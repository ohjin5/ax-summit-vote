import React from 'react';
import { VoteSelection } from '../types';
import { Sparkles, Trophy, CheckCircle2, Check, RotateCcw } from 'lucide-react';

interface VoteProgressProps {
  selection: VoteSelection;
}

export function VoteProgress({ selection }: VoteProgressProps) {
  const selectedCount = [selection[1], selection[2], selection[3]].filter(Boolean).length;
  const isComplete = selectedCount === 3;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-3 pb-1 sm:px-6">
      {/* Official White Card Container */}
      <div
        className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all ${
          isComplete ? 'border-[#1268C4] ring-2 ring-[#1268C4]/15' : 'border-[#D9E5F1]'
        }`}
      >
        <div className="text-center space-y-2">
          {/* Header Tag */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F3F8FD] border border-[#DCEEFF] text-[11px] font-extrabold text-[#1268C4]">
              <Sparkles className="w-3.5 h-3.5 text-[#2C8CE6]" />
              <span>은평 AX SUMMIT 2026 현장 투표</span>
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-base sm:text-lg font-black text-[#102A56] tracking-tight leading-snug">
            발표 카드의 [1위] [2위] [3위] 버튼을 직접 선택해주세요
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-[13px] font-semibold text-[#64748B] leading-relaxed max-w-lg mx-auto">
            가장 우수한 AX 혁신 사례 3개를 선정하여 1위(5점), 2위(3점), 3위(1점)를 각각 부여할 수 있습니다.
          </p>

          {/* Compact Tip Box */}
          <div className="max-w-md mx-auto my-1.5 p-2.5 sm:p-3 rounded-xl bg-[#F0F7FF] border border-[#BEE1FF] text-left text-xs text-[#1E3E6D] space-y-1 sm:space-y-1.5">
            <div className="flex items-start gap-1.5 leading-snug">
              <Check className="w-3.5 h-3.5 text-[#1268C4] shrink-0 mt-0.5" />
              <span className="font-medium text-[11px] sm:text-xs">
                각 순위는 <span className="font-bold text-[#0A2E6D]">한 프로그램에만</span> 선택할 수 있습니다.
              </span>
            </div>
            <div className="flex items-start gap-1.5 leading-snug">
              <RotateCcw className="w-3.5 h-3.5 text-[#1268C4] shrink-0 mt-0.5" />
              <span className="font-medium text-[11px] sm:text-xs">
                선택한 버튼을 <strong className="font-extrabold text-[#0A2E6D] bg-[#E1F0FF] px-1 py-0.5 rounded">한 번 더 누르면 취소</strong>할 수 있습니다.
              </span>
            </div>
          </div>

          {/* Scores Legend & Status Badge */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-xl bg-[#F7FAFD] border border-[#D9E5F1] text-[#0A2E6D] font-bold text-[11px] sm:text-xs">
              <span>🥇 1위 (5점)</span>
              <span className="text-[#94A3B8]">·</span>
              <span>🥈 2위 (3점)</span>
              <span className="text-[#94A3B8]">·</span>
              <span>🥉 3위 (1점)</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all ${
                isComplete
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#0A2E6D] text-white'
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              ) : (
                <Trophy className="w-3.5 h-3.5 text-[#2C8CE6]" />
              )}
              <span>
                선택 현황 {selectedCount} / 3 {isComplete ? '· 선택 완료' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
