# NEXUS SEARCH 2.0 — AI Search Engine + Tor Private Browser + Extension Ecosystem

**NEXUS SEARCH** is a production-grade, privacy-first Android search engine, AI research assistant, Tor-enabled browser, and WebExtensions platform.

- **Application Name**: NEXUS SEARCH
- **Creator**: **Death Game Boy 375**
- **Statement**: *NEXUS SEARCH displays its creator name as Death Game Boy 375.*
- **Version**: 2.0.0

---

## 🌟 Key Features & Systems

### 1. Dual AI Personas: Angel & Devil
- **Angel AI (Light Theme Default)**:
  - Personality: Calm, intellectual, supportive, and constructive.
  - Aesthetic: Radiant gold, white, and silver interface accents.
  - Wings icon indicator with serene guidance.
- **Devil AI (Dark Theme Default)**:
  - Personality: Bold, sharp, high-impact, and cyber-futuristic.
  - Aesthetic: Crimson, purple, and obsidian dark interface accents.
  - Flame / horns icon indicator with razor-sharp insights.
- **Security & Integrity**:
  - Automatic synchronization with application theme plus manual override option (`Auto`, `Force Angel`, `Force Devil`).
  - Both personas adhere strictly to identical factual accuracy, verifiable citations, prompt-injection defense, and security policies.

### 2. Deep Research Engine
- **Multi-Stage Query Decomposition**: Deconstructs complex research queries into structured sub-hypotheses across web, academic, technical, and news angles.
- **Parallel Retrieval & Cross-Verification**: Concurrently collects search results from multiple domains, ranks relevance, and flags conflicting source claims.
- **Configurable Depth**:
  - `Quick`: Rapid 2-angle query synthesis for fast facts.
  - `Deep`: 4-dimension thorough analysis with confidence scoring.
  - `Extended`: Exhaustive 6-angle investigation with source breakdown.
- **Structured Export & Storage**: Generates professional research reports persisted locally in Room DB (`ResearchReportEntity`), exportable directly as Markdown or text.

### 3. Tor & Onion Private Network Layer
- **Fail-Closed Privacy Architecture**: Any `.onion` URL or Tor-mode tab strictly requires an active Tor SOCKS5 circuit (127.0.0.1:9050). If Tor is disconnected, requests **fail closed** with a `TorFailClosedException` to guarantee zero unencrypted clearnet leaks.
- **Interactive 3-Hop Circuit Visualizer**: Displays live guard/entry, middle relay, and exit node status with IP, country code, and latency metrics.
- **Pluggable Bridges**: Supports `obfs4`, `meek-azure`, and `snowflake` censorship circumvention.
- **DNS & WebRTC Leak Shield**: Enforces local proxy isolation, preventing hardware or ISP DNS leaks.

### 4. Advanced Native Browser Engine
- **Multi-Tab Architecture**: Seamlessly switch between Normal tabs, Incognito tabs, and Tor Network tabs with independent cookie jars and session states.
- **Integrated Omnibox**: Unified smart search bar supporting URL autocomplete, direct search execution, and HTTPS/onion security badges.
- **Reader Mode**: Distraction-free article reader stripping bloated stylesheets and ads.
- **Desktop Site Toggle**: Dynamic User-Agent switching for mobile/desktop layout rendering.

### 5. WebExtensions Ecosystem
- **Curated Extension Catalog**:
  - **uBlock Origin Lite**: Ad-blocking and tracking domain prevention.
  - **Privacy Badger**: EFF algorithmic tracker protection.
  - **HTTPS Everywhere**: Automatic SSL/TLS upgrade enforcement.
  - **NoScript Lite**: Strict script policy defense.
  - **Dark Reader**: Universal high-contrast dark mode for web content.
  - **ClearURLs**: Strips tracking parameters (`utm_*`, `fbclid`, `gclid`).
- **Permission Review Flow**: Modal dialog detailing requested permissions before installation.
- **Runtime Content Script Injector**: Aggregates and injects active extension scripts into rendered pages.

### 6. Security Center & Privacy Audit
- **Real-Time Security Score**: Continuous audit evaluating Tor status, HTTPS enforcement, WebRTC shielding, and active extensions.
- **Tracker & Script Counter**: Live statistics on blocked ads, trackers, and cleaned hyperlinks.
- **One-Tap Sanitization**: Immediate clearance of tab sessions, cache, and search history.

---

## 🏗️ Architecture & Modules

```
app/src/main/java/com/example/
├── core/
│   ├── ai/               # Firebase AI Logic & PersonaManager (Angel / Devil)
│   ├── browser/          # BrowserTabManager, Tab states & CustomTabsHelper
│   ├── database/         # Room DB (History, Bookmarks, Reports, Extensions)
│   ├── deepresearch/     # DeepResearchEngine (decomposition, parallel querying, synthesis)
│   ├── extensions/       # NexusExtensionManager & WebExtensions runtime
│   ├── model/            # Unified data models (Nexus2Models.kt, SearchModels.kt)
│   ├── network/          # Retrofit, DuckDuckGo & OpenSearch providers
│   ├── security/         # SecurityCenterManager & privacy shields
│   ├── speech/           # Native SpeechRecognizer audio dictation
│   └── tor/              # TorNetworkManager, SOCKS5 proxy & Fail-Closed routing
├── data/repository/      # SearchRepository & UserDataRepository
├── ui/
│   ├── components/       # SearchBar, VoiceDialog, AiOverviewCard, Tabs
│   ├── navigation/       # NexusNavGraph (11 registered destinations)
│   ├── screens/          # Home, Results, DeepResearch, Browser, Tor, Extensions, etc.
│   ├── theme/            # M3 Color tokens, Angel/Devil dynamic themes
│   └── viewmodel/        # Search, UserData, DeepResearch, TorBrowser, Assistant, Extension
└── MainActivity.kt       # Activity entry point with edge-to-edge & DI
```

---

## 🧪 Testing & Verification

Comprehensive local JVM unit tests and Robolectric tests are provided:
- `TorSecurityAndPersonaTest`:
  - Validates `.onion` detection and strict **Tor fail-closed policy** (`TorFailClosedException`).
  - Verifies creator query interception and identity matching ("Death Game Boy 375").
  - Confirms prompt-injection attack rejection.
  - Verifies theme-dependent Angel and Devil persona resolution and manual overrides.
  - Validates extension catalog loading and content script aggregation.
- `SearchFilterTest`: Tests search filters, ranking, and curated providers.

To run the test suite:
```bash
gradle testDebugUnitTest
```

---

## 🤖 CI/CD Workflows (`.github/workflows/`)

1. **`android-ci.yml`**: Compiles debug APK and executes full unit test suites on pushes/PRs.
2. **`android-release.yml`**: Generates signed Google Play release bundles (AAB) and APKs using repository secrets.
3. **`security-audit.yml`**: Scheduled weekly and PR security audit running fail-closed leak prevention tests and secret scanning.

---

## 🛡️ License

Released under the Apache 2.0 License. Developed by Death Game Boy 375.
