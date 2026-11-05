# NEXUS SEARCH — Advanced AI-Powered Android Search Engine

NEXUS SEARCH is a next-generation native Android search engine delivering lightning-fast web, image, video, and news discovery paired with Gemini-powered AI synthesis, smart suggestions, voice dictation, and privacy-first local search history and bookmarks.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Key architectural decisions confirmed through interactive clarification:

- **Confirmed Decision 1 (Search Data Sourcing)**: **Dual-Mode Search Provider**. The app queries live public search APIs (DuckDuckGo Instant Answers/Related topics API and OpenSearch live suggestion endpoints) while seamlessly combining and falling back to a structured, curated local dataset for comprehensive multi-category results (Web, Images, News, Videos) when offline or rate-limited.
- **Confirmed Decision 2 (AI Search Answers)**: **Native Firebase AI Logic & Gemini API**. Integrated using `Firebase.ai` (`gemini-3.8-flash`) with App Check attestation, streaming responses (`generateContentStream`), structured citation linking, and resilient fallback handling.
- **Confirmed Decision 3 (Visual Aesthetic)**: **Minimalist Modern Search Engine**. Clean, distraction-free search experience with deep onyx dark theme, crisp light theme, rounded pill-shaped inputs, high-contrast typography, and smooth Material 3 card surfaces.
- **Decision 4 (History & Bookmarks Persistence)**: **Room Database with Privacy Toggles**. On-device SQLite with full offline support, custom bookmark collections/folders, instant search history deletion, and an "Incognito / Pause History" mode.
- **Decision 5 (External Browsing)**: **Android Custom Tabs**. High-performance in-app Chrome Custom Tabs for external web results with custom action buttons (Share, Bookmark, Copy Link) preserving native app context.

---

### 1. Overview & Core Concept

- **What It Does**: NEXUS SEARCH is a real native Android search client that lets users search the web, explore distinct media categories (All, Images, Videos, News), receive instant AI-synthesized summaries with verifiable source citations, perform voice searches via Android's SpeechRecognizer, and manage their research with on-device bookmarks and history.
- **Target Audience**: Mobile users seeking an intelligent, uncluttered, privacy-conscious search companion that distills complex web queries into actionable insights without ad trackers or forced feeds.
- **Key Value**: Bridges traditional web exploration with state-of-the-art AI comprehension, offering instant answers, media carousels, and deep search filters in a single fluid native experience.

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Discovery & Home Search**:
   - Clean homepage with animated NEXUS logo, floating pill search bar, quick voice search button, category quick-pills, and trending search topics.
   - Tapping the search bar transitions smoothly into the interactive Suggestion View with recent searches, one-tap delete chips, and real-time debounced query suggestions.

2. **Search Execution & Category Navigation**:
   - Executing a search opens the Results Screen with sticky category tabs (`All`, `Images`, `Videos`, `News`).
   - In the `All` tab: Prominently renders the **AI Overview Card** at the top (with streaming text, bulleted takeaways, and numbered source pills) followed by ranked web result cards.
   - In `Images`, `Videos`, `News` tabs: Displays specialized layouts (staggered image grids, video cards with play badges & durations, and journalistic news cards with publication timestamps).

3. **AI Search & Source Verification**:
   - The AI Overview synthesizes web context, highlights key insights, and displays numbered citation badges `[1]`, `[2]`.
   - Tapping any source citation opens the original source in an Android Custom Tab or reveals source metadata.
   - Interactive follow-up query bar allows asking contextual follow-ups.

4. **Voice Search & Speech Recognition**:
   - Tapping the mic button launches a native bottom sheet with audio visualizer waves and real-time speech transcription with instant fallback to text input.

5. **History & Bookmarks Management**:
   - Dedicated screens for managing past queries and saved items with swipe-to-delete, clear-all dialogs, category tags, and offline metadata inspection.

6. **Settings & Privacy**:
   - Toggles for Incognito Search (disable history saving), Safe Search filtering levels, Search Engine region/language preferences, and AI answer auto-generation toggles.

#### Visual Identity & Theme Tokens

- **Aesthetic Direction**: Minimalist tech aesthetic with razor-sharp typography, pill geometry, subtle tonal elevation, and border glow accents.
- **Color Tokens**:
  - `Primary`: Electric Blue (`#3B82F6` / `#60A5FA`) for active search tabs, focus rings, and action buttons.
  - `Surface / Background Dark`: Deep Graphite (`#0F1117`) and Elevated Card (`#1A1D27`).
  - `Surface / Background Light`: Pure White (`#FFFFFF`) with Pearl Grey surface (`#F3F4F6`).
  - `AI Accent`: Violet-Cyan gradient highlight (`#8B5CF6` to `#3B82F6`) denoting generative AI insights.
  - `Text Primary`: `#F9FAFB` (Dark) / `#111827` (Light).
  - `Text Secondary`: `#9CA3AF` (Dark) / `#4B5563` (Light).
- **Typography**: Crisp modern sans hierarchy (`HeadlineLarge` 32sp for brand logo, `TitleMedium` 16sp bold for result titles, `BodyMedium` 14sp for snippets and summaries, and `LabelSmall` 11sp for citation badges and domain breadcrumbs).

---

### 3. Key Product Decisions & Trade-Offs

