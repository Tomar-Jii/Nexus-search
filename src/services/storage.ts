import {
  SearchHistoryItem,
  BookmarkItem,
  NexusExtension,
  DeepResearchReport,
  PersonaMode,
  SafeSearch,
  SearchRegion,
  SearchCategory
} from '../types';
import { DEFAULT_EXTENSIONS } from '../data/curatedData';

const KEYS = {
  HISTORY: 'nexus_history',
  BOOKMARKS: 'nexus_bookmarks',
  INCOGNITO: 'nexus_incognito',
  PERSONA_MODE: 'nexus_persona_mode',
  SAFE_SEARCH: 'nexus_safe_search',
  REGION: 'nexus_region',
  AI_ENABLED: 'nexus_ai_enabled',
  EXTENSIONS: 'nexus_extensions',
  SAVED_REPORTS: 'nexus_saved_reports',
  THEME_DARK: 'nexus_theme_dark'
};

export class StorageService {
  // History
  static getHistory(): SearchHistoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addHistory(query: string, category: SearchCategory = SearchCategory.ALL): void {
    if (this.isIncognito()) return;
    const clean = query.trim();
    if (!clean) return;

    const list = this.getHistory().filter(h => h.query.toLowerCase() !== clean.toLowerCase());
    const newItem: SearchHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      query: clean,
      timestamp: Date.now(),
      category
    };
    const updated = [newItem, ...list].slice(0, 50);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  }

  static deleteHistoryItem(id: string): void {
    const list = this.getHistory().filter(h => h.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(list));
  }

  static deleteHistoryByQuery(query: string): void {
    const list = this.getHistory().filter(h => h.query.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(list));
  }

  static clearAllHistory(): void {
    localStorage.removeItem(KEYS.HISTORY);
  }

  // Bookmarks
  static getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleBookmark(item: {
    title: string;
    url: string;
    domain: string;
    snippet: string;
    category?: SearchCategory;
    imageUrl?: string | null;
    folder?: string;
  }): boolean {
    const bookmarks = this.getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.url === item.url);

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return false; // Removed
    } else {
      const newBm: BookmarkItem = {
        id: `bm_${Date.now()}`,
        title: item.title,
        url: item.url,
        domain: item.domain,
        snippet: item.snippet,
        category: item.category || SearchCategory.ALL,
        imageUrl: item.imageUrl,
        folder: item.folder || 'Reading List',
        savedAt: Date.now()
      };
      bookmarks.unshift(newBm);
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return true; // Added
    }
  }

  static deleteBookmark(url: string): void {
    const list = this.getBookmarks().filter(b => b.url !== url);
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(list));
  }

  static clearAllBookmarks(): void {
    localStorage.removeItem(KEYS.BOOKMARKS);
  }

  // Incognito
  static isIncognito(): boolean {
    return localStorage.getItem(KEYS.INCOGNITO) === 'true';
  }

  static setIncognito(enabled: boolean): void {
    localStorage.setItem(KEYS.INCOGNITO, enabled ? 'true' : 'false');
  }

  // AI Enabled
  static isAiEnabled(): boolean {
    const val = localStorage.getItem(KEYS.AI_ENABLED);
    return val !== 'false'; // default true
  }

  static setAiEnabled(enabled: boolean): void {
    localStorage.setItem(KEYS.AI_ENABLED, enabled ? 'true' : 'false');
  }

  // SafeSearch
  static getSafeSearch(): SafeSearch {
    return (localStorage.getItem(KEYS.SAFE_SEARCH) as SafeSearch) || SafeSearch.MODERATE;
  }

  static setSafeSearch(mode: SafeSearch): void {
    localStorage.setItem(KEYS.SAFE_SEARCH, mode);
  }

  // Region
  static getRegion(): SearchRegion {
    return (localStorage.getItem(KEYS.REGION) as SearchRegion) || SearchRegion.GLOBAL;
  }

  static setRegion(region: SearchRegion): void {
    localStorage.setItem(KEYS.REGION, region);
  }

  // Persona Mode
  static getPersonaMode(): PersonaMode {
    return (localStorage.getItem(KEYS.PERSONA_MODE) as PersonaMode) || PersonaMode.AUTO;
  }

  static setPersonaMode(mode: PersonaMode): void {
    localStorage.setItem(KEYS.PERSONA_MODE, mode);
  }

  // Extensions
  static getExtensions(): NexusExtension[] {
    try {
      const data = localStorage.getItem(KEYS.EXTENSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_EXTENSIONS;
  }

  static saveExtensions(exts: NexusExtension[]): void {
    localStorage.setItem(KEYS.EXTENSIONS, JSON.stringify(exts));
  }

  // Deep Research Saved Reports
  static getSavedReports(): DeepResearchReport[] {
    try {
      const data = localStorage.getItem(KEYS.SAVED_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveReport(report: DeepResearchReport): void {
    const list = this.getSavedReports().filter(r => r.id !== report.id);
    localStorage.setItem(KEYS.SAVED_REPORTS, JSON.stringify([report, ...list].slice(0, 30)));
  }

  static deleteReport(id: string): void {
    const list = this.getSavedReports().filter(r => r.id !== id);
    localStorage.setItem(KEYS.SAVED_REPORTS, JSON.stringify(list));
  }

  // Theme
  static isThemeDark(): boolean {
    const val = localStorage.getItem(KEYS.THEME_DARK);
    if (val === null) return true; // Default dark
    return val === 'true';
  }

  static setThemeDark(isDark: boolean): void {
    localStorage.setItem(KEYS.THEME_DARK, isDark ? 'true' : 'false');
  }

  // Clear everything
  static clearAllData(): void {
    this.clearAllHistory();
    this.clearAllBookmarks();
    localStorage.removeItem(KEYS.SAVED_REPORTS);
  }
}
