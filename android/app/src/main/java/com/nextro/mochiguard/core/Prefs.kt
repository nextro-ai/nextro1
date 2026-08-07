package com.nextro.mochiguard.core

import android.content.Context
import android.content.SharedPreferences

/**
 * Almacenamiento simple de la configuración: apps bloqueadas,
 * límites diarios por app y estado del modo concentración.
 */
object Prefs {

    private const val FILE = "mochi_prefs"
    private const val KEY_BLOCKED = "blocked_apps"
    private const val KEY_LIMITS = "app_limits"
    private const val KEY_FOCUS_UNTIL = "focus_until"

    private fun prefs(context: Context): SharedPreferences =
        context.applicationContext.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    // ---- Apps bloqueadas ----

    fun getBlockedApps(context: Context): Set<String> =
        prefs(context).getStringSet(KEY_BLOCKED, emptySet()) ?: emptySet()

    fun setBlocked(context: Context, packageName: String, blocked: Boolean) {
        val current = getBlockedApps(context).toMutableSet()
        if (blocked) current.add(packageName) else current.remove(packageName)
        prefs(context).edit().putStringSet(KEY_BLOCKED, current).apply()
    }

    fun isBlocked(context: Context, packageName: String): Boolean =
        getBlockedApps(context).contains(packageName)

    // ---- Límites diarios (minutos por app) ----

    fun getLimits(context: Context): Map<String, Int> {
        val raw = prefs(context).getString(KEY_LIMITS, "") ?: ""
        if (raw.isEmpty()) return emptyMap()
        return raw.split(";").mapNotNull { entry ->
            val parts = entry.split("=")
            if (parts.size == 2) parts[0] to (parts[1].toIntOrNull() ?: return@mapNotNull null)
            else null
        }.toMap()
    }

    fun setLimit(context: Context, packageName: String, minutes: Int?) {
        val current = getLimits(context).toMutableMap()
        if (minutes == null || minutes <= 0) current.remove(packageName)
        else current[packageName] = minutes
        val raw = current.entries.joinToString(";") { "${it.key}=${it.value}" }
        prefs(context).edit().putString(KEY_LIMITS, raw).apply()
    }

    fun getLimit(context: Context, packageName: String): Int? = getLimits(context)[packageName]

    // ---- Modo concentración ----

    fun getFocusUntil(context: Context): Long = prefs(context).getLong(KEY_FOCUS_UNTIL, 0L)

    fun isFocusActive(context: Context): Boolean =
        System.currentTimeMillis() < getFocusUntil(context)

    fun startFocus(context: Context, minutes: Int) {
        val until = System.currentTimeMillis() + minutes * 60_000L
        prefs(context).edit().putLong(KEY_FOCUS_UNTIL, until).apply()
    }

    fun stopFocus(context: Context) {
        prefs(context).edit().putLong(KEY_FOCUS_UNTIL, 0L).apply()
    }

    /** Apps "vigiladas": las bloqueadas o con límite. El modo concentración las bloquea todas. */
    fun getWatchedApps(context: Context): Set<String> =
        getBlockedApps(context) + getLimits(context).keys
}
