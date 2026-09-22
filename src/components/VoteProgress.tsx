import React from 'react';
import { VoteSelection } from '../types';
import { RotateCcw, HelpCircle } from 'lucide-react';

interface VoteProgressProps {
  selection?: VoteSelection;
  onOpenTutorial?: () => void;
}

export function VoteProgress({ onOpenTutorial }: VoteProgressProps = {}) {
  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 pt-2.5 pb-1 sm:px-6">
      {/* Official Compact White Card Container */}
      <div className="bg-white rounded-2xl border border-[#D9E5F1] p-3.5 sm:p-4 shadow-xs">
        {/* Main Action-Oriented Title & Subtitle */}
        <div className="text-center relative">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#DCEEFF] text-[#0A2E6D] text-[10.5px] font-black tracking-wider">
              현장 투표
            </div>
            {onOpenTutorial && (
              <button
                type="button"
                onClick={onOpenTutorial}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-95 text-[#1268C4] text-[11px] font-extrabold transition-all cursor-pointer border border-[#CBD5E1]"
                title="3단계 투표 가이드 다시 보기"
              >
                <HelpCircle className="w-3 h-3 text-[#1268C4]" />
                <span>? 투표 방법</span>
              </button>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug">
            가장 우수한 발표 3개를 선택해주세요
          </h2>
          <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
            발표 카드를 확인하고 각각 1위 · 2위 · 3위를 선택하면 됩니다.
          </p>
        </div>

        {/* 3-Step Guide (Compact 1-line on mobile) */}
        <div className="mt-2.5 py-1 px-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-center gap-1 sm:gap-2 text-[11px] font-bold text-[#334E68]">
          <span className="whitespace-nowrap text-[#0A2E6D]">① 발표 확인</span>
          <span className="text-[#94A3B8] text-[10px]">→</span>
          <span className="whitespace-nowrap text-[#0A2E6D]">② 1위 · 2위 · 3위 선택</span>
          <span className="text-[#94A3B8] text-[10px]">→</span>
          <span className="whitespace-nowrap text-[#0A2E6D]">③ 선택 확인 후 제출</span>
        </div>

        {/* Score Chips (Secondary Info) */}
        <div className="mt-2 flex items-center justify-center gap-2 flex-wrap text-[11.5px] font-bold">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#334E68] border border-[#E2E8F0]">
            <span>🥇</span>
            <span>1위 5점</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#334E68] border border-[#E2E8F0]">
            <span>🥈</span>
            <span>2위 3점</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#334E68] border border-[#E2E8F0]">
            <span>🥉</span>
            <span>3위 1점</span>
          </span>
        </div>

        {/* Compact Tip Box */}
        <div className="mt-2 py-1.5 px-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-center text-xs text-[#1E3E6D] flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3 h-3 text-[#1268C4] shrink-0" />
          <span className="text-[11px] sm:text-xs">
            <span className="text-[#1268C4] font-black mr-1">TIP</span>
            선택한 버튼을 한 번 더 누르면 취소할 수 있어요.
          </span>
        </div>
      </div>
    </div>
  );
}
