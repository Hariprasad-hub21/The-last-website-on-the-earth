import React from 'react';
import { Binary } from 'lucide-react';
import { MemoryArtifact } from '../../types';

interface FloatingMemoryArchiveCardsProps {
  currentMemory: MemoryArtifact;
  onSelectRelated?: (code: string) => void;
}

interface ArchivalChip {
  code: string;
  label: string;
  status: string;
  color: string;
  desktopPos: { top?: string; bottom?: string; left?: string; right?: string };
}

const ARCHIVAL_CHIPS: ArchivalChip[] = [
  {
    code: 'MEMORY_001',
    label: 'TRANSMISSION_LO',
    status: 'SYNCHRONIZED',
    color: '#38bdf8',
    desktopPos: { top: '0px', right: '4px' },
  },
  {
    code: 'MEMORY_002',
    label: 'CLUSTER_NODE_B',
    status: 'RELAY_ACTIVE',
    color: '#06b6d4',
    desktopPos: { top: '36px', right: '20px' },
  },
  {
    code: 'MEMORY_014',
    label: 'OPTICAL_STREAM',
    status: 'PRESERVED',
    color: '#f59e0b',
    desktopPos: { top: '72px', right: '6px' },
  },
  {
    code: 'MEMORY_042',
    label: 'ORBITAL_TELEMETRY',
    status: 'DECRYPTED',
    color: '#a855f7',
    desktopPos: { top: '108px', right: '32px' },
  },
];

export const FloatingMemoryArchiveCards: React.FC<FloatingMemoryArchiveCardsProps> = ({
  currentMemory,
}) => {
  return (
    <div
      id="floating-memory-archive-container"
      className="relative w-full overflow-hidden pointer-events-none select-none z-10 box-border"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Desktop View: Dedicated Floating Lateral Constellation Container */}
      <div
        className="hidden lg:block absolute right-0 top-0 w-64 h-36 overflow-hidden pointer-events-none z-10 box-border"
        style={{ boxSizing: 'border-box', maxWidth: '260px', maxHeight: '150px' }}
      >
        <div className="relative w-full h-full overflow-hidden box-border">
          {ARCHIVAL_CHIPS.map((chip, idx) => {
            const isCurrent = chip.code === currentMemory.code;
            return (
              <div
                key={`desktop-chip-${chip.code}-${idx}`}
                style={{
                  top: chip.desktopPos.top,
                  right: chip.desktopPos.right,
                  left: chip.desktopPos.left,
                  bottom: chip.desktopPos.bottom,
                  boxSizing: 'border-box',
                  maxWidth: '190px',
                }}
                className={`absolute transition-all duration-300 ease-out box-border ${
                  isCurrent
                    ? 'scale-100 opacity-100 z-20'
                    : 'opacity-70 hover:opacity-100 scale-95 z-10'
                }`}
              >
                <div
                  className="flex items-center gap-2 px-2.5 py-1 rounded-md border backdrop-blur-sm shadow-xs box-border overflow-hidden"
                  style={{
                    backgroundColor: isCurrent ? 'rgba(28, 28, 28, 0.95)' : 'rgba(237, 233, 225, 0.90)',
                    borderColor: isCurrent ? chip.color : 'rgba(139, 126, 102, 0.4)',
                    color: isCurrent ? '#F4F1EA' : '#1C1C1C',
                    boxSizing: 'border-box',
                    maxWidth: '100%',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chip.color }}
                  />
                  <div className="flex flex-col text-[10px] leading-tight font-mono truncate overflow-hidden">
                    <span className="font-bold tracking-wider truncate">{chip.code}</span>
                    <span
                      className="text-[8px] uppercase tracking-wider truncate"
                      style={{ color: isCurrent ? '#A3967C' : '#8B7E66' }}
                    >
                      {chip.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet View: Structured Horizontal Archival Ribbon Bar */}
      <div className="lg:hidden w-full pb-1.5 overflow-x-auto no-scrollbar box-border">
        <div className="flex items-center gap-1.5 flex-nowrap py-1 box-border">
          <div className="flex items-center gap-1 text-[9px] font-mono text-[#8B7E66] uppercase tracking-wider pl-1 pr-1.5 flex-shrink-0">
            <Binary size={10} />
            <span>CLUSTER:</span>
          </div>
          {ARCHIVAL_CHIPS.map((chip, idx) => {
            const isCurrent = chip.code === currentMemory.code;
            return (
              <div
                key={`mobile-chip-${chip.code}-${idx}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono transition-colors box-border"
                style={{
                  backgroundColor: isCurrent ? '#1C1C1C' : 'rgba(237, 233, 225, 0.92)',
                  borderColor: isCurrent ? chip.color : 'rgba(139, 126, 102, 0.35)',
                  color: isCurrent ? '#F4F1EA' : '#1C1C1C',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: chip.color }}
                />
                <span className="font-semibold truncate">{chip.code}</span>
                <span className="text-[8px] text-[#8B7E66] truncate">{chip.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
