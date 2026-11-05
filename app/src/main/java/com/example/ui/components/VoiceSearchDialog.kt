package com.example.ui.components

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.core.content.ContextCompat
import com.example.core.speech.VoiceRecognitionState
import com.example.core.speech.VoiceSearchManager
import com.example.ui.theme.NexusBlueLight
import com.example.ui.theme.NexusBluePrimary

@Composable
fun VoiceSearchDialog(
    onDismiss: () -> Unit,
    onSpeechResult: (String) -> Unit
) {
    val context = LocalContext.current
    val voiceManager = remember { VoiceSearchManager(context) }
    val speechState by voiceManager.recognitionState.collectAsState()

    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
        if (granted) {
            voiceManager.startListening()
        }
    }

    LaunchedEffect(Unit) {
        if (hasPermission) {
            voiceManager.startListening()
        } else {
            permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            voiceManager.stopListening()
        }
    }

    // Automatically complete search when final text is received
    LaunchedEffect(speechState) {
        if (speechState is VoiceRecognitionState.FinalResult) {
            val text = (speechState as VoiceRecognitionState.FinalResult).text
            if (text.isNotBlank()) {
                onSpeechResult(text)
            }
        }
    }

    val infiniteTransition = rememberInfiniteTransition(label = "mic_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "mic_scale"
    )

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .testTag("voice_search_dialog"),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Microphone Wave Rings
                Box(
                    modifier = Modifier.size(120.dp),
                    contentAlignment = Alignment.Center
                ) {
                    if (speechState is VoiceRecognitionState.Listening || speechState is VoiceRecognitionState.Ready) {
                        Box(
                            modifier = Modifier
                                .size(100.dp)
                                .scale(pulseScale)
                                .clip(CircleShape)
                                .background(NexusBluePrimary.copy(alpha = 0.2f))
                        )
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .scale(pulseScale * 0.9f)
                                .clip(CircleShape)
                                .background(NexusBluePrimary.copy(alpha = 0.35f))
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(68.dp)
                            .clip(CircleShape)
                            .background(NexusBluePrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Mic,
                            contentDescription = "Microphone",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(36.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                val statusText = when (val state = speechState) {
                    is VoiceRecognitionState.Listening -> "Listening…"
                    is VoiceRecognitionState.Ready -> "Say something…"
                    is VoiceRecognitionState.PartialResult -> state.text
                    is VoiceRecognitionState.FinalResult -> state.text
                    is VoiceRecognitionState.Error -> state.message
                    VoiceRecognitionState.Idle -> "Preparing…"
                }

                Text(
                    text = statusText,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = if (speechState is VoiceRecognitionState.PartialResult) FontWeight.Bold else FontWeight.Medium
                    ),
                    color = if (speechState is VoiceRecognitionState.Error) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center
                )

                if (!hasPermission) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Microphone permission is required for voice search.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(onClick = { permissionLauncher.launch(Manifest.permission.RECORD_AUDIO) }) {
                        Text("Grant Permission", color = NexusBlueLight)
                    }
                } else if (speechState is VoiceRecognitionState.Error) {
                    Spacer(modifier = Modifier.height(12.dp))
                    TextButton(onClick = { voiceManager.startListening() }) {
                        Text("Try Again", color = NexusBlueLight)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}
