import React, { useMemo, useState } from 'react';
import { Mail, Pencil, Plus, Power, PowerOff, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LecturerItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';
import LecturerModal from './LecturerModal'; // Импортируем модалку

interface LecturersTabProps {
  lecturers: LecturerItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
  onAdd: (newLecturer: Partial<LecturerItem>) => void;
  onEdit: (lecturer: LecturerItem) => void;
  onDelete: (lecturer: LecturerItem) => void; // ← фактически toggle isActive (см. AdminDashboardPage)
  onTogglePin: (id: string) => void;
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

export default function LecturersTab({
  lecturers,
  loading,
  error,
  searchQuery,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onTogglePin,
}: LecturersTabProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerItem | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return lecturers;
    const q = searchQuery.toLowerCase();
    return lecturers.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.role.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.bio.toLowerCase().includes(q)
    );
  }, [lecturers, searchQuery]);

  const handleOpenAddModal = () => {
    setSelectedLecturer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lecturer: LecturerItem) => {
    setSelectedLecturer(lecturer);
    setIsModalOpen(true);
  };

  const handleSaveLecturer = (data: Partial<LecturerItem>) => {
    if (selectedLecturer) {
      onEdit({ ...selectedLecturer, ...data } as LecturerItem);
    } else {
      onAdd(data);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">{t('lecturers.title')}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t('lecturers.subtitle')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition"
        >
          <Plus className="w-4 h-4" /> {t('lecturers.addLecturer')}
        </button>
      </div>

      {loading && <LoadingState label={t('lecturers.loading')} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? t('lecturers.notFound', { query: searchQuery })
              : t('lecturers.empty')
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((lec) => {
            // isActive может отсутствовать в типе — по умолчанию считаем активным
            const isActive = (lec as any).isActive !== false;

            return (
              <div
                key={lec.id}
                className={`bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between space-y-5 transition ${
                  isActive
                    ? 'border-slate-200/80 hover:shadow-md'
                    : 'border-rose-200/70 bg-rose-50/30 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <AvatarDisplay value={lec.avatarIcon} bgClass={lec.avatarBg} dimmed={!isActive} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md uppercase">
                        LECTURER
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          isActive
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-rose-600 bg-rose-100'
                        }`}
                      >
                        {isActive ? t('lecturers.active') : t('lecturers.inactive')}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base mt-0.5 truncate">{lec.name}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {lec.role || t('lecturers.noRole')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100/80">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{lec.email}</span>
                  </div>
                  <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
                    {lec.bio || t('lecturers.noBio')}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onTogglePin(lec.id)}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                      lec.isPinned
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${lec.isPinned ? 'fill-white' : 'fill-amber-400'}`} />
                    {lec.isPinned ? t('lecturers.pinned') : t('lecturers.pin')}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(lec)}
                      className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" /> {t('lecturers.edit')}
                    </button>
                    <button
                      onClick={() => onDelete(lec)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isActive
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                      }`}
                      title={isActive ? t('lecturers.deactivate') : t('lecturers.activate')}
                    >
                      {isActive ? (
                        <>
                          <PowerOff className="w-3.5 h-3.5" /> {t('lecturers.deactivate')}
                        </>
                      ) : (
                        <>
                          <Power className="w-3.5 h-3.5" /> {t('lecturers.activate')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <LecturerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLecturer}
        initialData={selectedLecturer}
      />
    </>
  );
}