package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.core.browser.CustomTabsHelper
import com.example.core.model.SearchCategory
import com.example.ui.components.AiOverviewCard
import com.example.ui.components.ImageResultCard
import com.example.ui.components.NewsResultCard
import com.example.ui.components.NexusSearchBar
import com.example.ui.components.SearchFilterSheet
import com.example.ui.components.VideoResultCard
import com.example.ui.components.VoiceSearchDialog
import com.example.ui.components.WebResultCard
import com.example.ui.theme.NexusBlueLight
import com.example.ui.theme.NexusBluePrimary
import com.example.ui.viewmodel.SearchViewModel
import com.example.ui.viewmodel.UserDataViewModel

@Composable
fun ResultsScreen(
    searchViewModel: SearchViewModel,
    userDataViewModel: UserDataViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val query by searchViewModel.query.collectAsState()
    val selectedCategory by searchViewModel.selectedCategory.collectAsState()
    val filters by searchViewModel.filters.collectAsState()
    val isSearching by searchViewModel.isSearching.collectAsState()
    val searchResults by searchViewModel.searchResults.collectAsState()
    val aiAnswer by searchViewModel.aiAnswer.collectAsState()
    val errorMessage by searchViewModel.errorMessage.collectAsState()
    val bookmarks by userDataViewModel.bookmarks.collectAsState()

    var showFilterSheet by remember { mutableStateOf(false) }
    var showVoiceDialog by remember { mutableStateOf(false) }
    var isEditingSearch by remember { mutableStateOf(false) }

    BackHandler {
        onBack()
    }

    if (showFilterSheet) {
        SearchFilterSheet(
            currentFilter = filters,
            onApply = { newFilters ->
                showFilterSheet = false
                searchViewModel.updateFilters(newFilters)
            },
            onDismiss = { showFilterSheet = false }
        )
    }

    if (showVoiceDialog) {
        VoiceSearchDialog(
            onDismiss = { showVoiceDialog = false },
            onSpeechResult = { text ->
                showVoiceDialog = false
                searchViewModel.onQueryChange(text)
                searchViewModel.executeSearch(text, selectedCategory)
            }
        )
    }

    val bookmarkedUrls = remember(bookmarks) {
        bookmarks.map { it.url }.toSet()
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(top = 8.dp)
            ) {
                // Top Search & Controls Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("results_back_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    if (isEditingSearch) {
                        NexusSearchBar(
                            query = query,
                            onQueryChange = { searchViewModel.onQueryChange(it) },
                            onSearch = { submitted ->
                                isEditingSearch = false
                                searchViewModel.executeSearch(submitted, selectedCategory)
                            },
                            onMicClick = { showVoiceDialog = true },
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(onClick = { isEditingSearch = false }) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Close edit")
                        }
                    } else {
                        // Compact Query Bar Pill
                        Row(
                            modifier = Modifier
                                .weight(1f)
                                .height(46.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .clickable { isEditingSearch = true }
                                .padding(horizontal = 14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = null,
                                tint = NexusBluePrimary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = query,
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium),
                                color = MaterialTheme.colorScheme.onSurface,
                                maxLines = 1,
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(
                                onClick = { showVoiceDialog = true },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Mic,
                                    contentDescription = "Voice search",
                                    tint = NexusBluePrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }

                    IconButton(
                        onClick = { showFilterSheet = true },
                        modifier = Modifier.testTag("filter_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.FilterList,
                            contentDescription = "Filter",
                            tint = NexusBluePrimary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Category Tabs Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    SearchCategory.entries.forEach { cat ->
                        val isSelected = selectedCategory == cat
                        val bg = if (isSelected) NexusBluePrimary else MaterialTheme.colorScheme.surfaceVariant
                        val fg = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(bg)
                                .clickable { searchViewModel.selectCategory(cat) }
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                                .testTag("tab_${cat.name}"),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = cat.label,
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                ),
                                color = fg
                            )
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                isSearching -> {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator(
                            color = NexusBluePrimary,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Searching authoritative web sources…",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                errorMessage != null -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Search Error",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = errorMessage ?: "Unknown search issue",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        TextButton(onClick = { searchViewModel.executeSearch(query, selectedCategory) }) {
                            Text("Retry Search", color = NexusBlueLight)
                        }
                    }
                }

                searchResults.isEmpty() -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "No results found for \"$query\"",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Try different keywords or check spelling and filters.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                    }
                }

                else -> {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        item {
                            Spacer(modifier = Modifier.height(10.dp))
                        }

                        // AI Overview Card in ALL tab
                        if (selectedCategory == SearchCategory.ALL) {
                            item {
                                AiOverviewCard(
                                    aiAnswer = aiAnswer,
                                    onSourceClick = { citation ->
                                        CustomTabsHelper.openUrl(context, citation.url)
                                    }
                                )
                            }
                        }

                        // Category Results Rendering
                        when (selectedCategory) {
                            SearchCategory.ALL -> {
                                items(searchResults) { res ->
                                    WebResultCard(
                                        result = res,
                                        isBookmarked = bookmarkedUrls.contains(res.url),
                                        onClick = { CustomTabsHelper.openUrl(context, res.url) },
                                        onBookmarkToggle = { userDataViewModel.toggleBookmark(res) },
                                        onShare = { CustomTabsHelper.shareUrl(context, res.title, res.url) },
                                        onCopyUrl = { CustomTabsHelper.copyToClipboard(context, res.url) }
                                    )
                                }
                            }
                            SearchCategory.IMAGES -> {
                                items(searchResults) { res ->
                                    ImageResultCard(
                                        result = res,
                                        onClick = { CustomTabsHelper.openUrl(context, res.url) }
                                    )
                                }
                            }
                            SearchCategory.VIDEOS -> {
                                items(searchResults) { res ->
                                    VideoResultCard(
                                        result = res,
                                        onClick = { CustomTabsHelper.openUrl(context, res.url) }
                                    )
                                }
                            }
                            SearchCategory.NEWS -> {
                                items(searchResults) { res ->
                                    NewsResultCard(
                                        result = res,
                                        onClick = { CustomTabsHelper.openUrl(context, res.url) }
                                    )
                                }
                            }
                        }

                        item {
                            Spacer(modifier = Modifier.height(24.dp))
                        }
                    }
                }
            }
        }
    }
}
