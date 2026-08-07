package com.nextro.mochiguard.core

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import android.os.Process
import java.util.Calendar

/**
 * Calcula el tiempo de pantalla de hoy por app usando UsageEvents,
 * que es más preciso que queryUsageStats.
 */
object UsageStatsHelper {

    fun hasUsageAccess(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun startOfToday(): Long {
        val cal = Calendar.getInstance()
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        return cal.timeInMillis
    }

    /** Milisegundos de uso en primer plano de hoy, por paquete. */
    fun usageTodayByApp(context: Context): Map<String, Long> {
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val start = startOfToday()
        val now = System.currentTimeMillis()
        val events = usm.queryEvents(start, now)

        val usage = HashMap<String, Long>()
        val lastResumed = HashMap<String, Long>()
        val event = UsageEvents.Event()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            when (event.eventType) {
                UsageEvents.Event.ACTIVITY_RESUMED ->
                    lastResumed[event.packageName] = event.timeStamp
                UsageEvents.Event.ACTIVITY_PAUSED,
                UsageEvents.Event.ACTIVITY_STOPPED -> {
                    val startTime = lastResumed.remove(event.packageName)
                    if (startTime != null && event.timeStamp > startTime) {
                        usage[event.packageName] =
                            (usage[event.packageName] ?: 0L) + (event.timeStamp - startTime)
                    }
                }
            }
        }
        // Apps que siguen abiertas ahora mismo
        for ((pkg, startTime) in lastResumed) {
            if (now > startTime) {
                usage[pkg] = (usage[pkg] ?: 0L) + (now - startTime)
            }
        }
        return usage
    }

    fun usageTodayForApp(context: Context, packageName: String): Long =
        usageTodayByApp(context)[packageName] ?: 0L

    fun totalUsageToday(context: Context, excludeSelf: Boolean = true): Long {
        var total = 0L
        for ((pkg, millis) in usageTodayByApp(context)) {
            if (excludeSelf && pkg == context.packageName) continue
            total += millis
        }
        return total
    }

    fun formatDuration(millis: Long): String {
        val totalMinutes = millis / 60_000
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        return when {
            hours > 0 -> "${hours} h ${minutes} min"
            totalMinutes > 0 -> "$minutes min"
            else -> "< 1 min"
        }
    }
}
