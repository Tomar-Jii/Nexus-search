package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.core.browser.BrowserTabManager
import com.example.core.model.BrowserTab
import com.example.core.model.BrowserTabMode
import com.example.core.model.TorStatus
import com.example.core.tor.TorNetworkManager
import kotlinx.coroutines.flow.StateFlow

class TorBrowserViewModel(
    private val tabManager: BrowserTabManager
) : ViewModel() {

    val torStatus: StateFlow<TorStatus> = TorNetworkManager.torStatus
    val tabs: StateFlow<List<BrowserTab>> = tabManager.tabs
    val activeTabId: StateFlow<String> = tabManager.activeTabId

    fun getActiveTab(): BrowserTab? = tabManager.getActiveTab()

    fun connectTor(useBridges: Boolean = false) {
        TorNetworkManager.connect(useBridges)
    }

    fun disconnectTor() {
        TorNetworkManager.disconnect()
    }

    fun renewIdentity() {
        TorNetworkManager.renewIdentity()
    }

    fun navigate(input: String) {
        tabManager.navigateActiveTab(input)
    }

    fun openTab(url: String = "https://duckduckgo.com", mode: BrowserTabMode = BrowserTabMode.NORMAL): String {
        return tabManager.openNewTab(url, mode)
    }

    fun openTorTab(url: String = "http://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion") {
        tabManager.openNewTab(url, BrowserTabMode.TOR)
    }

    fun switchTab(tabId: String) {
        tabManager.switchTab(tabId)
    }

    fun closeTab(tabId: String) {
        tabManager.closeTab(tabId)
    }

    fun toggleDesktopSite() {
        getActiveTab()?.let { tabManager.toggleDesktopSite(it.id) }
    }

    fun toggleReaderMode() {
        getActiveTab()?.let { tabManager.toggleReaderMode(it.id) }
    }
}

class TorBrowserViewModelFactory(
    private val tabManager: BrowserTabManager
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return TorBrowserViewModel(tabManager) as T
    }
}
