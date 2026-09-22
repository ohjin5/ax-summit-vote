import React from 'react';
import { Team, VoteRank, VoteSelection } from '../types';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface MySelectionSectionProps {
  selection: VoteSelection;
  teamsMap: Map<string, Team>;
  onClearRank: (rank: VoteRank, teamTitle?: string, e?: React.MouseEvent) => void;
  onProceedToConfirm?: () => void;
  allSelected?: boolean;
}

export function MySelectionSection({
  selection,
  teamsMap,
  onClearRank,
  onProceedToConfirm,
  allSelected = false,
}: MySelectionSectionProps) {
  const ranks: { rank: VoteRank; name: string; medal: string; score: string }[] = [
    { rank: 1, name: '1위', medal: '🥇', score: '5점' },
    { rank: 2, name: '2위', medal: '🥈', score: '3점' },
    { rank: 3, name: '3위', medal: '🥉', score: '1점' },
  ];

  const handleCardScroll = (teamId: string) => {
    const elem = document.getElementById(`card-${teamId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="my-selection-section" className="mt-10 pt-6 border-t-2 border-dashed border-[#D9E5F1]">
      <div className="bg-white rounded-2xl border border-[#D9E5F1] p-4 sm:p-5 shadow-xs">
        {/* Title & Subtitle */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#0A2E6D] text-white text-xs font-black">
              최종점검
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#102A56] tracking-tight">
              내 선택
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#66758A] font-semibold mt-1">
            최종 제출 전 선택한 발표를 확인해주세요.
          </p>
        </div>

        {/* 1위, 2위, 3위 Card Rows */}
        <div className="space-y-2.5">
          {ranks.map(({ rank, name, medal, score }) => {
            const teamId = selection[rank];
            const team = teamId ? teamsMap.get(teamId) : null;

            return (
              <div
                key={rank}
                onClick={() => {
                  if (team) handleCardScroll(team.id);
                }}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 ${
                  team
                    ? 'bg-[#F3F8FD] border-[#1268C4]/60 shadow-2xs hover:bg-[#DCEEFF]/60 cursor-pointer'
                    : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1]'
                }`}
              >
                {/* Left: Medal + Rank Badge + Team Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl shrink-0">{medal}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0A2E6D] text-white text-xs font-black shrink-0">
                    {name} ({score})
                  </span>

                  <div className="min-w-0 flex-1">
                    {team ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#102A56] truncate">
                          <span className="font-mono text-[#1268C4] mr-1">
                            {team.displayNumber || team.presentationNumber}.
                          </span>
                          {team.title}
                        </span>
                        <span className="text-xs text-[#64748B] font-medium shrink-0">
                          ({team.department} · {team.presenter})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold text-[#94A3B8]">
                        {name} 아직 선택하지 않았어요
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Unselect Button */}
                {team && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearRank(rank, team.title, e);
                    }}
                    className="self-end sm:self-auto px-2.5 py-1 rounded-lg text-xs font-bold text-[#66758A] hover:text-[#0A2E6D] hover:bg-[#DCEEFF] border border-[#CBD5E1] sm:border-transparent transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    title={`${name} 선택 해제`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>선택 해제</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* When 1위, 2위, 3위 all selected: show Confirm Button right below */}
        {allSelected && onProceedToConfirm && (
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onProceedToConfirm}
              className="w-full h-12 rounded-xl bg-[#1268C4] hover:bg-[#0A2E6D] active:scale-[0.98] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#1268C4]/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-[#DCEEFF]" />
              <span>선택 결과 확인</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
