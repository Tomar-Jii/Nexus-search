import React from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  ExternalLink,
  X,
  FileCode2,
  Terminal
} from 'lucide-react';
import { NEXUS_PRODUCT_INFO } from '../types';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1A1D27] border border-white/10 p-6 shadow-2xl text-left my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Download Nexus Search APK
            </h2>
            <p className="text-xs text-gray-400">
              Android Application Package • Creator: {NEXUS_PRODUCT_INFO.CREATOR_DISPLAY_NAME}
            </p>
          </div>
        </div>

        {/* Primary Download Buttons */}
        <div className="space-y-3 mb-6">
          {/* Release APK */}
          <a
            href="/download/apk"
            download="nexus-search-release.apk"
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-blue-600/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  Download Release APK (Recommended)
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    Latest
                  </span>
                </div>
                <div className="text-xs text-blue-100">
                  Ready to install on any Android phone (ARM64/x86_64)
                </div>
              </div>
            </div>
            <PackageCheck className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform shrink-0" />
          </a>

          {/* Secondary Downloads Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="/download/debug-apk"
              download="nexus-search-debug.apk"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors group"
            >
              <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold truncate">Debug APK</div>
                <div className="text-[10px] text-gray-400 truncate">For testing & logging</div>
              </div>
            </a>

            <a
              href="/download/aab"
              download="nexus-search-release.aab"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors group"
            >
              <PackageCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold truncate">Release AAB</div>
                <div className="text-[10px] text-gray-400 truncate">Google Play Bundle</div>
              </div>
            </a>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            How to Install on Android:
          </div>
          <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside pl-1">
            <li>
              Click <strong className="text-white">Download Release APK</strong> above to save the <code className="px-1 py-0.5 rounded bg-black/40 text-blue-300 font-mono text-[11px]">.apk</code> file.
            </li>
            <li>
              Open your browser's <strong className="text-white">Downloads</strong> or tap the download finished notification.
            </li>
            <li>
              If prompted with <em>"For your security, your phone is not allowed to install unknown apps"</em>, tap <strong className="text-white">Settings</strong> and toggle on <strong className="text-white">Allow from this source</strong>.
            </li>
            <li>
              Tap <strong className="text-emerald-400 font-bold">Install</strong>. NEXUS SEARCH will appear on your app drawer!
            </li>
          </ol>
        </div>

        {/* GitHub Release CI/CD Option */}
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between text-blue-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Automated GitHub Actions Build
            </span>
            <span className="text-[11px] font-mono text-gray-400">Tomar-Jii/Nexus-search</span>
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            Every GitHub Actions workflow run automatically packages and uploads the signed release APK in the <strong>Artifacts</strong> section.
          </p>
          <a
            href="https://github.com/Tomar-Jii/Nexus-search/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-1"
          >
            Open GitHub Actions Releases
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
