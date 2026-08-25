import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  CalendarRange,
  Clock,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SessionItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';

// Убирает время из ISO-даты: "2026-10-10T00:00:00" → "2026-10-10"
function formatDateOnly(value?: string | null): string {
  if (!value) return '—';
  return value.split('T')[0];
}

interface SessionsTabProps {
  sessions: SessionItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (session: SessionItem) => void;
  onDelete: (session: SessionItem) => void | Promise<void>;
  onViewStudents?: (session: SessionItem) => void;
}

// Единый "чип" для строки с деталями сессии — иконка в цветном кружке + текст
function DetailRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="text-xs text-slate-500 font-semibold min-w-0 truncate">
        {label}: <strong className="text-slate-800 font-bold">{value || '—'}</strong>
      </span>
    </div>
  );
}

export default function SessionsTab({
  sessions,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onViewStudents,
}: SessionsTabProps) {
  const { t } = useTranslation();
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
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">{t('sessionsTab.title')}</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{t('sessionsTab.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition hover:shadow-lg active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> {t('sessionsTab.addSession')}
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 ძიება სესიებში (ჩაწერეთ სესია, ლექტორი, ლოკაცია, განრიგი)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading && <LoadingState label={t('sessionsTab.loading')} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? t('sessionsTab.notFoundWithQuery', { query: searchQuery })
              : t('sessionsTab.noSessions')
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => {
            const isActive = s.isActive !== false;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm flex flex-col justify-between space-y-4 transition hover:shadow-lg hover:-translate-y-0.5 ${
                  isActive ? 'border-slate-100' : 'border-rose-200/70 bg-rose-50/20'
                }`}
              >
                {/* Header Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-2xl max-w-[65%]">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <p className="text-xs font-bold text-purple-700 truncate">
                      {s.courseTitle || s.sessionName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    {!isActive && (
                      <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-xs font-bold text-rose-600">{t('sessionsTab.inactive')}</span>
                      </div>
                    )}
                    <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">
                        {s.currentStudents ?? 0} / {s.maxStudents ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Details — единый стиль иконка-чип + текст */}
                <div className="space-y-2">
                  <DetailRow
                    icon={<User className="w-3.5 h-3.5" />}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    label={t('sessionsTab.instructor')}
                    value={s.instructor}
                  />
                  <DetailRow
                    icon={<Clock className="w-3.5 h-3.5" />}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    label={t('sessionsTab.schedule')}
                    value={s.lessonDaysDescription}
                  />
                  <DetailRow
                    icon={<MapPin className="w-3.5 h-3.5" />}
                    iconBg="bg-sky-50"
                    iconColor="text-sky-600"
                    label={t('sessionsTab.location')}
                    value={s.location}
                  />
                  {(s as any).weeks != null && (
                    <DetailRow
                      icon={<CalendarRange className="w-3.5 h-3.5" />}
                      iconBg="bg-teal-50"
                      iconColor="text-teal-600"
                      label={t('sessionsTab.duration')}
                      value={t('sessionsTab.weeksCount', { count: (s as any).weeks })}
                    />
                  )}
                  {(s.startDate || s.endDate) && (
                    <DetailRow
                      icon={<CalendarClock className="w-3.5 h-3.5" />}
                      iconBg="bg-violet-50"
                      iconColor="text-violet-600"
                      label={t('sessionsTab.dates')}
                      value={`${formatDateOnly(s.startDate)} → ${formatDateOnly(s.endDate)}`}
                    />
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewStudents && onViewStudents(s)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t('sessionsTab.studentsList', { count: s.currentStudents ?? 0 })}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(s)}
                      className="p-2.5 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition"
                      title={t('sessionsTab.edit')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSessionToDelete(s)}
                      className="p-2.5 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition"
                      title={t('sessionsTab.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                <h3 className="font-extrabold text-slate-900 text-base">{t('sessionsTab.deleteConfirmTitle')}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{t('sessionsTab.deleteConfirmSubtitle')}</p>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-xs font-semibold text-slate-700 leading-relaxed">
              {t('sessionsTab.deleteConfirmText')}{' '}
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
                {t('sessionsTab.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#ff004b] hover:bg-[#e00042] text-white flex items-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? t('sessionsTab.deleting') : t('sessionsTab.delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}