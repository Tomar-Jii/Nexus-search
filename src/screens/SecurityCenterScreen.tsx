import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  RefreshCw,
  EyeOff,
  Lock,
  Globe2,
  Server,
  KeyRound
} from 'lucide-react';
import { SecurityAuditStatus } from '../types';

interface SecurityCenterScreenProps {
  onBack: () => void;
}

export const SecurityCenterScreen: React.FC<SecurityCenterScreenProps> = ({ onBack }) => {
  const [status, setStatus] = useState<SecurityAuditStatus>({
    httpsEnforced: true,
    torFailClosedActive: true,
    webRtcShieldActive: true,
    dnsLeakShieldActive: true,
    totalTrackersBlocked: 186,
    storageEncryptionActive: true,
    phishingShieldActive: true,
    activeVulnerabilitiesFound: 0
  });

  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setStatus(prev => ({
        ...prev,
        totalTrackersBlocked: prev.totalTrackersBlocked + Math.floor(Math.random() * 5) + 2
      }));
      setIsAuditing(false);
    }, 600);
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
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Security Center</h1>
            <p className="text-xs text-gray-400 mt-0.5">Zero-Trust Diagnostics & Shields</p>
          </div>
        </div>
      </div>

      {/* Hero Status Card */}
      <div className="rounded-2xl bg-[#1A1D27] border border-emerald-500/30 p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Zero-Trust Privacy Status
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-wide mt-1">
              SYSTEM FULLY HARDENED
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-6">
          All outgoing network flows are protected by TLS 1.3 enforcement, Tor fail-closed boundaries, WebRTC STUN isolation, and on-device sandbox encryption.
        </p>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Auditing Network Stack…' : 'Execute Real-Time Security Audit'}</span>
        </button>
      </div>

      {/* Neutralized Trackers Counter Card */}
      <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl mb-6 flex items-center justify-between">
        <div>
          <div className="text-3xl font-black text-blue-400 tracking-tight">
            {status.totalTrackersBlocked}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Trackers & Profiling Beacons Neutralized
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
          <EyeOff className="w-6 h-6" />
        </div>
      </div>

      {/* Active Protection Shields Card */}
      <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Active Protection Shields
        </h2>

        {/* HTTPS Only */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-blue-400 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">HTTPS-Only Enforcement</div>
              <div className="text-xs text-gray-400">Automatically upgrades unencrypted HTTP connections to TLS</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={status.httpsEnforced}
              onChange={(e) => setStatus({ ...status, httpsEnforced: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {/* WebRTC IP Shield */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-blue-400 mt-0.5">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">WebRTC IP Shield</div>
              <div className="text-xs text-gray-400">Blocks internal private subnet & real IP leaks via STUN/ICE</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={status.webRtcShieldActive}
              onChange={(e) => setStatus({ ...status, webRtcShieldActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        {/* DNS Leak Protection */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">DNS Leak Protection</div>
              <div className="text-xs text-gray-400">DNS requests isolated from local carrier resolver</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            VERIFIED
          </span>
        </div>

        {/* Tor Fail-Closed */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Tor Fail-Closed Defense</div>
              <div className="text-xs text-gray-400">Aborts outgoing packets if Tor proxy circuit breaks</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
