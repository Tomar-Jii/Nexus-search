export enum SearchCategory {
  ALL = 'ALL',
  IMAGES = 'IMAGES',
  VIDEOS = 'VIDEOS',
  NEWS = 'NEWS'
}

export const CATEGORY_LABELS: Record<SearchCategory, string> = {
  [SearchCategory.ALL]: 'All',
  [SearchCategory.IMAGES]: 'Images',
  [SearchCategory.VIDEOS]: 'Videos',
  [SearchCategory.NEWS]: 'News'
};

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  category: SearchCategory;
  imageUrl?: string | null;
  publishedDate?: string | null;
  duration?: string | null;
  sourceName?: string | null;
  isBookmarked?: boolean;
}

export enum AiStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  STREAMING = 'STREAMING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SourceCitation {
  index: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface AiAnswer {
  query: string;
  summaryText: string;
  keyPoints: string[];
  citations: SourceCitation[];
  status: AiStatus;
  errorMessage?: string | null;
}

export enum TimeRange {
  ANY = 'ANY',
  PAST_24H = 'PAST_24H',
  PAST_WEEK = 'PAST_WEEK',
  PAST_MONTH = 'PAST_MONTH',
  PAST_YEAR = 'PAST_YEAR'
}

export enum SafeSearch {
  OFF = 'OFF',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT'
}

export enum SearchRegion {
  GLOBAL = 'GLOBAL',
  US = 'US',
  UK = 'UK',
  DE = 'DE',
  IN = 'IN',
  JP = 'JP'
}

export enum SortOrder {
  RELEVANCE = 'RELEVANCE',
  DATE = 'DATE'
}

export interface SearchFilter {
  timeRange: TimeRange;
  safeSearch: SafeSearch;
  region: SearchRegion;
  sortOrder: SortOrder;
}

export interface SearchSuggestion {
  query: string;
  isTrending?: boolean;
  isHistory?: boolean;
}

export interface TrendingTopic {
  id: string;
  query: string;
  category: string;
  searchVolume: string;
}

// Assistant Personas
export enum AssistantPersona {
  ANGEL = 'ANGEL',
  DEVIL = 'DEVIL'
}

export interface PersonaInfo {
  id: AssistantPersona;
  displayName: string;
  title: string;
  subtitle: string;
  themeAccentHex: string;
}

export const PERSONA_CONFIG: Record<AssistantPersona, PersonaInfo> = {
  [AssistantPersona.ANGEL]: {
    id: AssistantPersona.ANGEL,
    displayName: 'NEXUS ANGEL AI',
    title: 'Angel Intelligence',
    subtitle: 'Helpful, calm, and insightful research companion',
    themeAccentHex: '#EAB308'
  },
  [AssistantPersona.DEVIL]: {
    id: AssistantPersona.DEVIL,
    displayName: 'NEXUS DEVIL AI',
    title: 'Devil Intelligence',
    subtitle: 'Bold, sharp, and futuristic intelligence',
    themeAccentHex: '#EF4444'
  }
};

export enum PersonaMode {
  AUTO = 'AUTO',
  FORCE_ANGEL = 'FORCE_ANGEL',
  FORCE_DEVIL = 'FORCE_DEVIL'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  persona: AssistantPersona;
  timestamp: number;
}

// Deep Research Depth Settings
export enum ResearchDepth {
  QUICK = 'QUICK',
  DEEP = 'DEEP',
  EXTENDED = 'EXTENDED'
}

export const RESEARCH_DEPTH_CONFIG: Record<ResearchDepth, { label: string; description: string; queryCount: number; searchBreadth: string }> = {
  [ResearchDepth.QUICK]: {
    label: 'Quick Search',
    description: 'Instant single-query synthesis and concise takeaways',
    queryCount: 1,
    searchBreadth: 'Focused'
  },
  [ResearchDepth.DEEP]: {
    label: 'Deep Search',
    description: 'Multi-query decomposition, source cross-referencing, and comparative analysis',
    queryCount: 4,
    searchBreadth: 'Multi-Source'
  },
  [ResearchDepth.EXTENDED]: {
    label: 'Extended Research',
    description: 'Comprehensive multi-stage investigation, contradiction detection, and full research report',
    queryCount: 6,
    searchBreadth: 'Comprehensive'
  }
};

