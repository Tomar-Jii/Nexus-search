import { SearchCategory, SearchResult, TrendingTopic, NexusExtension, ExtensionCategory } from '../types';

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: 't1', query: 'Gemini 3.8 Flash release', category: 'Artificial Intelligence', searchVolume: '2.4M searches' },
  { id: 't2', query: 'Quantum advantage benchmarks 2026', category: 'Computing', searchVolume: '1.8M searches' },
  { id: 't3', query: 'Artemis lunar gateway docking', category: 'Space', searchVolume: '1.2M searches' },
  { id: 't4', query: 'Solid state battery mass production', category: 'Energy & Tech', searchVolume: '950K searches' },
  { id: 't5', query: 'Android 16 developer preview', category: 'Mobile', searchVolume: '820K searches' },
  { id: 't6', query: 'Next-gen fusion reactor milestone', category: 'Science', searchVolume: '750K searches' },
  { id: 't7', query: 'Global clean energy transition report', category: 'Sustainability', searchVolume: '600K searches' },
  { id: 't8', query: 'Humanoid robotics workplace trials', category: 'Robotics', searchVolume: '540K searches' }
];

export const CURATED_RESULTS: SearchResult[] = [
  // Web / All Results
  {
    id: 'w1',
    title: 'Next-Generation Multimodal AI: Architecture and Benchmarks',
    url: 'https://arxiv.org/abs/2405.08888',
    domain: 'arxiv.org',
    snippet: 'A comprehensive analysis of frontier multimodal models, showcasing real-time cross-modal reasoning, structured reasoning outputs, and sub-100ms inference optimization.',
    category: SearchCategory.ALL,
    sourceName: 'arXiv Preprints',
    publishedDate: 'Nov 2026'
  },
  {
    id: 'w2',
    title: 'Modern Architecture in 2026: Reactive Patterns with Component Engines',
    url: 'https://developer.mozilla.org/en-US/docs/Web',
    domain: 'developer.mozilla.org',
    snippet: 'Comprehensive guide to scalable web and native app architecture. Covers Unidirectional Data Flow (UDF), asynchronous streams, indexed persistence, and zero-trust security.',
    category: SearchCategory.ALL,
    sourceName: 'Web Standards Documentation',
    publishedDate: 'Oct 2026'
  },
  {
    id: 'w3',
    title: 'Quantum Computing Scales Past 1,000 Logical Qubits',
    url: 'https://www.nature.com/articles/quantum-computing-logical-qubits-2026',
    domain: 'nature.com',
    snippet: 'Researchers demonstrate fault-tolerant surface code error correction, marking a critical milestone toward practical quantum advantage in materials science.',
    category: SearchCategory.ALL,
    sourceName: 'Nature Journal',
    publishedDate: 'Nov 2026'
  },
  {
    id: 'w4',
    title: 'Global Renewable Energy Generation Exceeds 45% of Total Grid Capacity',
    url: 'https://www.iea.org/reports/renewables-2026-global-milestones',
    domain: 'iea.org',
    snippet: 'International Energy Agency report highlights record solar PV deployment and grid-scale lithium-iron-phosphate battery storage stabilizing continental grids.',
    category: SearchCategory.ALL,
    sourceName: 'IEA',
    publishedDate: '2 days ago'
  },
  {
    id: 'w5',
    title: 'SpaceX Starship Completes Orbital Refueling Test for Artemis Missions',
    url: 'https://www.nasa.gov/news/starship-cryogenic-propellant-transfer-success',
    domain: 'nasa.gov',
    snippet: 'NASA and aerospace engineering teams validate flight-tested orbital cryogenic propellant transfer in low Earth orbit, clearing path for crewed lunar landings.',
    category: SearchCategory.ALL,
    sourceName: 'NASA News',
    publishedDate: 'Yesterday'
  },

  // Image Results
  {
    id: 'img1',
    title: 'James Webb Deep Field of Gravitational Lensing Cluster',
    url: 'https://webbtelescope.org/contents/media/images/deep-field-cluster',
    domain: 'webbtelescope.org',
    snippet: 'Infrared composite showcasing warped background galaxies 13.2 billion light-years distant.',
    category: SearchCategory.IMAGES,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    sourceName: 'Webb Telescope Archive',
    publishedDate: 'Nov 2026'
  },
  {
    id: 'img2',
    title: 'Silicon Quantum Processing Unit Die Micrograph',
    url: 'https://spectrum.ieee.org/quantum-processor-silicon-micrograph',
    domain: 'spectrum.ieee.org',
    snippet: 'High-resolution SEM micrograph showing superconducting qubit coupling resonators.',
    category: SearchCategory.IMAGES,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    sourceName: 'IEEE Spectrum',
    publishedDate: 'Oct 2026'
  },
  {
    id: 'img3',
    title: 'Autonomous Electric High-Speed Rail Concept Design',
    url: 'https://www.designboom.com/transport/future-high-speed-rail-concept-2026',
    domain: 'designboom.com',
    snippet: 'Aerodynamic low-drag locomotive rendering utilizing lightweight carbon composite shells.',
    category: SearchCategory.IMAGES,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    sourceName: 'Designboom',
    publishedDate: '3 days ago'
  },
  {
    id: 'img4',
    title: 'Neural Network Topology 3D Spatial Visualization',
    url: 'https://distill.pub/2026/visualizing-latent-manifolds',
    domain: 'distill.pub',
    snippet: 'Interactive topological manifold showing attention weight clusters across transformer layers.',
    category: SearchCategory.IMAGES,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    sourceName: 'Distill AI',
    publishedDate: '1 week ago'
  },

  // Video Results
  {
    id: 'vid1',
    title: 'Building Intelligent Edge Systems: Complete Architectural Deep Dive',
    url: 'https://www.youtube.com/watch?v=nexus_edge_ai_2026',
    domain: 'youtube.com',
    snippet: 'Keynote presentation detailing on-device neural processing, low-power NPU pipelining, and privacy-preserving inference.',
    category: SearchCategory.VIDEOS,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    duration: '42:15',
    sourceName: 'Nexus Tech Talks',
    publishedDate: '3 days ago'
  },
  {
    id: 'vid2',
    title: 'Artemis III Crew Launch & Mission Walkthrough Simulation',
    url: 'https://www.youtube.com/watch?v=artemis_lunar_profile_2026',
    domain: 'youtube.com',
    snippet: 'Full mission profile walkthrough from Kennedy Space Center launch to South Pole lunar touchdown.',
    category: SearchCategory.VIDEOS,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    duration: '18:40',
    sourceName: 'Space Exploration Channel',
    publishedDate: '1 week ago'
  },
  {
    id: 'vid3',
    title: 'How Solid-State Batteries Actually Work Inside Modern EVs',
    url: 'https://www.youtube.com/watch?v=solid_state_battery_ev_2026',
    domain: 'youtube.com',
    snippet: 'Engineering breakdown of ceramic electrolytes, lithium dendrite prevention, and energy density curves.',
    category: SearchCategory.VIDEOS,
    imageUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7ce?w=600&auto=format&fit=crop&q=80',
    duration: '14:22',
    sourceName: 'Engineering Explained',
    publishedDate: '2 weeks ago'
  },

  // News Results
  {
    id: 'news1',
    title: 'Global Tech Summit 2026 Unveils Standardized Open AI Safety Protocols',
    url: 'https://www.reuters.com/technology/global-tech-summit-safety-protocols-2026',
    domain: 'reuters.com',
    snippet: 'Over 40 nations and top engineering institutions agree on cryptographic watermarking and verified model evaluation standards.',
    category: SearchCategory.NEWS,
    sourceName: 'Reuters Technology',
    publishedDate: '3 hours ago'
  },
  {
    id: 'news2',
    title: 'Semiconductor Breakthrough: 1nm Transistors Reach Pilot Foundry Fabrication',
    url: 'https://www.bloomberg.com/news/articles/2026-11-04/1nm-foundry-pilot-production',
    domain: 'bloomberg.com',
    snippet: 'Next-generation gate-all-around architecture delivers 30% reduction in power consumption with significant density gains.',
    category: SearchCategory.NEWS,
    sourceName: 'Bloomberg',
    publishedDate: '5 hours ago'
  },
  {
    id: 'news3',
    title: 'Autonomous Drone Logistics Network Receives Commercial Clearance',
    url: 'https://techcrunch.com/2026/11/autonomous-drone-corridors-commercial-clearance',
    domain: 'techcrunch.com',
    snippet: 'Aviation regulators approve beyond-visual-line-of-sight (BVLOS) operations across designated urban and regional air corridors.',
    category: SearchCategory.NEWS,
    sourceName: 'TechCrunch',
    publishedDate: '12 hours ago'
  }
];

