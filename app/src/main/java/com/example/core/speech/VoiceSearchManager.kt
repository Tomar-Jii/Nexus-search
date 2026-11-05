package com.example.core.speech

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

sealed interface VoiceRecognitionState {
    data object Idle : VoiceRecognitionState
    data object Ready : VoiceRecognitionState
    data class Listening(val rmsDb: Float) : VoiceRecognitionState
    data class PartialResult(val text: String) : VoiceRecognitionState
    data class FinalResult(val text: String) : VoiceRecognitionState
    data class Error(val message: String) : VoiceRecognitionState
}

class VoiceSearchManager(private val context: Context) {
    private val TAG = "VoiceSearchManager"
    private var speechRecognizer: SpeechRecognizer? = null

    private val _recognitionState = MutableStateFlow<VoiceRecognitionState>(VoiceRecognitionState.Idle)
    val recognitionState: StateFlow<VoiceRecognitionState> = _recognitionState.asStateFlow()

    fun isSpeechAvailable(): Boolean {
        return SpeechRecognizer.isRecognitionAvailable(context)
    }

    fun startListening() {
        if (!isSpeechAvailable()) {
            _recognitionState.value = VoiceRecognitionState.Error("Speech recognition is not available on this device.")
            return
        }

        stopListening()

        try {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        _recognitionState.value = VoiceRecognitionState.Ready
                    }

                    override fun onBeginningOfSpeech() {
                        _recognitionState.value = VoiceRecognitionState.Listening(0f)
                    }

                    override fun onRmsChanged(rmsdB: Float) {
                        if (_recognitionState.value is VoiceRecognitionState.Listening) {
                            _recognitionState.value = VoiceRecognitionState.Listening(rmsdB.coerceAtLeast(0f))
                        }
                    }

                    override fun onBufferReceived(buffer: ByteArray?) {}

                    override fun onEndOfSpeech() {
                        // Speech ended, awaiting final result
                    }

                    override fun onError(error: Int) {
                        val message = when (error) {
                            SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                            SpeechRecognizer.ERROR_CLIENT -> "Client error"
                            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Microphone permission required"
                            SpeechRecognizer.ERROR_NETWORK -> "Network connection error"
                            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                            SpeechRecognizer.ERROR_NO_MATCH -> "No speech recognized. Try speaking again."
                            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Recognition service busy"
                            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech detected"
                            else -> "Recognition error: $error"
                        }
                        Log.e(TAG, "SpeechRecognizer error: $message")
                        _recognitionState.value = VoiceRecognitionState.Error(message)
                    }

                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val text = matches?.firstOrNull().orEmpty()
                        if (text.isNotBlank()) {
                            _recognitionState.value = VoiceRecognitionState.FinalResult(text)
                        } else {
                            _recognitionState.value = VoiceRecognitionState.Error("No words recognized.")
                        }
                    }

                    override fun onPartialResults(partialResults: Bundle?) {
                        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val text = matches?.firstOrNull().orEmpty()
                        if (text.isNotBlank()) {
                            _recognitionState.value = VoiceRecognitionState.PartialResult(text)
                        }
                    }

                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            }

            speechRecognizer?.startListening(intent)
            _recognitionState.value = VoiceRecognitionState.Ready
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start speech recognition", e)
            _recognitionState.value = VoiceRecognitionState.Error(e.localizedMessage ?: "Failed to start speech recognition.")
        }
    }

    fun stopListening() {
        try {
            speechRecognizer?.stopListening()
            speechRecognizer?.destroy()
        } catch (e: Exception) {
            Log.w(TAG, "Error stopping recognizer: ${e.message}")
        } finally {
            speechRecognizer = null
        }
    }

    fun resetState() {
        _recognitionState.value = VoiceRecognitionState.Idle
    }
}
