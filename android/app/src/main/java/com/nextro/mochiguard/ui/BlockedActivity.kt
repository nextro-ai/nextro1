package com.nextro.mochiguard.ui

import android.animation.ObjectAnimator
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.OvershootInterpolator
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import com.nextro.mochiguard.R
import com.nextro.mochiguard.databinding.ActivityBlockedBinding

/**
 * Pantalla kawaii que aparece cuando se intenta abrir una app bloqueada.
 */
class BlockedActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_PACKAGE = "extra_package"
        const val EXTRA_REASON = "extra_reason"
        const val REASON_BLOCKED = "blocked"
        const val REASON_LIMIT = "limit"
        const val REASON_FOCUS = "focus"
    }

    private lateinit var binding: ActivityBlockedBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBlockedBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val pkg = intent.getStringExtra(EXTRA_PACKAGE) ?: ""
        val reason = intent.getStringExtra(EXTRA_REASON) ?: REASON_BLOCKED

        val appName = try {
            val info = packageManager.getApplicationInfo(pkg, 0)
            packageManager.getApplicationLabel(info).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            pkg
        }

        binding.textAppName.text = appName
        when (reason) {
            REASON_LIMIT -> {
                binding.textEmoji.text = "🍵"
                binding.textTitle.text = getString(R.string.blocked_title_limit)
                binding.textMessage.text = getString(R.string.blocked_message_limit, appName)
            }
            REASON_FOCUS -> {
                binding.textEmoji.text = "🌙"
                binding.textTitle.text = getString(R.string.blocked_title_focus)
                binding.textMessage.text = getString(R.string.blocked_message_focus, appName)
            }
            else -> {
                binding.textEmoji.text = "🧸"
                binding.textTitle.text = getString(R.string.blocked_title_blocked)
                binding.textMessage.text = getString(R.string.blocked_message_blocked, appName)
            }
        }

        binding.buttonHome.setOnClickListener { goHome() }

        playEntranceAnimations()

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                goHome()
            }
        })
    }

    private fun playEntranceAnimations() {
        // El emoji entra con rebote y luego flota suavemente
        binding.textEmoji.scaleX = 0f
        binding.textEmoji.scaleY = 0f
        binding.textEmoji.animate()
            .scaleX(1f).scaleY(1f)
            .setDuration(550)
            .setInterpolator(OvershootInterpolator(2.2f))
            .withEndAction {
                ObjectAnimator.ofFloat(binding.textEmoji, View.TRANSLATION_Y, 0f, -14f).apply {
                    duration = 1600
                    repeatMode = ObjectAnimator.REVERSE
                    repeatCount = ObjectAnimator.INFINITE
                    interpolator = AccelerateDecelerateInterpolator()
                    start()
                }
            }
            .start()

        // El resto aparece en cascada
        val views = listOf(
            binding.textTitle, binding.textAppName.parent as View,
            binding.textMessage, binding.buttonHome
        )
        views.forEachIndexed { index, view ->
            view.alpha = 0f
            view.translationY = 40f
            view.animate()
                .alpha(1f).translationY(0f)
                .setStartDelay(180L + index * 90L)
                .setDuration(400)
                .setInterpolator(OvershootInterpolator(1.2f))
                .start()
        }
    }

    private fun goHome() {
        val home = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(home)
        finish()
    }
}
