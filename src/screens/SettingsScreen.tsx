import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Sparkles,
  Lock,
  Globe2,
  Trash2,
  Info,
  ChevronRight,
  Smartphone,
  Download,
  PackageCheck
} from 'lucide-react';
import { SafeSearch, SearchRegion, NEXUS_PRODUCT_INFO } from '../types';
import { StorageService } from '../services/storage';

interface SettingsScreenProps {
  onBack: () => void;
  isIncognito: boolean;
  onToggleIncognito: (enabled: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  isIncognito,
  onToggleIncognito
}) => {
  const [isAiEnabled, setIsAiEnabled] = useState(StorageService.isAiEnabled());
  const [safeSearch, setSafeSearch] = useState<SafeSearch>(StorageService.getSafeSearch());
  const [region, setRegion] = useState<SearchRegion>(StorageService.getRegion());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleToggleAi = (enabled: boolean) => {
    setIsAiEnabled(enabled);
    StorageService.setAiEnabled(enabled);
  };

  const handleSafeSearchChange = (mode: SafeSearch) => {
    setSafeSearch(mode);
    StorageService.setSafeSearch(mode);
  };

  const handleRegionChange = (reg: SearchRegion) => {
    setRegion(reg);
    StorageService.setRegion(reg);
  };

  const handleClearAllData = () => {
    StorageService.clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white leading-none">Settings & Privacy</h1>
          <p className="text-xs text-gray-400 mt-0.5">Preferences & Local Governance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Privacy & History Section */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5">
            Privacy & History
          </div>
          <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Incognito Search</div>
                  <div className="text-xs text-gray-400">Never save queries or clicks to history</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isIncognito}
                  onChange={(e) => onToggleIncognito(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI Overview Synthesizer</div>
                  <div className="text-xs text-gray-400">Synthesize search answers using Gemini 3.8 Flash</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAiEnabled}
                  onChange={(e) => handleToggleAi(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Search Preferences */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5">
            Search Preferences
          </div>
          <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl space-y-4">
            {/* SafeSearch */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">SafeSearch Filtering</div>
                  <div className="text-xs text-gray-400">Filter explicit content and domain telemetry</div>
                </div>
              </div>

              <select
                value={safeSearch}
                onChange={(e) => handleSafeSearchChange(e.target.value as SafeSearch)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={SafeSearch.OFF}>Off</option>
                <option value={SafeSearch.MODERATE}>Moderate</option>
                <option value={SafeSearch.STRICT}>Strict</option>
              </select>
            </div>

            {/* Region */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 mt-0.5">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Search Region</div>
                  <div className="text-xs text-gray-400">Localized search routing & trends</div>
                </div>
              </div>

              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value as SearchRegion)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value={SearchRegion.GLOBAL}>Global</option>
                <option value={SearchRegion.US}>United States</option>
                <option value={SearchRegion.UK}>United Kingdom</option>
                <option value={SearchRegion.DE}>Germany</option>
                <option value={SearchRegion.IN}>India</option>
                <option value={SearchRegion.JP}>Japan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5">
            Data Management
          </div>
          <div
            onClick={() => setShowClearConfirm(true)}
            className="rounded-2xl bg-[#1A1D27] border border-white/10 hover:border-red-500/40 p-5 shadow-xl flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/15 text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  Clear All Browsing Data
                </div>
                <div className="text-xs text-gray-400">
                  Delete local search history, bookmarks, and saved research reports
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
          </div>
        </div>

        {/* Android APK Download Section */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5">
            Android Application (APK)
          </div>
          <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 mt-0.5">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">NEXUS SEARCH for Android</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Install the native Android package directly onto your phone.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="/download/apk"
                download="nexus-search-release.apk"
                className="flex items-center justify-between p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Release APK
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">v2.0.0</span>
              </a>

              <a
                href="/download/debug-apk"
                download="nexus-search-debug.apk"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-cyan-400" />
                  Download Debug APK
                </span>
                <span className="text-[10px] text-gray-400">Testing</span>
              </a>
            </div>

            <div className="text-[11px] text-gray-400 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              💡 <strong>Install Tip:</strong> Open the downloaded APK and toggle on <em>"Allow from this source"</em> if prompted by Android.
            </div>
          </div>
        </div>

        {/* About Card */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5">
            About
          </div>
          <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{NEXUS_PRODUCT_INFO.APP_NAME}</h3>
                <p className="text-xs text-blue-400 font-semibold">Creator: {NEXUS_PRODUCT_INFO.CREATOR_DISPLAY_NAME}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{NEXUS_PRODUCT_INFO.APP_VERSION}</p>
              </div>
            </div>

            <p className="text-xs text-gray-200 font-medium mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              {NEXUS_PRODUCT_INFO.CREATOR_STATEMENT}
            </p>

            <p className="text-xs text-gray-400 leading-relaxed">
              Dual Personas: Nexus Angel AI & Nexus Devil AI • Fail-closed Tor SOCKS5 network • WebExtensions platform • Zero-trust App Check • On-device persistent storage.
            </p>
          </div>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#1A1D27] border border-white/10 p-6 shadow-2xl text-center">
            <h3 className="text-base font-bold text-white mb-2">Clear All Stored Data?</h3>
            <p className="text-xs text-gray-400 mb-6">
              This will permanently delete all local search history, bookmarks, and saved research reports on this device.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
