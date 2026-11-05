package com.example.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.core.model.SearchCategory
import com.example.ui.screens.AssistantScreen
import com.example.ui.screens.BookmarksScreen
import com.example.ui.screens.BrowserScreen
import com.example.ui.screens.DeepResearchScreen
import com.example.ui.screens.ExtensionsScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.PrivateNetworkScreen
import com.example.ui.screens.ResultsScreen
import com.example.ui.screens.SecurityCenterScreen
import com.example.ui.screens.SettingsScreen
import com.example.ui.viewmodel.AssistantViewModel
import com.example.ui.viewmodel.DeepResearchViewModel
import com.example.ui.viewmodel.ExtensionViewModel
import com.example.ui.viewmodel.SearchViewModel
import com.example.ui.viewmodel.TorBrowserViewModel
import com.example.ui.viewmodel.UserDataViewModel

sealed class Screen(val route: String) {
    data object Home : Screen("home")
    data object Results : Screen("results")
    data object DeepResearch : Screen("deep_research")
    data object Browser : Screen("browser")
    data object PrivateNetwork : Screen("private_network")
    data object Extensions : Screen("extensions")
    data object Assistant : Screen("assistant")
    data object History : Screen("history")
    data object Bookmarks : Screen("bookmarks")
    data object SecurityCenter : Screen("security_center")
    data object Settings : Screen("settings")
}

@Composable
fun NexusNavGraph(
    searchViewModel: SearchViewModel,
    userDataViewModel: UserDataViewModel,
    deepResearchViewModel: DeepResearchViewModel,
    torBrowserViewModel: TorBrowserViewModel,
    assistantViewModel: AssistantViewModel,
    extensionViewModel: ExtensionViewModel,
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route,
        modifier = modifier
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                searchViewModel = searchViewModel,
                userDataViewModel = userDataViewModel,
                onNavigateToResults = { query, category ->
                    searchViewModel.executeSearch(query, category)
                    navController.navigate(Screen.Results.route)
                },
                onNavigateToDeepResearch = { navController.navigate(Screen.DeepResearch.route) },
                onNavigateToBrowser = { url ->
                    torBrowserViewModel.openTab(url)
                    navController.navigate(Screen.Browser.route)
                },
                onNavigateToPrivateNetwork = { navController.navigate(Screen.PrivateNetwork.route) },
                onNavigateToExtensions = { navController.navigate(Screen.Extensions.route) },
                onNavigateToAssistant = { navController.navigate(Screen.Assistant.route) },
                onNavigateToSecurityCenter = { navController.navigate(Screen.SecurityCenter.route) },
                onNavigateToHistory = { navController.navigate(Screen.History.route) },
                onNavigateToBookmarks = { navController.navigate(Screen.Bookmarks.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) }
            )
        }

        composable(Screen.Results.route) {
            ResultsScreen(
                searchViewModel = searchViewModel,
                userDataViewModel = userDataViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.DeepResearch.route) {
            DeepResearchScreen(
                viewModel = deepResearchViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Browser.route) {
            BrowserScreen(
                viewModel = torBrowserViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.PrivateNetwork.route) {
            PrivateNetworkScreen(
                viewModel = torBrowserViewModel,
                onNavigateToBrowserWithOnion = { onionUrl ->
                    torBrowserViewModel.openTorTab(onionUrl)
                    navController.navigate(Screen.Browser.route)
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Extensions.route) {
            ExtensionsScreen(
                viewModel = extensionViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Assistant.route) {
            AssistantScreen(
                viewModel = assistantViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.History.route) {
            HistoryScreen(
                userDataViewModel = userDataViewModel,
                onQueryClick = { query ->
                    searchViewModel.executeSearch(query, SearchCategory.ALL)
                    navController.navigate(Screen.Results.route)
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Bookmarks.route) {
            BookmarksScreen(
                userDataViewModel = userDataViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.SecurityCenter.route) {
            SecurityCenterScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                searchViewModel = searchViewModel,
                userDataViewModel = userDataViewModel,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
