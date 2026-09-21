import React from 'react';
import { Team, VoteRank } from '../types';
import { PresenterImage } from './PresenterImage';
import { Check } from 'lucide-react';

interface PresentationCardProps {
  team: Team;
  currentStep: VoteRank;
  assignedRank: VoteRank | null;
  isSelectedInCurrentStep: boolean;
  onSelect: (team: Team) => void;
  onUnselect?: (rank: VoteRank) => void;
}

export function PresentationCard({
  team,
  currentStep,
  assignedRank,
  isSelectedInCurrentStep,
  onSelect,
  onUnselect,
}: PresentationCardProps) {
  // Determine card selection state
  const isAssignedToOther = assignedRank !== null && assignedRank !== currentStep;
  const currentRankLabel = `${currentStep}위`;
  const assignedRankLabel = assignedRank !== null ? `${assignedRank}위` : '';

  return (
    <div
      id={`card-${team.id}`}
      onClick={() => {
        if (!isAssignedToOther) {
          onSelect(team);
        }
      }}
      className={`group relative rounded-2xl bg-white p-3 sm:p-3.5 transition-all duration-200 border ${
        isSelectedInCurrentStep
          ? 'border-[#1268C4] ring-2 ring-[#1268C4]/20 shadow-sm bg-[#F7FAFD] cursor-pointer'
          : isAssignedToOther
          ? 'border-[#D9E5F1] bg-[#F8FAFC]/80 opacity-75 cursor-default'
          : 'border-[#D9E5F1] hover:border-[#1268C4]/60 hover:shadow-xs cursor-pointer'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Top/Left: [대표 사진] + 3 Core Information Items */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* [대표 사진] (with presentation number badge) */}
          <PresenterImage
            src={team.image}
            alt={`${team.title} (${team.presenter})`}
            presentationNumber={team.presentationNumber}
            trackId={team.track}
            size="md"
          />

          {/* 3 Core Information Items in Strict Visual Hierarchy */}
          <div className="flex-1 min-w-0 py-0.5">
            {/* ① 프로그램명 (카드에서 가장 눈에 띔) */}
            <h4 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug group-hover:text-[#1268C4] transition-colors line-clamp-2">
              <span className="font-mono text-[#1268C4] mr-1.5">{team.presentationNumber}.</span>
              {team.title}
            </h4>

            {/* ② 어떤 프로그램인지 알 수 있는 짧은 한 줄 설명 (작은 회색 글씨, 최대 1~2줄) */}
            <p className="text-xs sm:text-[13px] text-[#64748B] line-clamp-2 leading-relaxed mt-0.5 font-normal">
              {team.subtitle}
            </p>

            {/* ③ 부서/팀 · 발표자 및 직책 (작은 Badge / Sub Text 형태) */}
            <div className="mt-1.5 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F3F8FD] border border-[#D9E5F1] text-[11px] font-semibold text-[#334E68]">
                <span>{team.department}</span>
                <span className="mx-1 text-[#94A3B8]">·</span>
                <span className="text-[#0A2E6D] font-bold">{team.presenter}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Compact, 44px touch target */}
        <div className="sm:shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#D9E5F1]/60 flex items-center justify-end">
          {isSelectedInCurrentStep ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onUnselect) onUnselect(currentStep);
                else onSelect(team);
              }}
              className="w-full sm:w-auto min-h-[42px] px-5 sm:px-6 rounded-xl bg-[#0A2E6D] hover:bg-[#0D3882] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>✓ {currentRankLabel} 선택 완료</span>
              <span className="text-[10px] opacity-75 underline ml-1">취소</span>
            </button>
          ) : isAssignedToOther ? (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto min-h-[42px] px-5 sm:px-6 rounded-xl bg-[#F3F8FD] border border-[#D9E5F1] text-[#64748B] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-not-allowed opacity-90"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>✓ {assignedRankLabel} 선택 완료</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(team);
              }}
              className="w-full sm:w-auto min-h-[42px] px-5 sm:px-6 rounded-xl bg-[#1268C4] hover:bg-[#0A2E6D] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{currentRankLabel}로 선택</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
