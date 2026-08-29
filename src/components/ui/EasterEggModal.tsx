import React from 'react';
import { X, Sparkles, Key, CheckCircle2, Bookmark } from 'lucide-react';
import { EasterEgg } from '../../types';
import { audioEngine } from '../../systems/audioEngine';

interface EasterEggModalProps {
  egg: EasterEgg | null;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ egg, onClose }) => {
  if (!egg) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-lg bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8B7E66]/40 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#EDE9E1] text-[#8B7E66] border border-[#8B7E66]/40">
              <Bookmark size={18} />
            </div>
            <div>
              <div className="text-[10px] font-ui tracking-[0.25em] text-[#8B7E66] font-semibold uppercase">
                CURATORIAL RELIC UNLOCKED
              </div>
              <h3 className="font-editorial text-xl font-normal text-[#1C1C1C]">
                {egg.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B7E66] hover:text-[#1C1C1C] hover:bg-[#EDE9E1] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Location Tag */}
        <div className="text-xs text-[#8B7E66] font-ui">
          ORIGIN LOCUS: <span className="text-[#1C1C1C] font-semibold">{egg.location}</span>
        </div>

        {/* Discovery Lore Text */}
        <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 text-xs sm:text-sm text-[#2C2822] italic leading-relaxed shadow-sm font-sans">
          "{egg.discoveryText}"
        </div>

        {/* Dismiss Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-md border border-[#8B7E66]/40"
          >
            INTEGRATE INTO FOLIO
          </button>
        </div>
      </div>
    </div>
  );
};
