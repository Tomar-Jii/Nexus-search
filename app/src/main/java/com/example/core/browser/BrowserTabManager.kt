package com.example.core.browser

import android.content.Context
import android.net.Uri
import com.example.core.database.dao.BrowserHistoryDao
import com.example.core.database.entity.BrowserHistoryEntity
import com.example.core.model.BrowserTab
import com.example.core.model.BrowserTabMode
import com.example.core.tor.TorNetworkManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

class BrowserTabManager(
    private val browserHistoryDao: BrowserHistoryDao
) {
    private val scope = CoroutineScope(Dispatchers.IO)

    private val initialTab = BrowserTab(
        id = UUID.randomUUID().toString(),
        url = "https://duckduckgo.com",
        title = "DuckDuckGo — Privacy Search",
        mode = BrowserTabMode.NORMAL,
        isSecureHttps = true,
        certificateDomain = "duckduckgo.com"
    )

    private val _tabs = MutableStateFlow<List<BrowserTab>>(listOf(initialTab))
    val tabs: StateFlow<List<BrowserTab>> = _tabs.asStateFlow()

    private val _activeTabId = MutableStateFlow<String>(initialTab.id)
    val activeTabId: StateFlow<String> = _activeTabId.asStateFlow()

    fun getActiveTab(): BrowserTab? {
        return _tabs.value.find { it.id == _activeTabId.value }
    }

    fun openNewTab(url: String = "https://duckduckgo.com", mode: BrowserTabMode = BrowserTabMode.NORMAL): String {
        val newId = UUID.randomUUID().toString()
        val title = if (url.contains(".onion")) "Tor Onion Session" else "New Tab"
        val newTab = BrowserTab(
            id = newId,
            url = url,
            title = title,
            mode = mode,
            isSecureHttps = url.startsWith("https://")
        )
        _tabs.value = _tabs.value + newTab
        _activeTabId.value = newId
        return newId
    }

    fun switchTab(tabId: String) {
        if (_tabs.value.any { it.id == tabId }) {
            _activeTabId.value = tabId
        }
    }

    fun closeTab(tabId: String) {
        val currentList = _tabs.value
        if (currentList.size <= 1) {
            // Re-initialize single clean tab
            val fresh = BrowserTab(
                id = UUID.randomUUID().toString(),
                url = "https://duckduckgo.com",
                title = "New Tab",
                mode = BrowserTabMode.NORMAL
            )
            _tabs.value = listOf(fresh)
            _activeTabId.value = fresh.id
            return
        }

        val updated = currentList.filter { it.id != tabId }
        _tabs.value = updated
        if (_activeTabId.value == tabId) {
            _activeTabId.value = updated.last().id
        }
    }

    fun closeAllTabs(mode: BrowserTabMode? = null) {
        val remaining = if (mode != null) {
            _tabs.value.filter { it.mode != mode }
        } else {
            emptyList()
        }

        if (remaining.isEmpty()) {
            openNewTab()
        } else {
            _tabs.value = remaining
            _activeTabId.value = remaining.last().id
        }
    }

    fun navigateActiveTab(input: String) {
        val targetTab = getActiveTab() ?: return
        val formattedUrl = resolveUrlOrSearch(input)

        // Tor Fail-Closed Enforcement
        if (targetTab.mode == BrowserTabMode.TOR || TorNetworkManager.isOnionAddress(formattedUrl)) {
            TorNetworkManager.assertTorRoutingAllowed(formattedUrl)
        }

        val domain = extractDomain(formattedUrl)
        val isHttps = formattedUrl.startsWith("https://")

        updateTab(targetTab.id) {
            it.copy(
                url = formattedUrl,
                title = domain,
                isLoading = true,
                progress = 20,
                isSecureHttps = isHttps,
                certificateDomain = if (isHttps) domain else null,
                canGoBack = true,
                blockedTrackersCount = it.blockedTrackersCount + (1..3).random()
            )
        }

        // Only log to persistent history if NOT in private or Tor mode
        if (targetTab.mode == BrowserTabMode.NORMAL) {
            scope.launch {
                browserHistoryDao.insertHistory(
                    BrowserHistoryEntity(
                        url = formattedUrl,
                        title = domain,
                        visitTimestamp = System.currentTimeMillis()
                    )
                )
            }
        }

        // Simulate finish loading
        scope.launch {
            kotlinx.coroutines.delay(400)
            updateTab(targetTab.id) {
                it.copy(isLoading = false, progress = 100)
            }
        }
    }

    fun toggleDesktopSite(tabId: String) {
        updateTab(tabId) {
            it.copy(isDesktopSite = !it.isDesktopSite)
        }
    }

    fun toggleReaderMode(tabId: String) {
        updateTab(tabId) {
            it.copy(isReaderMode = !it.isReaderMode)
        }
    }

    private fun updateTab(tabId: String, transform: (BrowserTab) -> BrowserTab) {
        _tabs.value = _tabs.value.map { tab ->
            if (tab.id == tabId) transform(tab) else tab
        }
    }

    private fun resolveUrlOrSearch(input: String): String {
        val trimmed = input.trim()
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed
        }
        if (trimmed.contains(".onion")) {
            return "http://${trimmed.removePrefix("http://").removePrefix("https://")}"
        }
        if (trimmed.contains(".") && !trimmed.contains(" ")) {
            return "https://$trimmed"
        }
        return "https://duckduckgo.com/?q=${Uri.encode(trimmed)}"
    }

    private fun extractDomain(url: String): String {
        return try {
            val uri = Uri.parse(url)
            uri.host?.removePrefix("www.") ?: url
        } catch (_: Exception) {
            url
        }
    }
}
