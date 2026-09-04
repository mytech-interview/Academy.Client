import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClipboardCheck,
  Calendar,
  BookOpen,
  Check,
  X,
  Loader2,
  MessageSquare,
  ChevronDown,
  Send,
} from 'lucide-react';
import {
  TeacherSessionDto,
  SessionLessonDto,
  StudentAttendanceRowDto,
  getLessonsForSession,
  getStudentAttendancesPerLesson,
  addStudentAttendance,
} from '@/src/api/teacher';

interface TeacherAttendanceTabProps {
  teacherGuid: string;
  sessions: TeacherSessionDto[];
  selectedSessionId: number;
  onSelectSession: (id: number) => void;
}

export default function TeacherAttendanceTab({
  teacherGuid,
  sessions,
  selectedSessionId,
  onSelectSession,
}: TeacherAttendanceTabProps) {
  const { t } = useTranslation();

  const activeSession = sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0];

  const [lessons, setLessons] = useState<SessionLessonDto[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [students, setStudents] = useState<StudentAttendanceRowDto[]>([]);
  const [loading, setLoading] = useState(false);

  // ID студентов, для которых сейчас идёт запрос на сервер (индивидуально)
  const [savingStudentIds, setSavingStudentIds] = useState<Set<string>>(new Set());
  // ID студентов, для которых последний запрос упал с ошибкой
  const [errorStudentIds, setErrorStudentIds] = useState<Set<string>>(new Set());
  // ID студентов, у которых только что успешно сохранилось (для галочки)
  const [savedStudentIds, setSavedStudentIds] = useState<Set<string>>(new Set());

  // какой студент сейчас раскрыт (показано поле сообщения)
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  // черновики сообщений по studentGuid, чтобы не терять ввод при ререндерах
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  // отдельный индикатор сохранения именно сообщения (не статуса)
  const [savingMessageIds, setSavingMessageIds] = useState<Set<string>>(new Set());

  // загрузка списка уроков при смене сессии
  useEffect(() => {
    if (!activeSession) return;

    let cancelled = false;
    getLessonsForSession(activeSession.sessionId)
      .then((res) => {
        if (cancelled) return;
        setLessons(res.lessons ?? []);
        setSelectedLessonId(res.lessons?.[0]?.courseLessonId ?? null);
      })
      .catch((e) => {
        console.error('[Attendance] Ошибка загрузки уроков:', e);
        if (!cancelled) {
          setLessons([]);
          setSelectedLessonId(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeSession?.sessionId]);

  // загрузка посещаемости при смене урока
  useEffect(() => {
    if (!activeSession || !selectedLessonId) {
      setStudents([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    getStudentAttendancesPerLesson(teacherGuid, activeSession.sessionId, selectedLessonId)
      .then((res) => {
        if (cancelled) return;
        const list = res.students ?? [];
        setStudents(list);
        // подтягиваем существующие сообщения в черновики
        setMessageDrafts(
          Object.fromEntries(list.map((s) => [s.studentGuid, s.message ?? '']))
        );
      })
      .catch((e) => {
        console.error('[Attendance] Ошибка загрузки посещаемости:', e);
        if (!cancelled) setStudents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // сбрасываем индикаторы при смене урока
    setSavingStudentIds(new Set());
    setErrorStudentIds(new Set());
    setSavedStudentIds(new Set());
    setExpandedStudentId(null);
    setSavingMessageIds(new Set());

    return () => {
      cancelled = true;
    };
  }, [activeSession?.sessionId, selectedLessonId, teacherGuid]);

  const selectedLesson = lessons.find((l) => l.courseLessonId === selectedLessonId);

  // Клик по кнопке "Был" / "Не был" — сразу шлёт запрос для этого студента
  const handleSetStatus = async (studentGuid: string, wasAttended: boolean) => {
    if (!activeSession || !selectedLessonId) return;

    const prevStudent = students.find((s) => s.studentGuid === studentGuid);
    if (!prevStudent) return;

    const currentMessage = messageDrafts[studentGuid] ?? prevStudent.message ?? '';

    // Оптимистично обновляем UI сразу
    setStudents((prev) =>
      prev.map((s) => (s.studentGuid === studentGuid ? { ...s, wasAttended } : s))
    );

    setSavingStudentIds((prev) => new Set(prev).add(studentGuid));
    setErrorStudentIds((prev) => {
      const next = new Set(prev);
      next.delete(studentGuid);
      return next;
    });

    try {
      await addStudentAttendance({
        teacherGuid,
        studentGuid,
        sessionId: activeSession.sessionId,
        lessonId: selectedLessonId,
        wasAttended,
        message: currentMessage,
      });

      setSavedStudentIds((prev) => new Set(prev).add(studentGuid));
      setTimeout(() => {
        setSavedStudentIds((prev) => {
          const next = new Set(prev);
          next.delete(studentGuid);
          return next;
        });
      }, 2000);
    } catch (e) {
      console.error('[Attendance] Ошибка сохранения посещаемости для студента', studentGuid, e);

      // откатываем UI назад к прежнему значению, раз запрос не прошёл
      setStudents((prev) =>
        prev.map((s) =>
          s.studentGuid === studentGuid ? { ...s, wasAttended: prevStudent.wasAttended } : s
        )
      );

      setErrorStudentIds((prev) => new Set(prev).add(studentGuid));
    } finally {
      setSavingStudentIds((prev) => {
        const next = new Set(prev);
        next.delete(studentGuid);
        return next;
      });
    }
  };

  // Сохранение только сообщения (текущий статус посещения не трогаем)
  const handleSaveMessage = async (studentGuid: string) => {
    if (!activeSession || !selectedLessonId) return;

    const student = students.find((s) => s.studentGuid === studentGuid);
    if (!student) return;

    const message = messageDrafts[studentGuid] ?? '';

    setSavingMessageIds((prev) => new Set(prev).add(studentGuid));
    setErrorStudentIds((prev) => {
      const next = new Set(prev);
      next.delete(studentGuid);
      return next;
    });

    try {
      await addStudentAttendance({
        teacherGuid,
        studentGuid,
        sessionId: activeSession.sessionId,
        lessonId: selectedLessonId,
        wasAttended: student.wasAttended,
        message,
      });

      setStudents((prev) =>
        prev.map((s) => (s.studentGuid === studentGuid ? { ...s, message } : s))
      );

      setSavedStudentIds((prev) => new Set(prev).add(studentGuid));
      setTimeout(() => {
        setSavedStudentIds((prev) => {
          const next = new Set(prev);
          next.delete(studentGuid);
          return next;
        });
      }, 2000);
    } catch (e) {
      console.error('[Attendance] Ошибка сохранения сообщения для студента', studentGuid, e);
      setErrorStudentIds((prev) => new Set(prev).add(studentGuid));
    } finally {
      setSavingMessageIds((prev) => {
        const next = new Set(prev);
        next.delete(studentGuid);
        return next;
      });
    }
  };

  const toggleExpanded = (studentGuid: string) => {
    setExpandedStudentId((prev) => (prev === studentGuid ? null : studentGuid));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selectors Block */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 text-[#5850ec] rounded-xl shrink-0 mt-0.5">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {t('teacherDashboard.attendance.title')}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {t('teacherDashboard.attendance.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {t('teacherDashboard.courseTitle')}
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => onSelectSession(Number(e.target.value))}
              className="bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer max-w-[220px] truncate"
            >
              {sessions.map((s) => (
                <option key={s.sessionId} value={s.sessionId}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {t('teacherDashboard.attendance.whichLesson')}
            </label>
            <select
              value={selectedLessonId ?? ''}
              onChange={(e) => setSelectedLessonId(Number(e.target.value))}
              className="bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer max-w-[260px] truncate"
            >
              {lessons.length > 0 ? (
                lessons.map((lesson, idx) => (
                  <option key={lesson.courseLessonId} value={lesson.courseLessonId}>
                    {t('teacherDashboard.attendance.lessonPrefix')} #{idx + 1}: {lesson.title}
                  </option>
                ))
              ) : (
                <option value="">{t('teacherDashboard.attendance.noLessons')}</option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {t('teacherDashboard.attendance.dateLabel')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#f8fafc] border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Selected Lesson Banner */}
      <div className="bg-[#f5f3ff] border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5850ec] text-white rounded-xl shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#5850ec] uppercase tracking-wider block">
              {t('teacherDashboard.attendance.selectedLessonForAttendance')}
            </span>
            <p className="text-xs font-extrabold text-slate-900 mt-0.5">
              {selectedLesson ? selectedLesson.title : t('teacherDashboard.attendance.noLessonSelected')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-100 text-[11px] font-bold text-[#5850ec] shrink-0 self-start sm:self-auto shadow-2xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>{t('teacherDashboard.attendance.dateLabel')}: {selectedDate}</span>
        </div>
      </div>

      {/* Main Attendance List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            {t('teacherDashboard.attendance.sessionLabel')}: {activeSession?.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t('teacherDashboard.attendance.totalRegistered')}: {students.length}{' '}
            {t('teacherDashboard.attendance.studentsCount')}
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 font-medium text-center py-8">…</p>
        ) : students.length > 0 ? (
          <div className="space-y-3">
            {students.map((st) => {
              const isSaving = savingStudentIds.has(st.studentGuid);
              const hasError = errorStudentIds.has(st.studentGuid);
              const justSaved = savedStudentIds.has(st.studentGuid);
              const isExpanded = expandedStudentId === st.studentGuid;
              const isSavingMessage = savingMessageIds.has(st.studentGuid);
              const draft = messageDrafts[st.studentGuid] ?? '';
              const hasMessage = (st.message ?? '').trim().length > 0;

              return (
                <div
                  key={st.studentGuid}
                  className="rounded-xl border border-slate-100 bg-[#f8fafc] overflow-hidden"
                >
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(st.studentGuid)}
                      className="flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-100/80 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {st.picture ? (
                          <img src={st.picture} alt="" className="h-10 w-10 rounded-xl object-cover" />
                        ) : (
                          st.firstName ? st.firstName[0] : 'S'
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          {st.firstName} {st.lastName}
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                          {hasMessage && !isExpanded && (
                            <MessageSquare className="h-3 w-3 text-[#5850ec]" />
                          )}
                        </p>
                        {hasError && (
                          <p className="text-[10px] font-bold text-rose-500 mt-0.5">
                           ვერ შეინახა
                          </p>
                        )}
                        {justSaved && !hasError && (
                          <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                            შენახულია
                          </p>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200/80">
                      {isSaving && (
                        <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin mx-1" />
                      )}

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSetStatus(st.studentGuid, true)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          st.wasAttended
                            ? 'bg-[#059669] text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{t('teacherDashboard.attendance.present')}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSetStatus(st.studentGuid, false)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          !st.wasAttended
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>{t('teacherDashboard.attendance.absent')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Скрытая панель с сообщением — раскрывается по клику на ученика */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 border-t border-slate-200/70 mt-1">
                        <div className="flex items-start gap-2 mt-3">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-2 shrink-0" />
                          <textarea
                            value={draft}
                            onChange={(e) =>
                              setMessageDrafts((prev) => ({
                                ...prev,
                                [st.studentGuid]: e.target.value,
                              }))
                            }
                            placeholder={
                              "კომენტარი (მიუთითეთ მიზეზი, თუ სტუდენტი არ იყო დასწრებული)"
                            }
                            rows={2}
                            className="flex-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:outline-none resize-none"
                          />
                          <button
                            type="button"
                            disabled={isSavingMessage}
                            onClick={() => handleSaveMessage(st.studentGuid)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-extrabold bg-[#5850ec] text-white hover:bg-[#4a43cc] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          >
                            {isSavingMessage ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#f8fafc] rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              {t('teacherDashboard.attendance.noStudents')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}