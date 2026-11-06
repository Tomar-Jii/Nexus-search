import React, { useState, useEffect } from 'react';
import {
  SearchCategory,
  AssistantPersona,
  PersonaMode,
  TorStatus,
  TorConnectionState,
  BrowserTab,
  BrowserTabMode
} from './types';
import { StorageService } from './services/storage';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { DeepResearchScreen } from './screens/DeepResearchScreen';
import { PrivateNetworkScreen } from './screens/PrivateNetworkScreen';
import { BrowserScreen } from './screens/BrowserScreen';
import { ExtensionsScreen } from './screens/ExtensionsScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { SecurityCenterScreen } from './screens/SecurityCenterScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [searchParams, setSearchParams] = useState<{ query: string; category: SearchCategory }>({
    query: '',
    category: SearchCategory.ALL
  });

  // Incognito State
  const [isIncognito, setIsIncognito] = useState(StorageService.isIncognito());

  // Persona State
  const [personaMode, setPersonaMode] = useState<PersonaMode>(StorageService.getPersonaMode());
  const isSystemDark = true; // Dark Onyx Theme
  const activePersona: AssistantPersona =
    personaMode === PersonaMode.FORCE_ANGEL
      ? AssistantPersona.ANGEL
      : personaMode === PersonaMode.FORCE_DEVIL
      ? AssistantPersona.DEVIL
      : isSystemDark
      ? AssistantPersona.DEVIL
      : AssistantPersona.ANGEL;

  // Tor Status Simulation
  const [torStatus, setTorStatus] = useState<TorStatus>({
    state: TorConnectionState.DISCONNECTED,
    bootstrapPercentage: 0,
    bootstrapStage: 'Tor client idle',
    circuitNodes: [],
    isFailClosedActive: true,
    dnsLeakProtected: true,
    bridgesEnabled: false
  });

  // Browser Tabs State
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab_init_1',
      url: 'https://duckduckgo.com',
      title: 'DuckDuckGo — Privacy Search',
      mode: BrowserTabMode.NORMAL,
      isLoading: false,
      progress: 100,
      canGoBack: false,
      canGoForward: false,
      isSecureHttps: true,
      certificateDomain: 'duckduckgo.com',
      isDesktopSite: false,
      isReaderMode: false,
      blockedTrackersCount: 3
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab_init_1');

  // Handle Tor Connection
  const handleConnectTor = (useBridges: boolean) => {
    setTorStatus(prev => ({
      ...prev,
      state: TorConnectionState.CONNECTING,
      bootstrapPercentage: 10,
      bootstrapStage: useBridges
        ? 'Initializing Pluggable Transports (Snowflake/obfs4)…'
        : 'Connecting to Tor Directory Authority…',
      bridgesEnabled: useBridges
    }));

    setTimeout(() => {
      setTorStatus(prev => ({
        ...prev,
        bootstrapPercentage: 35,
        bootstrapStage: 'Loading network consensus directory documents…'
      }));
    }, 400);

    setTimeout(() => {
      setTorStatus(prev => ({
        ...prev,
        bootstrapPercentage: 65,
        bootstrapStage: 'Negotiating encrypted TLS handshake with Guard relay…'
      }));
    }, 800);

    setTimeout(() => {
      setTorStatus(prev => ({
        ...prev,
        bootstrapPercentage: 90,
        bootstrapStage: 'Constructing 3-hop circuit (Guard -> Middle -> Exit)…'
      }));
    }, 1200);

    setTimeout(() => {
      const circuit = useBridges
        ? ['Snowflake Bridge [obfs4]', 'MiddleRelay_DE [84.115.x.x]', 'ExitRelay_CH [185.220.x.x]']
        : ['GuardRelay_IS [37.221.x.x]', 'MiddleRelay_FR [51.15.x.x]', 'ExitRelay_SE [194.26.x.x]'];

      setTorStatus(prev => ({
        ...prev,
        state: TorConnectionState.CONNECTED,
        bootstrapPercentage: 100,
        bootstrapStage: 'Circuits established and ready.',
        circuitNodes: circuit
      }));
    }, 1600);
  };

  const handleDisconnectTor = () => {
    setTorStatus(prev => ({
      ...prev,
      state: TorConnectionState.DISCONNECTED,
      bootstrapPercentage: 0,
      bootstrapStage: 'Disconnected from Tor.',
      circuitNodes: []
    }));
  };

  const handleRenewIdentity = () => {
    if (torStatus.state !== TorConnectionState.CONNECTED) return;
    setTorStatus(prev => ({
      ...prev,
      bootstrapStage: 'Sending NEWNYM signal: building fresh 3-hop circuit…'
    }));

    setTimeout(() => {
      const newCircuit = ['GuardRelay_NO [91.219.x.x]', 'MiddleRelay_NL [145.220.x.x]', 'ExitRelay_FI [95.216.x.x]'];
      setTorStatus(prev => ({
        ...prev,
        circuitNodes: newCircuit,
        bootstrapStage: 'Fresh circuit established. Newnym acknowledged.'
      }));
    }, 800);
  };

  // Browser Tab Actions
  const handleOpenNewTab = (url: string = 'https://duckduckgo.com', mode: BrowserTabMode = BrowserTabMode.NORMAL) => {
    const newId = `tab_${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      url,
      title: url.includes('.onion') ? 'Tor Onion Session' : 'New Tab',
      mode,
      isLoading: false,
      progress: 100,
      canGoBack: false,
      canGoForward: false,
      isSecureHttps: url.startsWith('https://'),
      isDesktopSite: false,
      isReaderMode: false,
      blockedTrackersCount: 2
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) {
      handleOpenNewTab();
    }
    const filtered = tabs.filter(t => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id && filtered.length > 0) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const handleNavigateTab = (input: string) => {
    const trimmed = input.trim();
    let finalUrl = trimmed;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      if (trimmed.includes('.onion')) {
        finalUrl = `http://${trimmed}`;
      } else if (trimmed.includes('.') && !trimmed.includes(' ')) {
        finalUrl = `https://${trimmed}`;
      } else {
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
      }
    }

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        let domain = 'Web view';
        try {
          domain = new URL(finalUrl).hostname;
        } catch {}

        return {
          ...t,
          url: finalUrl,
          title: domain,
          isSecureHttps: finalUrl.startsWith('https://'),
          blockedTrackersCount: t.blockedTrackersCount + Math.floor(Math.random() * 3) + 1
        };
      }
      return t;
    }));
  };

  const handleToggleReaderMode = (id: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, isReaderMode: !t.isReaderMode } : t));
  };

  const handleToggleDesktopSite = (id: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, isDesktopSite: !t.isDesktopSite } : t));
  };

  // Search Navigation
  const handleNavigateToResults = (query: string, category: SearchCategory) => {
    setSearchParams({ query, category });
    setCurrentRoute('results');
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex flex-col font-sans">
      {currentRoute === 'home' && (
        <HomeScreen
          onSearch={handleNavigateToResults}
          onNavigate={(route) => setCurrentRoute(route)}
          activePersona={activePersona}
          onPersonaClick={() => setCurrentRoute('assistant')}
          isIncognito={isIncognito}
        />
      )}

      {currentRoute === 'results' && (
        <ResultsScreen
          initialQuery={searchParams.query}
          initialCategory={searchParams.category}
          onBack={() => setCurrentRoute('home')}
        />
      )}

      {currentRoute === 'deep_research' && (
        <DeepResearchScreen
          onBack={() => setCurrentRoute('home')}
        />
      )}

      {currentRoute === 'private_network' && (
        <PrivateNetworkScreen
          onBack={() => setCurrentRoute('home')}
          torStatus={torStatus}
          onConnectTor={handleConnectTor}
          onDisconnectTor={handleDisconnectTor}
          onRenewIdentity={handleRenewIdentity}
          onOpenBrowserWithOnion={(onionUrl) => {
            handleOpenNewTab(onionUrl, BrowserTabMode.TOR);
            setCurrentRoute('browser');
          }}
        />
      )}

      {currentRoute === 'browser' && (
        <BrowserScreen
          onBack={() => setCurrentRoute('home')}
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={setActiveTabId}
          onOpenNewTab={handleOpenNewTab}
          onCloseTab={handleCloseTab}
          onNavigateTab={handleNavigateTab}
          onToggleReaderMode={handleToggleReaderMode}
          onToggleDesktopSite={handleToggleDesktopSite}
        />
      )}

      {currentRoute === 'extensions' && (
        <ExtensionsScreen
          onBack={() => setCurrentRoute('home')}
        />
      )}

      {currentRoute === 'assistant' && (
        <AssistantScreen
          onBack={() => setCurrentRoute('home')}
          activePersona={activePersona}
          personaMode={personaMode}
          onSetPersonaMode={(mode) => {
            setPersonaMode(mode);
            StorageService.setPersonaMode(mode);
          }}
        />
      )}

      {currentRoute === 'history' && (
        <HistoryScreen
          onBack={() => setCurrentRoute('home')}
          onSelectQuery={(q) => handleNavigateToResults(q, SearchCategory.ALL)}
          isIncognito={isIncognito}
          onToggleIncognito={(enabled) => {
            setIsIncognito(enabled);
            StorageService.setIncognito(enabled);
          }}
        />
      )}

      {currentRoute === 'bookmarks' && (
        <BookmarksScreen
          onBack={() => setCurrentRoute('home')}
        />
      )}

      {currentRoute === 'security_center' && (
        <SecurityCenterScreen
          onBack={() => setCurrentRoute('home')}
        />
      )}

      {currentRoute === 'settings' && (
        <SettingsScreen
          onBack={() => setCurrentRoute('home')}
          isIncognito={isIncognito}
          onToggleIncognito={(enabled) => {
            setIsIncognito(enabled);
            StorageService.setIncognito(enabled);
          }}
        />
      )}
    </div>
  );
}
