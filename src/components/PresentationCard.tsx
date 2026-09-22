import React from 'react';
import { Team, VoteRank, VoteSelection } from '../types';
import { PresenterImage } from './PresenterImage';
import { Check } from 'lucide-react';

interface PresentationCardProps {
  team: Team;
  selection: VoteSelection;
  onSelectRank: (team: Team, rank: VoteRank) => void;
  onClearRank: (rank: VoteRank) => void;
}

export function PresentationCard({
  team,
  selection,
  onSelectRank,
  onClearRank,
}: PresentationCardProps) {
  // Determine if this team holds any rank currently (1, 2, or 3)
  const assignedRank: VoteRank | null =
    selection[1] === team.id
      ? 1
      : selection[2] === team.id
      ? 2
      : selection[3] === team.id
      ? 3
      : null;

  return (
    <div
      id={`card-${team.id}`}
      className={`group relative rounded-2xl p-3 sm:p-3.5 transition-all duration-200 border ${
        assignedRank !== null
          ? 'border-[#1268C4] ring-2 ring-[#1268C4]/20 shadow-xs bg-[#F7FAFD]'
          : 'border-[#D9E5F1] hover:border-[#1268C4]/60 bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Top/Left: [대표 사진] + Core Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <PresenterImage
            src={team.image}
            alt={`${team.title} (${team.presenter})`}
            presentationNumber={team.presentationNumber}
            trackId={team.track}
            size="md"
          />

          <div className="flex-1 min-w-0 py-0.5">
            <h4 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug group-hover:text-[#1268C4] transition-colors line-clamp-2">
              <span className="font-mono text-[#1268C4] mr-1.5">
                {team.presentationNumber}.
              </span>
              {team.title}
            </h4>

            <p className="text-xs sm:text-[13px] text-[#64748B] line-clamp-2 leading-relaxed mt-0.5 font-normal">
              {team.subtitle}
            </p>

            <div className="mt-1.5 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F3F8FD] border border-[#D9E5F1] text-[11px] font-semibold text-[#334E68]">
                <span>{team.department}</span>
                <span className="mx-1 text-[#94A3B8]">·</span>
                <span className="text-[#0A2E6D] font-bold">{team.presenter}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row: [ 1위 ] [ 2위 ] [ 3위 ] */}
        <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9E5F1]/60 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto sm:flex sm:items-center sm:gap-2">
            {([1, 2, 3] as VoteRank[]).map((r) => {
              const isSelected = selection[r] === team.id;
              const isOtherRankOnThisTeam =
                assignedRank !== null && assignedRank !== r;
              const isTakenByOther =
                selection[r] !== null && selection[r] !== team.id;
              const disabled = isOtherRankOnThisTeam || isTakenByOther;

              return (
                <button
                  key={r}
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                      onClearRank(r);
                    } else if (!disabled) {
                      onSelectRank(team, r);
                    }
                  }}
                  className={`min-h-[38px] px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 transition-all border ${
                    isSelected
                      ? 'bg-[#0A2E6D] text-white border-[#0A2E6D] shadow-xs hover:bg-[#0D3882] cursor-pointer'
                      : disabled
                      ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed opacity-60'
                      : 'bg-white text-[#1268C4] border-[#1268C4]/60 hover:bg-[#F0F7FF] hover:border-[#1268C4] hover:text-[#0A2E6D] active:scale-[0.97] cursor-pointer shadow-2xs'
                  }`}
                  title={
                    isSelected
                      ? `${r}위 선택 해제`
                      : disabled
                      ? isTakenByOther
                        ? `${r}위는 다른 프로그램에 지정되어 있음`
                        : `이 프로그램은 이미 다른 순위에 선택됨`
                      : `${team.presentationNumber}번 ${team.title}을 ${r}위로 선택`
                  }
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>{r}위</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
