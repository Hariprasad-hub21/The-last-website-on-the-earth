import React from 'react';
import { X, Sliders, Volume2, VolumeX, Eye, Zap, Play } from 'lucide-react';
import { AppSettings, QualitySetting } from '../../types';
import { audioEngine } from '../../systems/audioEngine';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClose: () => void;
  onTriggerDemo: () => void;
}

const QUALITY_PRESETS: QualitySetting[] = ['LOW', 'MEDIUM', 'HIGH', 'ULTRA'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onTriggerDemo,
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-lg bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8B7E66]/40 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C]/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#8B7E66]">
              <Sliders size={18} />
            </div>
            <div>
              <div className="text-[10px] font-ui tracking-[0.25em] text-[#8B7E66] uppercase">
                EXHIBITION SPECIFICATIONS
              </div>
              <h2 className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                Display & Preferences
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B7E66] hover:text-[#1C1C1C] hover:bg-[#EDE9E1] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quality Preset Buttons */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5">
            <Zap size={14} className="text-[#8B7E66]" />
            <span>RENDER FIDELITY PROFILE</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {QUALITY_PRESETS.map((q) => (
              <button
                key={q}
                onClick={() => {
                  audioEngine.playClick(600);
                  onUpdateSettings({ quality: q });
                }}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  settings.quality === q
                    ? 'bg-[#1C1C1C] text-[#F4F1EA] border-[#1C1C1C] shadow-md'
                    : 'bg-[#EDE9E1] border-[#8B7E66]/30 text-[#1C1C1C] hover:bg-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-[#8B7E66]">
            {settings.quality === 'LOW' && 'Optimized for mobile devices and power conservation (250 particles).'}
            {settings.quality === 'MEDIUM' && 'Balanced rendering profile (600 particles).'}
            {settings.quality === 'HIGH' && 'Standard high-fidelity WebGL spatial experience (1200 particles).'}
            {settings.quality === 'ULTRA' && 'Maximum fidelity, high-density particle emitters (2200 particles).'}
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="space-y-3 pt-3 border-t border-[#1C1C1C]/15">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5">
              {settings.soundEnabled ? <Volume2 size={15} className="text-[#8B7E66]" /> : <VolumeX size={15} className="text-[#8B7E66]" />}
              <span>SPATIAL SOUND ENGINE</span>
            </div>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                audioEngine.setMuted(!next);
                onUpdateSettings({ soundEnabled: next });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                settings.soundEnabled
                  ? 'bg-[#1C1C1C] text-[#F4F1EA] border-[#1C1C1C]'
                  : 'bg-[#EDE9E1] border-[#8B7E66]/40 text-[#8B7E66]'
              }`}
            >
              {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </div>

        {/* Accessibility & Motion */}
        <div className="space-y-3 pt-3 border-t border-[#1C1C1C]/15">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase">REDUCED MOTION</div>
              <div className="text-[11px] text-[#8B7E66]">
                Stabilizes camera floating and eases viewpoint transitions
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                settings.reducedMotion
                  ? 'bg-[#1C1C1C] text-[#F4F1EA] border-[#1C1C1C]'
                  : 'bg-[#EDE9E1] border-[#8B7E66]/40 text-[#8B7E66]'
              }`}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* 1-Click Demo Tour Trigger */}
        <div className="pt-3 border-t border-[#1C1C1C]/15">
          <button
            onClick={() => {
              onTriggerDemo();
              onClose();
            }}
            className="w-full py-3.5 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md border border-[#8B7E66]/40"
          >
            <Play size={13} className="fill-[#F4F1EA]" />
            <span>LAUNCH GUIDED EXHIBITION TOUR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
