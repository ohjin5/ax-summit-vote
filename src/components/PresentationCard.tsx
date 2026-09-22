import React from 'react';
import { Team, VoteRank, VoteSelection } from '../types';
import { PresenterImage } from './PresenterImage';
import { Check } from 'lucide-react';

interface PresentationCardProps {
  team: Team;
  selection: VoteSelection;
  onSelectRank: (team: Team, rank: VoteRank) => void;
  onClearRank: (rank: VoteRank, teamTitle?: string) => void;
  onDisabledClick?: (reason: string) => void;
  isTutorialOpen?: boolean;
}

export function PresentationCard({
  team,
  selection,
  onSelectRank,
  onClearRank,
  onDisabledClick,
  isTutorialOpen = false,
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
      className={`group relative rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border ${
        assignedRank !== null
          ? 'border-[#1268C4] ring-2 ring-[#1268C4]/20 shadow-xs bg-[#F7FAFD]'
          : 'border-[#D9E5F1] hover:border-[#1268C4]/60 bg-white'
      }`}
    >
      {/* 1. Content: Image + Info */}
      <div className="flex items-start gap-3">
        <PresenterImage
          src={team.image}
          images={team.images}
          team={team}
          alt={`${team.title} (${team.presenter})`}
          presentationNumber={team.displayNumber || team.presentationNumber}
          trackId={team.track}
          size="md"
          isTutorialOpen={isTutorialOpen}
        />

        {team.subPrograms && team.subPrograms.length > 0 ? (
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug">
              <span className="font-mono text-[#1268C4] mr-1.5">
                {team.displayNumber || team.presentationNumber}.
              </span>
              {team.title}
            </h4>

            <div className="mt-2 space-y-1.5">
              {team.subPrograms.map((prog, idx) => (
                <div key={idx} className="relative">
                  {idx > 0 && <div className="h-[1px] bg-[#E2E8F0] my-2" />}
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#102A56] tracking-tight leading-snug">
                      {prog.title}
                    </h5>
                    <p className="text-xs text-[#64748B] leading-relaxed mt-0.5 font-normal">
                      {prog.subtitle}
                    </p>
                    <div className="mt-0.5 text-xs text-[#64748B]">
                      <span>{prog.department}</span>
                      <span className="mx-1 text-[#CBD5E1]">·</span>
                      <span className="text-[#334E68] font-medium">{prog.presenter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug line-clamp-2">
              <span className="font-mono text-[#1268C4] mr-1.5">
                {team.displayNumber || team.presentationNumber}.
              </span>
              {team.title}
            </h4>

            <p className="text-xs sm:text-[13px] text-[#64748B] line-clamp-2 leading-relaxed mt-1 font-normal">
              {team.subtitle}
            </p>

            <div className="mt-1.5 text-xs text-[#64748B]">
              <span>{team.department}</span>
              <span className="mx-1 text-[#CBD5E1]">·</span>
              <span className="text-[#334E68] font-medium">{team.presenter}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Action Buttons Row: [ 1위 ] [ 2위 ] [ 3위 ] placed BELOW content in 3 equal columns */}
      <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
        <div
          id={team.presentationNumber === '01' || team.id === 'team-01' ? 'tutorial-rank-buttons-01' : undefined}
          className="grid grid-cols-3 gap-2 w-full tutorial-rank-group"
        >
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
                aria-disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected) {
                    onClearRank(r, team.title);
                  } else if (disabled) {
                    if (isTakenByOther) {
                      onDisabledClick?.(`${r}위는 이미 다른 발표에서 선택했어요.`);
                    } else if (isOtherRankOnThisTeam) {
                      onDisabledClick?.(`이미 ${assignedRank}위로 선택된 발표입니다.`);
                    }
                  } else {
                    onSelectRank(team, r);
                  }
                }}
                className={`min-h-[44px] px-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all border whitespace-nowrap active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#1268C4] text-white border-[#1268C4] shadow-xs cursor-pointer'
                    : disabled
                    ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed opacity-75'
                    : 'bg-white text-[#1268C4] border-[#1268C4] hover:bg-[#EFF6FF] hover:text-[#0A2E6D] cursor-pointer shadow-2xs'
                }`}
                title={
                  isSelected
                    ? `✓ ${r}위 선택됨 (클릭하여 취소)`
                    : disabled
                    ? isTakenByOther
                      ? `${r}위는 이미 다른 발표에서 선택했습니다.`
                      : `이미 다른 순위가 선택되어 있습니다.`
                    : `${team.displayNumber || team.presentationNumber}번을 ${r}위로 선택`
                }
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
                    <span>✓ {r}위 선택</span>
                  </>
                ) : (
                  <span>{r}위</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
