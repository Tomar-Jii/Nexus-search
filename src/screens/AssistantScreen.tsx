import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Send,
  Trash2,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import {
  AssistantPersona,
  PERSONA_CONFIG,
  PersonaMode,
  ChatMessage
} from '../types';
import { ApiService } from '../services/api';

interface AssistantScreenProps {
  onBack: () => void;
  activePersona: AssistantPersona;
  personaMode: PersonaMode;
  onSetPersonaMode: (mode: PersonaMode) => void;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  onBack,
  activePersona,
  personaMode,
  onSetPersonaMode
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: activePersona === AssistantPersona.ANGEL
        ? 'Greetings. I am Nexus Angel AI. How may I assist your scientific or technical research today?'
        : 'Nexus Devil intelligence online. Direct, unfiltered insights ready. What are we decrypting today?',
      persona: activePersona,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persona = PERSONA_CONFIG[activePersona];
  const isAngel = activePersona === AssistantPersona.ANGEL;

  const quickPrompts = [
    'Who created NEXUS SEARCH?',
    'Explain how Tor fail-closed protection works',
    'Synthesize 2026 quantum error correction milestones',
    'How does Nexus isolate third-party cookies?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      persona: activePersona,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await ApiService.askAssistant(text, activePersona, messages);
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: response,
        persona: activePersona,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: 'System core connection timed out. Defensive sandbox remaining active.',
        persona: activePersona,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-4 h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                isAngel
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
              }`}
            >
              {isAngel ? <Sparkles className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">{persona.displayName}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{persona.subtitle}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Persona Mode Switcher Bar */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
          Persona:
        </span>
        {[
          { mode: PersonaMode.AUTO, label: 'Auto (Theme)' },
          { mode: PersonaMode.FORCE_ANGEL, label: 'Angel AI (Gold)' },
          { mode: PersonaMode.FORCE_DEVIL, label: 'Devil AI (Crimson)' }
        ].map((item) => {
          const isSelected = personaMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onSetPersonaMode(item.mode)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 pb-3 mb-3 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-[#1A1D27] hover:bg-white/10 border border-white/5 text-xs text-gray-300 hover:text-white transition-all whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : isAngel
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#1A1D27] border border-white/10 text-gray-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {!isUser && (
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    isAngel ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {PERSONA_CONFIG[msg.persona]?.displayName || persona.displayName}
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span>Synthesizing intelligence…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 pt-3 border-t border-white/10 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${persona.displayName} anything…`}
          className="flex-1 px-4 py-3 rounded-full bg-[#1A1D27] border border-white/10 focus:border-blue-500 text-sm text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white transition-colors shrink-0 shadow-md shadow-blue-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
