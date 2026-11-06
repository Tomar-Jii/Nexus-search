import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Blocks,
  Shield,
  ShieldAlert,
  Check,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { NexusExtension, ExtensionCategory } from '../types';
import { StorageService } from '../services/storage';

interface ExtensionsScreenProps {
  onBack: () => void;
}

export const ExtensionsScreen: React.FC<ExtensionsScreenProps> = ({ onBack }) => {
  const [extensions, setExtensions] = useState<NexusExtension[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'installed'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory | 'ALL'>('ALL');
  const [pendingInstallExt, setPendingInstallExt] = useState<NexusExtension | null>(null);

  useEffect(() => {
    setExtensions(StorageService.getExtensions());
  }, []);

  const saveUpdatedExtensions = (updated: NexusExtension[]) => {
    setExtensions(updated);
    StorageService.saveExtensions(updated);
  };

  const handleInstall = (extId: string) => {
    const updated = extensions.map(e => e.id === extId ? { ...e, isInstalled: true, isEnabled: true } : e);
    saveUpdatedExtensions(updated);
    setPendingInstallExt(null);
  };

  const handleToggle = (extId: string, isEnabled: boolean) => {
    const updated = extensions.map(e => e.id === extId ? { ...e, isEnabled } : e);
    saveUpdatedExtensions(updated);
  };

  const handleUninstall = (extId: string) => {
    const updated = extensions.map(e => e.id === extId ? { ...e, isInstalled: false, isEnabled: false } : e);
    saveUpdatedExtensions(updated);
  };

  const installedCount = extensions.filter(e => e.isInstalled).length;

  const displayedExtensions = extensions.filter(e => {
    if (activeTab === 'installed' && !e.isInstalled) return false;
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
    return true;
  });

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
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Blocks className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Nexus Extensions</h1>
            <p className="text-xs text-gray-400 mt-0.5">Sandboxed WebExtension Add-Ons</p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Store Catalog ({extensions.length})
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'installed'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Installed ({installedCount})
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 pb-3 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {Object.values(ExtensionCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Extension Cards Grid */}
      <div className="space-y-3 flex-1">
        {displayedExtensions.map((ext) => (
          <div
            key={ext.id}
            className="rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-blue-500/30 p-5 shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{ext.name}</span>
                    <span className="text-[11px] font-normal text-gray-400">v{ext.version}</span>
                  </h3>
                  <div className="text-xs text-blue-400 font-medium">by {ext.author}</div>
                </div>
              </div>

              {/* Install / Toggle Switch */}
              {ext.isInstalled ? (
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={ext.isEnabled}
                    onChange={(e) => handleToggle(ext.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              ) : (
                <button
                  onClick={() => setPendingInstallExt(ext)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20 shrink-0"
                >
                  Install
                </button>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {ext.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {ext.category}
              </span>

              {ext.isInstalled && (
                <button
                  onClick={() => handleUninstall(ext.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Review Modal before Install */}
      {pendingInstallExt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#1A1D27] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add "{pendingInstallExt.name}"?</h3>
                <p className="text-xs text-gray-400">Review required sandbox permissions</p>
              </div>
            </div>

            <div className="space-y-2.5 my-5">
              {pendingInstallExt.permissions.map((perm) => (
                <div key={perm.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                  {perm.isDangerous ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-white">{perm.name}</div>
                    <div className="text-[11px] text-gray-400 leading-tight mt-0.5">{perm.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setPendingInstallExt(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInstall(pendingInstallExt.id)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
              >
                Grant & Add Extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
