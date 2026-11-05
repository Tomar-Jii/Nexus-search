package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.example.core.extensions.NexusExtensionManager
import com.example.core.model.NexusExtension
import kotlinx.coroutines.flow.StateFlow

class ExtensionViewModel : ViewModel() {

    val extensions: StateFlow<List<NexusExtension>> = NexusExtensionManager.extensions

    fun installExtension(extensionId: String) {
        NexusExtensionManager.installExtension(extensionId)
    }

    fun toggleExtension(extensionId: String, isEnabled: Boolean) {
        NexusExtensionManager.toggleExtension(extensionId, isEnabled)
    }

    fun uninstallExtension(extensionId: String) {
        NexusExtensionManager.uninstallExtension(extensionId)
    }
}