export enum ResearchStage {
  INITIALIZING = 'INITIALIZING',
  DECOMPOSING_QUERY = 'DECOMPOSING_QUERY',
  RETRIEVING_SOURCES = 'RETRIEVING_SOURCES',
  ANALYZING_SOURCES = 'ANALYZING_SOURCES',
  SYNTHESIZING_REPORT = 'SYNTHESIZING_REPORT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export const STAGE_CONFIG: Record<ResearchStage, { title: string; progress: number }> = {
  [ResearchStage.INITIALIZING]: { title: 'Formulating research scope…', progress: 0.1 },
  [ResearchStage.DECOMPOSING_QUERY]: { title: 'Breaking question into sub-queries…', progress: 0.25 },
  [ResearchStage.RETRIEVING_SOURCES]: { title: 'Querying web & public indexes in parallel…', progress: 0.5 },
  [ResearchStage.ANALYZING_SOURCES]: { title: 'Ranking credibility & detecting contradictions…', progress: 0.75 },
  [ResearchStage.SYNTHESIZING_REPORT]: { title: 'Synthesizing comprehensive research report…', progress: 0.9 },
  [ResearchStage.COMPLETED]: { title: 'Research complete', progress: 1.0 },
  [ResearchStage.FAILED]: { title: 'Research failed', progress: 0.0 }
};

export interface ResearchSubQuery {
  id: string;
  query: string;
  focusArea: string;
  resultsCount?: number;
}

export interface DeepResearchReport {
  id: string;
  mainTopic: string;
  depth: ResearchDepth;
  stage: ResearchStage;
  subQueries: ResearchSubQuery[];
  summary: string;
  keyFindings: string[];
  contradictoryFindings: string[];
  sources: SourceCitation[];
  confidenceScore: number;
  confidenceExplanation: string;
  timestamp: number;
}

// Tor Private Network Models
export enum TorConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface TorStatus {
  state: TorConnectionState;
  bootstrapPercentage: number;
  bootstrapStage: string;
  circuitNodes: string[];
  currentOnionAddress?: string | null;
  isFailClosedActive: boolean;
  dnsLeakProtected: boolean;
  bridgesEnabled: boolean;
  errorMessage?: string | null;
}

// Browser Tab & Session Models
export enum BrowserTabMode {
  NORMAL = 'NORMAL',
  PRIVATE = 'PRIVATE',
  TOR = 'TOR'
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string | null;
  mode: BrowserTabMode;
  isLoading: boolean;
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isSecureHttps: boolean;
  certificateDomain?: string | null;
  isDesktopSite: boolean;
  isReaderMode: boolean;
  blockedTrackersCount: number;
}

// Browser Extension Models
export enum ExtensionCategory {
  PRIVACY = 'PRIVACY',
  SECURITY = 'SECURITY',
  PRODUCTIVITY = 'PRODUCTIVITY',
  READING = 'READING',
  DEVELOPER = 'DEVELOPER'
}

export interface ExtensionPermission {
  id: string;
  name: string;
  description: string;
  isDangerous: boolean;
}

export interface NexusExtension {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: ExtensionCategory;
  iconName: string;
  permissions: ExtensionPermission[];
  isInstalled: boolean;
  isEnabled: boolean;
  scriptCode: string;
}

// Security Center Diagnostics
export interface SecurityAuditStatus {
  httpsEnforced: boolean;
  torFailClosedActive: boolean;
  webRtcShieldActive: boolean;
  dnsLeakShieldActive: boolean;
  totalTrackersBlocked: number;
  storageEncryptionActive: boolean;
  phishingShieldActive: boolean;
  activeVulnerabilitiesFound: number;
}

// History & Bookmark Entities
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  category: SearchCategory;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  imageUrl?: string | null;
  category: SearchCategory;
  folder?: string;
  savedAt: number;
}

// Product Info
export const NEXUS_PRODUCT_INFO = {
  APP_NAME: 'NEXUS SEARCH',
  APP_VERSION: '2.0.0 (Ultra Master Build)',
  CREATOR_DISPLAY_NAME: 'Death Game Boy 375',
  CREATOR_STATEMENT: 'NEXUS SEARCH displays its creator name as Death Game Boy 375.',
  LICENSE: 'Apache License 2.0',
  PRIVACY_STATEMENT: 'Nexus Search 2.0 uses on-device persistent storage, zero search query tracking, fail-closed Tor onion network routing, and server-side Gemini 3.8 Flash synthesis.'
};