export const DEFAULT_EXTENSIONS: NexusExtension[] = [
  {
    id: 'ublock_origin',
    name: 'uBlock Origin Lite',
    version: '2026.11.2',
    author: 'Raymond Hill (Nexus Port)',
    description: 'High-efficiency content blocker. Eliminates trackers, crypto miners, banner ads, and malicious popups.',
    category: ExtensionCategory.PRIVACY,
    iconName: 'shield',
    permissions: [
      { id: 'webRequest', name: 'Network Request Interception', description: 'Inspect outgoing URLs to block known tracking domains', isDangerous: true },
      { id: 'storage', name: 'Local Rule Storage', description: 'Store filter lists and user custom rules', isDangerous: false }
    ],
    isInstalled: true,
    isEnabled: true,
    scriptCode: '/* uBlock Content Script */ document.querySelectorAll(".ad-container, [id*=\\"google_ads\\"]").forEach(e => e.remove());'
  },
  {
    id: 'privacy_badger',
    name: 'Privacy Badger',
    version: '3.4.1',
    author: 'EFF (Electronic Frontier Foundation)',
    description: 'Automatically learns to block invisible trackers based on third-party cookie observation without static lists.',
    category: ExtensionCategory.PRIVACY,
    iconName: 'security',
    permissions: [
      { id: 'cookies', name: 'Third-Party Cookie Management', description: 'Partition and isolate cross-site cookies', isDangerous: true },
      { id: 'tabs', name: 'Tab Telemetry', description: 'Inspect site origins to detect tracking beacons', isDangerous: false }
    ],
    isInstalled: true,
    isEnabled: true,
    scriptCode: '/* Privacy Badger Script */ console.log("[Nexus] Privacy Badger tracker isolation active.");'
  },
  {
    id: 'https_everywhere',
    name: 'HTTPS Everywhere',
    version: '5.2.0',
    author: 'EFF & Tor Project',
    description: 'Forces automatic encrypted HTTPS communication on thousands of websites to guard against MITM snooping.',
    category: ExtensionCategory.SECURITY,
    iconName: 'lock',
    permissions: [
      { id: 'webRequest', name: 'Protocol Rewrite', description: 'Upgrade unencrypted http:// links to https:// automatically', isDangerous: false }
    ],
    isInstalled: true,
    isEnabled: true,
    scriptCode: '/* HTTPS Everywhere */ if (location.protocol === "http:") { location.href = location.href.replace("http:", "https:"); }'
  },
  {
    id: 'dark_reader',
    name: 'Dark Reader',
    version: '4.9.90',
    author: 'Alexander Shutov',
    description: 'Inverts colors and generates soothing high-contrast dark themes on the fly for every webpage you visit.',
    category: ExtensionCategory.READING,
    iconName: 'dark_mode',
    permissions: [
      { id: 'activeTab', name: 'CSS Style Injection', description: 'Inject custom dark mode stylesheets into web content', isDangerous: false }
    ],
    isInstalled: false,
    isEnabled: false,
    scriptCode: '/* Dark Reader */ document.documentElement.classList.add("dark-reader-filter");'
  },
  {
    id: 'noscript_lite',
    name: 'NoScript Lite',
    version: '11.4.12',
    author: 'Giorgio Maone',
    description: 'Granular whitelist-based script, Java, and Flash execution control. Mitigates zero-day cross-site scripting (XSS).',
    category: ExtensionCategory.SECURITY,
    iconName: 'code_off',
    permissions: [
      { id: 'scripting', name: 'JavaScript Execution Control', description: 'Block inline scripts and eval execution on untrusted origins', isDangerous: true }
    ],
    isInstalled: false,
    isEnabled: false,
    scriptCode: '/* NoScript Lite */ console.log("[Nexus] Script policy enforced.");'
  },
  {
    id: 'clear_urls',
    name: 'ClearURLs',
    version: '1.26.1',
    author: 'Kevin Roebert',
    description: 'Removes tracking fields like utm_source, fbclid, and gclid from URLs before navigating to prevent user profiling.',
    category: ExtensionCategory.PRIVACY,
    iconName: 'link_off',
    permissions: [
      { id: 'webNavigation', name: 'URL Cleansing', description: 'Strip tracking parameters from address bar and hyperlink targets', isDangerous: false }
    ],
    isInstalled: false,
    isEnabled: false,
    scriptCode: '/* ClearURLs */ console.log("[Nexus] Clean URL filter active.");'
  }
];

