import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CheckCircle, RotateCcw, X, ChevronRight, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [sheetHeight, setSheetHeight] = useState<number>(165);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Measure Bottom Sheet Height
  const updateSheetHeight = useCallback(() => {
    if (sheetRef.current) {
      const h = sheetRef.current.getBoundingClientRect().height;
      if (h > 0) {
        setSheetHeight(h);
      }
    }
  }, []);

  // Position calculation for target elements in STEP 1 & 2
  const updateTargetRect = useCallback(() => {
    let el: HTMLElement | null = null;
    if (step === 1 || step === 2) {
      el = document.getElementById('tutorial-rank-buttons-01');
      if (!el) {
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

  // Adjust Sticky Bar position in STEP 3 & auto scroll in STEP 1 & 2
  useEffect(() => {
    if (!isOpen) return;

    updateSheetHeight();

    const stickyBar = document.getElementById('tutorial-sticky-bar');

    if (step === 1 || step === 2) {
      // Restore sticky bar position in step 1 & 2
      if (stickyBar) {
        stickyBar.style.transform = '';
        stickyBar.style.zIndex = '';
        stickyBar.style.transition = 'transform 0.3s ease';
      }

      const el = document.getElementById('tutorial-rank-buttons-01') || document.querySelector('.tutorial-rank-group');
      if (el) {
        const rect = el.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        // Scroll so target is in the upper 20% of viewport
        const targetScrollY = Math.max(0, absoluteTop - window.innerHeight * 0.2);
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }
    } else if (step === 3) {
      // Temporarily elevate sticky bar above tutorial bottom sheet
      const currentSheetH = sheetRef.current ? sheetRef.current.getBoundingClientRect().height : sheetHeight;
      if (stickyBar) {
        stickyBar.style.transform = `translateY(-${currentSheetH + 16}px)`;
        stickyBar.style.zIndex = '1001';
        stickyBar.style.transition = 'transform 0.3s ease';
      }
    }

    // Delay rect computation to let smooth transitions finish
    const timeout = setTimeout(() => {
      updateSheetHeight();
      updateTargetRect();
    }, 250);

    const handleUpdate = () => {
      updateSheetHeight();
      updateTargetRect();
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('orientationchange', handleUpdate);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('orientationchange', handleUpdate);
    };
  }, [isOpen, step, updateSheetHeight, updateTargetRect, sheetHeight]);

  // Cleanup sticky bar transformation when tutorial closes
  useEffect(() => {
    return () => {
      const stickyBar = document.getElementById('tutorial-sticky-bar');
      if (stickyBar) {
        stickyBar.style.transform = '';
        stickyBar.style.zIndex = '';
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSkip = () => {
    // Restore sticky bar
    const stickyBar = document.getElementById('tutorial-sticky-bar');
    if (stickyBar) {
      stickyBar.style.transform = '';
      stickyBar.style.zIndex = '';
    }
    try {
      localStorage.setItem('axSummitTutorialSeen', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleFinish = () => {
    // Restore sticky bar
    const stickyBar = document.getElementById('tutorial-sticky-bar');
    if (stickyBar) {
      stickyBar.style.transform = '';
      stickyBar.style.zIndex = '';
    }
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

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden select-none animate-in fade-in duration-200">
      {/* 1. Backdrop Overlay (z-index 1000) */}
      <div
        className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
        onClick={handleNext}
      />

      {/* 2. STEP 1 & STEP 2: Crisp White Spotlight Highlight Element at z-[1001] */}
      {targetRect && (step === 1 || step === 2) && (
        <div
          className="fixed z-[1001] transition-all duration-300 pointer-events-none rounded-2xl p-1.5 bg-white border-2 border-[#1268C4] shadow-[0_0_25px_rgba(44,140,230,0.6)] flex items-center justify-center"
          style={{
            left: `${Math.max(8, targetRect.left - 6)}px`,
            top: `${Math.max(8, targetRect.top - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* High-Contrast White 1위 / 2위 / 3위 Buttons */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full h-full items-center">
            <div className="flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl bg-white border-2 border-[#1268C4] text-[#1268C4] font-black text-xs sm:text-sm shadow-xs">
              <span>🥇</span>
              <span>1위</span>
            </div>
            <div className="flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl bg-white border-2 border-[#1268C4] text-[#1268C4] font-black text-xs sm:text-sm shadow-xs">
              <span>🥈</span>
              <span>2위</span>
            </div>
            <div className="flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl bg-white border-2 border-[#1268C4] text-[#1268C4] font-black text-xs sm:text-sm shadow-xs">
              <span>🥉</span>
              <span>3위</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 Spotlight Highlight: Positioned Directly ABOVE the Tutorial Bottom Sheet */}
      {step === 3 && (
        <div
          className="fixed z-[1001] left-3 right-3 max-w-2xl mx-auto transition-all duration-300 pointer-events-none rounded-2xl p-2.5 sm:p-3 bg-white border-2 border-[#1268C4] shadow-[0_0_25px_rgba(44,140,230,0.6)] flex items-center justify-between"
          style={{
            bottom: `${sheetHeight + 20}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2.5 w-full px-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[10.5px] font-bold text-[#64748B]">선택 진행 상황</span>
                <span className="text-[9.5px] font-extrabold text-[#1268C4] bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE]">
                  3개 선택 후 활성화
                </span>
              </div>
              <div className="font-black text-xs sm:text-sm text-[#102A56] mt-0.5">
                0 / 3 선택 <span className="text-[11px] font-normal text-[#64748B]">(선택 예시)</span>
              </div>
            </div>

            <div className="min-h-[40px] px-3.5 sm:px-5 rounded-xl bg-white border-2 border-[#1268C4] text-[#1268C4] text-xs sm:text-sm font-black shadow-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1268C4]" />
              <span>선택 결과 확인</span>
              <ArrowRight className="w-4 h-4 text-[#1268C4]" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Fixed Bottom Sheet Tutorial Card (z-index 1010) */}
      <div
        ref={sheetRef}
        className="fixed z-[1010] left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] max-w-md mx-auto pointer-events-auto transition-all duration-300"
      >
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border-2 border-[#1268C4] text-[#102A56] relative">
          {/* Top Right Close Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-full text-[#94A3B8] hover:text-[#0A2E6D] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="튜토리얼 닫기"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Step Badge & Dots */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#0A2E6D] text-white font-black text-[10px] tracking-wider">
              STEP {step} / 3
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step === 1 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1] w-1.5'
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step === 2 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1] w-1.5'
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step === 3 ? 'bg-[#1268C4] w-4' : 'bg-[#CBD5E1] w-1.5'
                }`}
              />
            </div>
          </div>

          {/* STEP 1 CONTENT */}
          {step === 1 && (
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0A2E6D] tracking-tight leading-snug">
                여기서 순위를 선택해요
              </h3>
              <p className="text-xs text-[#475569] font-medium leading-relaxed">
                마음에 드는 발표 3개에 <strong className="text-[#1268C4] font-black">1위 · 2위 · 3위</strong>를 하나씩 선택해주세요.
              </p>
            </div>
          )}

          {/* STEP 2 CONTENT */}
          {step === 2 && (
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0A2E6D] tracking-tight leading-snug">
                잘못 선택해도 괜찮아요
              </h3>
              <p className="text-xs text-[#475569] font-medium leading-relaxed">
                선택한 순위 버튼을 <strong className="text-[#1268C4] font-black">한 번 더 누르면 취소</strong>할 수 있어요.
              </p>

              {/* Visual Flow Indicator */}
              <div className="mt-1.5 py-1 px-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-around text-[11px] font-bold text-[#334E68]">
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
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0A2E6D] tracking-tight leading-snug">
                마지막으로 선택을 확인해요
              </h3>
              <p className="text-xs text-[#475569] font-medium leading-relaxed">
                3개를 모두 선택하면 <strong className="text-[#1268C4] font-black">선택 결과를 확인하고 제출</strong>할 수 있어요.
              </p>
            </div>
          )}

          {/* White-based Clean Action Controls */}
          <div className="mt-3 pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleSkip}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#334E68] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                건너뛰기
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrev}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#334E68] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4 text-[#334E68]" />
                <span>이전</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-white border-2 border-[#1268C4] text-[#1268C4] hover:bg-[#EFF6FF] active:bg-[#DBEAFE] text-xs sm:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>다음</span>
                <ChevronRight className="w-4 h-4 text-[#1268C4]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-white border-2 border-[#0A2E6D] text-[#0A2E6D] hover:bg-[#EFF6FF] active:bg-[#DBEAFE] text-xs sm:text-sm font-black transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
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
