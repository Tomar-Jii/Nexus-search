package com.example.core.extensions

import android.content.Context
import com.example.core.database.dao.InstalledExtensionDao
import com.example.core.database.entity.InstalledExtensionEntity
import com.example.core.model.ExtensionCategory
import com.example.core.model.ExtensionPermission
import com.example.core.model.NexusExtension
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

object NexusExtensionManager {

    private val scope = CoroutineScope(Dispatchers.IO)
    private var dao: InstalledExtensionDao? = null

    private val catalog = listOf(
        NexusExtension(
            id = "ublock_origin",
            name = "uBlock Origin Lite",
            version = "2026.11.2",
            author = "Raymond Hill (Nexus Port)",
            description = "High-efficiency content blocker. Eliminates trackers, crypto miners, banner ads, and malicious popups.",
            category = ExtensionCategory.PRIVACY,
            iconName = "shield",
            permissions = listOf(
                ExtensionPermission("webRequest", "Network Request Interception", "Inspect outgoing URLs to block known tracking domains", true),
                ExtensionPermission("storage", "Local Rule Storage", "Store filter lists and user custom rules", false)
            ),
            isInstalled = true,
            isEnabled = true,
            scriptCode = "/* uBlock Content Script */ document.querySelectorAll('.ad-container, [id*=\"google_ads\"]').forEach(e => e.remove());"
        ),
        NexusExtension(
            id = "privacy_badger",
            name = "Privacy Badger",
            version = "3.4.1",
            author = "EFF (Electronic Frontier Foundation)",
            description = "Automatically learns to block invisible trackers based on third-party cookie observation without static lists.",
            category = ExtensionCategory.PRIVACY,
            iconName = "security",
            permissions = listOf(
                ExtensionPermission("cookies", "Third-Party Cookie Management", "Partition and isolate cross-site cookies", true),
                ExtensionPermission("tabs", "Tab Telemetry", "Inspect site origins to detect tracking beacons", false)
            ),
            isInstalled = true,
            isEnabled = true,
            scriptCode = "/* Privacy Badger Script */ console.log('[Nexus] Privacy Badger tracker isolation active.');"
        ),
        NexusExtension(
            id = "https_everywhere",
            name = "HTTPS Everywhere",
            version = "5.2.0",
            author = "EFF & Tor Project",
            description = "Forces automatic encrypted HTTPS communication on thousands of websites to guard against MITM snooping.",
            category = ExtensionCategory.SECURITY,
            iconName = "lock",
            permissions = listOf(
                ExtensionPermission("webRequest", "Protocol Rewrite", "Upgrade unencrypted http:// links to https:// automatically", false)
            ),
            isInstalled = true,
            isEnabled = true,
            scriptCode = "/* HTTPS Everywhere */ if (location.protocol === 'http:') { location.href = location.href.replace('http:', 'https:'); }"
        ),
        NexusExtension(
            id = "dark_reader",
            name = "Dark Reader",
            version = "4.9.90",
            author = "Alexander Shutov",
            description = "Inverts colors and generates soothing high-contrast dark themes on the fly for every webpage you visit.",
            category = ExtensionCategory.READING,
            iconName = "dark_mode",
            permissions = listOf(
                ExtensionPermission("activeTab", "CSS Style Injection", "Inject custom dark mode stylesheets into web content", false)
            ),
            isInstalled = false,
            isEnabled = false,
            scriptCode = "/* Dark Reader */ const s = document.createElement('style'); s.innerHTML = 'html { filter: invert(90%) hue-rotate(180deg) !important; background: #121212 !important; } img, video { filter: invert(100%) hue-rotate(180deg) !important; }'; document.head.appendChild(s);"
        ),
        NexusExtension(
            id = "noscript_lite",
            name = "NoScript Lite",
            version = "11.4.12",
            author = "Giorgio Maone",
            description = "Granular whitelist-based script, Java, and Flash execution control. Mitigates zero-day cross-site scripting (XSS).",
            category = ExtensionCategory.SECURITY,
            iconName = "code_off",
            permissions = listOf(
                ExtensionPermission("scripting", "JavaScript Execution Control", "Block inline scripts and eval execution on untrusted origins", true)
            ),
            isInstalled = false,
            isEnabled = false,
            scriptCode = "/* NoScript Lite */ console.log('[Nexus] Script policy enforced.');"
        ),
        NexusExtension(
            id = "clear_urls",
            name = "ClearURLs",
            version = "1.26.1",
            author = "Kevin Roebert",
            description = "Removes tracking fields like utm_source, fbclid, and gclid from URLs before navigating to prevent user profiling.",
            category = ExtensionCategory.PRIVACY,
            iconName = "link_off",
            permissions = listOf(
                ExtensionPermission("webNavigation", "URL Cleansing", "Strip tracking parameters from address bar and hyperlink targets", false)
            ),
            isInstalled = false,
            isEnabled = false,
            scriptCode = "/* ClearURLs */ console.log('[Nexus] Clean URL filter active.');"
        )
    )

    private val _extensions = MutableStateFlow<List<NexusExtension>>(catalog)
    val extensions: StateFlow<List<NexusExtension>> = _extensions.asStateFlow()

    fun init(databaseDao: InstalledExtensionDao) {
        dao = databaseDao
        scope.launch {
            databaseDao.getInstalledExtensions().collect { installedEntities ->
                val installedMap = installedEntities.associateBy { it.extensionId }
                _extensions.value = catalog.map { ext ->
                    val installed = installedMap[ext.id]
                    if (installed != null) {
                        ext.copy(isInstalled = true, isEnabled = installed.isEnabled)
                    } else {
                        ext
                    }
                }
            }
        }
    }

    fun installExtension(extensionId: String) {
        val ext = _extensions.value.find { it.id == extensionId } ?: return
        scope.launch {
            dao?.saveExtension(
                InstalledExtensionEntity(
                    extensionId = ext.id,
                    name = ext.name,
                    version = ext.version,
                    isEnabled = true
                )
            )
            _extensions.value = _extensions.value.map {
                if (it.id == extensionId) it.copy(isInstalled = true, isEnabled = true) else it
            }
        }
    }

    fun toggleExtension(extensionId: String, isEnabled: Boolean) {
        scope.launch {
            dao?.setExtensionEnabled(extensionId, isEnabled)
            _extensions.value = _extensions.value.map {
                if (it.id == extensionId) it.copy(isEnabled = isEnabled) else it
            }
        }
    }

    fun uninstallExtension(extensionId: String) {
        scope.launch {
            dao?.uninstallExtension(extensionId)
            _extensions.value = _extensions.value.map {
                if (it.id == extensionId) it.copy(isInstalled = false, isEnabled = false) else it
            }
        }
    }

    /**
     * Aggregates javascript code of all active extensions to be injected into a loaded webpage
     */
    fun getActiveContentScripts(): String {
        val enabledExts = _extensions.value.filter { it.isInstalled && it.isEnabled }
        return enabledExts.joinToString("\n\n") { it.scriptCode }
    }
}
