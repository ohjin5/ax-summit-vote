import React from 'react';
import { Team, VoteRank, VoteSelection, TrackId } from '../types';
import { X } from 'lucide-react';

interface VoteSummaryProps {
  selection: VoteSelection;
  teamsMap: Map<string, Team>;
  activeStep: VoteRank;
  onSelectStep: (step: VoteRank) => void;
  onClearRank: (rank: VoteRank, e: React.MouseEvent) => void;
  activeTrackId: TrackId | 'all';
  onSelectTrack: (trackId: TrackId | 'all') => void;
}

export function VoteSummary({
  selection,
  teamsMap,
  activeStep,
  onSelectStep,
  onClearRank,
  activeTrackId,
  onSelectTrack,
}: VoteSummaryProps) {
  const ranks: { rank: VoteRank; name: string; medal: string; score: string }[] = [
    { rank: 1, name: '1위', medal: '🥇', score: '5점' },
    { rank: 2, name: '2위', medal: '🥈', score: '3점' },
    { rank: 3, name: '3위', medal: '🥉', score: '1점' },
  ];

  const tracksList: { id: TrackId | 'all'; label: string }[] = [
    { id: 'all', label: '전체 (13)' },
    { id: 'special', label: 'Special Track (01~05)' },
    { id: 'main1', label: 'Main Track 1 (06~08)' },
    { id: 'main2', label: 'Main Track 2 (09~13)' },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#D9E5F1] shadow-2xs">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 space-y-2">
        {/* Compact "내 선택" Row (1위 -> 2위 -> 3위 유지) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-extrabold text-[#0A2E6D] uppercase tracking-wider shrink-0 pl-1">
            내 선택
          </span>

          <div className="flex-1 grid grid-cols-3 gap-1.5">
            {ranks.map(({ rank, name, medal, score }) => {
              const teamId = selection[rank];
              const team = teamId ? teamsMap.get(teamId) : null;
              const isActive = activeStep === rank;

              return (
                <button
                  key={rank}
                  type="button"
                  onClick={() => onSelectStep(rank)}
                  className={`group relative h-9 px-2 rounded-xl text-left flex items-center justify-between border transition-all text-xs truncate cursor-pointer ${
                    isActive
                      ? 'bg-[#0A2E6D] text-white border-[#0A2E6D] shadow-2xs'
                      : team
                      ? 'bg-[#F3F8FD] border-[#D9E5F1] text-[#102A56] hover:bg-[#DCEEFF]'
                      : 'bg-white border-dashed border-[#D9E5F1] text-[#66758A] hover:border-[#1268C4]'
                  }`}
                  title={team ? `${medal} ${name}: ${team.title} (${score})` : `${medal} ${name} 선택하기`}
                >
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-xs shrink-0">{medal}</span>
                    <span
                      className={`text-[10px] font-black px-1 py-0.2 rounded shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#DCEEFF] text-[#0A2E6D]'
                      }`}
                    >
                      {name}
                    </span>
                    <span className="truncate font-bold text-[11px] sm:text-xs">
                      {team ? team.title : '선택 전'}
                    </span>
                  </div>

                  {team && (
                    <span
                      onClick={(e) => onClearRank(rank, e)}
                      className={`p-0.5 rounded-full shrink-0 ml-1 transition-colors ${
                        isActive
                          ? 'text-white/80 hover:text-white hover:bg-white/20'
                          : 'text-[#66758A] hover:text-[#0A2E6D] hover:bg-[#DCEEFF]'
                      }`}
                      title="선택 취소"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Track Sticky Quick Nav Chips (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          {tracksList.map((t) => {
            const isSelected = activeTrackId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTrack(t.id)}
                className={`px-3.5 py-1 rounded-lg whitespace-nowrap font-extrabold text-[11px] sm:text-xs transition-all border shrink-0 cursor-pointer ${
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
    </div>
  );
}
