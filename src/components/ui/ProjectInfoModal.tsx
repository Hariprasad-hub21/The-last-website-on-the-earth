import React from 'react';
import { X, Sparkles, Layers, Cpu, Code2, ShieldCheck, Trophy, Radio, Terminal, BookOpen, Feather } from 'lucide-react';

interface ProjectInfoModalProps {
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-3xl bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8B7E66]/40 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C]/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#8B7E66]">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-[10px] font-ui tracking-[0.25em] text-[#8B7E66] uppercase">
                EXHIBITION CURATORIAL DOSSIER // 2147
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1C1C]">
                The Last Website on Earth
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2 text-xs sm:text-sm font-sans leading-relaxed text-[#3D3830]">
          {/* Concept Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5 font-ui">
              <Feather size={14} className="text-[#8B7E66]" />
              <span>Narrative & Spatial Concept</span>
            </h3>
            <p className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 text-[#2C2822] shadow-sm">
              The year is <strong>2147</strong>. Humanity's physical internet has dissolved into cosmic silence. Deep beneath an abandoned geological archive, one final website remains luminous. Visitors explore an interconnected cyber-archaeological 3D expanse across 8 stages, discovering preserved relics of human expression, gazing upon the abandoned metropolis of Neo-Elysium, conversing with the ancient AI sentinel <strong>NEXUS</strong>, and materializing a permanent 3D memorial answering: <em>"What should humanity be remembered for?"</em>
            </p>
          </div>

          {/* Key 3D Systems */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5 font-ui">
              <Layers size={14} className="text-[#8B7E66]" />
              <span>Core Architectural & Spatial Systems</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 space-y-1 shadow-sm">
                <strong className="text-[#1C1C1C] block font-ui uppercase tracking-wider text-[11px]">1. Sub-Terrestrial Vault</strong>
                <p className="text-[#5C564C]">Cryogenic server arrays with kinetic status conduits, illuminated quartz floor runs, and hydraulic pressure portals.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 space-y-1 shadow-sm">
                <strong className="text-[#1C1C1C] block font-ui uppercase tracking-wider text-[11px]">2. Archival Memory Chambers</strong>
                <p className="text-[#5C564C]">Floating interactive octahedral memory capsules with proximity luminosity, orbital rings, and spatial annotations.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 space-y-1 shadow-sm">
                <strong className="text-[#1C1C1C] block font-ui uppercase tracking-wider text-[11px]">3. Lost City Metropolis</strong>
                <p className="text-[#5C564C]">Towering procedural skyscrapers, high-altitude skyways, atmospheric haze, and solitary surveillance probes.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/30 space-y-1 shadow-sm">
                <strong className="text-[#1C1C1C] block font-ui uppercase tracking-wider text-[11px]">4. AI Core & The Void</strong>
                <p className="text-[#5C564C]">Inverted geometric planes and the colossal NEXUS gyroscopic core with triple nested rotating gimbal rings and central plasma orb.</p>
              </div>
            </div>
          </div>

          {/* Audio Synthesizer */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5 font-ui">
              <Radio size={14} className="text-[#8B7E66]" />
              <span>Procedural Web Audio Engine</span>
            </h3>
            <p className="text-xs text-[#5C564C]">
              Zero external audio file dependencies. Utilizes the native browser <strong>Web Audio API</strong> to generate real-time spatial atmospheric sub-drones, LFO-modulated lowpass filters, crystalline harmonic memory bells, and resonant C-Major 9th monument chords.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#1C1C1C] uppercase flex items-center gap-1.5 font-ui">
              <Code2 size={14} className="text-[#8B7E66]" />
              <span>Technical Foundations</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {['React 19', 'TypeScript', 'Three.js', 'React Three Fiber', '@react-three/drei', 'Google GenAI (Gemini 3.7 Flash)', 'Express Fullstack', 'Tailwind CSS v4', 'Motion', 'Web Audio API'].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#1C1C1C] font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Creator & Hackathon Credits */}
          <div className="p-4 rounded-xl bg-white border border-[#8B7E66]/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#8B7E66]/20">
              <div className="text-[11px] font-ui font-bold uppercase tracking-wider text-[#1C1C1C]">
                3D Websites Hackathon Submission
              </div>
              <span className="text-[10px] text-[#8B7E66] font-mono">2026 EDITION</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-[#5C564C]">Project:</div>
              <div className="text-sm font-editorial font-bold text-[#1C1C1C]">THE LAST WEBSITE ON EARTH</div>
              <div className="text-xs text-[#5C564C] pt-1">
                Designed & Developed by <strong className="text-[#1C1C1C] font-semibold">V. Hari Prasad</strong>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <a
                href="mailto:hariprasad21212@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#1C1C1C] font-medium hover:bg-white transition-colors"
              >
                <span>hariprasad21212@gmail.com</span>
              </a>
              <a
                href="https://github.com/hariprasad21212"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-medium hover:bg-black transition-colors"
              >
                <span>GitHub @hariprasad21212</span>
              </a>
            </div>
          </div>

          {/* Presentation & Shortcuts */}
          <div className="p-4 rounded-xl bg-[#EDE9E1] border border-[#8B7E66]/40 space-y-2">
            <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider font-ui">
              Exhibition Navigation & Exploration Shortcuts
            </h4>
            <ul className="list-disc list-inside text-xs text-[#4A453E] space-y-1">
              <li><strong>Guided Tour:</strong> Click "GUIDED TOUR" in the header for an automated 6-stage cinematic showcase.</li>
              <li><strong>Presentation Mode:</strong> Press <kbd className="bg-white px-2 py-0.5 rounded border border-[#8B7E66]/40 text-[#1C1C1C] font-mono text-[10px]">SHIFT + P</kbd> for an uncluttered gallery viewpoint with 5 preset camera angles.</li>
              <li><strong>5 Hidden Memorial Relics:</strong> Discover Room 404, Voyager Golden Record, Architect's Journal, Constellation Solitude, and NEXUS Subconscious.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1C1C1C]/15 flex items-center justify-between text-[11px] text-[#8B7E66] font-ui">
          <span className="tracking-widest uppercase">CONSECRATED ARCHIVE // 2147</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1C1C1C] text-[#F4F1EA] font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
          >
            RETURN TO ARCHIVE
          </button>
        </div>
      </div>
    </div>
  );
};
