import React, { useMemo, useState } from 'react';
import { Mail, Phone, Search, User, X } from 'lucide-react';
import { SessionItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';
import { StudentItem } from '../types';

// Student model displayed in the modal.
// Replace with an import from the project's shared types.ts if needed.

interface StudentsModalProps {
  session: SessionItem | null;
  students: StudentItem[];
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onRetry?: () => void;
}

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function StatusBadge({ status }: { status: StudentItem['status'] }) {
  const isPaid = status === 'paid';
  return (
    <span
      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 ${
        isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
      }`}
    >
      {isPaid ? 'გადახდილი' : 'არ არის გადახდილი'}
    </span>
  );
}

function StudentRow({ student }: { student: StudentItem }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/60 transition">
      {student.pictureUrl ? (
        <img
          src={student.pictureUrl}
          alt={`${student.firstName} ${student.lastName}`}
          className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-100"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
          {initials(student.firstName, student.lastName)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-800 truncate">
            {student.firstName} {student.lastName}
          </p>
          <StatusBadge status={student.status} />
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {student.email && (
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {student.email}
            </span>
          )}
          {student.phone && (
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {student.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentsModal({
  session,
  students,
  loading = false,
  error = null,
  onClose,
  onRetry,
}: StudentsModalProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName?.toLowerCase().includes(q) ||
        s.lastName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q)
    );
  }, [students, query]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 pb-4 space-y-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-base truncate">
                  სტუდენტები
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                  {session.courseTitle || session.sessionName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition shrink-0"
              title="დახურვა"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ძებნა სახელით, ტელეფონით ან ემაილით"
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 overflow-y-auto space-y-2">
          {loading && <LoadingState label="იტვირთება..." />}
          {!loading && error && <ErrorState message={error} onRetry={onRetry ?? (() => {})} />}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState
              message={
                query.trim()
                  ? `"${query}"-ის მიხედვით სტუდენტი ვერ მოიძებნა`
                  : 'სტუდენტები არ არის'
              }
            />
          )}
          {!loading &&
            !error &&
            filtered.map((s) => <StudentRow key={s.id} student={s} />)}
        </div>
      </div>
    </div>
  );
}