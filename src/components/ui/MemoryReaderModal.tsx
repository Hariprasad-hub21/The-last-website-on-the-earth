import React, { useState } from 'react';
import { X, Volume2, BookOpen, Quote, Rotate3d, FileText } from 'lucide-react';
import { MemoryArtifact } from '../../types';
import { audioEngine } from '../../systems/audioEngine';
import { FloatingMemoryArchiveCards } from './FloatingMemoryArchiveCards';
import { Artifact3DViewer } from './Artifact3DViewer';

interface MemoryReaderModalProps {
  memory: MemoryArtifact | null;
  onClose: () => void;
  onOpen3DRotateModal?: (id: string) => void;
}

export const MemoryReaderModal: React.FC<MemoryReaderModalProps> = ({ memory, onClose, onOpen3DRotateModal }) => {
  const [activeTab, setActiveTab] = useState<'text' | '3d'>('text');

  if (!memory) return null;

  const handlePlaySound = () => {
    audioEngine.playMemoryChime(memory.audioToneFreq);
  };

  return (
    <div
      id="memory-reader-modal-overlay"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui"
    >
      <div
        id="memory-reader-modal-content"
        className="relative w-full max-w-2xl bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-[#8B7E66]/40 overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Dedicated Floating Archival Cards Layer */}
        <FloatingMemoryArchiveCards currentMemory={memory} />

        {/* Editorial Top Ribbon (Relative z-20 to ensure it is always on top) */}
        <div className="relative z-20 flex items-center justify-between pb-3 border-b border-[#1C1C1C]/15">
          <div className="flex items-center gap-2 text-[11px] font-ui tracking-[0.25em] text-[#8B7E66] uppercase">
            <BookOpen size={13} className="text-[#8B7E66]" />
            <span>ARCHIVAL FOLIO • {memory.code}</span>
            <span className="text-[#8B7E66]/40">•</span>
            <span className="font-semibold text-[#1C1C1C]">{memory.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Text vs 3D Rotate */}
            <div className="flex items-center p-0.5 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/30 text-[10px] font-mono">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                  activeTab === 'text'
                    ? 'bg-[#1C1C1C] text-[#F4F1EA] shadow-sm font-semibold'
                    : 'text-[#5C564C] hover:text-[#1C1C1C]'
                }`}
              >
                <FileText size={11} />
                <span>DOSSIER</span>
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                  activeTab === '3d'
                    ? 'bg-[#1C1C1C] text-[#F4F1EA] shadow-sm font-semibold'
                    : 'text-[#5C564C] hover:text-[#1C1C1C]'
                }`}
              >
                <Rotate3d size={11} className="text-[#8B7E66]" />
                <span>3D ROTATE</span>
              </button>
            </div>

            <button
              id="close-memory-reader-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8B7E66] hover:text-[#1C1C1C] hover:bg-[#EDE9E1] transition-colors focus:outline-none"
              aria-label="Close Archival Folio"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title and Metadata (Relative z-20 with max-w to prevent overlapping lateral floating chips) */}
        <div className="relative z-20 pt-4 pb-2 max-w-lg">
          <div className="text-xs font-mono tracking-wider text-[#8B7E66] uppercase mb-0.5">
            EPOCH CHRONOLOGY // {memory.date}
          </div>
          <h2
            id="memory-reader-title"
            className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1C1C] tracking-tight leading-snug"
          >
            {memory.title}
          </h2>
        </div>

        {/* Dynamic Content View */}
        {activeTab === '3d' ? (
          <div className="relative z-20 my-2 animate-fadeIn">
            <Artifact3DViewer
              memory={memory}
              onExpandFullscreen={onOpen3DRotateModal ? () => onOpen3DRotateModal(memory.id) : undefined}
            />
            <div className="p-3 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/30 text-xs text-[#3E3A34] leading-relaxed flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#1C1C1C]">3D Relic Telemetry:</span> Interactive spatial scan of {memory.code}. Drag with cursor or touch to rotate across all 3 axes.
              </div>
              {onOpen3DRotateModal && (
                <button
                  onClick={() => onOpen3DRotateModal(memory.id)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1C1C1C] text-[#F4F1EA] hover:bg-black text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Rotate3d size={12} className="text-[#8B7E66]" />
                  <span>EXPAND 3D</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Curated Editorial Quote Callout (Strictly isolated relative z-30 layer) */}
            <div
              id="memory-quote-container"
              className="relative z-30 my-3 p-4 sm:p-5 rounded-xl bg-[#EDE9E1] border-l-4 border-[#8B7E66] text-[#2D2A26] shadow-sm overflow-hidden"
            >
              <Quote size={20} className="text-[#8B7E66]/30 absolute top-4 right-4 pointer-events-none" />
              <p
                id="memory-quote-text"
                className="font-editorial italic text-base sm:text-lg leading-relaxed text-[#1C1C1C] relative z-10 pr-6"
              >
                "{memory.quote}"
              </p>
            </div>

            {/* Narrative Prose (Relative z-20) */}
            <div className="relative z-20 space-y-2 text-sm text-[#3E3A34] leading-relaxed">
              <p className="font-semibold text-[#1C1C1C] text-sm sm:text-base leading-snug">
                {memory.description}
              </p>
              <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#4A453E]">
                {memory.fullStory}
              </p>
            </div>
          </>
        )}

        {/* Bottom Relic Audio & Action Bar (Relative z-20) */}
        <div className="relative z-20 mt-6 pt-3 border-t border-[#1C1C1C]/15 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#8B7E66] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#8B7E66]" />
            <span>HARMONIC FREQUENCY: {memory.audioToneFreq.toFixed(1)} Hz</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="play-memory-chime-btn"
              onClick={handlePlaySound}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#8B7E66]/40 bg-[#EDE9E1] text-[#1C1C1C] font-semibold hover:bg-white text-xs tracking-wider transition-colors"
            >
              <Volume2 size={13} className="text-[#8B7E66]" />
              <span>PLAY CHIME</span>
            </button>

            <button
              id="return-to-archive-btn"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-semibold text-xs tracking-wider uppercase hover:bg-black transition-colors"
            >
              RETURN TO ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

