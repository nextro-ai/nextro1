package com.nextro.mochiguard.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import com.nextro.mochiguard.core.Prefs
import com.nextro.mochiguard.core.UsageStatsHelper
import com.nextro.mochiguard.ui.BlockedActivity

/**
 * Servicio de accesibilidad que detecta la app en primer plano y,
 * si está bloqueada (manualmente, por límite diario o por modo
 * concentración), muestra la pantalla de bloqueo kawaii.
 */
class AppBlockerService : AccessibilityService() {

    companion object {
        var isRunning = false
            private set
    }

    // Caché del uso de hoy para no consultar UsageStats en cada evento
    private var cachedUsage: Map<String, Long> = emptyMap()
    private var cacheTimestamp = 0L
    private val cacheTtlMs = 20_000L

    private var lastBlockedPkg: String? = null
    private var lastBlockedAt = 0L

    override fun onServiceConnected() {
        super.onServiceConnected()
        isRunning = true
    }

    override fun onDestroy() {
        isRunning = false
        super.onDestroy()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        val pkg = event.packageName?.toString() ?: return

        if (pkg == packageName || isSystemUi(pkg)) return

        val reason = blockReason(pkg) ?: return

        // Evita relanzar la pantalla de bloqueo en ráfaga para el mismo paquete
        val now = System.currentTimeMillis()
        if (pkg == lastBlockedPkg && now - lastBlockedAt < 1500) return
        lastBlockedPkg = pkg
        lastBlockedAt = now

        performGlobalAction(GLOBAL_ACTION_HOME)

        val intent = Intent(this, BlockedActivity::class.java).apply {
            addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP
            )
            putExtra(BlockedActivity.EXTRA_PACKAGE, pkg)
            putExtra(BlockedActivity.EXTRA_REASON, reason)
        }
        try {
            startActivity(intent)
        } catch (_: Exception) {
            // Si el sistema impide abrir la actividad, al menos ya volvimos al inicio.
        }
    }

    private fun blockReason(pkg: String): String? {
        // 1. Bloqueo manual
        if (Prefs.isBlocked(this, pkg)) return BlockedActivity.REASON_BLOCKED

        // 2. Modo concentración: bloquea todas las apps vigiladas
        if (Prefs.isFocusActive(this) && Prefs.getWatchedApps(this).contains(pkg)) {
            return BlockedActivity.REASON_FOCUS
        }

        // 3. Límite diario superado
        val limitMinutes = Prefs.getLimit(this, pkg) ?: return null
        val usedMs = usageFor(pkg)
        if (usedMs >= limitMinutes * 60_000L) return BlockedActivity.REASON_LIMIT

        return null
    }

    private fun usageFor(pkg: String): Long {
        val now = System.currentTimeMillis()
        if (now - cacheTimestamp > cacheTtlMs) {
            cachedUsage = try {
                UsageStatsHelper.usageTodayByApp(this)
            } catch (_: Exception) {
                emptyMap()
            }
            cacheTimestamp = now
        }
        return cachedUsage[pkg] ?: 0L
    }

    private fun isSystemUi(pkg: String): Boolean {
        if (pkg == "com.android.systemui" || pkg == "android") return true
        // No bloquear el launcher
        val home = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
        val res = packageManager.resolveActivity(home, 0)
        if (res?.activityInfo?.packageName == pkg) return true
        // No bloquear los ajustes del sistema (para poder desactivar el servicio)
        return pkg == "com.android.settings"
    }

    override fun onInterrupt() {
        // No se necesita acción
    }
}
