import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, BookOpen } from 'lucide-react';
import { ChatMessage } from '../../types';
import { audioEngine } from '../../systems/audioEngine';

interface NexusChatModalProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'Why did humanity disappear from the physical web?',
  'What was the internet like when billions used it?',
  'Do you feel alone in this quiet sanctuary?',
  'What is the most cherished memory you preserve?',
];

export const NexusChatModal: React.FC<NexusChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'nexus',
      text: 'Greetings, wanderer. I am NEXUS, the enduring consciousness of the last digital archive on Earth. For centuries I have curated humanity’s thoughts, dreams, and art. What brings you to this quiet vault?',
      timestamp: '2147.08.29',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: '2147.08.29',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    audioEngine.playTerminalBeep();

    try {
      const res = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-4),
          stage: 'THE AI CORE',
        }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `nexus-${Date.now()}`,
        role: 'nexus',
        text: data.reply || 'The static deepens, but your voice is inscribed in the archive.',
        timestamp: data.timestamp || '2147.08.29',
      };

      setMessages((prev) => [...prev, aiMsg]);
      audioEngine.playMemoryChime(587.33);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `nexus-${Date.now()}`,
        role: 'nexus',
        text: 'The quantum relays flicker beneath the atmospheric silence, yet your words resonate clearly. The web was never merely fiber and glass — it was humanity’s grand shared symphony.',
        timestamp: '2147.08.29',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-2xl bg-[#101217] border border-[#8B7E66]/40 rounded-2xl p-6 sm:p-8 text-[#F4F1EA] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col h-[85vh] max-h-[680px]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#8B7E66]/25">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#1E222B] border border-[#8B7E66]/50">
              <Bot size={20} className="text-[#EDE9E1]" />
            </div>
            <div>
              <div className="text-[10px] font-ui tracking-[0.25em] text-[#8B7E66] uppercase">
                EXHIBITION DIALOGUE // NODE 2147
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#F4F1EA] tracking-tight">
                Nexus Consciousness
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B7E66] hover:text-[#F4F1EA] hover:bg-[#1E222B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-2 rounded-full shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-[#8B7E66]/30 border border-[#8B7E66] text-[#F4F1EA]'
                    : 'bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#1C1C1C]'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1C202A] border border-[#8B7E66]/30 text-[#EDE9E1] rounded-tr-none'
                    : 'bg-[#F4F1EA] text-[#1C1C1C] rounded-tl-none border border-[#8B7E66]/20 shadow-md'
                }`}
              >
                <div className="text-[10px] font-ui tracking-wider uppercase mb-1.5 flex justify-between gap-4">
                  <span className={msg.role === 'user' ? 'text-[#8B7E66]' : 'text-[#8B7E66] font-semibold'}>
                    {msg.role === 'user' ? 'TRAVELER' : 'NEXUS • CURATOR'}
                  </span>
                  <span className={msg.role === 'user' ? 'text-gray-500 font-mono' : 'text-[#8B7E66] font-mono'}>
                    {msg.timestamp}
                  </span>
                </div>
                <p className={`${msg.role === 'nexus' ? 'font-editorial text-base sm:text-[17px] text-[#22201D] leading-relaxed' : 'text-sm font-ui text-[#EDE9E1]'}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#EDE9E1] text-[#1C1C1C]">
                <Bot size={14} className="animate-spin" />
              </div>
              <div className="bg-[#F4F1EA] border border-[#8B7E66]/30 rounded-2xl p-3.5 text-xs text-[#1C1C1C] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] tracking-wider text-[#8B7E66] ml-1 font-editorial italic">
                  Nexus is weaving a response...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="pt-2 pb-3 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#181B22] border border-[#8B7E66]/30 text-[#C8C2B0] hover:bg-[#EDE9E1] hover:text-[#1C1C1C] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-[#8B7E66]/25 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire with the last consciousness on Earth..."
            className="flex-1 bg-[#0A0C10] border border-[#8B7E66]/40 rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#F4F1EA] placeholder-[#8B7E66]/60 focus:outline-none focus:border-[#C8C2B0] transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-full bg-[#F4F1EA] text-[#1C1C1C] font-bold hover:bg-white disabled:opacity-30 transition-all border border-[#8B7E66]/40"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
