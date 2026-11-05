package com.example

import com.example.core.model.SafeSearch
import com.example.core.model.SearchCategory
import com.example.core.model.SearchFilter
import com.example.core.model.SearchRegion
import com.example.core.model.SortOrder
import com.example.core.model.TimeRange
import com.example.core.network.provider.CuratedSearchProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SearchFilterTest {

    @Test
    fun testDefaultFilters() {
        val filter = SearchFilter()
        assertEquals(TimeRange.ANY, filter.timeRange)
        assertEquals(SafeSearch.MODERATE, filter.safeSearch)
        assertEquals(SearchRegion.GLOBAL, filter.region)
        assertEquals(SortOrder.RELEVANCE, filter.sortOrder)
    }

    @Test
    fun testCuratedSearchQueryMatching() {
        val aiResults = CuratedSearchProvider.query("multimodal", SearchCategory.ALL)
        assertTrue(aiResults.isNotEmpty())
        assertTrue(aiResults.any { it.title.contains("Multimodal", ignoreCase = true) })

        val imgResults = CuratedSearchProvider.query("james webb", SearchCategory.IMAGES)
        assertTrue(imgResults.isNotEmpty())
        assertEquals(SearchCategory.IMAGES, imgResults[0].category)

        val vidResults = CuratedSearchProvider.query("artemis", SearchCategory.VIDEOS)
        assertTrue(vidResults.isNotEmpty())
        assertEquals(SearchCategory.VIDEOS, vidResults[0].category)

        val newsResults = CuratedSearchProvider.query("tech", SearchCategory.NEWS)
        assertTrue(newsResults.isNotEmpty())
        assertEquals(SearchCategory.NEWS, newsResults[0].category)
    }

    @Test
    fun testDynamicResultsForNovelQueries() {
        val novelResults = CuratedSearchProvider.query("photonic neural processors", SearchCategory.ALL)
        assertTrue(novelResults.isNotEmpty())
        assertTrue(novelResults.any { it.title.contains("Photonic neural processors", ignoreCase = true) })
    }

    @Test
    fun testTrendingTopicsNonEmpty() {
        val trending = CuratedSearchProvider.trendingTopics
        assertTrue(trending.size >= 5)
        assertTrue(trending.all { it.query.isNotBlank() && it.searchVolume.isNotBlank() })
    }
}
