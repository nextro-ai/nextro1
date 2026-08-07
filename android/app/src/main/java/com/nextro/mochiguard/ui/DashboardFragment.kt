package com.nextro.mochiguard.ui

import android.animation.ObjectAnimator
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.provider.Settings
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.nextro.mochiguard.R
import com.nextro.mochiguard.core.Prefs
import com.nextro.mochiguard.core.UsageStatsHelper
import com.nextro.mochiguard.databinding.FragmentDashboardBinding
import com.nextro.mochiguard.databinding.ItemUsageBinding
import java.util.concurrent.Executors

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    private val executor = Executors.newSingleThreadExecutor()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        binding.textNoPermission.setOnClickListener {
            try {
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            } catch (_: Exception) {
                startActivity(Intent(Settings.ACTION_SETTINGS))
            }
        }
        return binding.root
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val context = requireContext().applicationContext

        // Estado del modo concentración
        if (Prefs.isFocusActive(context)) {
            val remainingMin = (Prefs.getFocusUntil(context) - System.currentTimeMillis()) / 60_000 + 1
            binding.cardFocus.visibility = View.VISIBLE
            binding.textFocusStatus.text = getString(R.string.focus_remaining, remainingMin)
        } else {
            binding.cardFocus.visibility = View.GONE
        }

        if (!UsageStatsHelper.hasUsageAccess(context)) {
            binding.textTotalTime.text = "—"
            binding.textNoPermission.visibility = View.VISIBLE
            binding.listTopApps.removeAllViews()
            return
        }
        binding.textNoPermission.visibility = View.GONE

        // Captura la vista ahora: el hilo de fondo no debe leer `binding`
        // porque el fragmento puede destruirse mientras se calcula el uso.
        val rootView = binding.root
        executor.execute {
            val usage = try {
                UsageStatsHelper.usageTodayByApp(context)
            } catch (_: Exception) {
                emptyMap()
            }
            val pm = context.packageManager
            val filtered = usage
                .filterKeys { it != context.packageName && isLaunchable(pm, it) }
                .filterValues { it >= 60_000 }
            val total = filtered.values.sum()
            val top = filtered.entries.sortedByDescending { it.value }.take(6)

            val items = top.map { (pkg, millis) ->
                val label = try {
                    pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
                } catch (_: PackageManager.NameNotFoundException) {
                    pkg
                }
                val icon = try {
                    pm.getApplicationIcon(pkg)
                } catch (_: PackageManager.NameNotFoundException) {
                    null
                }
                Triple(label, icon, millis)
            }

            rootView.post {
                if (_binding == null || !isAdded) return@post
                binding.textTotalTime.text = UsageStatsHelper.formatDuration(total)

                // Pop suave del contador principal
                binding.textTotalTime.scaleX = 0.7f
                binding.textTotalTime.scaleY = 0.7f
                binding.textTotalTime.alpha = 0f
                binding.textTotalTime.animate()
                    .scaleX(1f).scaleY(1f).alpha(1f)
                    .setDuration(450)
                    .setInterpolator(OvershootInterpolator(1.6f))
                    .start()

                binding.listTopApps.removeAllViews()
                val maxMillis = top.firstOrNull()?.value ?: 1L
                for ((label, icon, millis) in items) {
                    val item = ItemUsageBinding.inflate(layoutInflater, binding.listTopApps, false)
                    item.textAppName.text = label
                    item.textAppTime.text = UsageStatsHelper.formatDuration(millis)
                    if (icon != null) item.imageIcon.setImageDrawable(icon)
                    item.progressUsage.max = 100
                    val target = ((millis * 100) / maxMillis).toInt().coerceIn(2, 100)
                    ObjectAnimator.ofInt(item.progressUsage, "progress", 0, target).apply {
                        duration = 800
                        interpolator = DecelerateInterpolator(2f)
                        start()
                    }
                    binding.listTopApps.addView(item.root)
                }
                // Entrada en cascada de la lista
                binding.listTopApps.scheduleLayoutAnimation()
                binding.textEmptyState.visibility =
                    if (items.isEmpty()) View.VISIBLE else View.GONE
            }
        }
    }

    private fun isLaunchable(pm: PackageManager, pkg: String): Boolean =
        pm.getLaunchIntentForPackage(pkg) != null

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
