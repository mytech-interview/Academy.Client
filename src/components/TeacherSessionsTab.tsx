import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Plus } from 'lucide-react';
import { Course, Session, User, Enrollment } from '../types';

interface TeacherSessionsTabProps {
  courses: Course[];
  sessions: Session[];
  registeredUsers: User[];
  enrollments: Enrollment[];
  selectedSessionId: string;
  onSelectSession: (id: string) => void;
  onOpenAddHW: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
];

export default function TeacherSessionsTab({
  courses,
  sessions,
  registeredUsers,
  enrollments,
  selectedSessionId,
  onSelectSession,
  onOpenAddHW,
}: TeacherSessionsTabProps) {
  const { t } = useTranslation();

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const activeCourse = activeSession
    ? courses.find((c) => c.id === activeSession.courseId)
    : null;

  const enrolledStudents = registeredUsers.filter(
    (u) =>
      activeSession?.enrolledStudentIds?.includes(u.id) ||
      enrollments.some(
        (e) => e.courseId === activeSession?.courseId && e.studentId === u.id
      )
  );

  return (
    <div className="space-y-6">
      {/* Session Selector Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {t('teacherDashboard.sessions.selectTitle')}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t('teacherDashboard.sessions.selectSub')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSessionId}
            onChange={(e) => onSelectSession(e.target.value)}
            className="bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.teacherName})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAddHW}
            className="flex items-center gap-2 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] px-5 py-2.5 text-xs font-bold text-white transition shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t('teacherDashboard.sessions.addHomework')}</span>
          </button>
        </div>
      </div>

      {activeSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Session Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#eeefeb] text-[#4f46e5] text-xs font-bold">
                  {activeCourse ? activeCourse.title : t('teacherDashboard.sessions.courseFallback')}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {activeSession.schedule}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">{activeSession.title}</h2>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.location')}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {activeSession.room || t('teacherDashboard.sessions.online')}
                  </p>
                </div>
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.startDate')}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {activeSession.startDate}
                  </p>
                </div>
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.students')}
                  </p>
                  <p className="text-xs font-bold text-[#4f46e5] mt-1">
                    {enrolledStudents.length} / {activeSession.maxStudents}
                  </p>
                </div>
              </div>
            </div>

            {/* Syllabus / Lessons Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#4f46e5]" />
                <span>{t('teacherDashboard.sessions.lessonsTitle')}</span>
              </h3>

              {activeCourse && activeCourse.lessons && activeCourse.lessons.length > 0 ? (
                <div className="space-y-3">
                  {activeCourse.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="p-4 rounded-xl bg-[#f8fafc] flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {idx + 1}. {lesson.title}
                        </p>
                        {lesson.content && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {lesson.content}
                          </p>
                        )}
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-extrabold text-slate-600 shrink-0 shadow-2xs">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium">
                  {t('teacherDashboard.sessions.noLessons')}
                </p>
              )}
            </div>
          </div>

          {/* Enrolled Students Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#4f46e5]" />
                  <span>{t('teacherDashboard.sessions.enrolledTitle')}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#f1f2fe] text-[#4f46e5] text-xs font-extrabold">
                  {enrolledStudents.length}
                </span>
              </h3>

              {enrolledStudents.length > 0 ? (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {enrolledStudents.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-xl bg-[#f8fafc] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar || AVATAR_PRESETS[1]}
                          alt=""
                          className="h-9 w-9 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{st.email}</p>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#f8fafc] rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">
                    {t('teacherDashboard.sessions.noStudents')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">
            {t('teacherDashboard.sessions.noSessions')}
          </p>
        </div>
      )}
    </div>
  );
}