import React from 'react';
import { Team, VoteRank } from '../types';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  currentStep: VoteRank;
  assignedRank: VoteRank | null; // which rank this team is currently selected for, if any
  isSelectedInCurrentStep: boolean;
  onSelect: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  currentStep,
  assignedRank,
  isSelectedInCurrentStep,
  onSelect,
}) => {
  // If assigned to a different rank
  const isAssignedToOtherRank = assignedRank !== null && !isSelectedInCurrentStep;

  // Visual cues based on assigned rank
  let badgeContent = null;
  if (assignedRank === 1) {
    badgeContent = (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
        🥇 1위 선택됨 (5점)
      </span>
    );
  } else if (assignedRank === 2) {
    badgeContent = (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
        🥈 2위 선택됨 (3점)
      </span>
    );
  } else if (assignedRank === 3) {
    badgeContent = (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
        🥉 3위 선택됨 (1점)
      </span>
    );
  }

  // Active step styling
  const getStepBorder = () => {
    if (isSelectedInCurrentStep) {
      if (currentStep === 1) return 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400 shadow-md';
      if (currentStep === 2) return 'border-slate-700 bg-slate-100/70 ring-2 ring-slate-500 shadow-md';
      if (currentStep === 3) return 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400 shadow-md';
    }
    if (isAssignedToOtherRank) {
      return 'border-slate-200 bg-slate-50/70 opacity-75';
    }
    return 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm active:bg-slate-50';
  };

  const getRankEmoji = (rank: VoteRank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉');

  return (
    <div
      id={`team-card-${team.id}`}
      onClick={() => onSelect(team)}
      role="button"
      tabIndex={0}
      className={`relative w-full rounded-xl p-3.5 sm:p-4 border transition-all duration-150 cursor-pointer text-left select-none ${getStepBorder()}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
            {team.numberStr}
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-tight">
            {team.department}
          </span>
        </div>

        {/* Status badges */}
        <div>
          {badgeContent ? (
            badgeContent
          ) : (
            <span className="text-[11px] font-medium text-slate-400">
              {currentStep}위로 선택
            </span>
          )}
        </div>
      </div>

      {/* Main Title - Most prominent */}
      <div className="mt-2.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
          {team.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
          {team.subtitle}
        </p>
      </div>

      {/* Presenter Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">발표자:</span>
          <span>{team.presenter}</span>
        </div>

        {isSelectedInCurrentStep ? (
          <span className="inline-flex items-center gap-1 font-bold text-blue-700">
            <Check className="w-4 h-4" />
            현재 {currentStep}위 선택됨
          </span>
        ) : isAssignedToOtherRank ? (
          <span className="text-[11px] text-slate-500 italic">
            터치하여 {currentStep}위로 변경
          </span>
        ) : (
          <span className="text-[11px] text-blue-600 font-medium">
            터치하여 {getRankEmoji(currentStep)} {currentStep}위 지정
          </span>
        )}
      </div>
    </div>
  );
};
