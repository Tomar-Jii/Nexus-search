package com.example.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.core.database.entity.BookmarkEntity
import com.example.core.database.entity.BrowserHistoryEntity
import com.example.core.database.entity.InstalledExtensionEntity
import com.example.core.database.entity.ResearchReportEntity
import com.example.core.database.entity.SearchHistoryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SearchHistoryDao {
    @Query("SELECT * FROM search_history ORDER BY timestamp DESC LIMIT :limit")
    fun getRecentHistory(limit: Int = 30): Flow<List<SearchHistoryEntity>>

    @Query("SELECT * FROM search_history WHERE `query` LIKE '%' || :queryPrefix || '%' ORDER BY timestamp DESC LIMIT 5")
    suspend fun findMatchingHistory(queryPrefix: String): List<SearchHistoryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(entity: SearchHistoryEntity): Long

    @Query("DELETE FROM search_history WHERE id = :id")
    suspend fun deleteHistoryById(id: Long)

    @Query("DELETE FROM search_history WHERE `query` = :query")
    suspend fun deleteHistoryByQuery(query: String)

    @Query("DELETE FROM search_history")
    suspend fun clearAllHistory()
}

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks ORDER BY savedAt DESC")
    fun getAllBookmarks(): Flow<List<BookmarkEntity>>

    @Query("SELECT * FROM bookmarks WHERE folder = :folder ORDER BY savedAt DESC")
    fun getBookmarksByFolder(folder: String): Flow<List<BookmarkEntity>>

    @Query("SELECT DISTINCT folder FROM bookmarks ORDER BY folder ASC")
    fun getFolders(): Flow<List<String>>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE url = :url)")
    fun isBookmarked(url: String): Flow<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM bookmarks WHERE url = :url)")
    suspend fun isBookmarkedSync(url: String): Boolean

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookmark(bookmark: BookmarkEntity)

    @Query("DELETE FROM bookmarks WHERE url = :url")
    suspend fun deleteBookmarkByUrl(url: String)

    @Query("DELETE FROM bookmarks")
    suspend fun clearAllBookmarks()
}

@Dao
interface ResearchReportDao {
    @Query("SELECT * FROM deep_research_reports ORDER BY timestamp DESC")
    fun getAllReports(): Flow<List<ResearchReportEntity>>

    @Query("SELECT * FROM deep_research_reports WHERE id = :reportId LIMIT 1")
    suspend fun getReportById(reportId: String): ResearchReportEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReport(report: ResearchReportEntity)

    @Query("DELETE FROM deep_research_reports WHERE id = :reportId")
    suspend fun deleteReport(reportId: String)

    @Query("DELETE FROM deep_research_reports")
    suspend fun clearAllReports()
}

@Dao
interface InstalledExtensionDao {
    @Query("SELECT * FROM installed_extensions ORDER BY installedAt DESC")
    fun getInstalledExtensions(): Flow<List<InstalledExtensionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveExtension(entity: InstalledExtensionEntity)

    @Query("UPDATE installed_extensions SET isEnabled = :isEnabled WHERE extensionId = :id")
    suspend fun setExtensionEnabled(id: String, isEnabled: Boolean)

    @Query("DELETE FROM installed_extensions WHERE extensionId = :id")
    suspend fun uninstallExtension(id: String)
}

@Dao
interface BrowserHistoryDao {
    @Query("SELECT * FROM browser_history ORDER BY visitTimestamp DESC LIMIT :limit")
    fun getBrowserHistory(limit: Int = 100): Flow<List<BrowserHistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHistory(entry: BrowserHistoryEntity)

    @Query("DELETE FROM browser_history WHERE id = :id")
    suspend fun deleteHistoryById(id: Long)

    @Query("DELETE FROM browser_history")
    suspend fun clearBrowserHistory()
}
