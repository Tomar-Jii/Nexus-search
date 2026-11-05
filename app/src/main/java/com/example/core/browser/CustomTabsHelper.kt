package com.example.core.browser

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.browser.customtabs.CustomTabColorSchemeParams
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.content.ContextCompat

object CustomTabsHelper {

    fun openUrl(context: Context, url: String) {
        try {
            val uri = Uri.parse(url)
            val colorSchemeParams = CustomTabColorSchemeParams.Builder()
                .setToolbarColor(0xFF0B0F19.toInt())
                .setSecondaryToolbarColor(0xFF131B2E.toInt())
                .build()

            val customTabsIntent = CustomTabsIntent.Builder()
                .setDefaultColorSchemeParams(colorSchemeParams)
                .setShowTitle(true)
                .setUrlBarHidingEnabled(true)
                .setShareState(CustomTabsIntent.SHARE_STATE_ON)
                .build()

            customTabsIntent.launchUrl(context, uri)
        } catch (e: Exception) {
            // Fallback to standard web browser intent
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                context.startActivity(intent)
            } catch (fallbackError: Exception) {
                Toast.makeText(context, "Unable to open link: $url", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun shareUrl(context: Context, title: String, url: String) {
        try {
            val sendIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_TITLE, title)
                putExtra(Intent.EXTRA_TEXT, "$title\n$url")
                type = "text/plain"
            }
            val shareIntent = Intent.createChooser(sendIntent, "Share Search Result")
            context.startActivity(shareIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not share link", Toast.LENGTH_SHORT).show()
        }
    }

    fun copyToClipboard(context: Context, text: String, label: String = "Search URL") {
        try {
            val clipboard = ContextCompat.getSystemService(context, ClipboardManager::class.java)
            val clip = ClipData.newPlainText(label, text)
            clipboard?.setPrimaryClip(clip)
            Toast.makeText(context, "Link copied to clipboard", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(context, "Could not copy link", Toast.LENGTH_SHORT).show()
        }
    }
}
