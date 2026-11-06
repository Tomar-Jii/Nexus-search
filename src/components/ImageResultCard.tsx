import React from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { SearchResult } from '../types';

interface ImageResultCardProps {
  result: SearchResult;
  onClick: () => void;
}

export const ImageResultCard: React.FC<ImageResultCardProps> = ({ result, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 overflow-hidden cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        {result.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <ImageIcon className="w-10 h-10 opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-xs font-medium text-white flex items-center gap-1">
            Open full view <ExternalLink className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>

      <div className="p-3.5">
        <div className="text-[11px] font-semibold text-blue-400 truncate mb-1">
          {result.sourceName || result.domain}
        </div>
        <h4 className="text-xs font-medium text-gray-200 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
          {result.title}
        </h4>
      </div>
    </div>
  );
};
