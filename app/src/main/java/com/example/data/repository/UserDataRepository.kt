package com.example.data.repository

import android.content.Context
import com.example.core.database.dao.BookmarkDao
import com.example.core.database.dao.SearchHistoryDao
import com.example.core.database.entity.BookmarkEntity
import com.example.core.database.entity.SearchHistoryEntity
import com.example.core.model.SafeSearch
import com.example.core.model.SearchRegion
import com.example.core.model.SearchResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

interface UserDataRepository {
    val history: Flow<List<SearchHistoryEntity>>
    val bookmarks: Flow<List<BookmarkEntity>>
    val folders: Flow<List<String>>
    val isIncognito: StateFlow<Boolean>
    val safeSearch: StateFlow<SafeSearch>
    val region: StateFlow<SearchRegion>

    suspend fun recordSearch(query: String, category: String = "ALL")
    suspend fun deleteHistoryItem(id: Long)
    suspend fun deleteHistoryQuery(query: String)
    suspend fun clearHistory()

    fun isBookmarked(url: String): Flow<Boolean>
    suspend fun isBookmarkedSync(url: String): Boolean
    suspend fun toggleBookmark(result: SearchResult, folder: String = "General")
    suspend fun deleteBookmark(url: String)
    suspend fun clearAllBookmarks()

    fun setIncognito(enabled: Boolean)
    fun setSafeSearch(safeSearch: SafeSearch)
    fun setRegion(region: SearchRegion)
}

class UserDataRepositoryImpl(
    private val historyDao: SearchHistoryDao,
    private val bookmarkDao: BookmarkDao,
    context: Context
) : UserDataRepository {

    private val prefs = context.getSharedPreferences("nexus_search_prefs", Context.MODE_PRIVATE)

    override val history: Flow<List<SearchHistoryEntity>> = historyDao.getRecentHistory(50)
    override val bookmarks: Flow<List<BookmarkEntity>> = bookmarkDao.getAllBookmarks()
    override val folders: Flow<List<String>> = bookmarkDao.getFolders()

    private val _isIncognito = MutableStateFlow(prefs.getBoolean("incognito_mode", false))
    override val isIncognito: StateFlow<Boolean> = _isIncognito.asStateFlow()

    private val _safeSearch = MutableStateFlow(
        SafeSearch.entries.getOrNull(prefs.getInt("safe_search", SafeSearch.MODERATE.ordinal)) ?: SafeSearch.MODERATE
    )
    override val safeSearch: StateFlow<SafeSearch> = _safeSearch.asStateFlow()

    private val _region = MutableStateFlow(
        SearchRegion.entries.getOrNull(prefs.getInt("search_region", SearchRegion.GLOBAL.ordinal)) ?: SearchRegion.GLOBAL
    )
    override val region: StateFlow<SearchRegion> = _region.asStateFlow()

    override suspend fun recordSearch(query: String, category: String) {
        if (_isIncognito.value || query.isBlank()) return
        historyDao.insertHistory(
            SearchHistoryEntity(
                query = query.trim(),
                timestamp = System.currentTimeMillis(),
                category = category
            )
        )
    }

    override suspend fun deleteHistoryItem(id: Long) {
        historyDao.deleteHistoryById(id)
    }

    override suspend fun deleteHistoryQuery(query: String) {
        historyDao.deleteHistoryByQuery(query.trim())
    }

    override suspend fun clearHistory() {
        historyDao.clearAllHistory()
    }

    override fun isBookmarked(url: String): Flow<Boolean> {
        return bookmarkDao.isBookmarked(url)
    }

    override suspend fun isBookmarkedSync(url: String): Boolean {
        return bookmarkDao.isBookmarkedSync(url)
    }

    override suspend fun toggleBookmark(result: SearchResult, folder: String) {
        val alreadyBookmarked = bookmarkDao.isBookmarkedSync(result.url)
        if (alreadyBookmarked) {
            bookmarkDao.deleteBookmarkByUrl(result.url)
        } else {
            bookmarkDao.insertBookmark(
                BookmarkEntity(
                    url = result.url,
                    title = result.title,
                    domain = result.domain,
                    snippet = result.snippet,
                    imageUrl = result.imageUrl,
                    category = result.category.name,
                    folder = folder,
                    savedAt = System.currentTimeMillis()
                )
            )
        }
    }

    override suspend fun deleteBookmark(url: String) {
        bookmarkDao.deleteBookmarkByUrl(url)
    }

    override suspend fun clearAllBookmarks() {
        bookmarkDao.clearAllBookmarks()
    }

    override fun setIncognito(enabled: Boolean) {
        _isIncognito.value = enabled
        prefs.edit().putBoolean("incognito_mode", enabled).apply()
    }

    override fun setSafeSearch(safeSearch: SafeSearch) {
        _safeSearch.value = safeSearch
        prefs.edit().putInt("safe_search", safeSearch.ordinal).apply()
    }

    override fun setRegion(region: SearchRegion) {
        _region.value = region
        prefs.edit().putInt("search_region", region.ordinal).apply()
    }
}
