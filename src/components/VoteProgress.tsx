import React from 'react';
import { VoteRank, VoteSelection } from '../types';
import { Sparkles, Trophy } from 'lucide-react';

interface VoteProgressProps {
  currentStep: VoteRank;
  selection: VoteSelection;
  onSelectStep: (step: VoteRank) => void;
}

export function VoteProgress({
  currentStep,
  selection,
  onSelectStep,
}: VoteProgressProps) {
  // New Flow: 3위 (Step 1) -> 2위 (Step 2) -> 1위 (Step 3)
  const steps: {
    rank: VoteRank;
    stepIndex: number;
    stepBadge: string;
    label: string;
    score: string;
  }[] = [
    { rank: 3, stepIndex: 1, stepBadge: '③ 3위', label: '3위 선택', score: '1점' },
    { rank: 2, stepIndex: 2, stepBadge: '② 2위', label: '2위 선택', score: '3점' },
    { rank: 1, stepIndex: 3, stepBadge: '① 1위', label: '1위 선택', score: '5점' },
  ];

  const selectedCount = [selection[1], selection[2], selection[3]].filter(Boolean).length;

  // Step information based on currentStep
  const stepInfo = {
    3: {
      stepNum: 'STEP 1 / 3',
      title: '3위 발표를 선택해주세요',
      desc: '먼저 3위로 선정할 발표를 선택해주세요. (1점 부여)',
      isHighlight: false,
    },
    2: {
      stepNum: 'STEP 2 / 3',
      title: '2위 발표를 선택해주세요',
      desc: '다음으로 2위로 선정할 발표를 선택해주세요. (3점 부여)',
      isHighlight: false,
    },
    1: {
      stepNum: 'STEP 3 / 3',
      title: '마지막으로 1위를 선택해주세요',
      desc: '오늘 발표 중 가장 인상 깊었던 AX 혁신 사례를 선택해주세요. (5점 부여)',
      isHighlight: true,
    },
  }[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-2 sm:px-6">
      {/* Official White Card Container */}
      <div className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all ${
        stepInfo.isHighlight ? 'border-[#1268C4] ring-2 ring-[#1268C4]/15' : 'border-[#D9E5F1]'
      }`}>
        {/* Step Indicator & Header Area */}
        <div className="text-center space-y-1.5 pb-3.5 border-b border-[#D9E5F1]/70">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0A2E6D] text-white text-[11px] font-black tracking-wider">
              {stepInfo.stepNum}
            </span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3F8FD] border border-[#DCEEFF] text-[11px] font-bold text-[#1268C4]">
              <Sparkles className="w-3 h-3 text-[#2C8CE6]" />
              <span>은평 AX SUMMIT 2026 현장 투표</span>
            </div>
          </div>

          <h2 className={`text-lg sm:text-xl font-black tracking-tight leading-snug ${
            stepInfo.isHighlight ? 'text-[#0A2E6D]' : 'text-[#102A56]'
          }`}>
            {stepInfo.title}
          </h2>

          <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
            stepInfo.isHighlight ? 'text-[#1268C4]' : 'text-[#66758A]'
          }`}>
            {stepInfo.desc}
          </p>
        </div>

        {/* Stepper: ③ 3위 선택 ━━━ ② 2위 선택 ━━━ ① 1위 선택 */}
        <div className="pt-3">
          <div className="bg-[#F7FAFD] rounded-xl p-1.5 border border-[#D9E5F1] flex items-center justify-between gap-1 sm:gap-2">
            {steps.map((s, idx) => {
              const isCurrent = currentStep === s.rank;
              const isCompleted = Boolean(selection[s.rank]);

              return (
                <React.Fragment key={s.rank}>
                  <button
                    type="button"
                    onClick={() => onSelectStep(s.rank)}
                    className={`flex-1 py-2 sm:py-2.5 px-2 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1268C4] text-white shadow-xs ring-2 ring-[#1268C4]/25'
                        : isCompleted
                        ? 'bg-white text-[#0A2E6D] border border-[#D9E5F1] shadow-2xs hover:bg-[#F3F8FD]'
                        : 'text-[#66758A] hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent ? 'bg-white/25 text-white' : 'bg-[#DCEEFF] text-[#1268C4]'
                          }`}
                        >
                          {s.rank === 1 ? '1' : s.rank === 2 ? '2' : '3'}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-extrabold whitespace-nowrap">
                        {s.stepBadge}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full whitespace-nowrap ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-[#DCEEFF] text-[#0A2E6D]'
                          : 'text-[#66758A]'
                      }`}
                    >
                      {isCompleted ? '선택완료' : s.score}
                    </span>
                  </button>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-3 sm:w-6 rounded-full shrink-0 transition-colors ${
                        selection[s.rank]
                          ? 'bg-[#1268C4]'
                          : 'bg-[#D9E5F1]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active step guide banner */}
          <div className="mt-2.5 flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1268C4] animate-pulse" />
              <span className="font-extrabold text-[#1268C4]">
                {currentStep === 3
                  ? '현재 3위 선택 중 (1점)'
                  : currentStep === 2
                  ? '현재 2위 선택 중 (3점)'
                  : '현재 1위 선택 중 (5점)'}
              </span>
            </div>

            <span className="font-bold text-[#66758A]">
              {selectedCount} / 3 선택 완료
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
