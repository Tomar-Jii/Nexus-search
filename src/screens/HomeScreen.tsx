import React, { useState } from 'react';
import {
  Shield,
  Bookmark,
  Settings,
  Sparkles,
  Flame,
  Brain,
  KeyRound,
  Globe,
  Blocks,
  TrendingUp,
  History
} from 'lucide-react';
import {
  SearchCategory,
  CATEGORY_LABELS,
  AssistantPersona,
  PERSONA_CONFIG,
  TrendingTopic
} from '../types';
import { TRENDING_TOPICS } from '../data/curatedData';
import { NexusSearchBar } from '../components/NexusSearchBar';
import { VoiceSearchModal } from '../components/VoiceSearchModal';

interface HomeScreenProps {
  onSearch: (query: string, category: SearchCategory) => void;
  onNavigate: (route: string) => void;
  activePersona: AssistantPersona;
  onPersonaClick: () => void;
  isIncognito: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  activePersona,
  onPersonaClick,
  isIncognito
}) => {
  const [query, setQuery] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const persona = PERSONA_CONFIG[activePersona];
  const isAngel = activePersona === AssistantPersona.ANGEL;

  const handleCategoryQuickClick = (cat: SearchCategory) => {
    onSearch(query.trim() || 'latest', cat);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-3 md:py-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        {/* Interactive Persona Greeting Badge */}
        <button
          type="button"
          onClick={onPersonaClick}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
            isAngel
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
          }`}
          title="Click to interact with Assistant"
        >
          {isAngel ? <Sparkles className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
          <span className="text-xs font-bold tracking-wide">{persona.displayName}</span>
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1">
          {isIncognito && (
            <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold uppercase mr-1">
              Incognito
            </span>
          )}
          <button
            onClick={() => onNavigate('security_center')}
            className="p-2 rounded-xl text-blue-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Security Center"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('bookmarks')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Bookmarks"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Search History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Settings & Privacy"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Logo Section */}
      <div className="text-center my-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-violet-600 via-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 mb-3 border border-white/20 animate-pulse-glow overflow-hidden">
          <img
            src="/nexus_icon.jpg"
            alt="Nexus Search"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest text-white uppercase mb-1">
          NEXUS SEARCH
        </h1>
        <p className="text-xs md:text-sm text-gray-400 font-medium">
          AI Search • Tor Private Browser • Extension Platform
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="my-3">
        <NexusSearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={(submitted) => onSearch(submitted, SearchCategory.ALL)}
          onMicClick={() => setIsVoiceOpen(true)}
        />
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 my-4 flex-wrap">
        {Object.values(SearchCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryQuickClick(cat)}
            className="px-4 py-1.5 rounded-full bg-[#1A1D27] hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 text-xs font-semibold text-gray-300 hover:text-blue-300 transition-all shadow-sm"
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Core Platform Ecosystem Cards */}
      <div className="my-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Nexus Ecosystem
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Deep Research */}
          <button
            onClick={() => onNavigate('deep_research')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/40 hover:bg-[#1E2230] transition-all text-left shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-2 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Deep Research
            </div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
              Multi-stage investigation
            </div>
          </button>

          {/* Tor Network */}
          <button
            onClick={() => onNavigate('private_network')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-purple-500/40 hover:bg-[#1E2230] transition-all text-left shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Tor Network
            </div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
              .onion fail-closed routing
            </div>
          </button>

          {/* Nexus Browser */}
          <button
            onClick={() => onNavigate('browser')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-emerald-500/40 hover:bg-[#1E2230] transition-all text-left shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Nexus Browser
            </div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
              Multi-tab private engine
            </div>
          </button>

          {/* Extensions */}
          <button
            onClick={() => onNavigate('extensions')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-cyan-500/40 hover:bg-[#1E2230] transition-all text-left shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
              <Blocks className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Extensions
            </div>
            <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
              WebExtensions store
            </div>
          </button>
        </div>
      </div>

      {/* Trending Topics List */}
      <div className="my-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Trending Searches
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSearch(topic.query, SearchCategory.ALL)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 hover:bg-[#1E2230] transition-all text-left group"
            >
              <div>
                <div className="text-sm font-semibold text-gray-200 group-hover:text-blue-300 transition-colors">
                  {topic.query}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {topic.category} • {topic.searchVolume}
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-blue-400 shrink-0 ml-2 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onResult={(spokenText) => {
          setIsVoiceOpen(false);
          setQuery(spokenText);
          onSearch(spokenText, SearchCategory.ALL);
        }}
      />
    </div>
  );
};
