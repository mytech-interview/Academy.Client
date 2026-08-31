import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Plus, ChevronDown } from 'lucide-react';
import {
  TeacherSessionDto,
  SessionStudentDto,
  SessionLessonDto,
  getAllStudentsOfSpecificSession,
  getLessonsForSession,
} from '@/src/api/teacher';

interface TeacherSessionsTabProps {
  teacherGuid: string;
  sessions: TeacherSessionDto[];
  selectedSessionId: number;
  onSelectSession: (id: number) => void;
  onOpenAddHW: () => void;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

export default function TeacherSessionsTab({
  teacherGuid,
  sessions,
  selectedSessionId,
  onSelectSession,
  onOpenAddHW,
}: TeacherSessionsTabProps) {
  const { t } = useTranslation();

  const activeSession =
    sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0];

  const [students, setStudents] = useState<SessionStudentDto[]>([]);
  const [lessons, setLessons] = useState<SessionLessonDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Открытый (раскрытый) урок в аккордеоне. Только один за раз.
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);

  const toggleLesson = (id: number) => {
    setOpenLessonId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!activeSession) return;

    let cancelled = false;
    setLoading(true);

    Promise.all([
      getAllStudentsOfSpecificSession(teacherGuid, activeSession.sessionId),
      getLessonsForSession(activeSession.sessionId),
    ])
      .then(([studentsRes, lessonsRes]) => {
        if (cancelled) return;
        setStudents(studentsRes.students ?? []);
        setLessons(lessonsRes.lessons ?? []);
      })
      .catch((e) => {
        console.error('Ошибка загрузки студентов/уроков:', e);
        if (!cancelled) {
          setStudents([]);
          setLessons([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSession?.sessionId, teacherGuid]);

  // При смене сессии закрываем ранее открытый урок, чтобы не путать разные списки.
  useEffect(() => {
    setOpenLessonId(null);
  }, [activeSession?.sessionId]);

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

        <div className="flex items-center gap-3 w-full">
          <select
            value={selectedSessionId}
            onChange={(e) => onSelectSession(Number(e.target.value))}
            className="w-[580px] max-w-full min-w-0 bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer truncate"
          >
            {sessions.map((s) => (
              <option key={s.sessionId} value={s.sessionId}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenAddHW}
            className="flex items-center gap-2 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] px-3 py-2.5 text-xs font-bold text-white transition shadow-md active:scale-95 cursor-pointer shrink-0"
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
                  {activeSession.title}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {activeSession.lessonDaysDescription}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">{activeSession.title}</h2>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.location')}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {activeSession.city || t('teacherDashboard.sessions.online')}
                  </p>
                </div>
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.startDate')}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {new Date(activeSession.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3.5 bg-[#f8fafc] rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('teacherDashboard.sessions.students')}
                  </p>
                  <p className="text-xs font-bold text-[#4f46e5] mt-1">
                    {activeSession.enrolledStudents} / {activeSession.maxStudents}
                  </p>
                </div>
              </div>
            </div>

            {/* Syllabus / Lessons Card */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-400" />
                    <span>
                      {t('teacherDashboard.sessions.lessonsTitle', {
                        count: lessons.length,
                        defaultValue: `გაკვეთილები (${lessons.length})`
                      })}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('teacherDashboard.sessions.lessonsSubtitle', 'კურსზე დამატებული გაკვეთილების სრული სია')}
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-xs text-slate-400 font-medium">…</p>
              ) : lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => {
                    // Бэкенд пока не присылает title для уроков (приходит
                    // пустой строкой), поэтому используем description
                    // как основной текст, если title пустой.
                    const heading = lesson.title?.trim()
                      ? lesson.title
                      : lesson.description?.trim()
                      ? lesson.description
                      : `${t('teacherDashboard.sessions.lessonPrefix') || 'Lesson'} ${
                          lesson.lessonNumber ?? idx + 1
                        }`;

                    // Отдельную строку с описанием показываем только
                    // если title реально заполнен (иначе получится
                    // дублирование одного и того же текста).
                    const showSeparateDescription =
                      Boolean(lesson.title?.trim()) && Boolean(lesson.description?.trim());

                    const isOpen = openLessonId === lesson.courseLessonId;

                    return (
                      <div
                        key={lesson.courseLessonId}
                        className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden transition"
                      >
                        <button
                          type="button"
                          onClick={() => showSeparateDescription && toggleLesson(lesson.courseLessonId)}
                          className={`w-full p-4 flex items-center justify-between gap-4 text-left transition ${
                            showSeparateDescription ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900">
                            {idx + 1}. {heading}
                          </p>
                          {showSeparateDescription && (
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>

                        {showSeparateDescription && (
                          <div
                            className={`grid transition-all duration-200 ease-in-out ${
                              isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="text-xs text-slate-500 leading-relaxed px-4 pb-4 whitespace-pre-line">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                  {students.length}
                </span>
              </h3>

              {loading ? (
                <p className="text-xs text-slate-400 font-medium">…</p>
              ) : students.length > 0 ? (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {students.map((st) => (
                    <div
                      key={st.studentGuid}
                      className="p-3.5 rounded-xl bg-[#f8fafc] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.picture || FALLBACK_AVATAR}
                          alt=""
                          className="h-9 w-9 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {st.firstName} {st.lastName}
                          </p>
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