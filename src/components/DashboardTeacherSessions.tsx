import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, ClipboardCheck, Briefcase } from 'lucide-react';
import { Course, Session, User, Enrollment, HomeWork, HomeWorkSubmission } from '../types';
import TeacherSessionsTab from './TeacherSessionsTab';
import TeacherHomeworksTab from './TeacherHomeworksTab';
import TeacherAttendanceTab from './TeacherAttendanceTab';
import TeacherProfileTab from './TeacherProfileTab';

interface DashboardTeacherSessionsProps {
  teacher: User;
  courses: Course[];
  sessions: Session[];
  enrollments: Enrollment[];
  homeworks: HomeWork[];
  homeworkSubmissions: HomeWorkSubmission[];
  registeredUsers: User[];
  onAddHomeWork: (newHW: HomeWork) => void;
  onGradeSubmission: (submissionId: string, grade: string, feedback: string) => void;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
}

type TabKey = 'sessions' | 'homeworks' | 'attendance' | 'profile';

export default function DashboardTeacherSessions({
  teacher,
  courses,
  sessions,
  enrollments,
  homeworks,
  homeworkSubmissions,
  registeredUsers,
  onAddHomeWork,
  onGradeSubmission,
  onUpdateProfile,
}: DashboardTeacherSessionsProps) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>('sessions');

  const mySessions = sessions.filter(
    (s) => s.teacherId === teacher.id || teacher.role === 'teacher'
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    mySessions[0]?.id || sessions[0]?.id || ''
  );
  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) || mySessions[0] || sessions[0];

  const teacherHomeWorks = homeworks.filter(
    (hw) =>
      mySessions.some((s) => s.id === hw.sessionId) ||
      hw.assignedByTeacherId === teacher.id
  );

  // Add HomeWork modal state
  const [showAddHWModal, setShowAddHWModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  const handleAddHomeWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !hwTitle) return;

    const newHW: HomeWork = {
      id: `hw-${Date.now()}`,
      sessionId: activeSession.id,
      courseId: activeSession.courseId,
      title: hwTitle,
      description: hwDesc,
      dueDate: hwDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedByTeacherId: teacher.id,
    };

    onAddHomeWork(newHW);
    setShowAddHWModal(false);
    setHwTitle('');
    setHwDesc('');
    setHwDueDate('');
  };

  // Grade modal state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState('100/100');
  const [feedbackValue, setFeedbackValue] = useState('');

  const openGrade = (submissionId: string, currentGrade?: string, currentFeedback?: string) => {
    setGradingSubId(submissionId);
    setGradeValue(currentGrade || '100/100');
    setFeedbackValue(currentFeedback || '');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;
    onGradeSubmission(gradingSubId, gradeValue, feedbackValue);
    setGradingSubId(null);
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
            
            {/* User Info */}
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

            {/* Stats Counter Cards */}
            <div className="flex items-center gap-3">
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl px-7 py-3 text-center min-w-[110px]">
                <p className="text-2xl font-black text-white">{mySessions.length}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {t('teacherDashboard.header.sessionsStat')}
                </p>
              </div>
              <div className="bg-[#111827]/80 border border-slate-800 rounded-xl px-7 py-3 text-center min-w-[110px]">
                <p className="text-2xl font-black text-white">{teacherHomeWorks.length}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {t('teacherDashboard.header.homeworksStat')}
                </p>
              </div>
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
                  {tab.key === 'homeworks' && (
                    <span
                      className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {homeworkSubmissions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'sessions' && (
            <TeacherSessionsTab
              courses={courses}
              sessions={sessions}
              registeredUsers={registeredUsers}
              enrollments={enrollments}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
              onOpenAddHW={() => setShowAddHWModal(true)}
            />
          )}

          {activeTab === 'homeworks' && (
            <TeacherHomeworksTab
              homeworks={homeworks}
              homeworkSubmissions={homeworkSubmissions}
              onOpenAddHW={() => setShowAddHWModal(true)}
              onOpenGrade={openGrade}
            />
          )}

          {activeTab === 'attendance' && (
            <TeacherAttendanceTab
              courses={courses} 
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={setSelectedSessionId}
              registeredUsers={registeredUsers}
              enrollments={enrollments}
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

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHWModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  {t('teacherDashboard.modals.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  {t('teacherDashboard.modals.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE SUBMISSION MODAL */}
      {gradingSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {t('teacherDashboard.modals.gradeTitle')}
            </h3>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.gradeLabel')}
                </label>
                <input
                  type="text"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder={t('teacherDashboard.modals.gradePlaceholder') as string}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.feedbackLabel')}
                </label>
                <textarea
                  rows={3}
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  {t('teacherDashboard.modals.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  {t('teacherDashboard.modals.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}