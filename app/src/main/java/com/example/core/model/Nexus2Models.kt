package com.example.core.model

// Assistant Personas
enum class AssistantPersona(
    val displayName: String,
    val title: String,
    val subtitle: String,
    val themeAccentHex: Long
) {
    ANGEL(
        displayName = "NEXUS ANGEL AI",
        title = "Angel Intelligence",
        subtitle = "Helpful, calm, and insightful research companion",
        themeAccentHex = 0xFFEAB308 // Gold
    ),
    DEVIL(
        displayName = "NEXUS DEVIL AI",
        title = "Devil Intelligence",
        subtitle = "Bold, sharp, and futuristic intelligence",
        themeAccentHex = 0xFFEF4444 // Crimson
    )
}

enum class PersonaMode {
    AUTO,        // Angel in Light Mode, Devil in Dark Mode
    FORCE_ANGEL,
    FORCE_DEVIL
}

// Deep Research Depth Settings
enum class ResearchDepth(
    val label: String,
    val description: String,
    val queryCount: Int,
    val searchBreadth: String
) {
    QUICK(
        label = "Quick Search",
        description = "Instant single-query synthesis and concise takeaways",
        queryCount = 1,
        searchBreadth = "Focused"
    ),
    DEEP(
        label = "Deep Search",
        description = "Multi-query decomposition, source cross-referencing, and comparative analysis",
        queryCount = 4,
        searchBreadth = "Multi-Source"
    ),
    EXTENDED(
        label = "Extended Research",
        description = "Comprehensive multi-stage investigation, contradiction detection, and full research report",
        queryCount = 8,
        searchBreadth = "Comprehensive"
    )
}

// Deep Research Progress Stages
enum class ResearchStage(val title: String, val progress: Float) {
    INITIALIZING("Formulating research scope…", 0.1f),
    DECOMPOSING_QUERY("Breaking question into sub-queries…", 0.25f),
    RETRIEVING_SOURCES("Querying web & public indexes in parallel…", 0.5f),
    ANALYZING_SOURCES("Ranking credibility & detecting contradictions…", 0.75f),
    SYNTHESIZING_REPORT("Synthesizing comprehensive research report…", 0.9f),
    COMPLETED("Research complete", 1.0f),
    FAILED("Research failed", 0f)
}

data class ResearchSubQuery(
    val id: String,
    val query: String,
    val focusArea: String,
    val resultsCount: Int = 0
)

data class DeepResearchReport(
    val id: String,
    val mainTopic: String,
    val depth: ResearchDepth,
    val stage: ResearchStage,
    val subQueries: List<ResearchSubQuery> = emptyList(),
    val summary: String = "",
    val keyFindings: List<String> = emptyList(),
    val contradictoryFindings: List<String> = emptyList(),
    val sources: List<SourceCitation> = emptyList(),
    val confidenceScore: Int = 95, // 0 to 100
    val confidenceExplanation: String = "High consensus across authoritative scientific and technical sources.",
    val timestamp: Long = System.currentTimeMillis()
)

// Tor Private Network Models
enum class TorConnectionState(val label: String) {
    DISCONNECTED("Disconnected"),
    CONNECTING("Establishing circuit…"),
    CONNECTED("Connected to Tor"),
    ERROR("Connection failed")
}

data class TorBridge(
    val id: String,
    val type: String, // obfs4, snowflake, meek
    val address: String,
    val enabled: Boolean = true
)

data class TorStatus(
    val state: TorConnectionState = TorConnectionState.DISCONNECTED,
    val bootstrapPercentage: Int = 0,
    val bootstrapStage: String = "Inactive",
    val circuitNodes: List<String> = emptyList(), // Guard -> Middle -> Exit
    val currentOnionAddress: String? = null,
    val isFailClosedActive: Boolean = true,
    val dnsLeakProtected: Boolean = true,
    val bridgesEnabled: Boolean = false,
    val errorMessage: String? = null
)

// Browser Tab & Session Models
enum class BrowserTabMode(val label: String) {
    NORMAL("Normal"),
    PRIVATE("Incognito"),
    TOR("Tor Private (.onion)")
}

data class BrowserTab(
    val id: String,
    val url: String = "about:blank",
    val title: String = "New Tab",
    val faviconUrl: String? = null,
    val mode: BrowserTabMode = BrowserTabMode.NORMAL,
    val isLoading: Boolean = false,
    val progress: Int = 0,
    val canGoBack: Boolean = false,
    val canGoForward: Boolean = false,
    val isSecureHttps: Boolean = false,
    val certificateDomain: String? = null,
    val isDesktopSite: Boolean = false,
    val isReaderMode: Boolean = false,
    val blockedTrackersCount: Int = 0
)

// Browser Extension Platform Models
enum class ExtensionCategory(val label: String) {
    PRIVACY("Privacy & Tracking"),
    SECURITY("Security & Defense"),
    PRODUCTIVITY("Productivity"),
    READING("Reading & Aesthetics"),
    DEVELOPER("Developer Tools")
}

data class ExtensionPermission(
    val id: String,
    val name: String,
    val description: String,
    val isDangerous: Boolean = false
)

data class NexusExtension(
    val id: String,
    val name: String,
    val version: String,
    val author: String,
    val description: String,
    val category: ExtensionCategory,
    val iconName: String,
    val permissions: List<ExtensionPermission>,
    val isInstalled: Boolean = false,
    val isEnabled: Boolean = false,
    val scriptCode: String = "",
    val isSignedByNexus: Boolean = true
)

// Security Center Diagnostics
data class SecurityAuditStatus(
    val httpsEnforced: Boolean = true,
    val torFailClosedActive: Boolean = true,
    val webRtcShieldActive: Boolean = true,
    val dnsLeakShieldActive: Boolean = true,
    val totalTrackersBlocked: Int = 142,
    val storageEncryptionActive: Boolean = true,
    val phishingShieldActive: Boolean = true,
    val activeVulnerabilitiesFound: Int = 0
)

// Creator Information Constants
object NexusProductInfo {
    const val APP_NAME = "NEXUS SEARCH"
    const val APP_VERSION = "2.0.0 (Ultra Master Build)"
    const val CREATOR_DISPLAY_NAME = "Death Game Boy 375"
    const val CREATOR_STATEMENT = "NEXUS SEARCH displays its creator name as Death Game Boy 375."
    const val LICENSE = "Apache License 2.0"
    const val PRIVACY_STATEMENT = "Nexus Search 2.0 uses on-device SQLite storage, zero search query tracking, fail-closed Tor onion network routing, and Firebase App Check attestation for secure Gemini synthesis."
}
