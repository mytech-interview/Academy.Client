import React, { useMemo } from 'react';
import { Mail, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { StudentItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';

interface StudentsTabProps {
  students: StudentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (student: StudentItem) => void;
  onDelete: (student: StudentItem) => void;
}

export default function StudentsTab({
  students,
  loading,
  error,
  searchQuery,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
}: StudentsTabProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (st) =>
        st.name.toLowerCase().includes(q) ||
        st.role.toLowerCase().includes(q) ||
        st.email.toLowerCase().includes(q) ||
        st.phone.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">სტუდენტების მართვა</h2>
          <p className="text-xs text-slate-400 mt-0.5">სტუდენტთა სია, პროფილების განახლება</p>
        </div>
        {/* <button
          onClick={onAdd}
          title="ეს ღილაკი ჯერ არააქტიურია — იხ. მესიჯი ჩატში"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition"
        >
          <Plus className="w-4 h-4" /> ახალი სტუდენტის დამატება
        </button> */}
      </div>

      {loading && <LoadingState label="სტუდენტები იტვირთება..." />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? `სტუდენტი ვერ მოიძებნა ძებნის კრიტერიუმით: "${searchQuery}"`
              : 'სტუდენტები ჯერ არ დამატებულა'
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${st.avatarBg} text-white text-2xl flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {st.avatarIcon}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                    STUDENT
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-base mt-0.5 truncate">{st.name}</h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {st.role || '— (პროგრამა მითითებული არაა)'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100/80 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{st.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{st.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onEdit(st)}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Pencil className="w-3.5 h-3.5" /> სტუდენტის რედაქტირება
                </button>
                {/* <button
                  onClick={() => onDelete(st)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                  title="წაშლა"
                >
                  <Trash2 className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}