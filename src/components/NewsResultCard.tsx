import React from 'react';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';
import { SearchResult } from '../types';

interface NewsResultCardProps {
  result: SearchResult;
  onClick: () => void;
}

export const NewsResultCard: React.FC<NewsResultCardProps> = ({ result, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group w-full rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 p-5 cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <div className="p-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Newspaper className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold text-gray-200">{result.sourceName || result.domain}</span>
        {result.publishedDate && (
          <>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              {result.publishedDate}
            </span>
          </>
        )}
      </div>

      <h3 className="text-base md:text-lg font-semibold text-gray-100 group-hover:text-blue-300 transition-colors leading-snug mb-2 flex items-center gap-1.5">
        <span>{result.title}</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </h3>

      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
        {result.snippet}
      </p>
    </div>
  );
};
