import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Trash2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { BookmarkItem } from '../types';
import { StorageService } from '../services/storage';
import { ExternalBrowserModal } from '../components/ExternalBrowserModal';

interface BookmarksScreenProps {
  onBack: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ onBack }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedBrowserUrl, setSelectedBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState('');

  const loadBookmarks = () => {
    setBookmarks(StorageService.getBookmarks());
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleDelete = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteBookmark(url);
    loadBookmarks();
  };

  const handleShare = (bm: BookmarkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: bm.title, url: bm.url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(bm.url);
    }
  };

  const folders = Array.from(new Set(bookmarks.map(b => b.folder || 'Saved'))).filter(Boolean);

  const displayedBookmarks = selectedFolder
    ? bookmarks.filter(b => (b.folder || 'Saved') === selectedFolder)
    : bookmarks;

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white leading-none">Bookmarks</h1>
          <p className="text-xs text-gray-400 mt-0.5">Saved Offline References</p>
        </div>
      </div>

      {/* Folder Filter Chips */}
      {folders.length > 0 && (
        <div className="flex items-center gap-2 pb-3 mb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedFolder === null
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            All ({bookmarks.length})
          </button>
          {folders.map((folder) => {
            const count = bookmarks.filter(b => (b.folder || 'Saved') === folder).length;
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedFolder === folder
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {folder} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Bookmarks List */}
      {displayedBookmarks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <Bookmark className="w-12 h-12 text-gray-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No saved bookmarks</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Tap the bookmark icon on any search result to save it here for offline reading.
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {displayedBookmarks.map((bm) => (
            <div
              key={bm.id}
              onClick={() => {
                setBrowserTitle(bm.title);
                setSelectedBrowserUrl(bm.url);
              }}
              className="rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 p-5 shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 text-xs text-blue-400 font-bold truncate">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{bm.domain}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleShare(bm, e)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(bm.url, e)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors mb-1.5 line-clamp-2 flex items-center gap-1.5">
                <span>{bm.title}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </h3>

              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {bm.snippet}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* External Browser Custom Tab Modal */}
      <ExternalBrowserModal
        url={selectedBrowserUrl}
        title={browserTitle}
        onClose={() => setSelectedBrowserUrl(null)}
      />
    </div>
  );
};
