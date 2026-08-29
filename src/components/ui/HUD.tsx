import React from 'react';
import {
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  Compass,
  Camera,
  Play,
  Pause,
  Info,
  Sparkles,
  BookOpen,
  Layers,
  Rotate3d
} from 'lucide-react';
import { StageId, StageInfo } from '../../types';
import { STAGE_ORDER, STAGES } from '../../data/stages';
import { audioEngine } from '../../systems/audioEngine';

interface HUDProps {
  currentStage: StageInfo;
  onSelectStage: (id: StageId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenProjectInfo: () => void;
  onOpen3DRotateView: () => void;
  onTogglePresentation: () => void;
  isGuidedTour: boolean;
  onToggleGuidedTour: () => void;
  discoveredCount: number;
  totalMemories: number;
  easterEggsCount: number;
  interactionPrompt: string | null;
  onTriggerInteraction: () => void;
  onOpenFinalQuestion: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentStage,
  onSelectStage,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenProjectInfo,
  onOpen3DRotateView,
  onTogglePresentation,
  isGuidedTour,
  onToggleGuidedTour,
  discoveredCount,
  totalMemories,
  easterEggsCount,
  interactionPrompt,
  onTriggerInteraction,
  onOpenFinalQuestion,
}) => {
  const stageIndex = STAGE_ORDER.indexOf(currentStage.id) + 1;
  const stageIndexPadded = stageIndex.toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-ui">
      {/* Top Bar Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-Left: Curated Archival Status Card */}
        <div className="pointer-events-auto bg-[#101217]/90 border border-[#8B7E66]/35 rounded-xl p-3.5 sm:p-4 backdrop-blur-md shadow-2xl text-xs space-y-2 max-w-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#8B7E66]/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A3967C] animate-pulse" />
              <span className="font-ui font-semibold tracking-[0.2em] text-[#EDE9E1] text-[11px] uppercase">
                ISSUE 2147 • ARCHIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8B7E66]">{stageIndexPadded}/{STAGE_ORDER.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-[#A3967C] tracking-wide flex justify-between gap-4">
              <span>SECTION:</span>
              <span className="text-[#F4F1EA] font-editorial text-sm tracking-normal font-semibold truncate">
                {currentStage.title}
              </span>
            </div>
            <div className="text-[11px] text-[#A3967C] tracking-wide flex justify-between gap-4">
              <span>EPOCH / YEAR:</span>
              <span className="text-[#EDE9E1] font-mono font-medium">{currentStage.year}</span>
            </div>
          </div>

          <div className="text-[10px] text-[#8B7E66] pt-1 border-t border-[#8B7E66]/15 flex justify-between font-mono tracking-wider">
            <span>MEMORIES: {discoveredCount}/{totalMemories}</span>
            <span>CURIOS: {easterEggsCount}/5</span>
          </div>
        </div>

        {/* Top-Right: Quick Stage Navigation & Action Buttons */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          {/* Stage Quick Switcher Pills (Curated Editorial Indices) */}
          <div className="hidden md:flex items-center gap-1 bg-[#101217]/90 border border-[#8B7E66]/30 p-1.5 rounded-xl backdrop-blur-md shadow-xl">
            {STAGE_ORDER.map((stageId, idx) => {
              const info = STAGES[stageId];
              const isActive = currentStage.id === stageId;
              const num = (idx + 1).toString().padStart(2, '0');
              return (
                <button
                  key={stageId}
                  onClick={() => {
                    audioEngine.playClick(700);
                    onSelectStage(stageId);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#F4F1EA] text-[#1C1C1C] font-bold shadow-[0_0_15px_rgba(244,241,234,0.25)]'
                      : 'text-[#C8C2B0] hover:text-[#F4F1EA] hover:bg-[#1E222B]/80 font-medium'
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-[#8B7E66]' : 'text-[#8B7E66]'}`}>{num}</span>
                  <span>{info.title.replace('THE ', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Controls Row */}
          <div className="flex items-center gap-2">
            {/* Guided Demo Tour */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleGuidedTour();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs tracking-wider font-semibold backdrop-blur-md transition-all ${
                isGuidedTour
                  ? 'bg-[#8B7E66]/30 border-[#C8C2B0] text-[#F4F1EA] animate-pulse'
                  : 'bg-[#101217]/90 border-[#8B7E66]/30 text-[#EDE9E1] hover:bg-[#1E222B]/80 hover:border-[#8B7E66]'
              }`}
              title="Cinematic Archival Showcase"
            >
              {isGuidedTour ? <Pause size={13} /> : <Play size={13} />}
              <span className="hidden sm:inline">
                {isGuidedTour ? 'PAUSE TOUR' : 'GUIDED TOUR'}
              </span>
            </button>

            {/* Interactive 3D Rotate View Button */}
            <button
              onClick={() => {
                audioEngine.playClick(750);
                onOpen3DRotateView();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101217]/90 border border-[#8B7E66]/50 text-[#F4F1EA] hover:bg-[#8B7E66]/20 hover:border-[#8B7E66] backdrop-blur-md text-xs tracking-wider font-semibold shadow-lg transition-all"
              title="Open Interactive 3D Rotate View (Inspect Relics & Monuments)"
            >
              <Rotate3d size={14} className="text-[#8B7E66] animate-spin" style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline">3D ROTATE VIEW</span>
            </button>

            {/* Presentation Mode (Shift+P) */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onTogglePresentation();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101217]/90 border border-[#8B7E66]/30 text-[#EDE9E1] hover:bg-[#1E222B]/80 hover:border-[#8B7E66] backdrop-blur-md text-xs tracking-wider transition-colors"
              title="Editorial Focus / Clean Mode (Shift + P)"
            >
              <Camera size={14} />
              <span className="hidden sm:inline font-semibold">VIEW</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-[#101217]/90 border border-[#8B7E66]/30 text-[#EDE9E1] hover:bg-[#1E222B]/80 hover:border-[#8B7E66] backdrop-blur-md text-xs transition-colors"
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-xl bg-[#101217]/90 border border-[#8B7E66]/30 text-[#EDE9E1] hover:bg-[#1E222B]/80 hover:border-[#8B7E66] backdrop-blur-md text-xs transition-colors"
              title="Exhibition Display Settings"
            >
              <SettingsIcon size={15} />
            </button>

            {/* Project / Hackathon Submission Info */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenProjectInfo();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EDE9E1] text-[#1C1C1C] border border-[#8B7E66]/40 hover:bg-white backdrop-blur-md text-xs font-bold tracking-wider shadow-md transition-all"
              title="Curator Notes & Technical Dossier"
            >
              <Info size={13} />
              <span className="hidden sm:inline">DOSSIER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Proximity Interaction Banner / Prompt */}
      {interactionPrompt && (
        <div className="self-center pointer-events-auto">
          <button
            onClick={() => {
              audioEngine.playClick();
              onTriggerInteraction();
            }}
            className="group px-6 py-3 rounded-full bg-[#101217]/95 border border-[#8B7E66] text-[#F4F1EA] text-sm tracking-wider font-medium backdrop-blur-xl shadow-[0_0_30px_rgba(139,126,102,0.4)] hover:scale-105 transition-all duration-200 flex items-center gap-3 animate-bounce"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#EDE9E1] animate-ping" />
            <span className="font-editorial italic text-base">{interactionPrompt}</span>
            <span className="text-xs text-[#1C1C1C] bg-[#EDE9E1] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-tight">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* Bottom Bar Footer */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: Keyboard Guidance */}
        <div className="pointer-events-auto bg-[#101217]/90 border border-[#8B7E66]/30 rounded-xl p-3 backdrop-blur-md text-[11px] text-[#A3967C] space-y-1 hidden sm:block">
          <div className="text-[#EDE9E1] font-semibold tracking-[0.2em] mb-1 flex items-center gap-1.5 text-[10px] uppercase">
            <Compass size={12} className="text-[#8B7E66]" />
            <span>EXHIBITION NAVIGATION</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px]">
            <span><strong className="text-[#F4F1EA]">[W A S D]</strong> Move</span>
            <span><strong className="text-[#F4F1EA]">[SHIFT]</strong> Glide</span>
            <span><strong className="text-[#F4F1EA]">[E]</strong> Inspect</span>
            <span><strong className="text-[#F4F1EA]">[R]</strong> 3D Rotate</span>
            <span><strong className="text-[#F4F1EA]">[SHIFT+P]</strong> View</span>
          </div>
        </div>

        {/* Bottom-Right: Final Question Call-to-Action */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick(900);
              onOpenFinalQuestion();
            }}
            className="px-5 py-3 rounded-full bg-[#F4F1EA] text-[#1C1C1C] font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(244,241,234,0.25)] hover:bg-white hover:shadow-[0_0_35px_rgba(244,241,234,0.45)] hover:scale-105 transition-all flex items-center gap-2 border border-[#8B7E66]/40"
          >
            <Sparkles size={14} className="text-[#8B7E66]" />
            <span>INSCRIBE TESTAMENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
