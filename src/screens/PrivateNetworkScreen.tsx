import React, { useState } from 'react';
import {
  ArrowLeft,
  KeyRound,
  Lock,
  Power,
  RefreshCw,
  Shield,
  Route,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { TorStatus, TorConnectionState } from '../types';

interface PrivateNetworkScreenProps {
  onBack: () => void;
  torStatus: TorStatus;
  onConnectTor: (useBridges: boolean) => void;
  onDisconnectTor: () => void;
  onRenewIdentity: () => void;
  onOpenBrowserWithOnion: (onionUrl: string) => void;
}

export const PrivateNetworkScreen: React.FC<PrivateNetworkScreenProps> = ({
  onBack,
  torStatus,
  onConnectTor,
  onDisconnectTor,
  onRenewIdentity,
  onOpenBrowserWithOnion
}) => {
  const [useBridges, setUseBridges] = useState(torStatus.bridgesEnabled);

  const onionBookmarks = [
    { name: 'DuckDuckGo Onion', url: 'http://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion' },
    { name: 'Tor Project Repository', url: 'http://2gzyxa5ihm7nsggfxnu52r24pvxamunkg2njstkuwmrqlx2h7geysoyd.onion' },
    { name: 'Proton Mail Onion', url: 'http://protonmailrmez3lotccipshtkleegetsolb7fhuydq25qslzy2wphqid.onion' }
  ];

  const isConnected = torStatus.state === TorConnectionState.CONNECTED;
  const isConnecting = torStatus.state === TorConnectionState.CONNECTING;

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
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Tor Private Network</h1>
            <p className="text-xs text-gray-400 mt-0.5">SOCKS5 Fail-Closed Onion Routing</p>
          </div>
        </div>
      </div>

      {/* Main Connection Status Hero Card */}
      <div className={`rounded-2xl bg-[#1A1D27] border p-6 shadow-xl mb-6 transition-all ${
        isConnected
          ? 'border-emerald-500/40 shadow-emerald-500/10'
          : isConnecting
          ? 'border-amber-500/40 shadow-amber-500/10'
          : 'border-white/10'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Tor Connection State
            </div>
            <div className={`text-2xl font-bold mt-1 ${
              isConnected
                ? 'text-emerald-400'
                : isConnecting
                ? 'text-amber-400'
                : 'text-white'
            }`}>
              {isConnected
                ? 'Connected to Tor'
                : isConnecting
                ? 'Establishing Circuit…'
                : 'Disconnected'}
            </div>
          </div>

          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isConnected
              ? 'bg-emerald-500/15 text-emerald-400'
              : isConnecting
              ? 'bg-amber-500/15 text-amber-400 animate-pulse'
              : 'bg-white/5 text-gray-400'
          }`}>
            {isConnected ? <Lock className="w-6 h-6" /> : <Power className="w-6 h-6" />}
          </div>
        </div>

        {/* Progress bar during connection */}
        {isConnecting && (
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${torStatus.bootstrapPercentage}%` }}
            />
          </div>
        )}

        <p className="text-xs text-gray-400 font-mono mb-6">
          {torStatus.bootstrapStage}
        </p>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <button
                onClick={onDisconnectTor}
                className="flex-1 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-md shadow-red-600/20"
              >
                Disconnect Tor
              </button>
              <button
                onClick={onRenewIdentity}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-colors"
                title="Send NEWNYM signal to construct new 3-hop circuit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Identity</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onConnectTor(useBridges)}
              disabled={isConnecting}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isConnecting ? 'Building Onion Circuit…' : 'Connect to Tor Network'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Hop Circuit Visualizer */}
      {torStatus.circuitNodes && torStatus.circuitNodes.length > 0 && (
        <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Active 3-Hop Tor Circuit</h3>
          </div>

          <div className="space-y-3">
            {torStatus.circuitNodes.map((node, idx) => {
              const label = idx === 0 ? 'Entry / Guard Relay' : idx === 1 ? 'Middle Relay' : 'Exit Relay';
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">{label}</div>
                    <div className="text-xs text-gray-200 font-mono mt-0.5">{node}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fail-Closed & Bridges Card */}
      <div className="rounded-2xl bg-[#1A1D27] border border-white/10 p-5 shadow-xl mb-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Fail-Closed Protection</div>
              <div className="text-xs text-gray-400">Strictly blocks all clearnet leaks if Tor circuit disconnects</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            STRICT ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-sm font-bold text-white">Pluggable Transports / Bridges</div>
            <div className="text-xs text-gray-400">Bypass Tor censorship using Snowflake & obfs4</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useBridges}
              onChange={(e) => setUseBridges(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>
      </div>

      {/* Verified .onion Quick Launchers */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Verified .onion Destinations
        </h2>
        <div className="space-y-2.5">
          {onionBookmarks.map((item) => (
            <div
              key={item.url}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1D27] border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="truncate mr-3">
                <div className="text-sm font-semibold text-gray-200">{item.name}</div>
                <div className="text-[11px] text-purple-300 font-mono truncate">{item.url}</div>
              </div>
              <button
                onClick={() => onOpenBrowserWithOnion(item.url)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Open in Tab
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Disclosure Notice */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Tor onion routing anonymizes traffic across 3 encrypted nodes. However, logging into personal clearnet accounts, downloading executables, or enabling unverified browser extensions can compromise anonymity. Nexus maintains isolated cookie partitions and WebRTC STUN suppression.
        </p>
      </div>
    </div>
  );
};
