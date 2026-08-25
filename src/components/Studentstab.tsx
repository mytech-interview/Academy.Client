import React, { useMemo } from 'react';
import { Mail, Pencil, Phone, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StudentItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';

interface StudentsTabProps {
  students: StudentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
  onEdit: (student: StudentItem) => void;
  onDelete: (student: StudentItem) => void; // ← фактически toggle isActive (см. AdminDashboardPage)
}

function isImageUrl(value: string): boolean {
  return /^https?:\/\//.test(value) || value.startsWith('data:image');
}

function AvatarDisplay({ value, bgClass, dimmed }: { value: string; bgClass: string; dimmed?: boolean }) {
  if (value && isImageUrl(value)) {
    return (
      <div
        className={`w-14 h-14 rounded-2xl ${bgClass} shrink-0 shadow-sm overflow-hidden flex items-center justify-center ${
          dimmed ? 'grayscale opacity-60' : ''
        }`}
      >
        <img src={value} alt="avatar" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`w-14 h-14 rounded-2xl ${bgClass} text-white text-2xl flex items-center justify-center shrink-0 shadow-sm ${
        dimmed ? 'grayscale opacity-60' : ''
      }`}
    >
      {value || '🎓'}
    </div>
  );
}

export default function StudentsTab({
  students,
  loading,
  error,
  searchQuery,
  onRetry,
  onEdit,
  onDelete,
}: StudentsTabProps) {
  const { t } = useTranslation();

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
          <h2 className="text-base font-black text-slate-800">{t('studentsTab.title')}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t('studentsTab.subtitle')}</p>
        </div>
      </div>

      {loading && <LoadingState label={t('studentsTab.loading')} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? t('studentsTab.emptySearch', { query: searchQuery })
              : t('studentsTab.emptyList')
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((st) => {
            // isActive может отсутствовать в типе — по умолчанию считаем активным
            const isActive = (st as any).isActive !== false;

            return (
              <div
                key={st.id}
                className={`bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between space-y-5 transition ${
                  isActive
                    ? 'border-slate-200/80 hover:shadow-md'
                    : 'border-rose-200/70 bg-rose-50/30 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <AvatarDisplay value={st.avatarIcon} bgClass={st.avatarBg} dimmed={!isActive} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                        {t('studentsTab.studentBadge')}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          isActive
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-rose-600 bg-rose-100'
                        }`}
                      >
                        {isActive ? t('studentsTab.active') : t('studentsTab.inactive')}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base mt-0.5 truncate">{st.name}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {st.role || t('studentsTab.noProgram')}
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
                    <span className="truncate">{st.phone || t('studentsTab.notAvailable')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onEdit(st)}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" /> 
                  </button>
                  <button
                    onClick={() => onDelete(st)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isActive
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    }`}
                    
                  >
                    {isActive ? (
                      <>
                        <PowerOff className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Power className="w-3.5 h-3.5" /> 
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}