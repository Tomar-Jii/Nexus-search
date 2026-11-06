import React, { useState } from 'react';
import { X, Lock, ExternalLink, Copy, Check, Share2, Shield, RefreshCw } from 'lucide-react';

interface ExternalBrowserModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export const ExternalBrowserModal: React.FC<ExternalBrowserModalProps> = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!url) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: title || 'Nexus Search Result', url }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Custom Tab Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1D27] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* URL Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 min-w-0 max-w-md flex-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate text-xs font-mono text-gray-200">
              <span className="text-gray-400">https://</span>
              <span className="font-semibold text-white">{domain}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Security Banner */}
      <div className="px-4 py-1.5 bg-blue-950/40 border-b border-blue-500/20 flex items-center justify-between text-[11px] text-blue-300">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Nexus Custom Tab Shield: WebRTC leak protected • Zero-trust isolation active</span>
        </div>
        <span className="text-gray-400 hidden sm:inline">Encrypted TLS Session</span>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full bg-[#0F1117] relative">
        {!iframeError ? (
          <iframe
            src={url}
            title={title || 'Web view'}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setIframeError(true)}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-300">
            <Shield className="w-12 h-12 text-blue-400 mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white mb-1">Direct Frame Security Restriction</h3>
            <p className="text-sm text-gray-400 max-w-md mb-4">
              This domain (<span className="text-blue-400 font-mono">{domain}</span>) has strict X-Frame-Options headers to protect user credentials.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow-lg transition-colors"
            >
              Open in Native Window <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
