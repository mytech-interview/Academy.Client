import React, { useState, useEffect } from 'react';
import { BookOpen, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { Language } from '../lib/translations';
import { getStudentSessions, StudentSession } from '../api/sessions';
import { AVATAR_OPTIONS, avatarUrl } from '../lib/avatars';

import { StudentProfileTab } from './StudentProfileTab';
import { StudentStudyTab } from './StudentStudyTab';

interface DashboardStudentProps {
  student: User;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
  lang: Language;
}

export default function DashboardStudent({
  student,
  onUpdateProfile,
  lang
}: DashboardStudentProps) {
  const { t } = useTranslation();

  // Tab control
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'profile'>('study');

  // Real enrolled sessions
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(true);
  const [sessionsError, setSessionsError] = useState<string>('');

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  // Profile fields state
  const defaultAvatar = avatarUrl(AVATAR_OPTIONS[0].seed, AVATAR_OPTIONS[0].bg);
  const [profName, setProfName] = useState(student.name);
  const [profEmail, setProfEmail] = useState(student.email);
  const [profPhone, setProfPhone] = useState((student as any).phone || '+995 555 12 34 56');
  const [profHeadline, setProfHeadline] = useState(student.headline || t('studentDashboard.defaultHeadline', 'სტუდენტი აკადემიაში'));
  const [profBio, setProfBio] = useState(student.bio || t('studentDashboard.defaultBio', 'მიზანდასახული სტუდენტი, რომელიც ეუფლება ტექნოლოგიურ უნარებს.'));
  const [profAvatar, setProfAvatar] = useState(student.avatar || defaultAvatar);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      try {
        setSessionsLoading(true);
        setSessionsError('');
        const result = await getStudentSessions(student.id);
        if (isMounted) setSessions(result);
      } catch (e: any) {
        if (isMounted) setSessionsError(e.message || t('studentDashboard.loadError'));
      } finally {
        if (isMounted) setSessionsLoading(false);
      }
    };

    loadSessions();
    return () => {
      isMounted = false;
    };
  }, [student.id, t]);

  const totalEnrolled = sessions.length;
  const avgProgress = 0;

  const activeSession = sessions.find((s) => s.sessionId === activeSessionId) || null;

  const handleSelectSession = (sessionId: number) => {
    setActiveSessionId(sessionId);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profName,
        email: profEmail,
        headline: profHeadline,
        bio: profBio,
        avatar: profAvatar,
        ...({ phone: profPhone } as any)
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2000);
    }
  };

  return (
    <div id="student-dashboard" className="space-y-6 text-left">
      {/* Dark Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A1021] px-6 py-8 sm:px-10 pb-14 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* User Profile Summary */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0 rounded-[1.5rem] bg-[#5842F8]/20 p-1.5 border border-[#5842F8]/40 shadow-inner">
              <img
                src={profAvatar}
                alt={profName}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-[1.2rem] object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="inline-block rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                {t('studentDashboard.badge', 'STUDENT CABINET')}
              </span>
              <h2 id="welcome-student-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {profName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">{profHeadline}</p>
            </div>
          </div>

          {/* Right Stat Card (Active Courses Only) */}
          <div className="flex gap-3 shrink-0">
            <div className="rounded-2xl bg-[#131B35]/80 border border-slate-800 px-7 py-3.5 text-center min-w-[110px] backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-[#5842F8]">{totalEnrolled}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                {t('studentDashboard.activeCoursesStat', 'აქტიური კურსები')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Overlapping Tabs Bar */}
      <div className="-mt-12 relative z-20 w-full">
        <div className="flex items-center gap-2.5 rounded-[1.75rem] bg-white p-2.5 shadow-xl shadow-slate-200/60 border border-slate-100 w-full">
          <button
            onClick={() => setActiveSubTab('study')}
            className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-extrabold transition duration-200 cursor-pointer ${
              activeSubTab === 'study'
                ? 'bg-[#5842F8] text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={16} />
            <span>{t('studentDashboard.studyTab', 'ჩემი კურსები & სესიები')}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeSubTab === 'study' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalEnrolled}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-extrabold transition duration-200 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-[#5842F8] text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserIcon size={16} />
            <span>{t('studentDashboard.profileTab', 'პირადი პროფილი')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-2">
        {activeSubTab === 'profile' ? (
          <StudentProfileTab
            student={student}
            profName={profName}
            setProfName={setProfName}
            profEmail={profEmail}
            setProfEmail={setProfEmail}
            profPhone={profPhone}
            setProfPhone={setProfPhone}
            profHeadline={profHeadline}
            setProfHeadline={setProfHeadline}
            profBio={profBio}
            setProfBio={setProfBio}
            profAvatar={profAvatar}
            setProfAvatar={setProfAvatar}
            onSubmit={handleProfileSubmit}
            profileSuccess={profileSuccess}
          />
        ) : (
          <StudentStudyTab
            sessionsLoading={sessionsLoading}
            sessionsError={sessionsError}
            activeSession={activeSession}
            sessions={sessions}
            avgProgress={avgProgress}
            lang={lang}
            onSelectSession={handleSelectSession}
            onLeaveClassroom={() => setActiveSessionId(null)}
          />
        )}
      </div>
    </div>
  );
}