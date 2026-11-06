import React from 'react';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { SearchResult } from '../types';

interface VideoResultCardProps {
  result: SearchResult;
  onClick: () => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ result, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group w-full rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 overflow-hidden cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col md:flex-row gap-4 p-4"
    >
      {/* Thumbnail with Play Overlay & Duration */}
      <div className="relative w-full md:w-56 aspect-video bg-black/50 rounded-xl overflow-hidden shrink-0">
        {result.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
            <Play className="w-8 h-8" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>

        {result.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {result.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
            <span className="font-semibold text-blue-400">{result.sourceName || result.domain}</span>
            {result.publishedDate && (
              <>
                <span className="text-gray-600">•</span>
                <span>{result.publishedDate}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-semibold text-gray-100 group-hover:text-blue-300 transition-colors leading-snug mb-2 flex items-center gap-1.5">
            <span>{result.title}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {result.snippet}
          </p>
        </div>

        <div className="mt-2 text-[11px] text-gray-500 font-medium">
          Watch on {result.domain}
        </div>
      </div>
    </div>
  );
};
