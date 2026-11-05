package com.example

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import com.example.core.database.AppDatabase
import com.example.core.database.entity.BookmarkEntity
import com.example.core.database.entity.SearchHistoryEntity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

    private lateinit var db: AppDatabase

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
    }

    @After
    fun closeDb() {
        db.close()
    }

    @Test
    fun readStringFromContext() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("Nexus Search", appName)
    }

    @Test
    fun testSearchHistoryDaoInsertAndQuery() = runBlocking {
        val historyDao = db.searchHistoryDao()
        val entity = SearchHistoryEntity(
            query = "quantum computing",
            category = "ALL",
            timestamp = 1000L
        )

        historyDao.insertHistory(entity)
        val matches = historyDao.findMatchingHistory("quantum")

        assertEquals(1, matches.size)
        assertEquals("quantum computing", matches[0].query)

        // Test clear
        historyDao.clearAllHistory()
        val emptyList = historyDao.getRecentHistory().first()
        assertTrue(emptyList.isEmpty())
    }

    @Test
    fun testBookmarkDaoOperations() = runBlocking {
        val bookmarkDao = db.bookmarkDao()
        val bookmark = BookmarkEntity(
            url = "https://nature.com/articles/quantum-2026",
            title = "Quantum Computing Breakthrough",
            domain = "nature.com",
            snippet = "New fault tolerant results.",
            folder = "Science"
        )

        bookmarkDao.insertBookmark(bookmark)

        val isBookmarked = bookmarkDao.isBookmarkedSync(bookmark.url)
        assertTrue(isBookmarked)

        val all = bookmarkDao.getAllBookmarks().first()
        assertEquals(1, all.size)
        assertEquals("Science", all[0].folder)

        bookmarkDao.deleteBookmarkByUrl(bookmark.url)
        val afterDelete = bookmarkDao.isBookmarkedSync(bookmark.url)
        assertFalse(afterDelete)
    }
}
