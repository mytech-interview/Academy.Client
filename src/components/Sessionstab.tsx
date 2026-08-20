import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, Clock, MapPin, Pencil, Plus, Trash2, User, Users } from 'lucide-react';
import { SessionItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';

interface SessionsTabProps {
  sessions: SessionItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (session: SessionItem) => void;
  onDelete: (session: SessionItem) => void | Promise<void>;
  onViewStudents?: (session: SessionItem) => void;
}

export default function SessionsTab({
  sessions,
  loading,
  error,
  searchQuery,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onViewStudents,
}: SessionsTabProps) {
  const [sessionToDelete, setSessionToDelete] = useState<SessionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.sessionName?.toLowerCase().includes(q) ||
        s.courseTitle?.toLowerCase().includes(q) ||
        s.instructor?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q)
    );
  }, [sessions, searchQuery]);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(sessionToDelete);
    } finally {
      setIsDeleting(false);
      setSessionToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800">აკადემიური სესიები / ნაკადები</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">მართეთ აქტიური და დაგეგმილი ნაკადები</p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4" /> ახალი სესიის დამატება
        </button>
      </div>

      {loading && <LoadingState label="სესიები იტვირთება..." />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? `სესია ვერ მოიძებნა ძებნის კრიტერიუმით: "${searchQuery}"`
              : 'სესიები ჯერ არ დამატებულა'
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-2xl max-w-[70%]">
                  <p className="text-xs font-bold text-purple-700 truncate">{s.courseTitle || s.sessionName}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">
                    {s.currentStudents ?? 0} / {s.maxStudents ?? 0} სტუდენტი
                  </span>
                </div>
              </div>

              {/* Session Title */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{s.sessionName}</h3>
              </div>

              {/* Session Details */}
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                 <User className="w-4 h-4 text-emerald-600 shrink-0" />
  <span>
    მიჩენილი ლექტორი: <strong className="text-slate-800">{s.instructor || '—'}</strong>
  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <div className="flex items-center gap-2">
  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
  <span>
    განრიგი: <strong className="text-slate-700">{s.lessonDaysDescription || '—'}</strong>
  </span>
</div> */}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    ლოკაცია: <strong className="text-slate-700">{s.location || '—'}</strong>
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewStudents && onViewStudents(s)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4" />
                  <span>სტუდენტების სია ({s.currentStudents ?? 0})</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(s)}
                    className="p-2 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition"
                    title="რედაქტირება"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSessionToDelete(s)}
                    className="p-2 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition"
                    title="წაშლა"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="pt-0.5">
                <h3 className="font-extrabold text-slate-900 text-base">წაშლის დადასტურება</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">ეს მოქმედება შეუქცევადია.</p>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-xs font-semibold text-slate-700 leading-relaxed">
              დარწმუნებული ხართ რომ გსურთ წაშალოთ:{' '}
              <span className="font-extrabold text-rose-600">
                "{sessionToDelete.sessionName || sessionToDelete.courseTitle}"
              </span>
              ?
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              >
                გაუქმება
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#ff004b] hover:bg-[#e00042] text-white flex items-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'იშლება...' : 'წაშლა'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}