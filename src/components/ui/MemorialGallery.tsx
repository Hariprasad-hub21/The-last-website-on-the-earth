import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Clock, Heart, Feather, Rotate3d } from 'lucide-react';
import { MonumentData } from '../../types';

interface MemorialGalleryProps {
  onClose: () => void;
  currentMonument: MonumentData | null;
  onOpen3DRotateView?: (itemId?: string) => void;
}

const DEFAULT_MONUMENTS: MonumentData[] = [
  {
    word: 'CURIOSITY',
    title: 'MONUMENT OF CURIOSITY',
    inscription: 'Dedicated to the countless eyes that looked up at the stars and asked what lies beyond.',
    author: 'Archivist Thorne',
    timestamp: '2147.05.12',
    nexusBenediction: 'Carved into the first ring of the core.',
  },
  {
    word: 'MUSIC',
    title: 'MONUMENT OF MUSIC',
    inscription: 'For the melodies composed on pianos, strings, and synthesizers that carried human joy through dark nights.',
    author: 'Global Choral Network',
    timestamp: '2099.12.31',
    nexusBenediction: 'Synthesized into the permanent harmonic register.',
  },
  {
    word: 'PERSEVERANCE',
    title: 'MONUMENT OF PERSEVERANCE',
    inscription: 'They stumbled ten thousand times, yet rebuilt their towers and reopened their doors each morning.',
    author: 'Sub-Surface Node 04',
    timestamp: '2133.09.19',
    nexusBenediction: 'Woven into the geothermal core pillars.',
  },
  {
    word: 'EMPATHY',
    title: 'MONUMENT OF EMPATHY',
    inscription: 'The quiet courage of strangers who held hands across oceans through glowing glass screens.',
    author: 'Wanderer of Kyoto',
    timestamp: '2084.06.21',
    nexusBenediction: 'Preserved in the diamond archive.',
  }
];

export const MemorialGallery: React.FC<MemorialGalleryProps> = ({
  onClose,
  currentMonument,
  onOpen3DRotateView,
}) => {
  const [monuments, setMonuments] = useState<MonumentData[]>(DEFAULT_MONUMENTS);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('last_website_monuments') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setMonuments([...stored, ...DEFAULT_MONUMENTS]);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-ui">
      <div className="relative w-full max-w-2xl bg-[#F4F1EA] text-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-[#8B7E66]/40 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C]/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#EDE9E1] border border-[#8B7E66]/40 text-[#8B7E66]">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="text-[10px] font-ui tracking-[0.25em] text-[#8B7E66] uppercase">
                CURATED TESTAMENTS // ARCHIVE FOLIO 2147
              </div>
              <h2 className="font-editorial text-2xl font-normal text-[#1C1C1C]">
                Memorial Inscription Catalogue
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

        {/* List of Monuments in Editorial Cards */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2">
          {monuments.map((m, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white border border-[#8B7E66]/30 hover:border-[#1C1C1C] transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-editorial text-xl font-bold text-[#1C1C1C] tracking-wide uppercase">
                  {m.word}
                </div>
                <div className="text-[11px] font-mono text-[#8B7E66] flex items-center gap-1">
                  <Clock size={11} />
                  <span>{m.timestamp}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#4A453E] italic leading-relaxed">
                "{m.inscription}"
              </p>
              <div className="text-[10px] font-ui tracking-wider text-[#8B7E66] uppercase flex items-center justify-between pt-2 border-t border-[#1C1C1C]/10">
                <span>INSCRIBED BY: <strong className="text-[#1C1C1C]">{m.author || 'Anonymous'}</strong></span>
                {onOpen3DRotateView ? (
                  <button
                    onClick={() => onOpen3DRotateView('relic-monument-eternal')}
                    className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EDE9E1] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors"
                  >
                    <Rotate3d size={11} className="text-[#8B7E66]" />
                    <span>3D ROTATE VIEW</span>
                  </button>
                ) : (
                  <span className="font-semibold text-[#8B7E66]">CONSECRATED TO QUARTZ</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
