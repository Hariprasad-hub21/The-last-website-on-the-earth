import React, { useState } from 'react';
import { X, Sparkles, Send, Flame, Heart, Compass, Music, BookOpen, Feather } from 'lucide-react';
import { MonumentData } from '../../types';
import { audioEngine } from '../../systems/audioEngine';
import confetti from 'canvas-confetti';

interface FinalQuestionModalProps {
  onClose: () => void;
  onMonumentCreated: (monument: MonumentData) => void;
}

const INSPIRATION_WORDS = [
  { word: 'Curiosity', icon: Compass },
  { word: 'Love', icon: Heart },
  { word: 'Music', icon: Music },
  { word: 'Perseverance', icon: Flame },
  { word: 'Stories', icon: BookOpen },
  { word: 'Empathy', icon: Sparkles },
];

export const FinalQuestionModal: React.FC<FinalQuestionModalProps> = ({
  onClose,
  onMonumentCreated,
}) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || loading) return;

    setLoading(true);
    audioEngine.playMonumentChord();

    try {
      const res = await fetch('/api/nexus/monument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word.trim(),
          meaning: meaning.trim(),
        }),
      });
      const data = await res.json();

      const newMonument: MonumentData = {
        word: word.trim().toUpperCase(),
        meaning: meaning.trim(),
        author: author.trim() || 'Anonymous Traveler',
        timestamp: '2147.08.29',
        title: data.title || `MONUMENT OF ${word.toUpperCase()}`,
        inscription: data.inscription || `Carved into the eternal quartz memory core of Earth in 2147.`,
        nexusBenediction: data.nexusBenediction || 'Integrated into the final archive.',
      };

      // Save locally
      try {
        const stored = JSON.parse(localStorage.getItem('last_website_monuments') || '[]');
        localStorage.setItem('last_website_monuments', JSON.stringify([newMonument, ...stored]));
      } catch (e) {}

      // Trigger golden confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B7E66', '#C8C2B0', '#EDE9E1', '#1C1C1C'],
      });

      onMonumentCreated(newMonument);
      onClose();
    } catch (err) {
      // Fallback
      const newMonument: MonumentData = {
        word: word.trim().toUpperCase(),
        meaning: meaning.trim(),
        author: author.trim() || 'Anonymous Traveler',
        timestamp: '2147.08.29',
        title: `MONUMENT OF ${word.toUpperCase()}`,
        inscription: `Dedicated to the enduring light of human ${word}, preserved across centuries of silence.`,
        nexusBenediction: 'May this tribute shine across the silent dark.',
      };
      onMonumentCreated(newMonument);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-xl bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8B7E66]/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-[#8B7E66] hover:text-[#1C1C1C] hover:bg-[#EDE9E1] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Dialog Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#8B7E66] text-[11px] font-semibold tracking-[0.25em] uppercase">
            <Feather size={12} />
            <span>EPILOGUE // THE FINAL TESTAMENT</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[#1C1C1C] tracking-tight leading-snug">
            What should humanity be remembered for?
          </h2>
          <p className="text-xs sm:text-sm text-[#5C564C] italic max-w-md mx-auto leading-relaxed">
            "Countless thoughts have dissolved into the cosmic quiet. One enduring inscription remains to be carved into the stone."
          </p>
        </div>

        {/* Inspiration Chips */}
        <div className="mb-6">
          <div className="text-[11px] font-ui tracking-wider text-[#8B7E66] uppercase mb-2">
            CHOOSE AN ATTRIBUTE OR INSCRIBE YOUR OWN:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INSPIRATION_WORDS.map((item) => {
              const Icon = item.icon;
              const isSelected = word.toLowerCase() === item.word.toLowerCase();
              return (
                <button
                  key={item.word}
                  type="button"
                  onClick={() => {
                    audioEngine.playClick(850);
                    setWord(item.word);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#1C1C1C] text-[#F4F1EA] border-[#1C1C1C] shadow-md'
                      : 'bg-[#EDE9E1] border-[#8B7E66]/30 text-[#1C1C1C] hover:bg-white'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-[#EDE9E1]' : 'text-[#8B7E66]'} />
                  <span>{item.word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase mb-1">
              THE ENDURING VIRTUE (OR CONCEPT)
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. Curiosity, Empathy, Art, Wonder"
              maxLength={30}
              required
              className="w-full bg-white border border-[#8B7E66]/40 rounded-xl px-4 py-2.5 text-sm text-[#1C1C1C] placeholder-[#8B7E66]/60 focus:outline-none focus:border-[#1C1C1C] transition-colors font-editorial text-base tracking-wide"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#8B7E66] uppercase mb-1">
              DEDICATION / PROSE (OPTIONAL)
            </label>
            <input
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Why does this resonate across the centuries?"
              maxLength={120}
              className="w-full bg-white border border-[#8B7E66]/30 rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1C1C1C] placeholder-[#8B7E66]/60 focus:outline-none focus:border-[#1C1C1C] transition-colors"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="w-full py-3.5 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 flex items-center justify-center gap-2 border border-[#8B7E66]/40"
            >
              {loading ? (
                <span>INSCRIBING INTO THE QUARTZ CORE...</span>
              ) : (
                <>
                  <Sparkles size={15} className="text-[#EDE9E1]" />
                  <span>MATERIALIZE 3D MONUMENT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