- **Dual-Mode Search Provider vs. Fragile Scraping**:
  - *Chosen Approach*: Search provider abstraction layer (`SearchRepository` backed by `LiveSearchProvider` + `CuratedSearchProvider`). Direct HTTP calls to public search and suggestion endpoints (DuckDuckGo instant topic APIs + Wikipedia/OpenSearch APIs) backed by a robust offline domain dataset for diverse web, image, video, and news coverage.
  - *Why*: Web scraping violates terms of service and breaks unpredictably; dual-mode provides real live query capability with zero downtime and fast response times.
- **Firebase AI Logic with Streaming vs. Unary Calls**:
  - *Chosen Approach*: `generateContentStream` through `Firebase.ai.generativeModel("gemini-3.8-flash")` wrapped in realistic 45-second coroutine timeouts and App Check attestation.
  - *Why*: Drastically lowers Time-to-First-Token from 8+ seconds to under 1.5 seconds, giving users immediate feedback.
- **Room Database for Local Search History & Bookmarks**:
  - *Chosen Approach*: Type-safe Room DB with `SearchHistoryDao` and `BookmarkDao` emitting reactive Kotlin `Flow`s, accompanied by an in-memory toggle for Incognito mode.
  - *Why*: Instant offline access, zero cloud data leakage for sensitive user queries, and rock-solid privacy compliance.
- **Single-Activity Compose Navigation with Type-Safe State**:
  - *Chosen Approach*: Jetpack Navigation Compose with unified state and `BackHandler` support for all sub-screens (Search, Results, History, Bookmarks, Settings, About).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXUS SEARCH APPLICATION                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           UI LAYER (Compose)                           │
│  ┌───────────────┐ ┌────────────────┐ ┌───────────────┐ ┌────────────┐ │
│  │  HomeScreen   │ │ ResultsScreen  │ │ HistoryScreen │ │  Settings  │ │
│  │ (Search Bar,  │ │ (Tabs, Cards,  │ │ & Bookmarks   │ │  & Privacy │ │
│  │ Trending, Mic)│ │ AI Overview)   │ │ Screen        │ │   Screen   │ │
│  └───────┬───────┘ └───────┬────────┘ └───────┬───────┘ └─────┬──────┘ │
└──────────┼─────────────────┼──────────────────┼───────────────┼────────┘
           │                 │                  │               │
           ▼                 ▼                  ▼               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          VIEWMODEL LAYER                               │
│  ┌───────────────────────────┐      ┌────────────────────────────────┐ │
│  │      SearchViewModel      │      │     HistoryBookmarkViewModel   │ │
│  │  - query, suggestions     │      │  - history flow, bookmarks flow│ │
│  │  - selected category tab  │      │  - incognito mode state        │ │
│  │  - AI answer stream state │      │  - delete / folder operations  │ │
│  │  - search filters state   │      └────────────────────────────────┘ │
└──────────┬───────────────────┴───────────────────────┬─────────────────┘
           │                                           │
           ▼                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          REPOSITORY LAYER                              │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │        SearchRepository       │  │       UserDataRepository       │ │
│  │  - search(query, category)    │  │  - insertHistory(query)        │ │
│  │  - getSuggestions(query)      │  │  - getHistory(), clearHistory()│ │
│  │  - getTrendingQueries()       │  │  - addBookmark(), getBookmarks│ │
│  └───────┬───────────────┬───────┘  └────────────────┬───────────────┘ │
└──────────┼───────────────┼───────────────────────────┼─────────────────┘
           │               │                           │
           ▼               ▼                           ▼
┌────────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐
│  DATA SOURCE: LIVE │ │ DATA SOURCE: AI  │ │  DATA SOURCE: LOCAL DB   │
│  & PUBLIC SEARCH   │ │ Firebase AI Logic│ │  Room Database (SQLite)  │
│  - DuckDuckGo API  │ │ gemini-3.8-flash │ │  - SearchHistoryEntity   │
│  - OpenSearch API  │ │ Streaming +      │ │  - BookmarkEntity        │
│  - Fallback Data   │ │ Source Grounding │ │  - SharedPreferences     │
└────────────────────┘ └──────────────────┘ └──────────────────────────┘
```

#### Core Data Entities

1. `SearchResult`: ID, title, url, domain, snippet, category (`WEB`, `IMAGES`, `VIDEOS`, `NEWS`), imageUrl, publishedDate, duration (for video), sourceName.
2. `AiAnswer`: query, summaryText, keyPoints, sourceCitations (`List<SourceCitation>`), status (`IDLE`, `STREAMING`, `SUCCESS`, `ERROR`), errorMessage.
3. `SourceCitation`: index, title, url, domain, snippet.
4. `SearchHistoryEntity`: id (auto-generate), query, timestamp, category.
5. `BookmarkEntity`: id, title, url, domain, snippet, imageUrl, category, folder, savedAt.
6. `SearchFilter`: timeRange (`ANY`, `DAY`, `WEEK`, `MONTH`, `YEAR`), safeSearch (`OFF`, `MODERATE`, `STRICT`), region (`GLOBAL`, `US`, `UK`, `DE`, `JP`, etc.), sortBy (`RELEVANCE`, `DATE`).

#### Automated CI/CD & Testing
- `.github/workflows/android-ci.yml`: Full automated lint, unit tests (`:app:testDebugUnitTest`), and debug APK build.
- `.github/workflows/android-release.yml`: Tag-triggered release workflow building signed APK/AAB with GitHub secrets handling.
- Comprehensive JVM unit & Robolectric tests verifying search filters, repository fallback logic, Room DAO operations, and ViewModel state transitions.
