package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Extension
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.NorthWest
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.VpnKey
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.core.model.AssistantPersona
import com.example.core.model.SearchCategory
import com.example.core.model.SearchSuggestion
import com.example.core.model.TrendingTopic
import com.example.ui.components.NexusSearchBar
import com.example.ui.components.VoiceSearchDialog
import com.example.ui.theme.NexusAiGradientEnd
import com.example.ui.theme.NexusAiGradientStart
import com.example.ui.theme.NexusBlueLight
import com.example.ui.theme.NexusBluePrimary
import com.example.ui.theme.NexusIncognito
import com.example.ui.theme.NexusSuccess
import com.example.ui.viewmodel.SearchViewModel
import com.example.ui.viewmodel.UserDataViewModel

@Composable
fun HomeScreen(
    searchViewModel: SearchViewModel,
    userDataViewModel: UserDataViewModel,
    onNavigateToResults: (query: String, category: SearchCategory) -> Unit,
    onNavigateToDeepResearch: () -> Unit,
    onNavigateToBrowser: (url: String) -> Unit,
    onNavigateToPrivateNetwork: () -> Unit,
    onNavigateToExtensions: () -> Unit,
    onNavigateToAssistant: () -> Unit,
    onNavigateToSecurityCenter: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToBookmarks: () -> Unit,
    onNavigateToSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val query by searchViewModel.query.collectAsState()
    val suggestions by searchViewModel.suggestions.collectAsState()
    val isIncognito by userDataViewModel.isIncognito.collectAsState()
    val isDark = isSystemInDarkTheme()
    val activePersona = if (isDark) AssistantPersona.DEVIL else AssistantPersona.ANGEL
    val personaAccent = Color(activePersona.themeAccentHex)

    var showVoiceDialog by remember { mutableStateOf(false) }

    if (showVoiceDialog) {
        VoiceSearchDialog(
            onDismiss = { showVoiceDialog = false },
            onSpeechResult = { text ->
                showVoiceDialog = false
                searchViewModel.onQueryChange(text)
                onNavigateToResults(text, SearchCategory.ALL)
            }
        )
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Interactive Persona Greeting Badge
                Row(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(personaAccent.copy(alpha = 0.15f))
                        .border(1.dp, personaAccent.copy(alpha = 0.5f), CircleShape)
                        .clickable { onNavigateToAssistant() }
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                        .testTag("home_persona_badge"),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = if (activePersona == AssistantPersona.ANGEL) Icons.Default.Spa else Icons.Default.LocalFireDepartment,
                        contentDescription = null,
                        tint = personaAccent,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = activePersona.displayName,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = personaAccent
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onNavigateToSecurityCenter) {
                        Icon(imageVector = Icons.Default.Shield, contentDescription = "Security Center", tint = NexusBlueLight)
                    }
                    IconButton(onClick = onNavigateToBookmarks) {
                        Icon(imageVector = Icons.Default.Bookmark, contentDescription = "Bookmarks", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(imageVector = Icons.Default.Settings, contentDescription = "Settings", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(10.dp))
                // Logo Branding
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(Brush.linearGradient(listOf(NexusAiGradientStart, NexusAiGradientEnd))),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "N",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.surface
                        )
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "NEXUS SEARCH",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    ),
                    color = MaterialTheme.colorScheme.onBackground
                )

                Text(
                    text = "AI Search • Tor Private Browser • Extension Platform",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Search Bar
                NexusSearchBar(
                    query = query,
                    onQueryChange = { searchViewModel.onQueryChange(it) },
                    onSearch = { submittedQuery ->
                        if (submittedQuery.isNotBlank()) {
                            onNavigateToResults(submittedQuery, SearchCategory.ALL)
                        }
                    },
                    onMicClick = { showVoiceDialog = true }
                )
            }

            // Quick Category Filter Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    SearchCategory.entries.forEach { cat ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                            .clickable {
                                if (query.isNotBlank()) {
                                    onNavigateToResults(query, cat)
                                } else {
                                    onNavigateToResults("latest", cat)
                                }
                            }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                        ) {
                            Text(
                                text = cat.label,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Core Platform Feature Launchpad
            item {
                Text(
                    text = "Nexus Ecosystem",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    FeatureLaunchCard(
                        title = "Deep Research",
                        subtitle = "Multi-stage investigation",
                        icon = Icons.Default.Psychology,
                        iconTint = NexusBluePrimary,
                        onClick = onNavigateToDeepResearch,
                        modifier = Modifier.weight(1f)
                    )
                    FeatureLaunchCard(
                        title = "Tor Network",
                        subtitle = ".onion fail-closed routing",
                        icon = Icons.Default.VpnKey,
                        iconTint = NexusIncognito,
                        onClick = onNavigateToPrivateNetwork,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    FeatureLaunchCard(
                        title = "Nexus Browser",
                        subtitle = "Multi-tab private engine",
                        icon = Icons.Default.Security,
                        iconTint = NexusSuccess,
                        onClick = { onNavigateToBrowser("https://duckduckgo.com") },
                        modifier = Modifier.weight(1f)
                    )
                    FeatureLaunchCard(
                        title = "Extensions",
                        subtitle = "WebExtensions store",
                        icon = Icons.Default.Extension,
                        iconTint = NexusBlueLight,
                        onClick = onNavigateToExtensions,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Autocomplete Suggestions OR Trending Topics
            if (query.isNotBlank() && suggestions.isNotEmpty()) {
                item {
                    Text(
                        text = "Suggestions",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                items(suggestions) { item ->
                    SuggestionRowItem(
                        item = item,
                        onClick = {
                            searchViewModel.onQueryChange(item.query)
                            onNavigateToResults(item.query, SearchCategory.ALL)
                        },
                        onDelete = {
                            userDataViewModel.deleteHistoryQuery(item.query)
                        }
                    )
                }
            } else {
                item {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.TrendingUp, contentDescription = null, tint = NexusBluePrimary, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Trending Searches",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }
                }

                items(searchViewModel.trendingTopics) { topic ->
                    TrendingTopicCard(
                        topic = topic,
                        onClick = {
                            searchViewModel.onQueryChange(topic.query)
                            onNavigateToResults(topic.query, SearchCategory.ALL)
                        }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun FeatureLaunchCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    iconTint: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(iconTint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(text = title, style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = MaterialTheme.colorScheme.onSurface)
            Text(text = subtitle, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun SuggestionRowItem(
    item: SearchSuggestion,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = if (item.isHistory) Icons.Default.History else Icons.Default.TrendingUp,
                contentDescription = null,
                tint = if (item.isHistory) MaterialTheme.colorScheme.onSurfaceVariant else NexusBlueLight,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = item.query,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface
            )
        }

        if (item.isHistory) {
            IconButton(
                onClick = onDelete,
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Remove suggestion",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
            }
        } else {
            Icon(
                imageVector = Icons.Default.NorthWest,
                contentDescription = "Fill",
                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                modifier = Modifier.size(14.dp)
            )
        }
    }
}

@Composable
private fun TrendingTopicCard(
    topic: TrendingTopic,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .testTag("trending_${topic.id}"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = topic.query,
                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${topic.category} • ${topic.searchVolume}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                imageVector = Icons.Default.TrendingUp,
                contentDescription = null,
                tint = NexusBlueLight,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}
