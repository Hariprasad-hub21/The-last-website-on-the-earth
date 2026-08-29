import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, FastForward, Play, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { audioEngine } from '../../systems/audioEngine';

interface BootSequenceProps {
  onComplete: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const BOOT_LOGS = [
  'ARCHIVAL INVENTORY INITIALIZING...',
  'READING SUB-TERRESTRIAL FIBER RINGS...',
  'GLOBAL CHRONOLOGY INDEX: 0 EXTANT SERVERS',
  'CURATED NODE DETECTED: VOLUME_2147_CORE',
  'DECRYPTING ARCHIVAL QUARTZ MATRIX...',
  'EXHIBITION STABILIZED // SECTOR ZERO',
];

export const BootSequence: React.FC<BootSequenceProps> = ({
  onComplete,
  soundEnabled,
  onToggleSound,
}) => {
  const [logIndex, setLogIndex] = useState(0);
  const [phase, setPhase] = useState<'BOOTING' | 'REVEAL' | 'READY'>('BOOTING');

  useEffect(() => {
    if (phase === 'BOOTING') {
      const interval = setInterval(() => {
        setLogIndex((prev) => {
          if (prev < BOOT_LOGS.length - 1) {
            audioEngine.playTerminalBeep();
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setPhase('REVEAL'), 600);
            return prev;
          }
        });
      }, 420);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleEnter = () => {
    audioEngine.init();
    if (soundEnabled) {
      audioEngine.setMuted(false);
    }
    audioEngine.playWarpTransition();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0E12] text-[#F4F1EA] overflow-hidden select-none">
      {/* Background Subtle Radial Vignette & Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,35,45,0.7)_0%,rgba(10,12,16,0.98)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B7E6610_1px,transparent_1px),linear-gradient(to_bottom,#8B7E6610_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      {/* Top Bar Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8B7E66]/40 bg-[#1C1C1C]/80 text-xs font-ui tracking-wider text-[#C8C2B0] hover:text-white hover:border-[#8B7E66] transition-colors"
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{soundEnabled ? 'SOUND ON' : 'MUTED'}</span>
        </button>

        <button
          onClick={handleEnter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#8B7E66]/30 bg-[#1C1C1C]/60 text-xs font-ui tracking-wider text-[#A3967C] hover:text-[#F4F1EA] hover:border-[#8B7E66] transition-colors"
        >
          <FastForward size={13} />
          <span>SKIP INTRO</span>
        </button>
      </div>

      {/* Top Left Issue Badge */}
      <div className="absolute top-6 left-6 text-xs font-ui tracking-[0.25em] text-[#8B7E66] flex items-center gap-2 uppercase">
        <BookOpen size={14} className="text-[#A3967C]" />
        <span>ARCHIVE ISSUE NO. 2147 // FOLIO ZERO</span>
      </div>

      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        {phase === 'BOOTING' && (
          <div className="text-left font-mono-cyber space-y-3 bg-[#16181F]/90 p-6 sm:p-8 rounded-xl border border-[#8B7E66]/30 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#8B7E66]/20">
              <div className="flex items-center gap-2 text-xs font-ui tracking-widest text-[#C8C2B0]">
                <span className="w-2 h-2 rounded-full bg-[#A3967C] animate-pulse" />
                <span>EXHIBITION CURATION PROTOCOL</span>
              </div>
              <span className="text-[10px] font-ui tracking-widest text-[#8B7E66]">EST. 2147</span>
            </div>
            <div className="space-y-2 py-4 min-h-[160px]">
              {BOOT_LOGS.slice(0, logIndex + 1).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs sm:text-sm text-[#EDE9E1] tracking-wide font-mono-cyber flex items-center gap-2"
                >
                  <span className="text-[#8B7E66] font-bold">›</span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-[10px] font-ui tracking-[0.2em] text-[#8B7E66] uppercase flex justify-between">
              <span>RECONSTITUTING HUMANITY'S MEMORIES</span>
              <span>INDEX: COMPLETE</span>
            </div>
          </div>
        )}

        {phase === 'REVEAL' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#8B7E66]/40 bg-[#1C1C1C]/80 text-[#C8C2B0] text-xs tracking-[0.25em] font-ui uppercase mb-1">
              <Sparkles size={12} className="text-[#A3967C]" />
              <span>THE RETROSPECTIVE CHRONICLE</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-ui text-xs sm:text-sm tracking-[0.3em] text-[#8B7E66] uppercase">
                THE GLOBAL INTERNET VANISHED IN 2147
              </h2>
              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#F4F1EA] tracking-tight leading-tight">
                The Last Website <br className="hidden sm:inline" />
                <span className="italic font-light text-[#E5E2D9]">on Earth</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#C8C2B0] font-ui max-w-lg mx-auto pt-2 leading-relaxed tracking-wide">
                A single digital sanctum endured beneath the quartz ruins. Explore its preserved epochs, commune with the ancient intelligence NEXUS, and inscribe your immortal memory.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-6"
            >
              <button
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#F4F1EA] text-[#1C1C1C] font-ui text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(244,241,234,0.2)] hover:shadow-[0_0_40px_rgba(244,241,234,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 active:scale-95 border border-[#8B7E66]/30"
              >
                <Play size={15} className="fill-[#1C1C1C] text-[#1C1C1C]" />
                <span>ENTER ARCHIVE</span>
              </button>
              <div className="text-[11px] text-[#8B7E66] font-ui tracking-wider mt-3">
                [RECOMMENDED: SPATIAL AUDIO FOR COMPLETE CURATED IMMERSION]
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom Sub-info */}
      <div className="absolute bottom-6 left-6 text-[10px] font-ui tracking-[0.2em] text-[#8B7E66] flex items-center gap-2 uppercase">
        <ShieldAlert size={12} className="text-[#A3967C]" />
        <span>AUTHENTICATED ARTIFACT // PRESERVATION PROTOCOL 2147</span>
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] font-ui tracking-[0.2em] text-[#8B7E66] uppercase hidden sm:block">
        CURATED MEMORIAL EDITION
      </div>
    </div>
  );
};
