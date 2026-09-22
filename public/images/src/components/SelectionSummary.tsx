import React from 'react';
import { VoteRank, VoteSelection, Team } from '../types';
import { X, ChevronRight, Check } from 'lucide-react';

interface SelectionSummaryProps {
  selection: VoteSelection;
  teamsMap: Map<string, Team>;
  activeStep: VoteRank;
  onSelectStep: (step: VoteRank) => void;
  onClearRank: (rank: VoteRank, e: React.MouseEvent) => void;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selection,
  teamsMap,
  activeStep,
  onSelectStep,
  onClearRank,
}) => {
  const ranks: { rank: VoteRank; label: string; badge: string; points: string; color: string; activeColor: string }[] = [
    {
      rank: 1,
      label: '1위',
      badge: '🥇',
      points: '5점',
      color: 'border-amber-200 bg-amber-50/40 text-amber-950',
      activeColor: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50 shadow-sm',
    },
    {
      rank: 2,
      label: '2위',
      badge: '🥈',
      points: '3점',
      color: 'border-slate-200 bg-slate-50 text-slate-900',
      activeColor: 'ring-2 ring-slate-600 border-slate-600 bg-slate-50 shadow-sm',
    },
    {
      rank: 3,
      label: '3위',
      badge: '🥉',
      points: '1점',
      color: 'border-orange-200 bg-orange-50/30 text-orange-950',
      activeColor: 'ring-2 ring-orange-500 border-orange-500 bg-orange-50 shadow-sm',
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm py-3 px-4 sticky top-0 z-20 backdrop-blur-md bg-white/95">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            현재 선택 현황
          </span>
          <span className="text-xs text-slate-500 font-medium">
            터치하여 수정 가능
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ranks.map(({ rank, label, badge, points, color, activeColor }) => {
            const teamId = selection[rank];
            const team = teamId ? teamsMap.get(teamId) : null;
            const isActive = activeStep === rank;

            return (
              <div
                key={rank}
                id={`selection-slot-${rank}`}
                onClick={() => onSelectStep(rank)}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                  isActive ? activeColor : team ? 'border-blue-200 bg-blue-50/30' : color
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="text-lg leading-none">{badge}</span>
                    <span className="text-xs font-bold text-slate-800">{label}</span>
                  </div>

                  <div className="min-w-0 truncate">
                    {team ? (
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {team.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          No.{team.numberStr} · {team.department}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">
                        아직 선택하지 않았습니다
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {team ? (
                    <button
                      type="button"
                      onClick={(e) => onClearRank(rank, e)}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="선택 해제"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : isActive ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white animate-pulse">
                      선택중
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-100">
                      {points}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
