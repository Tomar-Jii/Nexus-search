package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.core.model.AiAnswer
import com.example.core.model.AiStatus
import com.example.core.model.SearchCategory
import com.example.core.model.SearchFilter
import com.example.core.model.SearchResult
import com.example.core.model.SearchSuggestion
import com.example.core.model.TrendingTopic
import com.example.data.repository.SearchRepository
import com.example.data.repository.UserDataRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch

class SearchViewModel(
    private val searchRepository: SearchRepository,
    private val userDataRepository: UserDataRepository
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _selectedCategory = MutableStateFlow(SearchCategory.ALL)
    val selectedCategory: StateFlow<SearchCategory> = _selectedCategory.asStateFlow()

    private val _filters = MutableStateFlow(SearchFilter())
    val filters: StateFlow<SearchFilter> = _filters.asStateFlow()

    private val _suggestions = MutableStateFlow<List<SearchSuggestion>>(emptyList())
    val suggestions: StateFlow<List<SearchSuggestion>> = _suggestions.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching: StateFlow<Boolean> = _isSearching.asStateFlow()

    private val _searchResults = MutableStateFlow<List<SearchResult>>(emptyList())
    val searchResults: StateFlow<List<SearchResult>> = _searchResults.asStateFlow()

    private val _aiAnswer = MutableStateFlow(AiAnswer())
    val aiAnswer: StateFlow<AiAnswer> = _aiAnswer.asStateFlow()

    private val _isAiEnabled = MutableStateFlow(true)
    val isAiEnabled: StateFlow<Boolean> = _isAiEnabled.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    val trendingTopics: List<TrendingTopic> = searchRepository.getTrendingTopics()

    private var suggestionJob: Job? = null
    private var searchJob: Job? = null
    private var aiJob: Job? = null

    init {
        loadInitialSuggestions()
    }

    private fun loadInitialSuggestions() {
        _suggestions.value = searchRepository.getTrendingTopics().map {
            SearchSuggestion(query = it.query, isTrending = true)
        }
    }

    fun onQueryChange(newQuery: String) {
        _query.value = newQuery
        suggestionJob?.cancel()

        if (newQuery.isBlank()) {
            loadInitialSuggestions()
            return
        }

        suggestionJob = viewModelScope.launch {
            delay(250) // Debounce network requests
            val list = searchRepository.getSuggestions(newQuery)
            _suggestions.value = list
        }
    }

    fun executeSearch(searchQuery: String = _query.value, category: SearchCategory = _selectedCategory.value) {
        val trimmed = searchQuery.trim()
        if (trimmed.isBlank()) return

        _query.value = trimmed
        _selectedCategory.value = category
        _isSearching.value = true
        _errorMessage.value = null

        // Record query in history (if not incognito)
        viewModelScope.launch {
            userDataRepository.recordSearch(trimmed, category.name)
        }

        searchJob?.cancel()
        aiJob?.cancel()

        searchJob = viewModelScope.launch {
            searchRepository.search(trimmed, category, _filters.value)
                .catch { e ->
                    _isSearching.value = false
                    _errorMessage.value = e.localizedMessage ?: "Search request failed"
                }
                .collect { results ->
                    _searchResults.value = results
                    _isSearching.value = false

                    // If in ALL tab and AI answers are enabled, trigger Gemini AI overview
                    if (category == SearchCategory.ALL && _isAiEnabled.value && results.isNotEmpty()) {
                        triggerAiSynthesis(trimmed, results)
                    } else {
                        _aiAnswer.value = AiAnswer(status = AiStatus.IDLE)
                    }
                }
        }
    }

    private fun triggerAiSynthesis(query: String, sources: List<SearchResult>) {
        aiJob?.cancel()
        aiJob = viewModelScope.launch {
            searchRepository.getAiAnswer(query, sources)
                .catch { e ->
                    _aiAnswer.value = AiAnswer(
                        query = query,
                        status = AiStatus.ERROR,
                        errorMessage = e.localizedMessage ?: "AI synthesis failed"
                    )
                }
                .collect { answer ->
                    _aiAnswer.value = answer
                }
        }
    }

    fun selectCategory(category: SearchCategory) {
        if (_selectedCategory.value != category) {
            _selectedCategory.value = category
            if (_query.value.isNotBlank() && _searchResults.value.isNotEmpty()) {
                executeSearch(_query.value, category)
            }
        }
    }

    fun updateFilters(newFilters: SearchFilter) {
        _filters.value = newFilters
        if (_query.value.isNotBlank()) {
            executeSearch(_query.value, _selectedCategory.value)
        }
    }

    fun setAiEnabled(enabled: Boolean) {
        _isAiEnabled.value = enabled
        if (enabled && _selectedCategory.value == SearchCategory.ALL && _searchResults.value.isNotEmpty()) {
            triggerAiSynthesis(_query.value, _searchResults.value)
        } else if (!enabled) {
            aiJob?.cancel()
            _aiAnswer.value = AiAnswer(status = AiStatus.IDLE)
        }
    }

    fun clearSearch() {
        _query.value = ""
        _searchResults.value = emptyList()
        _aiAnswer.value = AiAnswer(status = AiStatus.IDLE)
        _errorMessage.value = null
        loadInitialSuggestions()
    }
}

class SearchViewModelFactory(
    private val searchRepository: SearchRepository,
    private val userDataRepository: UserDataRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return SearchViewModel(searchRepository, userDataRepository) as T
    }
}
