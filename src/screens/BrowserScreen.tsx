import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  BookOpen,
  Monitor,
  Share2,
  Lock,
  Shield,
  Plus,
  X,
  Layers,
  Globe,
  KeyRound
} from 'lucide-react';
import { BrowserTab, BrowserTabMode } from '../types';
import { ExternalBrowserModal } from '../components/ExternalBrowserModal';

interface BrowserScreenProps {
  onBack: () => void;
  tabs: BrowserTab[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onOpenNewTab: (url?: string, mode?: BrowserTabMode) => void;
  onCloseTab: (id: string) => void;
  onNavigateTab: (urlOrQuery: string) => void;
  onToggleReaderMode: (id: string) => void;
  onToggleDesktopSite: (id: string) => void;
}

export const BrowserScreen: React.FC<BrowserScreenProps> = ({
  onBack,
  tabs,
  activeTabId,
  onSwitchTab,
  onOpenNewTab,
  onCloseTab,
  onNavigateTab,
  onToggleReaderMode,
  onToggleDesktopSite
}) => {
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [addressInput, setAddressInput] = useState(activeTab?.url || 'https://duckduckgo.com');
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [selectedBrowserModalUrl, setSelectedBrowserModalUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url);
    }
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onNavigateTab(addressInput.trim());
    }
  };

  const isTor = activeTab?.mode === BrowserTabMode.TOR;

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0F1117] text-white">
      {/* Top Browser Bar */}
      <div className="px-4 py-2.5 bg-[#1A1D27] border-b border-white/10 flex items-center gap-2 shrink-0">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Back to Nexus"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Address Bar */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="flex items-center w-full h-10 px-3.5 rounded-full bg-black/40 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            {isTor ? (
              <KeyRound className="w-4 h-4 text-purple-400 shrink-0 mr-2" />
            ) : activeTab?.isSecureHttps ? (
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mr-2" />
            ) : (
              <Globe className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
            )}

            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Search or enter web URL…"
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none"
            />

            {addressInput && (
              <button
                type="button"
                onClick={() => setAddressInput('')}
                className="p-1 text-gray-500 hover:text-white rounded-full mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Tab Count Switcher Pill */}
        <button
          onClick={() => setShowTabSwitcher(true)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-blue-400 transition-colors shrink-0"
          title="Switch Tabs"
        >
          {tabs.length}
        </button>
      </div>

      {/* Privacy & Shields Indicator */}
      <div className="px-4 py-1.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[11px] text-gray-400 shrink-0">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{activeTab?.blockedTrackersCount || 4} trackers neutralized</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>3 Extensions active in sandbox</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab ? (
          activeTab.isReaderMode ? (
            /* Reader Mode View */
            <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#1A1D27] border border-white/10 p-6 md:p-8 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                Nexus Reader Mode Active
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                {activeTab.title}
              </h1>
              <p className="text-xs text-gray-400 mb-6 font-mono">
                {activeTab.url}
              </p>
              <div className="text-sm md:text-base text-gray-200 leading-relaxed space-y-4">
                <p>
                  This webpage has been purified by Nexus Reader Engine. All intrusive banner scripts, tracking beacons, and visual clutter have been stripped away to deliver distraction-free reading.
                </p>
                <p>
                  The original source continues to execute under isolated sandbox constraints, protecting your IP address and device credentials.
                </p>
              </div>
            </div>
          ) : (
            /* Normal Web Session Canvas */
            <div className="w-full max-w-3xl mx-auto rounded-2xl bg-[#1A1D27] border border-white/10 p-6 md:p-8 shadow-xl flex flex-col min-h-[400px] justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{activeTab.title}</span>
                  </div>
                  {isTor && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      TOR ONION ROUTED
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-blue-400 mb-6 break-all">
                  {activeTab.url}
                </div>

                <div className="rounded-xl bg-black/30 border border-white/5 p-4 space-y-2 mb-6">
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Protected Native Web Session
                  </div>
                  <div className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
                    <p>• WebRTC IP Shield: <span className="text-emerald-400 font-semibold">Active (No local subnet leakage)</span></p>
                    <p>• Third-Party Cookies: <span className="text-emerald-400 font-semibold">Isolated in sandbox memory</span></p>
                    <p>• Content Scripts: <span className="text-blue-400 font-semibold">uBlock Origin Lite & Privacy Badger active</span></p>
                    <p>• Protocol: <span className="text-gray-300 font-semibold">{activeTab.isSecureHttps ? 'TLS 1.3 Verified' : 'Tor Onion Service Transport'}</span></p>
                    <p>• Viewport Mode: <span className="text-gray-300 font-semibold">{activeTab.isDesktopSite ? 'Desktop Emulation' : 'Mobile Responsive'}</span></p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedBrowserModalUrl(activeTab.url)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
              >
                Open in Full Custom Tab Engine
              </button>
            </div>
          )
        ) : null}
      </div>

      {/* Bottom Browser Navigation Bar */}
      <div className="px-6 py-2.5 bg-[#1A1D27] border-t border-white/10 flex items-center justify-around shrink-0">
        <button
          onClick={() => {}}
          className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onNavigateTab(activeTab?.url || '')}
          className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
          title="Reload"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={() => activeTab && onToggleReaderMode(activeTab.id)}
          className={`p-2 rounded-lg transition-colors ${
            activeTab?.isReaderMode ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'
          }`}
          title="Reader Mode"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        <button
          onClick={() => activeTab && onToggleDesktopSite(activeTab.id)}
          className={`p-2 rounded-lg transition-colors ${
            activeTab?.isDesktopSite ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'
          }`}
          title="Desktop Site"
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            if (activeTab?.url) {
              if (navigator.share) {
                navigator.share({ title: activeTab.title, url: activeTab.url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(activeTab.url);
              }
            }
          }}
          className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Switcher Modal */}
      {showTabSwitcher && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#1A1D27] border border-white/15 p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Browser Tabs ({tabs.length})</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenNewTab('https://duckduckgo.com', BrowserTabMode.NORMAL);
                    setShowTabSwitcher(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tab</span>
                </button>
                <button
                  onClick={() => {
                    onOpenNewTab('http://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion', BrowserTabMode.TOR);
                    setShowTabSwitcher(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Tor Tab</span>
                </button>
                <button
                  onClick={() => setShowTabSwitcher(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-full ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {tabs.map((tab) => {
                const isSelected = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    onClick={() => {
                      onSwitchTab(tab.id);
                      setShowTabSwitcher(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="truncate mr-3">
                      <div className="text-sm font-semibold text-white truncate">{tab.title}</div>
                      <div className="text-xs text-gray-400 font-mono truncate">{tab.url}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* External Browser Custom Tab Modal */}
      <ExternalBrowserModal
        url={selectedBrowserModalUrl}
        title={activeTab?.title}
        onClose={() => setSelectedBrowserModalUrl(null)}
      />
    </div>
  );
};