export function generateDynamicResults(query: string, category: SearchCategory): SearchResult[] {
  const q = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
  const results: SearchResult[] = [];

  if (category === SearchCategory.ALL || category === SearchCategory.NEWS) {
    results.push({
      id: `dyn_all_1_${Date.now()}`,
      title: `${q}: Comprehensive Overview, Facts, and Latest Developments`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, '_'))}`,
      domain: 'en.wikipedia.org',
      snippet: `Explore detailed information, historical context, research findings, and technical explanations regarding ${query}.`,
      category: SearchCategory.ALL,
      sourceName: 'Wikipedia Encyclopedia',
      publishedDate: 'Updated today'
    });
    results.push({
      id: `dyn_all_2_${Date.now()}`,
      title: `Latest Research & Analysis on ${q}`,
      url: `https://techcrunch.com/search/${encodeURIComponent(query)}`,
      domain: 'techcrunch.com',
      snippet: `In-depth investigative reports, market analysis, industry trends, and future perspectives concerning ${query}.`,
      category: SearchCategory.ALL,
      sourceName: 'TechCrunch Analysis',
      publishedDate: 'Yesterday'
    });
    results.push({
      id: `dyn_all_3_${Date.now()}`,
      title: `${q} Technical Documentation & Implementation Guidelines`,
      url: `https://github.com/topics/${encodeURIComponent(query.toLowerCase().replace(/ /g, '-'))}`,
      domain: 'github.com',
      snippet: `Open-source implementations, architectural diagrams, tools, and developer libraries built around ${query}.`,
      category: SearchCategory.ALL,
      sourceName: 'GitHub Topics',
      publishedDate: '2 days ago'
    });
  }

  if (category === SearchCategory.IMAGES) {
    results.push({
      id: `dyn_img_1_${Date.now()}`,
      title: `High-Resolution Visual Infographic: ${q}`,
      url: `https://unsplash.com/s/photos/${encodeURIComponent(query.replace(/ /g, '-'))}`,
      domain: 'unsplash.com',
      snippet: `High-definition conceptual photography and architectural render of ${query}.`,
      category: SearchCategory.IMAGES,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      sourceName: 'Unsplash Visuals'
    });
    results.push({
      id: `dyn_img_2_${Date.now()}`,
      title: `${q} Diagram & System Architecture Blueprint`,
      url: `https://unsplash.com/s/photos/${encodeURIComponent(query.replace(/ /g, '-'))}`,
      domain: 'unsplash.com',
      snippet: `Detailed technical schematic and visual blueprint illustrating ${query}.`,
      category: SearchCategory.IMAGES,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      sourceName: 'Unsplash Science'
    });
  }

  if (category === SearchCategory.VIDEOS) {
    results.push({
      id: `dyn_vid_1_${Date.now()}`,
      title: `Understanding ${q} in 15 Minutes: Full Documentary`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      domain: 'youtube.com',
      snippet: `A visual exploration covering key concepts, foundational principles, and practical applications of ${query}.`,
      category: SearchCategory.VIDEOS,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      duration: '15:20',
      sourceName: 'Documentary Network',
      publishedDate: '1 week ago'
    });
    results.push({
      id: `dyn_vid_2_${Date.now()}`,
      title: `${q} Masterclass & Deep Dive Tutorial`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      domain: 'youtube.com',
      snippet: `Step-by-step masterclass demonstrating practical concepts and advanced techniques in ${query}.`,
      category: SearchCategory.VIDEOS,
      imageUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7ce?w=600&auto=format&fit=crop&q=80',
      duration: '28:45',
      sourceName: 'Tech Masterclass',
      publishedDate: '3 days ago'
    });
  }

  if (category === SearchCategory.NEWS) {
    results.push({
      id: `dyn_news_1_${Date.now()}`,
      title: `Breaking: Key Breakthroughs and New Announcements in ${q}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      domain: 'reuters.com',
      snippet: `Industry leaders and research institutions announce major new developments impacting the future of ${query}.`,
      category: SearchCategory.NEWS,
      sourceName: 'Global News Wire',
      publishedDate: '1 hour ago'
    });
    results.push({
      id: `dyn_news_2_${Date.now()}`,
      title: `How ${q} is Shaping Modern Industry and Policy in 2026`,
      url: `https://www.bloomberg.com/search?query=${encodeURIComponent(query)}`,
      domain: 'bloomberg.com',
      snippet: `Economic analysis and market indicators projecting the multi-year impact of ${query} across international sectors.`,
      category: SearchCategory.NEWS,
      sourceName: 'Bloomberg Insights',
      publishedDate: '4 hours ago'
    });
  }

  return results;
}
