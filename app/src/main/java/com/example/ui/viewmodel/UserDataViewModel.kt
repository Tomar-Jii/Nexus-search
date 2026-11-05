package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.core.database.entity.BookmarkEntity
import com.example.core.database.entity.SearchHistoryEntity
import com.example.core.model.SafeSearch
import com.example.core.model.SearchRegion
import com.example.core.model.SearchResult
import com.example.data.repository.UserDataRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class UserDataViewModel(
    private val userDataRepository: UserDataRepository
) : ViewModel() {

    val history: StateFlow<List<SearchHistoryEntity>> = userDataRepository.history
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bookmarks: StateFlow<List<BookmarkEntity>> = userDataRepository.bookmarks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val folders: StateFlow<List<String>> = userDataRepository.folders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val isIncognito: StateFlow<Boolean> = userDataRepository.isIncognito
    val safeSearch: StateFlow<SafeSearch> = userDataRepository.safeSearch
    val region: StateFlow<SearchRegion> = userDataRepository.region

    fun deleteHistoryItem(id: Long) {
        viewModelScope.launch {
            userDataRepository.deleteHistoryItem(id)
        }
    }

    fun deleteHistoryQuery(query: String) {
        viewModelScope.launch {
            userDataRepository.deleteHistoryQuery(query)
        }
    }

    fun clearAllHistory() {
        viewModelScope.launch {
            userDataRepository.clearHistory()
        }
    }

    fun toggleBookmark(result: SearchResult, folder: String = "General") {
        viewModelScope.launch {
            userDataRepository.toggleBookmark(result, folder)
        }
    }

    fun deleteBookmark(url: String) {
        viewModelScope.launch {
            userDataRepository.deleteBookmark(url)
        }
    }

    fun clearAllBookmarks() {
        viewModelScope.launch {
            userDataRepository.clearAllBookmarks()
        }
    }

    fun setIncognito(enabled: Boolean) {
        userDataRepository.setIncognito(enabled)
    }

    fun setSafeSearch(safeSearch: SafeSearch) {
        userDataRepository.setSafeSearch(safeSearch)
    }

    fun setRegion(region: SearchRegion) {
        userDataRepository.setRegion(region)
    }
}

class UserDataViewModelFactory(
    private val userDataRepository: UserDataRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return UserDataViewModel(userDataRepository) as T
    }
}
