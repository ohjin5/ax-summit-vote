import React from 'react';
import { TrackId } from '../types';

interface VoteSummaryProps {
  activeTrackId: TrackId | 'all';
  onSelectTrack: (trackId: TrackId | 'all') => void;
}

export function VoteSummary({
  activeTrackId,
  onSelectTrack,
}: VoteSummaryProps) {
  const tracksList: { id: TrackId | 'all'; label: string }[] = [
    { id: 'all', label: '전체 (14)' },
    { id: 'special', label: 'Special Track (01~06)' },
    { id: 'main1', label: 'Main Track 1 (07~09)' },
    { id: 'main2', label: 'Main Track 2 (10~14)' },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#D9E5F1] shadow-2xs">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        {tracksList.map((t) => {
          const isSelected = activeTrackId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTrack(t.id)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-extrabold text-[11px] sm:text-xs transition-all border shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#0A2E6D] text-white border-[#0A2E6D] shadow-2xs'
                  : 'bg-[#F3F8FD] text-[#0A2E6D] border-[#D9E5F1] hover:bg-[#DCEEFF]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
