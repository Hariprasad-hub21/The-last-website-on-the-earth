import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { MovementKeys } from '../../hooks/useKeyboardControls';
import { audioEngine } from '../../systems/audioEngine';

interface MobileControlsOverlayProps {
  onMovementChange: (setter: (prev: MovementKeys) => MovementKeys) => void;
  onInteract: () => void;
}

export const MobileControlsOverlay: React.FC<MobileControlsOverlayProps> = ({
  onMovementChange,
  onInteract,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-end p-4 pb-20 sm:hidden select-none font-ui">
      <div className="flex items-end justify-between w-full">
        {/* D-Pad Virtual Movement */}
        <div className="pointer-events-auto grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-[#F4F1EA]/90 border border-[#8B7E66]/40 backdrop-blur-md shadow-lg">
          <div />
          <button
            onTouchStart={() => onMovementChange((m) => ({ ...m, forward: true }))}
            onTouchEnd={() => onMovementChange((m) => ({ ...m, forward: false }))}
            onMouseDown={() => onMovementChange((m) => ({ ...m, forward: true }))}
            onMouseUp={() => onMovementChange((m) => ({ ...m, forward: false }))}
            onMouseLeave={() => onMovementChange((m) => ({ ...m, forward: false }))}
            className="w-11 h-11 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/30 flex items-center justify-center text-[#1C1C1C] active:bg-[#1C1C1C] active:text-[#F4F1EA] transition-colors"
          >
            <ArrowUp size={18} />
          </button>
          <div />

          <button
            onTouchStart={() => onMovementChange((m) => ({ ...m, left: true }))}
            onTouchEnd={() => onMovementChange((m) => ({ ...m, left: false }))}
            onMouseDown={() => onMovementChange((m) => ({ ...m, left: true }))}
            onMouseUp={() => onMovementChange((m) => ({ ...m, left: false }))}
            onMouseLeave={() => onMovementChange((m) => ({ ...m, left: false }))}
            className="w-11 h-11 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/30 flex items-center justify-center text-[#1C1C1C] active:bg-[#1C1C1C] active:text-[#F4F1EA] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onTouchStart={() => onMovementChange((m) => ({ ...m, backward: true }))}
            onTouchEnd={() => onMovementChange((m) => ({ ...m, backward: false }))}
            onMouseDown={() => onMovementChange((m) => ({ ...m, backward: true }))}
            onMouseUp={() => onMovementChange((m) => ({ ...m, backward: false }))}
            onMouseLeave={() => onMovementChange((m) => ({ ...m, backward: false }))}
            className="w-11 h-11 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/30 flex items-center justify-center text-[#1C1C1C] active:bg-[#1C1C1C] active:text-[#F4F1EA] transition-colors"
          >
            <ArrowDown size={18} />
          </button>
          <button
            onTouchStart={() => onMovementChange((m) => ({ ...m, right: true }))}
            onTouchEnd={() => onMovementChange((m) => ({ ...m, right: false }))}
            onMouseDown={() => onMovementChange((m) => ({ ...m, right: true }))}
            onMouseUp={() => onMovementChange((m) => ({ ...m, right: false }))}
            onMouseLeave={() => onMovementChange((m) => ({ ...m, right: false }))}
            className="w-11 h-11 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/30 flex items-center justify-center text-[#1C1C1C] active:bg-[#1C1C1C] active:text-[#F4F1EA] transition-colors"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Touch Action / Interact Button */}
        <button
          onClick={() => {
            audioEngine.playClick();
            onInteract();
          }}
          className="pointer-events-auto w-16 h-16 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-semibold text-[11px] tracking-wider flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform border border-[#8B7E66]/40"
        >
          <Sparkles size={18} className="text-[#EDE9E1]" />
          <span>INSPECT</span>
        </button>
      </div>
    </div>
  );
};
