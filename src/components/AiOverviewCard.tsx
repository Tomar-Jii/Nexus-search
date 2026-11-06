import React from 'react';
import { Sparkles, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { AiAnswer, AiStatus, SourceCitation } from '../types';

interface AiOverviewCardProps {
  aiAnswer: AiAnswer;
  onSourceClick: (citation: SourceCitation) => void;
}

export const AiOverviewCard: React.FC<AiOverviewCardProps> = ({ aiAnswer, onSourceClick }) => {
  if (aiAnswer.status === AiStatus.IDLE) return null;

  if (aiAnswer.status === AiStatus.LOADING || aiAnswer.status === AiStatus.STREAMING) {
    return (
      <div className="w-full rounded-2xl bg-[#1A1D27] border border-blue-500/30 p-5 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 animate-pulse" />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-400 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            Synthesizing AI Overview…
          </span>
        </div>
        <div className="space-y-2.5 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
          <div className="h-4 bg-white/10 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (aiAnswer.status === AiStatus.ERROR) {
    return (
      <div className="w-full rounded-2xl bg-[#1A1D27]/80 border border-red-500/30 p-4 mb-6 text-sm text-gray-300">
        <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>AI Overview Notice</span>
        </div>
        <p className="text-xs text-gray-400">{aiAnswer.errorMessage || 'Unable to generate synthesis for this query.'}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-[#1A1D27] border border-blue-500/30 p-5 shadow-xl relative overflow-hidden mb-6 hover:border-blue-500/50 transition-all duration-200">
      {/* Top Accent Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>AI Overview</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                Gemini 3.8 Flash
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Grounded in verified search citations</p>
          </div>
        </div>
      </div>

      {/* Synthesis Text */}
      <div className="text-sm text-gray-200 leading-relaxed space-y-3 mb-4 whitespace-pre-line">
        {aiAnswer.summaryText}
      </div>

      {/* Key Takeaways */}
      {aiAnswer.keyPoints && aiAnswer.keyPoints.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Key Takeaways
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {aiAnswer.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Citation Badges */}
      {aiAnswer.citations && aiAnswer.citations.length > 0 && (
        <div className="mt-5 pt-3 border-t border-white/5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Verified Grounding Sources
          </div>
          <div className="flex flex-wrap gap-2">
            {aiAnswer.citations.map((c) => (
              <button
                key={c.index}
                onClick={() => onSourceClick(c)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-xs text-gray-300 transition-all text-left group"
              >
                <span className="font-bold text-blue-400 group-hover:text-blue-300">[{c.index}]</span>
                <span className="truncate max-w-[140px] font-medium text-gray-200">{c.domain}</span>
                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-400 shrink-0 ml-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
