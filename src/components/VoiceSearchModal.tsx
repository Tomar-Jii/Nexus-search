import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fallbackInput, setFallbackInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    // Check Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    let recognition: any = null;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);

        if (event.results[0].isFinal) {
          const finalQuery = event.results[0][0].transcript.trim();
          if (finalQuery) {
            setTimeout(() => {
              onResult(finalQuery);
            }, 600);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech initialization error:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }
    };
  }, [isOpen, onResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1A1D27] border border-white/10 p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Voice Search</h3>
        <p className="text-xs text-gray-400 mb-6">
          {speechSupported
            ? isListening
              ? 'Listening… Speak your query clearly'
              : 'Tap microphone or submit transcript below'
            : 'Microphone permission or browser speech synthesis unavailable. Enter query below:'}
        </p>

        {/* Audio Visualizer Waves */}
        <div className="relative my-8 flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_35px_rgba(59,130,246,0.6)] animate-pulse'
                : 'bg-white/10'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <MicOff className="w-10 h-10 text-gray-400" />
            )}
          </div>

          {/* Animated wave rings */}
          {isListening && (
            <>
              <div className="absolute w-32 h-32 rounded-full border border-blue-500/40 animate-ping" />
              <div className="absolute w-40 h-40 rounded-full border border-indigo-500/20 animate-pulse" />
            </>
          )}
        </div>

        {/* Transcript Output */}
        <div className="min-h-12 flex items-center justify-center px-4 py-2 rounded-xl bg-black/30 border border-white/5 mb-4">
          <p className="text-sm font-medium text-blue-200">
            {transcript || (isListening ? 'Listening for speech…' : 'Say something like "Gemini 3.8 Flash benchmarks"')}
          </p>
        </div>

        {/* Manual fallback input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (transcript || fallbackInput).trim();
            if (q) onResult(q);
          }}
          className="flex items-center gap-2 mt-4"
        >
          <input
            type="text"
            value={fallbackInput}
            onChange={(e) => setFallbackInput(e.target.value)}
            placeholder="Or type voice query manually…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};
