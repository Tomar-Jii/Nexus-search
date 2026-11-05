package com.example.core.network.provider

import com.example.core.model.SearchCategory
import com.example.core.model.SearchResult
import com.example.core.model.TrendingTopic

object CuratedSearchProvider {

    val trendingTopics = listOf(
        TrendingTopic("t1", "Gemini 3.8 Flash release", "Artificial Intelligence", "2.4M searches"),
        TrendingTopic("t2", "Quantum advantage benchmarks 2026", "Computing", "1.8M searches"),
        TrendingTopic("t3", "Artemis lunar gateway docking", "Space", "1.2M searches"),
        TrendingTopic("t4", "Solid state battery mass production", "Energy & Tech", "950K searches"),
        TrendingTopic("t5", "Android 16 developer preview", "Mobile", "820K searches"),
        TrendingTopic("t6", "Next-gen fusion reactor milestone", "Science", "750K searches"),
        TrendingTopic("t7", "Global clean energy transition report", "Sustainability", "600K searches"),
        TrendingTopic("t8", "Humanoid robotics workplace trials", "Robotics", "540K searches")
    )

    private val allData = listOf(
        // Web / All Results
        SearchResult(
            id = "w1",
            title = "Next-Generation Multimodal AI: Architecture and Benchmarks",
            url = "https://arxiv.org/abs/2405.08888",
            domain = "arxiv.org",
            snippet = "A comprehensive analysis of frontier multimodal models, showcasing real-time cross-modal reasoning, structured reasoning outputs, and sub-100ms inference optimization.",
            category = SearchCategory.ALL,
            sourceName = "arXiv Preprints",
            publishedDate = "Nov 2026"
        ),
        SearchResult(
            id = "w2",
            title = "Android Architecture in 2026: Modern Patterns with Jetpack Compose",
            url = "https://developer.android.com/topic/architecture",
            domain = "developer.android.com",
            snippet = "Official guide to scalable Android app architecture. Covers Unidirectional Data Flow (UDF), lifecycle-aware coroutines, Room persistence, and zero-trust security.",
            category = SearchCategory.ALL,
            sourceName = "Android Developers",
            publishedDate = "Oct 2026"
        ),
        SearchResult(
            id = "w3",
            title = "Quantum Computing Scales Past 1,000 Logical Qubits",
            url = "https://www.nature.com/articles/quantum-computing-logical-qubits-2026",
            domain = "nature.com",
            snippet = "Researchers demonstrate fault-tolerant surface code error correction, marking a critical milestone toward practical quantum advantage in materials science.",
            category = SearchCategory.ALL,
            sourceName = "Nature Journal",
            publishedDate = "Nov 2026"
        ),
        SearchResult(
            id = "w4",
            title = "Global Renewable Energy Generation Exceeds 45% of Total Grid Capacity",
            url = "https://www.iea.org/reports/renewables-2026-global-milestones",
            domain = "iea.org",
            snippet = "International Energy Agency report highlights record solar PV deployment and grid-scale lithium-iron-phosphate battery storage stabilizing continental grids.",
            category = SearchCategory.ALL,
            sourceName = "IEA",
            publishedDate = "2 days ago"
        ),
        SearchResult(
            id = "w5",
            title = "SpaceX Starship Completes Orbital Refueling Test for Artemis Missions",
            url = "https://www.nasa.gov/news/starship-cryogenic-propellant-transfer-success",
            domain = "nasa.gov",
            snippet = "NASA and SpaceX validate flight-tested orbital cryogenic propellant transfer in low Earth orbit, clearing path for crewed lunar landings.",
            category = SearchCategory.ALL,
            sourceName = "NASA News",
            publishedDate = "Yesterday"
        ),

        // Image Results
        SearchResult(
            id = "img1",
            title = "James Webb Deep Field of Gravitational Lensing Cluster",
            url = "https://webbtelescope.org/contents/media/images/deep-field-cluster",
            domain = "webbtelescope.org",
            snippet = "Infrared composite showcasing warped background galaxies 13.2 billion light-years distant.",
            category = SearchCategory.IMAGES,
            imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            sourceName = "Webb Telescope Archive",
            publishedDate = "Nov 2026"
        ),
        SearchResult(
            id = "img2",
            title = "Silicon Quantum Processing Unit Die Micrograph",
            url = "https://spectrum.ieee.org/quantum-processor-silicon-micrograph",
            domain = "spectrum.ieee.org",
            snippet = "High-resolution SEM micrograph showing superconducting qubit coupling resonators.",
            category = SearchCategory.IMAGES,
            imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
            sourceName = "IEEE Spectrum",
            publishedDate = "Oct 2026"
        ),
        SearchResult(
            id = "img3",
            title = "Autonomous Electric High-Speed Rail Concept Design",
            url = "https://www.designboom.com/transport/future-high-speed-rail-concept-2026",
            domain = "designboom.com",
            snippet = "Aerodynamic low-drag locomotive rendering utilizing lightweight carbon composite shells.",
            category = SearchCategory.IMAGES,
            imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
            sourceName = "Designboom",
            publishedDate = "3 days ago"
        ),
        SearchResult(
            id = "img4",
            title = "Neural Network Topology 3D Spatial Visualization",
            url = "https://distill.pub/2026/visualizing-latent-manifolds",
            domain = "distill.pub",
            snippet = "Interactive topological manifold showing attention weight clusters across transformer layers.",
            category = SearchCategory.IMAGES,
            imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
            sourceName = "Distill AI",
            publishedDate = "1 week ago"
        ),

        // Video Results
        SearchResult(
            id = "vid1",
            title = "Building Intelligent Edge Systems: Complete Architectural Deep Dive",
            url = "https://www.youtube.com/watch?v=nexus_edge_ai_2026",
            domain = "youtube.com",
            snippet = "Keynote presentation detailing on-device neural processing, low-power NPU pipelining, and privacy-preserving inference.",
            category = SearchCategory.VIDEOS,
            imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
            duration = "42:15",
            sourceName = "Nexus Tech Talks",
            publishedDate = "3 days ago"
        ),
        SearchResult(
            id = "vid2",
            title = "Artemis III Crew Launch & Mission Walkthrough Simulation",
            url = "https://www.youtube.com/watch?v=artemis_lunar_profile_2026",
            domain = "youtube.com",
            snippet = "Full mission profile walkthrough from Kennedy Space Center launch to South Pole lunar touchdown.",
            category = SearchCategory.VIDEOS,
            imageUrl = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
            duration = "18:40",
            sourceName = "Space Exploration Channel",
            publishedDate = "1 week ago"
        ),
        SearchResult(
            id = "vid3",
            title = "How Solid-State Batteries Actually Work Inside Modern EVs",
            url = "https://www.youtube.com/watch?v=solid_state_battery_ev_2026",
            domain = "youtube.com",
            snippet = "Engineering breakdown of ceramic electrolytes, lithium dendrite prevention, and energy density curves.",
            category = SearchCategory.VIDEOS,
            imageUrl = "https://images.unsplash.com/photo-1558441719-8b489c63f7ce?w=600&auto=format&fit=crop&q=80",
            duration = "14:22",
            sourceName = "Engineering Explained",
            publishedDate = "2 weeks ago"
        ),

        // News Results
        SearchResult(
            id = "news1",
            title = "Global Tech Summit 2026 Unveils Standardized Open AI Safety Protocols",
            url = "https://www.reuters.com/technology/global-tech-summit-safety-protocols-2026",
            domain = "reuters.com",
            snippet = "Over 40 nations and top engineering institutions agree on cryptographic watermarking and verified model evaluation standards.",
            category = SearchCategory.NEWS,
            sourceName = "Reuters Technology",
            publishedDate = "3 hours ago"
        ),
        SearchResult(
            id = "news2",
            title = "Semiconductor Breakthrough: 1nm Transistors Reach Pilot Foundry Fabrication",
            url = "https://www.bloomberg.com/news/articles/2026-11-04/1nm-foundry-pilot-production",
            domain = "bloomberg.com",
            snippet = "Next-generation gate-all-around architecture delivers 30% reduction in power consumption with significant density gains.",
            category = SearchCategory.NEWS,
            sourceName = "Bloomberg",
            publishedDate = "5 hours ago"
        ),
        SearchResult(
            id = "news3",
            title = "Autonomous Drone Logistics Network Receives Nationwide Commercial Clearance",
            url = "https://techcrunch.com/2026/11/autonomous-drone-corridors-commercial-clearance",
            domain = "techcrunch.com",
            snippet = "Aviation regulators approve beyond-visual-line-of-sight (BVLOS) operations across designated urban and regional air corridors.",
            category = SearchCategory.NEWS,
            sourceName = "TechCrunch",
            publishedDate = "12 hours ago"
        )
    )

