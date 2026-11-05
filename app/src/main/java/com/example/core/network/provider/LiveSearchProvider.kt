package com.example.core.network.provider

import android.net.Uri
import android.util.Log
import com.example.core.model.SearchCategory
import com.example.core.model.SearchResult
import com.example.core.network.api.NetworkClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.util.UUID

object LiveSearchProvider {
    private const val TAG = "LiveSearchProvider"

    suspend fun search(query: String, category: SearchCategory): List<SearchResult> = withContext(Dispatchers.IO) {
        val liveResults = mutableListOf<SearchResult>()

        try {
            if (category == SearchCategory.ALL || category == SearchCategory.NEWS) {
                val response = NetworkClient.searchService.searchDuckDuckGo(query = query)
                
                // 1. Primary Abstract Result
                if (!response.abstractText.isNullOrBlank() && !response.abstractUrl.isNullOrBlank()) {
                    val domain = extractDomain(response.abstractUrl)
                    liveResults.add(
                        SearchResult(
                            id = "ddg_main_${UUID.randomUUID()}",
                            title = response.heading ?: query,
                            url = response.abstractUrl,
                            domain = domain,
                            snippet = response.abstractText,
                            category = SearchCategory.ALL,
                            imageUrl = response.image?.takeIf { it.isNotBlank() },
                            sourceName = response.abstractSource ?: domain,
                            publishedDate = "Live Result"
                        )
                    )
                }

                // 2. Related Topics
                response.relatedTopics?.forEach { topic ->
                    if (!topic.text.isNullOrBlank() && !topic.firstUrl.isNullOrBlank()) {
                        val domain = extractDomain(topic.firstUrl)
                        val iconUrl = topic.icon?.url?.takeIf { it.isNotBlank() }?.let {
                            if (it.startsWith("http")) it else "https://duckduckgo.com$it"
                        }
                        liveResults.add(
                            SearchResult(
                                id = "ddg_rel_${UUID.randomUUID()}",
                                title = topic.text.substringBefore(" - ").takeIf { it.length < 90 } ?: topic.text.take(80),
                                url = topic.firstUrl,
                                domain = domain,
                                snippet = topic.text,
                                category = SearchCategory.ALL,
                                imageUrl = iconUrl,
                                sourceName = domain,
                                publishedDate = "Live Result"
                            )
                        )
                    }
                }

                // 3. Direct Results
                response.results?.forEach { item ->
                    if (!item.text.isNullOrBlank() && !item.firstUrl.isNullOrBlank()) {
                        val domain = extractDomain(item.firstUrl)
                        liveResults.add(
                            SearchResult(
                                id = "ddg_res_${UUID.randomUUID()}",
                                title = item.text,
                                url = item.firstUrl,
                                domain = domain,
                                snippet = item.text,
                                category = SearchCategory.ALL,
                                sourceName = domain
                            )
                        )
                    }
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Live DuckDuckGo search failed or offline: ${e.message}")
        }

        // If live search returned results, complement with curated category content to guarantee rich results across all tabs
        val curated = CuratedSearchProvider.query(query, category)
        val combined = (liveResults + curated).distinctBy { it.url }

        combined.ifEmpty { curated }
    }

    suspend fun getLiveSuggestions(query: String): List<String> = withContext(Dispatchers.IO) {
        if (query.isBlank()) return@withContext emptyList()
        try {
            val url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=${Uri.encode(query)}&limit=7&namespace=0&format=json"
            val responseBody = NetworkClient.searchService.getOpenSearchSuggestions(url)
            val jsonString = responseBody.string()
            val jsonArray = JSONArray(jsonString)
            if (jsonArray.length() >= 2) {
                val suggestionsArray = jsonArray.getJSONArray(1)
                val suggestions = mutableListOf<String>()
                for (i in 0 until suggestionsArray.length()) {
                    suggestions.add(suggestionsArray.getString(i))
                }
                return@withContext suggestions
            }
        } catch (e: Exception) {
            Log.w(TAG, "OpenSearch suggestions failed or offline: ${e.message}")
        }
        emptyList()
    }

    private fun extractDomain(url: String): String {
        return try {
            val uri = Uri.parse(url)
            uri.host?.removePrefix("www.") ?: "web"
        } catch (e: Exception) {
            "web"
        }
    }
}
