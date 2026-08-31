import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, ClipboardCheck, Briefcase, Paperclip, X } from 'lucide-react';
import { User, Enrollment } from '../types';
import { TeacherSessionDto, TeacherHomeWorkDto, addHomeWork } from '@/src/api/teacher';
import TeacherSessionsTab from './TeacherSessionsTab';
import TeacherHomeworksTab from './TeacherHomeworksTab';
import TeacherAttendanceTab from './TeacherAttendanceTab';
import TeacherProfileTab from './TeacherProfileTab';

interface DashboardTeacherSessionsProps {
  teacher: User;
  courses: any[]; 
  sessions: TeacherSessionDto[];
  enrollments: Enrollment[];
  homeworks: TeacherHomeWorkDto[];
  registeredUsers: User[];
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
  onHomeworkAdded?: () => void; 
}

type TabKey = 'sessions' | 'homeworks' | 'attendance' | 'profile';

export default function DashboardTeacherSessions({
  teacher,
  courses,
  sessions,
  enrollments,
  homeworks,
  registeredUsers,
  onUpdateProfile,
  onHomeworkAdded,
}: DashboardTeacherSessionsProps) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>('sessions');


  const [selectedSessionId, setSelectedSessionId] = useState<number>(0);

  useEffect(() => {
    if (sessions.length === 0) return;
    const stillValid = sessions.some((s) => s.sessionId === selectedSessionId);
    if (!stillValid) {
      setSelectedSessionId(sessions[0].sessionId);
    }
  }, [sessions]);

  const activeSession =
    sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0];

  // Add HomeWork modal state
  const [showAddHWModal, setShowAddHWModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwFile, setHwFile] = useState<File | null>(null);
  const [hwSubmitting, setHwSubmitting] = useState(false);
  const [hwError, setHwError] = useState<string | null>(null);

  const handleHwFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setHwFile(file);
  };

  const handleAddHomeWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !hwTitle) return;

    setHwSubmitting(true);
    setHwError(null);

    try {
      const filePath = hwFile ? URL.createObjectURL(hwFile) : '';

      await addHomeWork({
        sessionId: activeSession.sessionId,
        teacherGuid: teacher.id,
        title: hwTitle,
        description: hwDesc,
        lessonDate: new Date().toISOString(),
        dueDate: hwDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        filePath,
      });

      setShowAddHWModal(false);
      setHwTitle('');
      setHwDesc('');
      setHwDueDate('');
      setHwFile(null);
      onHomeworkAdded?.();
    } catch (err: any) {
      setHwError(err.message || 'An error occurred while adding homework.');
    } finally {
      setHwSubmitting(false);
    }
  };

  const tabs: { key: TabKey; icon: React.ReactNode; labelKey: string }[] = [
    { key: 'sessions', icon: <Calendar className="h-4 w-4" />, labelKey: 'teacherDashboard.tabs.sessions' },
    { key: 'homeworks', icon: <FileText className="h-4 w-4" />, labelKey: 'teacherDashboard.tabs.homeworks' },
    { key: 'attendance', icon: <ClipboardCheck className="h-4 w-4" />, labelKey: 'teacherDashboard.tabs.attendance' },
    { key: 'profile', icon: <Briefcase className="h-4 w-4" />, labelKey: 'teacherDashboard.tabs.profile' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner Section */}
        <div className="bg-[#0b132b] text-white rounded-2xl p-6 sm:p-8 pt-8 pb-14 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">

            <div className="flex items-center gap-5">
              <div className="p-1.5 bg-[#1c2541] rounded-2xl shadow-inner shrink-0">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover"
                />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-[#1e293b] text-indigo-300 text-[10px] font-bold tracking-widest uppercase mb-1.5">
                  {t('teacherDashboard.header.badge')}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {teacher.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {teacher.headline || t('teacherDashboard.header.defaultHeadline')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl px-7 py-3 text-center min-w-[110px]">
                <p className="text-2xl font-black text-white">{sessions.length}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  კურსი
                </p>
              </div>
              {/* <div className="bg-[#111827]/80 border border-slate-800 rounded-xl px-7 py-3 text-center min-w-[110px]">
                <p className="text-2xl font-black text-white">{homeworks.length}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {t('teacherDashboard.header.homeworksStat')}
                </p>
              </div> */}
            </div>

          </div>
        </div>

        {/* Floating Navigation Tabs Bar */}
        <div className="max-w-[96%] mx-auto -mt-6 relative z-20">
          <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-lg flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4f46e5] text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  <span>{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'sessions' && (
            <TeacherSessionsTab
              teacherGuid={teacher.id}
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
              onOpenAddHW={() => setShowAddHWModal(true)}
            />
          )}

          {activeTab === 'homeworks' && (
            <TeacherHomeworksTab
              teacherGuid={teacher.id}
              homeworks={homeworks}
              onOpenAddHW={() => setShowAddHWModal(true)}
            />
          )}

          {activeTab === 'attendance' && (
            <TeacherAttendanceTab
              teacherGuid={teacher.id}
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
            />
          )}

          {activeTab === 'profile' && (
            <TeacherProfileTab teacher={teacher} onUpdateProfile={onUpdateProfile} />
          )}
        </div>

      </div>

      {/* ADD HOMEWORK MODAL */}
      {showAddHWModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {t('teacherDashboard.modals.addHomeworkTitle')}
            </h3>

            {hwError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {hwError}
              </div>
            )}

            <form onSubmit={handleAddHomeWorkSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.sessionLabel')}
                </label>
                <input
                  type="text"
                  value={activeSession?.title || ''}
                  disabled
                  className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.hwTitleLabel')}
                </label>
                <input
                  type="text"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder={t('teacherDashboard.modals.hwTitlePlaceholder') as string}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.descriptionLabel')}
                </label>
                <textarea
                  rows={3}
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder={t('teacherDashboard.modals.descriptionPlaceholder') as string}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.dueDateLabel')}
                </label>
                <input
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.fileLabel')}
                </label>

                {hwFile ? (
                  <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 truncate">
                        {hwFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHwFile(null)}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 shrink-0 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition">
                    <Paperclip className="h-4 w-4" />
                    <span>{t('teacherDashboard.modals.filePlaceholder')}</span>
                    <input
                      type="file"
                      onChange={handleHwFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddHWModal(false);
                    setHwFile(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  {t('teacherDashboard.modals.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={hwSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {hwSubmitting ? '...' : t('teacherDashboard.modals.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}