    fun query(searchTerm: String, category: SearchCategory): List<SearchResult> {
        val cleanQuery = searchTerm.trim().lowercase()
        val baseList = if (category == SearchCategory.ALL) {
            allData
        } else {
            allData.filter { it.category == category }
        }

        if (cleanQuery.isBlank()) return baseList

        val filtered = baseList.filter { item ->
            item.title.lowercase().contains(cleanQuery) ||
            item.snippet.lowercase().contains(cleanQuery) ||
            item.domain.lowercase().contains(cleanQuery)
        }

        return if (filtered.isNotEmpty()) {
            filtered
        } else {
            // Generate dynamically contextual results based on the search query
            generateDynamicResults(searchTerm, category)
        }
    }

    private fun generateDynamicResults(query: String, category: SearchCategory): List<SearchResult> {
        val q = query.trim().replaceFirstChar { it.uppercase() }
        val results = mutableListOf<SearchResult>()

        when (category) {
            SearchCategory.ALL -> {
                results.add(
                    SearchResult(
                        id = "dyn_all_1",
                        title = "$q: Comprehensive Overview, Facts, and Latest Developments",
                        url = "https://en.wikipedia.org/wiki/${query.replace(' ', '_')}",
                        domain = "en.wikipedia.org",
                        snippet = "Explore detailed information, historical context, research findings, and technical explanations regarding $query.",
                        category = SearchCategory.ALL,
                        sourceName = "Wikipedia Encyclopedia",
                        publishedDate = "Updated today"
                    )
                )
                results.add(
                    SearchResult(
                        id = "dyn_all_2",
                        title = "Latest Research & Analysis on $q",
                        url = "https://techcrunch.com/search/${query.replace(' ', '+')}",
                        domain = "techcrunch.com",
                        snippet = "In-depth investigative reports, market analysis, industry trends, and future perspectives concerning $query.",
                        category = SearchCategory.ALL,
                        sourceName = "TechCrunch Analysis",
                        publishedDate = "Yesterday"
                    )
                )
                results.add(
                    SearchResult(
                        id = "dyn_all_3",
                        title = "$q Technical Documentation & Implementation Guidelines",
                        url = "https://github.com/topics/${query.replace(' ', '-')}",
                        domain = "github.com",
                        snippet = "Open-source implementations, architectural diagrams, tools, and developer libraries built around $query.",
                        category = SearchCategory.ALL,
                        sourceName = "GitHub Topics",
                        publishedDate = "2 days ago"
                    )
                )
            }
            SearchCategory.IMAGES -> {
                results.add(
                    SearchResult(
                        id = "dyn_img_1",
                        title = "High-Resolution Visual Infographic: $q",
                        url = "https://unsplash.com/s/photos/${query.replace(' ', '-')}",
                        domain = "unsplash.com",
                        snippet = "High-definition conceptual photography and architectural render of $query.",
                        category = SearchCategory.IMAGES,
                        imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
                        sourceName = "Unsplash Visuals"
                    )
                )
                results.add(
                    SearchResult(
                        id = "dyn_img_2",
                        title = "$q Diagram & System Architecture Blueprint",
                        url = "https://unsplash.com/s/photos/${query.replace(' ', '-')}",
                        domain = "unsplash.com",
                        snippet = "Detailed technical schematic and visual blueprint illustrating $query.",
                        category = SearchCategory.IMAGES,
                        imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                        sourceName = "Unsplash Science"
                    )
                )
            }
            SearchCategory.VIDEOS -> {
                results.add(
                    SearchResult(
                        id = "dyn_vid_1",
                        title = "Understanding $q in 15 Minutes: Full Documentary",
                        url = "https://www.youtube.com/results?search_query=${query.replace(' ', '+')}",
                        domain = "youtube.com",
                        snippet = "A visual exploration covering key concepts, foundational principles, and practical applications of $query.",
                        category = SearchCategory.VIDEOS,
                        imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
                        duration = "15:20",
                        sourceName = "Documentary Network",
                        publishedDate = "1 week ago"
                    )
                )
                results.add(
                    SearchResult(
                        id = "dyn_vid_2",
                        title = "$q Masterclass & Deep Dive Tutorial",
                        url = "https://www.youtube.com/results?search_query=${query.replace(' ', '+')}",
                        domain = "youtube.com",
                        snippet = "Step-by-step masterclass demonstrating practical concepts and advanced techniques in $query.",
                        category = SearchCategory.VIDEOS,
                        imageUrl = "https://images.unsplash.com/photo-1558441719-8b489c63f7ce?w=600&auto=format&fit=crop&q=80",
                        duration = "28:45",
                        sourceName = "Tech Masterclass",
                        publishedDate = "3 days ago"
                    )
                )
            }
            SearchCategory.NEWS -> {
                results.add(
                    SearchResult(
                        id = "dyn_news_1",
                        title = "Breaking: Key Breakthroughs and New Announcements in $q",
                        url = "https://news.google.com/search?q=${query.replace(' ', '+')}",
                        domain = "reuters.com",
                        snippet = "Industry leaders and research institutions announce major new developments impacting the future of $query.",
                        category = SearchCategory.NEWS,
                        sourceName = "Global News Wire",
                        publishedDate = "1 hour ago"
                    )
                )
                results.add(
                    SearchResult(
                        id = "dyn_news_2",
                        title = "How $q is Shaping Modern Industry and Policy in 2026",
                        url = "https://www.bloomberg.com/search?query=${query.replace(' ', '+')}",
                        domain = "bloomberg.com",
                        snippet = "Economic analysis and market indicators projecting the multi-year impact of $query across international sectors.",
                        category = SearchCategory.NEWS,
                        sourceName = "Bloomberg Insights",
                        publishedDate = "4 hours ago"
                    )
                )
            }
        }
        return results
    }
}
