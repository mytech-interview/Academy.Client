import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import { User, Course, Enrollment } from '../types';
import { Language } from '../lib/translations';
import DashboardTeacherSessions from '../components/DashboardTeacherSessions';
import {
  getTeacherSessions,
  getHomeWorksForTeacher,
  TeacherSessionDto,
  TeacherHomeWorkDto,
} from '@/src/api/teacher';

interface TeacherDashboardPageProps {
  lang: Language;
  activeUser: User | null;
  courses: Course[];
  enrollments: Enrollment[];
  registeredUsers: User[];
  onUpdateProfile: (fields: Partial<User>) => void;
  onOpenAuth: () => void;
}

export default function TeacherDashboardPage({
  activeUser,
  courses,
  enrollments,
  registeredUsers,
  onUpdateProfile,
  onOpenAuth,
}: TeacherDashboardPageProps) {
  const { t } = useTranslation();

  const [sessions, setSessions] = useState<TeacherSessionDto[]>([]);
  const [homeworks, setHomeworks] = useState<TeacherHomeWorkDto[]>([]);
  // ВАЖНО: изначально true, чтобы не рендерить дочерний дашборд
  // с пустыми sessions/homeworks до того, как данные реально придут.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeUser || activeUser.role !== 'teacher') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getTeacherSessions(activeUser.id),
      getHomeWorksForTeacher(activeUser.id),
    ])
      .then(([sessionsRes, homeworksRes]) => {
        if (cancelled) return;
        setSessions(sessionsRes.sessions ?? []);
        setHomeworks(homeworksRes.homeWorks ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeUser]);

  if (!activeUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />
          <GraduationCap className="mx-auto h-16 w-16 text-indigo-500 animate-pulse" />
          <h3 className="text-lg font-black text-slate-950 tracking-tight">
            {t('teacherDashboard.page.authRequiredTitle')}
          </h3>
          <button
            onClick={onOpenAuth}
            className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md active:scale-[0.98]"
          >
            {t('teacherDashboard.page.loginBtn')}
          </button>
        </div>
      </div>
    );
  }

  if (activeUser.role !== 'teacher') {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg">
          <GraduationCap className="mx-auto h-16 w-16 text-amber-500" />
          <h3 className="text-lg font-black text-slate-950 tracking-tight">
            {t('teacherDashboard.page.teachersOnlyTitle')}
          </h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-10 text-center text-xs text-slate-400"> {t('courseDetailModal.loading')}...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-xs text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <DashboardTeacherSessions
      teacher={activeUser}
      courses={courses}
      sessions={sessions}
      homeworks={homeworks}
      enrollments={enrollments}
      registeredUsers={registeredUsers}
      onUpdateProfile={onUpdateProfile}
      onHomeworkAdded={() => {
        getHomeWorksForTeacher(activeUser.id).then((res) => {
          setHomeworks(res.homeWorks ?? []);
        });
      }}
    />
  );
}