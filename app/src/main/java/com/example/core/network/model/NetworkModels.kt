package com.example.core.network.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class DuckDuckGoResponse(
    @Json(name = "Heading") val heading: String? = null,
    @Json(name = "AbstractText") val abstractText: String? = null,
    @Json(name = "AbstractURL") val abstractUrl: String? = null,
    @Json(name = "AbstractSource") val abstractSource: String? = null,
    @Json(name = "Image") val image: String? = null,
    @Json(name = "RelatedTopics") val relatedTopics: List<RelatedTopicItem>? = null,
    @Json(name = "Results") val results: List<ExternalResultItem>? = null
)

@JsonClass(generateAdapter = true)
data class RelatedTopicItem(
    @Json(name = "Text") val text: String? = null,
    @Json(name = "FirstURL") val firstUrl: String? = null,
    @Json(name = "Icon") val icon: TopicIcon? = null,
    @Json(name = "Result") val result: String? = null
)

@JsonClass(generateAdapter = true)
data class ExternalResultItem(
    @Json(name = "Text") val text: String? = null,
    @Json(name = "FirstURL") val firstUrl: String? = null,
    @Json(name = "Icon") val icon: TopicIcon? = null
)

@JsonClass(generateAdapter = true)
data class TopicIcon(
    @Json(name = "URL") val url: String? = null,
    @Json(name = "Height") val height: String? = null,
    @Json(name = "Width") val width: String? = null
)
