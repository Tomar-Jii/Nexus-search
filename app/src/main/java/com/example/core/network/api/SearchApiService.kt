package com.example.core.network.api

import com.example.core.network.model.DuckDuckGoResponse
import okhttp3.OkHttpClient
import okhttp3.ResponseBody
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query
import retrofit2.http.Url
import java.util.concurrent.TimeUnit

interface SearchApiService {
    @GET("/")
    suspend fun searchDuckDuckGo(
        @Query("q") query: String,
        @Query("format") format: String = "json",
        @Query("no_html") noHtml: Int = 1,
        @Query("skip_disambig") skipDisambig: Int = 0
    ): DuckDuckGoResponse

    @GET
    suspend fun getOpenSearchSuggestions(
        @Url url: String
    ): ResponseBody
}

object NetworkClient {
    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BASIC
            })
            .build()
    }

    val searchService: SearchApiService by lazy {
        Retrofit.Builder()
            .baseUrl("https://api.duckduckgo.com/")
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
            .create(SearchApiService::class.java)
    }
}
