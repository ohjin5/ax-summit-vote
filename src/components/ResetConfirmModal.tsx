import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-black text-slate-900">투표 결과 초기화</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            현재까지 저장된 모든 투표 결과가 삭제됩니다. 정말 초기화하시겠습니까?
          </p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            ※ 초기화 후에는 복구할 수 없습니다.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            id="btn-confirm-reset"
            type="button"
            disabled={isProcessing}
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>네, 초기화합니다</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
