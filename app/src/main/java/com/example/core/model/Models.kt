package com.example.core.model

enum class SearchCategory(val label: String) {
    ALL("All"),
    IMAGES("Images"),
    VIDEOS("Videos"),
    NEWS("News")
}

data class SearchResult(
    val id: String,
    val title: String,
    val url: String,
    val domain: String,
    val snippet: String,
    val category: SearchCategory = SearchCategory.ALL,
    val imageUrl: String? = null,
    val publishedDate: String? = null,
    val duration: String? = null,
    val sourceName: String? = null,
    val isBookmarked: Boolean = false
)

enum class AiStatus {
    IDLE,
    LOADING,
    STREAMING,
    SUCCESS,
    ERROR
}

data class SourceCitation(
    val index: Int,
    val title: String,
    val url: String,
    val domain: String,
    val snippet: String
)

data class AiAnswer(
    val query: String = "",
    val summaryText: String = "",
    val keyPoints: List<String> = emptyList(),
    val citations: List<SourceCitation> = emptyList(),
    val status: AiStatus = AiStatus.IDLE,
    val errorMessage: String? = null
)

enum class TimeRange(val label: String) {
    ANY("Any time"),
    PAST_24H("Past 24 hours"),
    PAST_WEEK("Past week"),
    PAST_MONTH("Past month"),
    PAST_YEAR("Past year")
}

enum class SafeSearch(val label: String) {
    OFF("Off"),
    MODERATE("Moderate"),
    STRICT("Strict")
}

enum class SearchRegion(val label: String, val code: String) {
    GLOBAL("Global", "global"),
    US("United States", "us"),
    UK("United Kingdom", "uk"),
    DE("Germany", "de"),
    IN("India", "in"),
    JP("Japan", "jp")
}

enum class SortOrder(val label: String) {
    RELEVANCE("Most relevant"),
    DATE("Most recent")
}

data class SearchFilter(
    val timeRange: TimeRange = TimeRange.ANY,
    val safeSearch: SafeSearch = SafeSearch.MODERATE,
    val region: SearchRegion = SearchRegion.GLOBAL,
    val sortOrder: SortOrder = SortOrder.RELEVANCE
)

data class SearchSuggestion(
    val query: String,
    val isTrending: Boolean = false,
    val isHistory: Boolean = false
)

data class TrendingTopic(
    val id: String,
    val query: String,
    val category: String,
    val searchVolume: String
)
