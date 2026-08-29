import React from 'react';
import { Camera, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { audioEngine } from '../../systems/audioEngine';

interface PresentationModeOverlayProps {
  activeShot: number | null;
  onSelectShot: (shotNumber: number) => void;
  onExit: () => void;
}

const PRESET_SHOTS = [
  { id: 1, name: 'Shot 01: Vault' },
  { id: 2, name: 'Shot 02: Archive' },
  { id: 3, name: 'Shot 03: Lost City' },
  { id: 4, name: 'Shot 04: The Void' },
  { id: 5, name: 'Shot 05: AI Core' },
];

export const PresentationModeOverlay: React.FC<PresentationModeOverlayProps> = ({
  activeShot,
  onSelectShot,
  onExit,
}) => {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 select-none font-ui">
      {/* Top Bar with Camera Presets */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-[#F4F1EA]/95 border border-[#8B7E66]/40 px-4 py-2 rounded-full backdrop-blur-md shadow-xl text-[#1C1C1C]">
          <Camera size={15} className="text-[#8B7E66]" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Curatorial Gallery View
          </span>
          <span className="text-[10px] text-[#8B7E66] bg-[#EDE9E1] px-2 py-0.5 rounded-full border border-[#8B7E66]/30 font-medium">
            FRAMELESS
          </span>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => {
            audioEngine.playClick();
            onExit();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F1EA]/95 border border-[#8B7E66]/40 text-[#1C1C1C] hover:bg-white backdrop-blur-md text-xs font-bold transition-all shadow-xl tracking-wider uppercase"
        >
          <X size={14} className="text-[#8B7E66]" />
          <span>EXIT VIEW [ESC]</span>
        </button>
      </div>

      {/* Bottom Preset Switcher Pills */}
      <div className="self-center pointer-events-auto flex items-center gap-1.5 bg-[#F4F1EA]/95 border border-[#8B7E66]/40 p-1.5 rounded-full backdrop-blur-xl shadow-2xl">
        <div className="text-[10px] text-[#8B7E66] px-3 font-semibold tracking-wider uppercase hidden sm:block">
          PERSPECTIVE:
        </div>
        {PRESET_SHOTS.map((shot) => (
          <button
            key={shot.id}
            onClick={() => {
              audioEngine.playClick(750);
              onSelectShot(shot.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeShot === shot.id
                ? 'bg-[#1C1C1C] text-[#F4F1EA] shadow-md'
                : 'text-[#5C564C] hover:text-[#1C1C1C] hover:bg-[#EDE9E1]'
            }`}
          >
            {shot.name}
          </button>
        ))}
      </div>
    </div>
  );
};
