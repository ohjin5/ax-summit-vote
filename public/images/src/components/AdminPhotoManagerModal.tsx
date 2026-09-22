import React, { useState } from 'react';
import { Team } from '../types';
import { PresenterImage } from './PresenterImage';
import { X, Image as ImageIcon, Save, Check, RotateCcw } from 'lucide-react';

interface AdminPhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  token: string;
  onUpdated: () => void;
}

export const AdminPhotoManagerModal: React.FC<AdminPhotoManagerModalProps> = ({
  isOpen,
  onClose,
  teams,
  token,
  onUpdated,
}) => {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setImageUrlInput(team.image || '');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSave = async (teamId: string) => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/teams/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId,
          imageUrl: imageUrlInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('대표 이미지가 성공적으로 저장되었습니다.');
        setEditingTeamId(null);
        onUpdated();
      } else {
        setErrorMessage(data.error || '이미지 저장에 실패했습니다.');
      }
    } catch {
      setErrorMessage('서버와 통신할 수 없습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-base">발표팀 대표 사진 / 썸네일 관리</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info & Notices */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between">
          <span>각 발표팀의 사진 URL을 등록하거나 변경할 수 있습니다. 변경 사항은 투표 화면에 즉시 반영됩니다.</span>
          {successMessage && <span className="font-bold text-emerald-700">✓ {successMessage}</span>}
          {errorMessage && <span className="font-bold text-rose-600">✕ {errorMessage}</span>}
        </div>

        {/* Teams List */}
        <div className="p-6 overflow-y-auto divide-y divide-slate-100 flex-1 space-y-3">
          {teams.map((team) => {
            const isEditing = editingTeamId === team.id;

            return (
              <div
                key={team.id}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <PresenterImage
                    src={team.image}
                    alt={team.title}
                    presentationNumber={team.presentationNumber}
                    trackId={team.track}
                    size="sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        발표 {team.presentationNumber}
                      </span>
                      <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {team.trackTitle}
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900">{team.title}</div>
                    <div className="text-xs text-slate-500">
                      {team.department} · {team.presenter}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://... (이미지 주소)"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="w-56 sm:w-72 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave(team.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-800 disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTeamId(null)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs hover:bg-slate-50"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(team)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                    >
                      사진 변경
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
