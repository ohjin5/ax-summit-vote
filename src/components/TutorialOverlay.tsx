import React, { useEffect, useState, useCallback } from 'react';
import { ArrowDown, ArrowUp, CheckCircle, RotateCcw, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Position calculation for target elements
  const updateTargetRect = useCallback(() => {
    let el: HTMLElement | null = null;
    if (step === 1 || step === 2) {
      el = document.getElementById('tutorial-rank-buttons-01');
      if (!el) {
        // Fallback to any rank button group
        el = document.querySelector('.tutorial-rank-group');
      }
    } else if (step === 3) {
      el = document.getElementById('tutorial-sticky-bar');
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Scroll target into view & compute position when step changes or window resizes
  useEffect(() => {
    if (!isOpen) return;

    let el: HTMLElement | null = null;
    if (step === 1 || step === 2) {
      el = document.getElementById('tutorial-rank-buttons-01') || document.querySelector('.tutorial-rank-group');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (step === 3) {
      el = document.getElementById('tutorial-sticky-bar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }

    // Delay rect computation slightly to allow smooth scroll to finish
    const timeout = setTimeout(() => {
      updateTargetRect();
    }, 200);

    const handleResizeOrScroll = () => {
      updateTargetRect();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isOpen, step, updateTargetRect]);

  if (!isOpen) return null;

  const handleSkip = () => {
    try {
      localStorage.setItem('axSummitTutorialSeen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('axSummitTutorialSeen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  // Determine if tooltip should sit above or below the target
  const tooltipAbove = step === 3 || (targetRect && targetRect.top > window.innerHeight * 0.55);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* 1. Backdrop Overlay with Spotlight Cutout */}
      <div className="absolute inset-0 bg-[#0A192F]/75 backdrop-blur-[1px] transition-all duration-300 pointer-events-auto" />

      {/* 2. Spotlight Ring over Target Element */}
      {targetRect && (
        <div
          className="fixed z-50 rounded-2xl transition-all duration-300 pointer-events-none ring-4 ring-[#2C8CE6] shadow-[0_0_0_9999px_rgba(10,25,47,0.75)]"
          style={{
            left: `${Math.max(8, targetRect.left - 6)}px`,
            top: `${Math.max(8, targetRect.top - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* Subtle pulsating outer glow */}
          <div className="absolute -inset-1 rounded-2xl bg-[#2C8CE6]/30 animate-pulse pointer-events-none" />
        </div>
      )}

      {/* 3. Coach Mark Tooltip Box */}
      <div
        className="fixed z-50 w-[calc(100vw-32px)] max-w-md left-1/2 -translate-x-1/2 transition-all duration-300 px-1"
        style={{
          top: targetRect
            ? tooltipAbove
              ? `${Math.max(16, targetRect.top - (step === 2 ? 260 : 230))}px`
              : `${Math.min(window.innerHeight - 260, targetRect.bottom + 18)}px`
            : '50%',
          transform: !targetRect ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        }}
      >
        {/* Pointer Arrow */}
        {targetRect && (
          <div
            className={`flex justify-center w-full my-0.5 ${
              tooltipAbove ? 'order-2' : 'order-1 mb-1'
            }`}
          >
            {tooltipAbove ? (
              <div className="flex flex-col items-center animate-bounce text-[#2C8CE6]">
                <ArrowDown className="w-6 h-6 stroke-[3] drop-shadow-md text-[#2C8CE6]" />
              </div>
            ) : (
              <div className="flex flex-col items-center animate-bounce text-[#2C8CE6]">
                <ArrowUp className="w-6 h-6 stroke-[3] drop-shadow-md text-[#2C8CE6]" />
              </div>
            )}
          </div>
        )}

        {/* Tooltip Card Body */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#1268C4] text-[#102A56] relative">
          {/* Close / Skip top right icon */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-full text-[#94A3B8] hover:text-[#0A2E6D] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="튜토리얼 닫기"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-[#0A2E6D] text-white font-black text-[10px] tracking-wider">
              STEP {step} / 3
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  step === 1 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1]'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  step === 2 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1]'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  step === 3 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1]'
                }`}
              />
            </div>
          </div>

          {/* STEP 1 CONTENT */}
          {step === 1 && (
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#0A2E6D] tracking-tight leading-snug">
                발표 3개를 골라 순위를 정해주세요
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                마음에 드는 발표에 <strong className="text-[#1268C4] font-black">1위 · 2위 · 3위</strong>를 하나씩 선택하면 됩니다.
              </p>

              <div className="mt-2 py-2 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#1E3E6D] flex items-center gap-2">
                <span className="text-base">👉</span>
                <span>여기서 순위를 직접 눌러서 선택하세요.</span>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT */}
          {step === 2 && (
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#0A2E6D] tracking-tight leading-snug">
                잘못 눌러도 괜찮아요!
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                선택한 순위 버튼을 <strong className="text-[#1268C4] font-black">한 번 더 누르면 바로 취소</strong>할 수 있어요.
              </p>

              {/* Visual Cue: 선택 -> 다시 탭 -> 취소 */}
              <div className="mt-2.5 py-2 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-around text-xs font-bold text-[#334E68]">
                <div className="flex items-center gap-1 text-[#1268C4]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>선택</span>
                </div>
                <span className="text-[#94A3B8] font-normal">→</span>
                <div className="flex items-center gap-1 text-[#0A2E6D]">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 탭</span>
                </div>
                <span className="text-[#94A3B8] font-normal">→</span>
                <div className="text-rose-600 font-extrabold">취소</div>
              </div>
            </div>
          )}

          {/* STEP 3 CONTENT */}
          {step === 3 && (
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#0A2E6D] tracking-tight leading-snug">
                3개를 모두 고르면 투표 준비 완료!
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                1위 · 2위 · 3위를 모두 선택한 뒤 하단의 <strong className="text-[#1268C4] font-black">선택 결과 확인</strong>을 누르고 제출해주세요.
              </p>

              <div className="mt-2.5 py-2 px-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#1E3E6D] flex items-center justify-between">
                <span>선택 현황 3 / 3</span>
                <span className="px-2 py-0.5 rounded bg-[#1268C4] text-white text-[11px]">결과 확인</span>
              </div>
            </div>
          )}

          {/* Navigation Controls Row */}
          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0A2E6D] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                건너뛰기
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#334E68] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>이전</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-[#1268C4] hover:bg-[#0A2E6D] active:scale-95 text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>다음</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl bg-[#0A2E6D] hover:bg-[#1268C4] active:scale-95 text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>투표 시작하기 🎉</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
