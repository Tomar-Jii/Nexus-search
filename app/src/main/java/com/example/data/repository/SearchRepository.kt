package com.example.data.repository

import com.example.core.ai.AiAnswerEngine
import com.example.core.database.dao.SearchHistoryDao
import com.example.core.model.AiAnswer
import com.example.core.model.SearchCategory
import com.example.core.model.SearchFilter
import com.example.core.model.SearchResult
import com.example.core.model.SearchSuggestion
import com.example.core.model.SortOrder
import com.example.core.model.TrendingTopic
import com.example.core.network.provider.CuratedSearchProvider
import com.example.core.network.provider.LiveSearchProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withContext

interface SearchRepository {
    fun search(query: String, category: SearchCategory, filter: SearchFilter): Flow<List<SearchResult>>
    suspend fun getSuggestions(query: String): List<SearchSuggestion>
    fun getTrendingTopics(): List<TrendingTopic>
    fun getAiAnswer(query: String, sources: List<SearchResult>): Flow<AiAnswer>
}

class SearchRepositoryImpl(
    private val historyDao: SearchHistoryDao
) : SearchRepository {

    override fun search(
        query: String,
        category: SearchCategory,
        filter: SearchFilter
    ): Flow<List<SearchResult>> = flow {
        val rawResults = LiveSearchProvider.search(query, category)
        val filtered = applyFilters(rawResults, filter)
        emit(filtered)
    }.flowOn(Dispatchers.IO)

    override suspend fun getSuggestions(query: String): List<SearchSuggestion> = withContext(Dispatchers.IO) {
        val cleanQuery = query.trim()
        if (cleanQuery.isBlank()) {
            return@withContext CuratedSearchProvider.trendingTopics.map {
                SearchSuggestion(query = it.query, isTrending = true)
            }
        }

        val suggestions = mutableListOf<SearchSuggestion>()

        // 1. Check local search history
        try {
            val matchingHistory = historyDao.findMatchingHistory(cleanQuery)
            matchingHistory.forEach {
                suggestions.add(SearchSuggestion(query = it.query, isHistory = true))
            }
        } catch (_: Exception) {}

        // 2. Fetch live online autocomplete suggestions
        val liveSuggestions = LiveSearchProvider.getLiveSuggestions(cleanQuery)
        liveSuggestions.forEach { term ->
            if (suggestions.none { it.query.equals(term, ignoreCase = true) }) {
                suggestions.add(SearchSuggestion(query = term))
            }
        }

        // 3. Fallback to matching curated trending topics
        CuratedSearchProvider.trendingTopics.forEach { topic ->
            if (topic.query.contains(cleanQuery, ignoreCase = true) &&
                suggestions.none { it.query.equals(topic.query, ignoreCase = true) }
            ) {
                suggestions.add(SearchSuggestion(query = topic.query, isTrending = true))
            }
        }

        suggestions.take(10)
    }

    override fun getTrendingTopics(): List<TrendingTopic> {
        return CuratedSearchProvider.trendingTopics
    }

    override fun getAiAnswer(query: String, sources: List<SearchResult>): Flow<AiAnswer> {
        return AiAnswerEngine.generateStreamingAnswer(query, sources)
    }

    private fun applyFilters(results: List<SearchResult>, filter: SearchFilter): List<SearchResult> {
        var filtered = results

        // Sort filter
        filtered = when (filter.sortOrder) {
            SortOrder.DATE -> filtered.sortedByDescending { it.publishedDate.orEmpty() }
            SortOrder.RELEVANCE -> filtered
        }

        return filtered
    }
}
