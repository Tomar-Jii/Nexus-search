package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.core.model.SafeSearch
import com.example.core.model.SearchFilter
import com.example.core.model.SearchRegion
import com.example.core.model.SortOrder
import com.example.core.model.TimeRange
import com.example.ui.theme.NexusBluePrimary

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun SearchFilterSheet(
    currentFilter: SearchFilter,
    onApply: (SearchFilter) -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedTimeRange by remember { mutableStateOf(currentFilter.timeRange) }
    var selectedSafeSearch by remember { mutableStateOf(currentFilter.safeSearch) }
    var selectedRegion by remember { mutableStateOf(currentFilter.region) }
    var selectedSortOrder by remember { mutableStateOf(currentFilter.sortOrder) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
        ) {
            Text(
                text = "Search Filters",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(18.dp))

            // Time Range
            Text(
                text = "Time Range",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(8.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TimeRange.entries.forEach { time ->
                    FilterChipOption(
                        label = time.label,
                        isSelected = selectedTimeRange == time,
                        onClick = { selectedTimeRange = time }
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Sort Order
            Text(
                text = "Sort Order",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(8.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                SortOrder.entries.forEach { sort ->
                    FilterChipOption(
                        label = sort.label,
                        isSelected = selectedSortOrder == sort,
                        onClick = { selectedSortOrder = sort }
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // SafeSearch
            Text(
                text = "SafeSearch",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(8.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                SafeSearch.entries.forEach { safe ->
                    FilterChipOption(
                        label = safe.label,
                        isSelected = selectedSafeSearch == safe,
                        onClick = { selectedSafeSearch = safe }
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Region
            Text(
                text = "Region",
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(8.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                SearchRegion.entries.forEach { reg ->
                    FilterChipOption(
                        label = reg.label,
                        isSelected = selectedRegion == reg,
                        onClick = { selectedRegion = reg }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedButton(
                    onClick = {
                        selectedTimeRange = TimeRange.ANY
                        selectedSafeSearch = SafeSearch.MODERATE
                        selectedRegion = SearchRegion.GLOBAL
                        selectedSortOrder = SortOrder.RELEVANCE
                    }
                ) {
                    Text("Reset")
                }
                Spacer(modifier = Modifier.width(12.dp))
                Button(
                    onClick = {
                        onApply(
                            SearchFilter(
                                timeRange = selectedTimeRange,
                                safeSearch = selectedSafeSearch,
                                region = selectedRegion,
                                sortOrder = selectedSortOrder
                            )
                        )
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NexusBluePrimary)
                ) {
                    Text("Apply Filters")
                }
            }
        }
    }
}

@Composable
private fun FilterChipOption(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val bg = if (isSelected) NexusBluePrimary else MaterialTheme.colorScheme.surfaceVariant
    val textCol = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bg)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium.copy(fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium),
            color = textCol
        )
    }
}
