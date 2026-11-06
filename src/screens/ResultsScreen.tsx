import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Mic,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  SearchCategory,
  CATEGORY_LABELS,
  SearchResult,
  AiAnswer,
  AiStatus,
  SearchFilter,
  SourceCitation
} from '../types';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { NexusSearchBar } from '../components/NexusSearchBar';
import { VoiceSearchModal } from '../components/VoiceSearchModal';
import { AiOverviewCard } from '../components/AiOverviewCard';
import { WebResultCard } from '../components/WebResultCard';
import { ImageResultCard } from '../components/ImageResultCard';
import { VideoResultCard } from '../components/VideoResultCard';
import { NewsResultCard } from '../components/NewsResultCard';
import { SearchFilterModal } from '../components/SearchFilterModal';
import { ExternalBrowserModal } from '../components/ExternalBrowserModal';

interface ResultsScreenProps {
  initialQuery: string;
  initialCategory: SearchCategory;
  onBack: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  initialQuery,
  initialCategory,
  onBack
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>(initialCategory);
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiAnswer, setAiAnswer] = useState<AiAnswer>({
    query: '',
    summaryText: '',
    keyPoints: [],
    citations: [],
    status: AiStatus.IDLE
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());
  const [selectedBrowserUrl, setSelectedBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState<string>('');

  const [filters, setFilters] = useState<SearchFilter>({
    timeRange: StorageService.getSafeSearch() as any,
    safeSearch: StorageService.getSafeSearch(),
    region: StorageService.getRegion(),
    sortOrder: 0 as any
  });

  // Load bookmarks
  const refreshBookmarks = () => {
    const urls = new Set(StorageService.getBookmarks().map(b => b.url));
    setBookmarkedUrls(urls);
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  // Search execution
  const executeSearch = async (searchTerm: string, targetCategory: SearchCategory) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setQuery(searchTerm);
    setCategory(targetCategory);

    // Save history
    StorageService.addHistory(searchTerm, targetCategory);

    try {
      const searchRes = await ApiService.search(searchTerm, targetCategory);
      setResults(searchRes);

      // Trigger AI overview synthesis if on ALL tab and enabled
      if (targetCategory === SearchCategory.ALL && StorageService.isAiEnabled()) {
        setAiAnswer({
          query: searchTerm,
          summaryText: '',
          keyPoints: [],
          citations: [],
          status: AiStatus.LOADING
        });

        const citations: SourceCitation[] = searchRes.slice(0, 5).map((r, idx) => ({
          index: idx + 1,
          title: r.title,
          url: r.url,
          domain: r.domain,
          snippet: r.snippet
        }));

        ApiService.synthesizeOverview(searchTerm, citations)
          .then(answer => {
            setAiAnswer(answer);
          })
          .catch(() => {
            setAiAnswer({
              query: searchTerm,
              summaryText: 'Overview synthesis currently unavailable. You can browse the verified citations below.',
              keyPoints: [],
              citations,
              status: AiStatus.ERROR,
              errorMessage: 'Network timeout during synthesis.'
            });
          });
      } else {
        setAiAnswer({
          query: searchTerm,
          summaryText: '',
          keyPoints: [],
          citations: [],
          status: AiStatus.IDLE
        });
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to retrieve search results');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(initialQuery, initialCategory);
  }, [initialQuery, initialCategory]);

  const handleBookmarkToggle = (item: SearchResult) => {
    StorageService.toggleBookmark({
      title: item.title,
      url: item.url,
      domain: item.domain,
      snippet: item.snippet,
      category: item.category,
      imageUrl: item.imageUrl
    });
    refreshBookmarks();
  };

  const handleOpenBrowser = (item: { url: string; title: string }) => {
    setBrowserTitle(item.title);
    setSelectedBrowserUrl(item.url);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-3">
      {/* Top Search Controls Bar */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isEditingSearch ? (
          <div className="flex-1">
            <NexusSearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={(submitted) => {
                setIsEditingSearch(false);
                executeSearch(submitted, category);
              }}
              onMicClick={() => setIsVoiceOpen(true)}
              autoFocus
            />
          </div>
        ) : (
          <div
            onClick={() => setIsEditingSearch(true)}
            className="flex-1 flex items-center justify-between h-11 px-4 rounded-full bg-[#1A1D27] border border-white/10 hover:border-white/20 cursor-pointer shadow-sm transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-sm font-semibold text-white truncate">{query}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceOpen(true);
              }}
              className="p-1 rounded-full text-blue-400 hover:bg-white/5 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2.5 rounded-xl bg-[#1A1D27] border border-white/10 hover:border-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          title="Filter results"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10 overflow-x-auto no-scrollbar">
        {Object.values(SearchCategory).map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              onClick={() => executeSearch(query, cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#1A1D27] text-gray-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-300">Searching authoritative web sources…</p>
            <p className="text-xs text-gray-500 mt-1">Cross-referencing live indexes and verified public data</p>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Search Encountered an Issue</h3>
            <p className="text-sm text-gray-400 mb-4">{errorMessage}</p>
            <button
              onClick={() => executeSearch(query, category)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Search
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No results found for "{query}"</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Try checking your spelling, using broader search terms, or adjusting your SafeSearch filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI Overview Card (Only in ALL category) */}
            {category === SearchCategory.ALL && (
              <AiOverviewCard
                aiAnswer={aiAnswer}
                onSourceClick={(citation) => handleOpenBrowser({ url: citation.url, title: citation.title })}
              />
            )}

            {/* Results by Category */}
            {category === SearchCategory.ALL && (
              <div className="space-y-3">
                {results.map((res) => (
                  <WebResultCard
                    key={res.id}
                    result={res}
                    isBookmarked={bookmarkedUrls.has(res.url)}
                    onBookmarkToggle={() => handleBookmarkToggle(res)}
                    onClick={() => handleOpenBrowser({ url: res.url, title: res.title })}
                  />
                ))}
              </div>
            )}

            {category === SearchCategory.IMAGES && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {results.map((res) => (
                  <ImageResultCard
                    key={res.id}
                    result={res}
                    onClick={() => handleOpenBrowser({ url: res.url, title: res.title })}
                  />
                ))}
              </div>
            )}

            {category === SearchCategory.VIDEOS && (
              <div className="space-y-3">
                {results.map((res) => (
                  <VideoResultCard
                    key={res.id}
                    result={res}
                    onClick={() => handleOpenBrowser({ url: res.url, title: res.title })}
                  />
                ))}
              </div>
            )}

            {category === SearchCategory.NEWS && (
              <div className="space-y-3">
                {results.map((res) => (
                  <NewsResultCard
                    key={res.id}
                    result={res}
                    onClick={() => handleOpenBrowser({ url: res.url, title: res.title })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <SearchFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilter={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          executeSearch(query, category);
        }}
      />

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onResult={(voiceText) => {
          setIsVoiceOpen(false);
          executeSearch(voiceText, category);
        }}
      />

      {/* In-App Browser Custom Tab */}
      <ExternalBrowserModal
        url={selectedBrowserUrl}
        title={browserTitle}
        onClose={() => setSelectedBrowserUrl(null)}
      />
    </div>
  );
};
