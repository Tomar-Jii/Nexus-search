import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X, TrendingUp, History, ArrowUpLeft } from 'lucide-react';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';

interface NexusSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (submittedQuery: string) => void;
  onMicClick: () => void;
  autoFocus?: boolean;
  className?: string;
}

export const NexusSearchBar: React.FC<NexusSearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  onMicClick,
  autoFocus = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ query: string; isTrending?: boolean; isHistory?: boolean }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced suggestion fetch
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Show recent history or trending suggestions
      const hist = StorageService.getHistory().slice(0, 4).map(h => ({ query: h.query, isHistory: true }));
      setSuggestions(hist);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const live = await ApiService.getSuggestions(trimmed);
        const historyMatches = StorageService.getHistory()
          .filter(h => h.query.toLowerCase().includes(trimmed.toLowerCase()))
          .slice(0, 3)
          .map(h => ({ query: h.query, isHistory: true }));

        const combined = [
          ...historyMatches,
          ...live.map(s => ({ query: s.query, isTrending: s.isTrending }))
        ];

        // Deduplicate
        const seen = new Set<string>();
        const unique = combined.filter(item => {
          const l = item.query.toLowerCase();
          if (seen.has(l)) return false;
          seen.add(l);
          return true;
        });

        setSuggestions(unique.slice(0, 7));
      } catch {
        // Ignore
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      onSearch(query.trim());
    }
  };

  const handleDeleteHistory = (itemQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteHistoryByQuery(itemQuery);
    setSuggestions(prev => prev.filter(s => s.query.toLowerCase() !== itemQuery.toLowerCase()));
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center h-13 px-4 rounded-full bg-[#1A1D27] border transition-all duration-200 shadow-lg ${
          isFocused ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <Search className="w-5 h-5 text-blue-400 shrink-0 mr-3" />

        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search the web, AI overviews, or enter URL…"
          autoFocus={autoFocus}
          className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-gray-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded-full mr-1 hover:bg-white/10"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onMicClick}
          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-full transition-colors mr-1"
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="submit"
          className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shrink-0 ml-1"
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-2xl bg-[#1A1D27] border border-white/15 shadow-2xl z-40 overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {query.trim() ? 'Search Suggestions' : 'Recent Searches & Trending'}
          </div>
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              onClick={() => {
                onQueryChange(s.query);
                setIsFocused(false);
                onSearch(s.query);
              }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 cursor-pointer text-sm text-gray-200 transition-colors group"
            >
              <div className="flex items-center gap-3 truncate">
                {s.isHistory ? (
                  <History className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <span className="truncate group-hover:text-blue-300">{s.query}</span>
              </div>

              {s.isHistory ? (
                <button
                  type="button"
                  onClick={(e) => handleDeleteHistory(s.query, e)}
                  className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                  title="Remove from history"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <ArrowUpLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 shrink-0 opacity-60" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
