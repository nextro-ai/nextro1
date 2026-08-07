package com.nextro.mochiguard.ui

import android.content.Intent
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.NumberPicker
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.nextro.mochiguard.R
import com.nextro.mochiguard.core.Prefs
import com.nextro.mochiguard.core.UsageStatsHelper
import com.nextro.mochiguard.databinding.FragmentAppsBinding
import com.nextro.mochiguard.databinding.ItemAppBinding
import java.util.concurrent.Executors

data class AppEntry(
    val packageName: String,
    val label: String,
    val icon: Drawable?,
    val usageTodayMs: Long
)

class AppsFragment : Fragment() {

    private var _binding: FragmentAppsBinding? = null
    private val binding get() = _binding!!
    private val executor = Executors.newSingleThreadExecutor()
    private var adapter: AppsAdapter? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAppsBinding.inflate(inflater, container, false)
        binding.recyclerApps.layoutManager = LinearLayoutManager(requireContext())
        return binding.root
    }

    override fun onResume() {
        super.onResume()
        loadApps()
    }

    private fun loadApps() {
        val context = requireContext().applicationContext
        binding.progressLoading.visibility = View.VISIBLE
        executor.execute {
            val pm = context.packageManager
            val usage = if (UsageStatsHelper.hasUsageAccess(context)) {
                try {
                    UsageStatsHelper.usageTodayByApp(context)
                } catch (_: Exception) {
                    emptyMap()
                }
            } else emptyMap()

            val launcherIntent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            val entries = pm.queryIntentActivities(launcherIntent, 0)
                .asSequence()
                .map { it.activityInfo.applicationInfo }
                .distinctBy { it.packageName }
                .filter { it.packageName != context.packageName }
                .map { info ->
                    AppEntry(
                        packageName = info.packageName,
                        label = pm.getApplicationLabel(info).toString(),
                        icon = try {
                            pm.getApplicationIcon(info)
                        } catch (_: Exception) {
                            null
                        },
                        usageTodayMs = usage[info.packageName] ?: 0L
                    )
                }
                .sortedWith(
                    compareByDescending<AppEntry> { it.usageTodayMs }
                        .thenBy { it.label.lowercase() }
                )
                .toList()

            binding.root.post {
                if (_binding == null) return@post
                binding.progressLoading.visibility = View.GONE
                adapter = AppsAdapter(entries)
                binding.recyclerApps.adapter = adapter
                binding.recyclerApps.scheduleLayoutAnimation()
            }
        }
    }

    private inner class AppsAdapter(private val apps: List<AppEntry>) :
        RecyclerView.Adapter<AppsAdapter.AppViewHolder>() {

        inner class AppViewHolder(val item: ItemAppBinding) : RecyclerView.ViewHolder(item.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppViewHolder {
            val item = ItemAppBinding.inflate(layoutInflater, parent, false)
            return AppViewHolder(item)
        }

        override fun getItemCount() = apps.size

        override fun onBindViewHolder(holder: AppViewHolder, position: Int) {
            val app = apps[position]
            val context = holder.item.root.context
            holder.item.textAppName.text = app.label
            holder.item.textUsage.text = if (app.usageTodayMs > 0)
                getString(R.string.usage_today, UsageStatsHelper.formatDuration(app.usageTodayMs))
            else getString(R.string.usage_none)
            if (app.icon != null) holder.item.imageIcon.setImageDrawable(app.icon)

            // Switch de bloqueo
            holder.item.switchBlocked.setOnCheckedChangeListener(null)
            holder.item.switchBlocked.isChecked = Prefs.isBlocked(context, app.packageName)
            holder.item.switchBlocked.setOnCheckedChangeListener { _, checked ->
                Prefs.setBlocked(context, app.packageName, checked)
            }

            // Límite diario
            val limit = Prefs.getLimit(context, app.packageName)
            holder.item.buttonLimit.text = if (limit != null)
                getString(R.string.limit_minutes, limit)
            else getString(R.string.limit_none)
            holder.item.buttonLimit.setOnClickListener {
                showLimitDialog(app) { notifyItemChanged(position) }
            }
        }
    }

    private fun showLimitDialog(app: AppEntry, onDone: () -> Unit) {
        val context = requireContext()
        val current = Prefs.getLimit(context, app.packageName) ?: 30

        val picker = NumberPicker(context).apply {
            minValue = 1
            maxValue = 48 // pasos de 5 min → hasta 4 horas
            value = (current / 5).coerceIn(1, 48)
            displayedValues = Array(48) { "${(it + 1) * 5} min" }
            wrapSelectorWheel = false
        }

        MaterialAlertDialogBuilder(context)
            .setTitle(getString(R.string.limit_dialog_title, app.label))
            .setView(picker)
            .setPositiveButton(R.string.limit_save) { _, _ ->
                Prefs.setLimit(context, app.packageName, picker.value * 5)
                onDone()
            }
            .setNeutralButton(R.string.limit_remove) { _, _ ->
                Prefs.setLimit(context, app.packageName, null)
                onDone()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
