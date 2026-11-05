package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import com.example.core.ai.PersonaManager
import com.example.core.ai.configureAppCheck
import com.example.core.browser.BrowserTabManager
import com.example.core.database.AppDatabase
import com.example.core.extensions.NexusExtensionManager
import com.example.data.repository.SearchRepositoryImpl
import com.example.data.repository.UserDataRepositoryImpl
import com.example.ui.navigation.NexusNavGraph
import com.example.ui.theme.NexusSearchTheme
import com.example.ui.viewmodel.AssistantViewModel
import com.example.ui.viewmodel.AssistantViewModelFactory
import com.example.ui.viewmodel.DeepResearchViewModel
import com.example.ui.viewmodel.DeepResearchViewModelFactory
import com.example.ui.viewmodel.ExtensionViewModel
import com.example.ui.viewmodel.SearchViewModel
import com.example.ui.viewmodel.SearchViewModelFactory
import com.example.ui.viewmodel.TorBrowserViewModel
import com.example.ui.viewmodel.TorBrowserViewModelFactory
import com.example.ui.viewmodel.UserDataViewModel
import com.example.ui.viewmodel.UserDataViewModelFactory

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // STEP 1: Mandatory App Check configuration with launch intent before UI/ViewModels
        configureAppCheck(this, intent)

        // STEP 2: Edge-to-edge support
        enableEdgeToEdge()

        // STEP 3: Core Database & Engine initialization
        val database = AppDatabase.getInstance(applicationContext)
        NexusExtensionManager.init(database.installedExtensionDao())

        val searchRepository = SearchRepositoryImpl(database.searchHistoryDao())
        val userDataRepository = UserDataRepositoryImpl(
            historyDao = database.searchHistoryDao(),
            bookmarkDao = database.bookmarkDao(),
            context = applicationContext
        )
        val browserTabManager = BrowserTabManager(database.browserHistoryDao())
        val personaManager = PersonaManager(applicationContext)

        // ViewModels
        val searchViewModel = ViewModelProvider(
            this,
            SearchViewModelFactory(searchRepository, userDataRepository)
        )[SearchViewModel::class.java]

        val userDataViewModel = ViewModelProvider(
            this,
            UserDataViewModelFactory(userDataRepository)
        )[UserDataViewModel::class.java]

        val deepResearchViewModel = ViewModelProvider(
            this,
            DeepResearchViewModelFactory(database.researchReportDao())
        )[DeepResearchViewModel::class.java]

        val torBrowserViewModel = ViewModelProvider(
            this,
            TorBrowserViewModelFactory(browserTabManager)
        )[TorBrowserViewModel::class.java]

        val assistantViewModel = ViewModelProvider(
            this,
            AssistantViewModelFactory(personaManager)
        )[AssistantViewModel::class.java]

        val extensionViewModel = ViewModelProvider(
            this
        )[ExtensionViewModel::class.java]

        // STEP 4: Render Compose UI
        setContent {
            NexusSearchTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    NexusNavGraph(
                        searchViewModel = searchViewModel,
                        userDataViewModel = userDataViewModel,
                        deepResearchViewModel = deepResearchViewModel,
                        torBrowserViewModel = torBrowserViewModel,
                        assistantViewModel = assistantViewModel,
                        extensionViewModel = extensionViewModel
                    )
                }
            }
        }
    }
}
