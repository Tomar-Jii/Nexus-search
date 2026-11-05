package com.example.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.core.database.dao.BookmarkDao
import com.example.core.database.dao.BrowserHistoryDao
import com.example.core.database.dao.InstalledExtensionDao
import com.example.core.database.dao.ResearchReportDao
import com.example.core.database.dao.SearchHistoryDao
import com.example.core.database.entity.BookmarkEntity
import com.example.core.database.entity.BrowserHistoryEntity
import com.example.core.database.entity.InstalledExtensionEntity
import com.example.core.database.entity.ResearchReportEntity
import com.example.core.database.entity.SearchHistoryEntity

@Database(
    entities = [
        SearchHistoryEntity::class,
        BookmarkEntity::class,
        ResearchReportEntity::class,
        InstalledExtensionEntity::class,
        BrowserHistoryEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun searchHistoryDao(): SearchHistoryDao
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun researchReportDao(): ResearchReportDao
    abstract fun installedExtensionDao(): InstalledExtensionDao
    abstract fun browserHistoryDao(): BrowserHistoryDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "nexus_search.db"
                ).fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
