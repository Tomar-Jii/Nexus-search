package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.core.ai.ChatMessage
import com.example.core.ai.PersonaManager
import com.example.core.model.AssistantPersona
import com.example.core.model.PersonaMode
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch
import java.util.UUID

class AssistantViewModel(
    private val personaManager: PersonaManager
) : ViewModel() {

    val personaMode: StateFlow<PersonaMode> = personaManager.personaMode

    private val _messages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                id = "welcome",
                sender = "assistant",
                text = "Welcome to NEXUS SEARCH 2.0. I am your dual-identity research assistant. Ask me anything, explore deep technical topics, or question my architecture.",
                persona = AssistantPersona.ANGEL
            )
        )
    )
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private val _isStreaming = MutableStateFlow(false)
    val isStreaming: StateFlow<Boolean> = _isStreaming.asStateFlow()

    private var currentStreamJob: Job? = null

    fun getActivePersona(isSystemDark: Boolean): AssistantPersona {
        return personaManager.getActivePersona(isSystemDark)
    }

    fun setPersonaMode(mode: PersonaMode) {
        personaManager.setPersonaMode(mode)
    }

    fun sendMessage(text: String, isSystemDark: Boolean) {
        val clean = text.trim()
        if (clean.isBlank()) return

        val activePersona = getActivePersona(isSystemDark)
        val userMsg = ChatMessage(
            id = UUID.randomUUID().toString(),
            sender = "user",
            text = clean,
            persona = activePersona
        )

        _messages.value = _messages.value + userMsg

        val assistantMsgId = UUID.randomUUID().toString()
        val initialAssistantMsg = ChatMessage(
            id = assistantMsgId,
            sender = "assistant",
            text = "Thinking…",
            persona = activePersona
        )
        _messages.value = _messages.value + initialAssistantMsg
        _isStreaming.value = true

        currentStreamJob?.cancel()
        currentStreamJob = viewModelScope.launch {
            personaManager.streamAssistantResponse(clean, activePersona, _messages.value)
                .catch { e ->
                    _isStreaming.value = false
                    updateAssistantMessage(assistantMsgId, "Response error: ${e.localizedMessage}")
                }
                .collect { partialText ->
                    updateAssistantMessage(assistantMsgId, partialText)
                }
            _isStreaming.value = false
        }
    }

    private fun updateAssistantMessage(messageId: String, newText: String) {
        _messages.value = _messages.value.map { msg ->
            if (msg.id == messageId) msg.copy(text = newText) else msg
        }
    }

    fun clearChat() {
        _messages.value = emptyList()
    }
}

class AssistantViewModelFactory(
    private val personaManager: PersonaManager
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return AssistantViewModel(personaManager) as T
    }
}
