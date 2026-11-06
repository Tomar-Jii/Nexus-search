import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash2,
  History,
  Shield,
  X,
  Search,
  Clock
} from 'lucide-react';
import { SearchHistoryItem, SearchCategory } from '../types';
import { StorageService } from '../services/storage';

interface HistoryScreenProps {
  onBack: () => void;
  onSelectQuery: (query: string) => void;
  isIncognito: boolean;
  onToggleIncognito: (enabled: boolean) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onBack,
  onSelectQuery,
  isIncognito,
  onToggleIncognito
}) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadHistory = () => {
    setHistory(StorageService.getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteHistoryItem(id);
    loadHistory();
  };

  const handleClearAll = () => {
    StorageService.clearAllHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Search History</h1>
            <p className="text-xs text-gray-400 mt-0.5">On-Device Local History</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Clear all search history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Incognito Card */}
      <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Incognito Search</div>
            <div className="text-xs text-gray-400">Do not save queries to search history</div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isIncognito}
            onChange={(e) => onToggleIncognito(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
        </label>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <History className="w-12 h-12 text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No search history</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Searches you perform will appear here for quick access unless Incognito mode is active.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectQuery(item.query)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 hover:bg-[#1E2230] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 truncate mr-3">
                <Search className="w-4 h-4 text-gray-500 group-hover:text-blue-400 shrink-0" />
                <div className="truncate">
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-blue-300 truncate">
                    {item.query}
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="uppercase">{item.category}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleDeleteItem(item.id, e)}
                className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                title="Remove item"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#1A1D27] border border-white/10 p-6 shadow-2xl text-center">
            <h3 className="text-base font-bold text-white mb-2">Clear Search History?</h3>
            <p className="text-xs text-gray-400 mb-6">
              This action will permanently delete all stored search queries on this device.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
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
