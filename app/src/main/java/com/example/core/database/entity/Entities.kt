package com.example.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "search_history")
data class SearchHistoryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val query: String,
    val timestamp: Long = System.currentTimeMillis(),
    val category: String = "ALL"
)

@Entity(tableName = "bookmarks")
data class BookmarkEntity(
    @PrimaryKey
    val url: String,
    val title: String,
    val domain: String,
    val snippet: String,
    val imageUrl: String? = null,
    val category: String = "ALL",
    val folder: String = "General",
    val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "deep_research_reports")
data class ResearchReportEntity(
    @PrimaryKey
    val id: String,
    val mainTopic: String,
    val depth: String,
    val summary: String,
    val keyFindingsJson: String,
    val contradictoryFindingsJson: String,
    val sourcesJson: String,
    val confidenceScore: Int,
    val confidenceExplanation: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "installed_extensions")
data class InstalledExtensionEntity(
    @PrimaryKey
    val extensionId: String,
    val name: String,
    val version: String,
    val isEnabled: Boolean,
    val installedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "browser_history")
data class BrowserHistoryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val url: String,
    val title: String,
    val visitTimestamp: Long = System.currentTimeMillis()
)
