import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Share2, Copy, Check, Globe, ExternalLink } from 'lucide-react';
import { SearchResult } from '../types';

interface WebResultCardProps {
  result: SearchResult;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onClick: () => void;
}

export const WebResultCard: React.FC<WebResultCardProps> = ({
  result,
  isBookmarked,
  onBookmarkToggle,
  onClick
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: result.title, url: result.url }).catch(() => {});
    } else {
      handleCopy(e);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group w-full rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 p-5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Domain & Source Header */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <Globe className="w-3 h-3 text-blue-400" />
          </div>
          <span className="font-semibold text-gray-300">{result.sourceName || result.domain}</span>
          <span className="text-gray-600">•</span>
          <span className="truncate max-w-[200px] text-gray-500">{result.domain}</span>
          {result.publishedDate && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">{result.publishedDate}</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-white/5 transition-colors"
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this result'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Result Title */}
      <h3 className="text-base md:text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors mb-2 leading-snug flex items-center gap-1.5">
        <span>{result.title}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </h3>

      {/* Snippet */}
      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
        {result.snippet}
      </p>
    </div>
  );
};
