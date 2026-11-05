package com.example.core.ai

import android.util.Log
import com.example.core.model.AiAnswer
import com.example.core.model.AiStatus
import com.example.core.model.SearchResult
import com.example.core.model.SourceCitation
import com.google.firebase.Firebase
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.generationConfig
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withTimeout

object AiAnswerEngine {
    private const val TAG = "AiAnswerEngine"

    // Lazy initialization of Gemini model to prevent startup crashes before App Check
    private val generativeModel by lazy {
        Firebase.ai.generativeModel(
            modelName = "gemini-3.8-flash",
            generationConfig = generationConfig {
                temperature = 0.2f
                topP = 0.85f
            }
        )
    }

    fun generateStreamingAnswer(query: String, retrievedSources: List<SearchResult>): Flow<AiAnswer> = flow {
        if (retrievedSources.isEmpty()) {
            emit(
                AiAnswer(
                    query = query,
                    summaryText = "No sources available to synthesize an answer for \"$query\".",
                    status = AiStatus.ERROR,
                    errorMessage = "Insufficient source material."
                )
            )
            return@flow
        }

        // Prepare grounded source citations
        val citations = retrievedSources.take(5).mapIndexed { idx, res ->
            SourceCitation(
                index = idx + 1,
                title = res.title,
                url = res.url,
                domain = res.domain,
                snippet = res.snippet
            )
        }

        emit(
            AiAnswer(
                query = query,
                summaryText = "",
                citations = citations,
                status = AiStatus.STREAMING
            )
        )

        // Build grounded prompt with source citations
        val contextBuilder = StringBuilder()
        contextBuilder.append("User Query: $query\n\n")
        contextBuilder.append("Retrieved Search Results for Grounding:\n")
        citations.forEach { c ->
            contextBuilder.append("[${c.index}] \"${c.title}\" (${c.domain})\n${c.snippet}\n\n")
        }
        contextBuilder.append(
            "Instructions:\n" +
            "Synthesize an accurate, high-quality, concise technical summary answering the user query based ONLY on the retrieved sources above.\n" +
            "Include inline citation markers like [1] or [2] referencing which source provided each fact.\n" +
            "Do not invent facts or extrapolate beyond the sources. Keep tone objective and authoritative."
        )

        val fullTextBuilder = StringBuilder()

        try {
            withTimeout(45_000L) {
                val stream = generativeModel.generateContentStream(contextBuilder.toString())
                stream.collect { chunk ->
                    val text = chunk.text.orEmpty()
                    fullTextBuilder.append(text)
                    emit(
                        AiAnswer(
                            query = query,
                            summaryText = fullTextBuilder.toString(),
                            citations = citations,
                            status = AiStatus.STREAMING
                        )
                    )
                }
            }

            val finalSummary = fullTextBuilder.toString().trim()
            val keyPoints = extractKeyBulletPoints(finalSummary)

            emit(
                AiAnswer(
                    query = query,
                    summaryText = finalSummary.ifEmpty { "Summary completed based on verified sources." },
                    keyPoints = keyPoints,
                    citations = citations,
                    status = AiStatus.SUCCESS
                )
            )
        } catch (e: TimeoutCancellationException) {
            Log.e(TAG, "Gemini generation timed out", e)
            emit(generateFallbackAnswer(query, citations, "Generation timed out. Synthesized from retrieved sources."))
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            Log.w(TAG, "Firebase AI Logic unavailable, generating local grounded synthesis: ${e.message}")
            emit(generateFallbackAnswer(query, citations, null))
        }
    }.flowOn(Dispatchers.IO)

    private fun generateFallbackAnswer(
        query: String,
        citations: List<SourceCitation>,
        customMessage: String?
    ): AiAnswer {
        val topSources = citations.take(3)
        val summary = StringBuilder()
        if (customMessage != null) {
            summary.append(customMessage).append("\n\n")
        }
        summary.append("Based on retrieved web sources for \"$query\":\n\n")
        topSources.forEach { c ->
            summary.append("• ${c.snippet} [${c.index}]\n\n")
        }
        val keyPoints = topSources.map { c ->
            "${c.title} — ${c.domain} [${c.index}]"
        }

        return AiAnswer(
            query = query,
            summaryText = summary.toString().trim(),
            keyPoints = keyPoints,
            citations = citations,
            status = AiStatus.SUCCESS
        )
    }

    private fun extractKeyBulletPoints(text: String): List<String> {
        val lines = text.lines()
        val bullets = lines.filter { it.trim().startsWith("•") || it.trim().startsWith("-") || it.trim().startsWith("*") }
            .map { it.trim().removePrefix("•").removePrefix("-").removePrefix("*").trim() }
            .filter { it.length > 10 }

        return if (bullets.isNotEmpty()) {
            bullets.take(4)
        } else {
            // Pick first 2-3 substantial sentences
            text.split(". ")
                .map { it.trim().removeSuffix(".") }
                .filter { it.length > 25 }
                .take(3)
        }
    }
}
