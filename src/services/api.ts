import {
  SearchCategory,
  SearchResult,
  SourceCitation,
  AiAnswer,
  AssistantPersona,
  ResearchDepth,
  DeepResearchReport
} from '../types';

export class ApiService {
  static async search(query: string, category: SearchCategory): Promise<SearchResult[]> {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
      const data = await res.json();
      return data.results || [];
    } catch (e) {
      console.error('API search failed:', e);
      throw e;
    }
  }

  static async getSuggestions(query: string): Promise<{ query: string; isTrending?: boolean }[]> {
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.suggestions || [];
    } catch {
      return [];
    }
  }

  static async synthesizeOverview(query: string, sources: SourceCitation[]): Promise<AiAnswer> {
    try {
      const res = await fetch('/api/ai/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, sources })
      });
      if (!res.ok) throw new Error('Overview generation failed');
      return await res.json();
    } catch (e) {
      console.error('Synthesis error:', e);
      throw e;
    }
  }

  static async askAssistant(prompt: string, persona: AssistantPersona, history: any[] = []): Promise<string> {
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, persona, history })
      });
      if (!res.ok) throw new Error('Assistant communication failed');
      const data = await res.json();
      return data.response || 'No response generated.';
    } catch (e) {
      console.error('Assistant error:', e);
      throw e;
    }
  }

  static async runDeepResearch(topic: string, depth: ResearchDepth): Promise<DeepResearchReport> {
    try {
      const res = await fetch('/api/ai/deep-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, depth })
      });
      if (!res.ok) throw new Error('Deep research failed');
      return await res.json();
    } catch (e) {
      console.error('Deep research error:', e);
      throw e;
    }
  }
}
