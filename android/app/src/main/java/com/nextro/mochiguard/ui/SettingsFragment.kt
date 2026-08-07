package com.nextro.mochiguard.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.NumberPicker
import androidx.fragment.app.Fragment
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.nextro.mochiguard.R
import com.nextro.mochiguard.core.Prefs
import com.nextro.mochiguard.core.UsageStatsHelper
import com.nextro.mochiguard.databinding.FragmentSettingsBinding
import com.nextro.mochiguard.service.AppBlockerService

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)

        binding.cardUsagePermission.setOnClickListener {
            openSettingsScreen(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }
        binding.cardAccessibility.setOnClickListener {
            openSettingsScreen(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }
        binding.cardOverlay.setOnClickListener {
            openSettingsScreen(
                Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${requireContext().packageName}")
                )
            )
        }
        binding.buttonFocus.setOnClickListener { onFocusButton() }

        return binding.root
    }

    override fun onResume() {
        super.onResume()
        refreshState()
    }

    private fun refreshState() {
        val context = requireContext()

        val hasUsage = UsageStatsHelper.hasUsageAccess(context)
        binding.textUsageState.text =
            if (hasUsage) getString(R.string.permission_granted)
            else getString(R.string.permission_missing)

        val serviceOn = AppBlockerService.isRunning
        binding.textAccessibilityState.text =
            if (serviceOn) getString(R.string.permission_granted)
            else getString(R.string.permission_missing)

        val hasOverlay = Settings.canDrawOverlays(context)
        binding.textOverlayState.text =
            if (hasOverlay) getString(R.string.permission_granted)
            else getString(R.string.permission_missing)

        if (Prefs.isFocusActive(context)) {
            val remainingMin = (Prefs.getFocusUntil(context) - System.currentTimeMillis()) / 60_000 + 1
            binding.textFocusDescription.text = getString(R.string.focus_remaining, remainingMin)
            binding.buttonFocus.text = getString(R.string.focus_stop)
        } else {
            binding.textFocusDescription.text = getString(R.string.focus_description)
            binding.buttonFocus.text = getString(R.string.focus_start)
        }
    }

    /**
     * Abre la pantalla de ajustes del sistema pedida; si el fabricante no la
     * expone (algunas capas como MIUI), cae a la ficha de la app y como último
     * recurso a los ajustes generales.
     */
    private fun openSettingsScreen(intent: Intent) {
        try {
            startActivity(intent)
        } catch (_: Exception) {
            try {
                startActivity(
                    Intent(
                        Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        Uri.parse("package:${requireContext().packageName}")
                    )
                )
            } catch (_: Exception) {
                startActivity(Intent(Settings.ACTION_SETTINGS))
            }
        }
    }

    private fun onFocusButton() {
        val context = requireContext()
        if (Prefs.isFocusActive(context)) {
            Prefs.stopFocus(context)
            refreshState()
            return
        }

        val picker = NumberPicker(context).apply {
            minValue = 1
            maxValue = 24 // pasos de 15 min → hasta 6 horas
            value = 2
            displayedValues = Array(24) { "${(it + 1) * 15} min" }
            wrapSelectorWheel = false
        }
        MaterialAlertDialogBuilder(context)
            .setTitle(R.string.focus_dialog_title)
            .setMessage(R.string.focus_dialog_message)
            .setView(picker)
            .setPositiveButton(R.string.focus_start) { _, _ ->
                Prefs.startFocus(context, picker.value * 15)
                refreshState()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
