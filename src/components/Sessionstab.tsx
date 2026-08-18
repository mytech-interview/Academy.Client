import React, { useMemo } from 'react';
import { Clock, Pencil, Plus, Trash2, User, Users } from 'lucide-react';
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
  onDelete: (session: SessionItem) => void;
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
}: SessionsTabProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.sessionName.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q) ||
        s.instructor.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );
  }, [sessions, searchQuery]);
 
  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">აკადემიური სესიები / ნაკადები</h2>
          <p className="text-xs text-slate-400 mt-0.5">მართეთ აქტიური და დაგეგმილი ნაკადები</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition"
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
              className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="bg-purple-50/70 border border-purple-100 px-3 py-1.5 rounded-xl flex-1">
                  <p className="text-xs font-extrabold text-purple-800 line-clamp-1">{s.courseTitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400 inline" />
                    {s.maxStudents > 0 ? `${s.currentStudents} / ${s.maxStudents}` : s.currentStudents}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold">სტუდენტი</p>
                </div>
              </div>
 
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{s.sessionName}</h3>
              </div>
 
              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    მიჩენილი ლექტორი: <strong className="text-slate-800">{s.instructor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    განრიგი: <strong className="text-slate-800">{s.schedule || '—'}</strong>
                  </span>
                </div>
              </div>
 
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onEdit(s)}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Pencil className="w-3.5 h-3.5" /> სესიის რედაქტირება
                </button>
                <button
                  onClick={() => onDelete(s)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                  title="წაშლა"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
 