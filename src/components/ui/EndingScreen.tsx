import React from 'react';
import { RotateCcw, Sparkles, BookOpen, Feather, Rotate3d } from 'lucide-react';
import { MonumentData } from '../../types';
import { audioEngine } from '../../systems/audioEngine';

interface EndingScreenProps {
  monument: MonumentData | null;
  onReplay: () => void;
  onOpenQuestion: () => void;
  onOpenGallery: () => void;
  onOpen3DRotateView?: (itemId?: string) => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  monument,
  onReplay,
  onOpenQuestion,
  onOpenGallery,
  onOpen3DRotateView,
}) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#0E1015] text-[#F4F1EA] select-none font-ui animate-fadeIn">
      {/* Background subtle editorial grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(28,32,42,0.8)_0%,rgba(10,12,16,0.98)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B7E6610_1px,transparent_1px),linear-gradient(to_bottom,#8B7E6610_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        <div className="space-y-3">
          <div className="text-[11px] text-[#8B7E66] tracking-[0.3em] uppercase font-semibold">
            CHRONICLE FOLIO // THE SILENCE OF 2147
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-[#F4F1EA] tracking-tight leading-tight">
            The Last Website <br className="hidden sm:inline" />
            <span className="italic text-[#C8C2B0]">on Earth</span>
          </h1>
        </div>

        {monument && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F4F1EA] text-[#1C1C1C] max-w-lg mx-auto shadow-2xl border border-[#8B7E66]/40">
            <div className="text-[10px] text-[#8B7E66] font-bold uppercase tracking-[0.25em] mb-1">
              CONSECRATED INSCRIPTION
            </div>
            <div className="font-editorial text-3xl font-bold text-[#1C1C1C] uppercase mb-2">
              {monument.word}
            </div>
            <p className="text-xs sm:text-sm text-[#4A453E] italic leading-relaxed">
              "{monument.inscription}"
            </p>
          </div>
        )}

        <div className="space-y-1.5 max-w-md mx-auto text-[#A3967C] text-sm italic leading-relaxed">
          <p>"Perhaps the web was never about infinite noise or ephemeral clicks."</p>
          <p className="text-[#F4F1EA] font-editorial text-base not-italic font-medium">"It was an archive of human love and memory."</p>
          <p className="text-[11px] text-[#8B7E66] font-ui not-italic pt-2">
            Created for the 3D Websites Hackathon • Designed & Developed by <strong className="text-[#EDE9E1]">V. Hari Prasad</strong>
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              onReplay();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4F1EA] text-[#1C1C1C] font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all shadow-md border border-[#8B7E66]/40"
          >
            <RotateCcw size={13} />
            <span>ENTER ARCHIVE AGAIN</span>
          </button>

          {onOpen3DRotateView && (
            <button
              onClick={() => {
                audioEngine.playClick(750);
                onOpen3DRotateView('relic-monument-eternal');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#101217] border border-[#8B7E66] text-[#F4F1EA] font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#8B7E66]/30 transition-all shadow-lg"
            >
              <Rotate3d size={14} className="text-[#8B7E66] animate-spin" style={{ animationDuration: '8s' }} />
              <span>3D ROTATE VIEW</span>
            </button>
          )}

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenQuestion();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C202A] border border-[#8B7E66]/40 text-[#EDE9E1] font-semibold text-xs uppercase tracking-[0.15em] hover:bg-[#252B38] transition-all"
          >
            <Sparkles size={13} className="text-[#8B7E66]" />
            <span>INSCRIBE ANOTHER MEMORY</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenGallery();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#EDE9E1] text-[#1C1C1C] font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all border border-[#8B7E66]/40"
          >
            <BookOpen size={13} />
            <span>MEMORIAL CATALOGUE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
