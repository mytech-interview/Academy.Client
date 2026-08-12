import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, CheckCircle, Calendar, BookOpen, Check, X } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // загрузка списка уроков при смене сессии
  useEffect(() => {
    if (!activeSession) return;
    let cancelled = false;
    getLessonsForSession(activeSession.sessionId).then((res) => {
      if (cancelled) return;
      setLessons(res.lessons ?? []);
      setSelectedLessonId(res.lessons?.[0]?.courseLessonId ?? null);
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
        if (!cancelled) setStudents(res.students ?? []);
      })
      .catch(() => {
        if (!cancelled) setStudents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeSession?.sessionId, selectedLessonId, teacherGuid]);

  const selectedLesson = lessons.find((l) => l.courseLessonId === selectedLessonId);

  const setStatus = (studentGuid: string, wasAttended: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentGuid === studentGuid ? { ...s, wasAttended } : s))
    );
  };

  const handleSave = async () => {
    if (!activeSession || !selectedLessonId) return;
    setSaving(true);
    try {
      await Promise.all(
        students.map((st) =>
          addStudentAttendance({
            teacherGuid,
            studentGuid: st.studentGuid,
            sessionId: activeSession.sessionId,
            lessonId: selectedLessonId,
            wasAttended: st.wasAttended,
            message: st.message,
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {t('teacherDashboard.attendance.sessionLabel')}: {activeSession?.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {t('teacherDashboard.attendance.totalRegistered')}: {students.length}{' '}
              {t('teacherDashboard.attendance.studentsCount')}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !selectedLessonId}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#059669] hover:bg-[#047857] px-5 py-2.5 text-xs font-bold text-white transition shadow-md active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{saving ? '...' : t('teacherDashboard.attendance.saveAttendance')}</span>
          </button>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{t('teacherDashboard.attendance.saved')}</span>
          </div>
        )}

        {loading ? (
          <p className="text-xs text-slate-400 font-medium text-center py-8">…</p>
        ) : students.length > 0 ? (
          <div className="space-y-3">
            {students.map((st) => (
              <div
                key={st.studentGuid}
                className="p-4 rounded-xl border border-slate-100 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100/80 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {st.picture ? (
                      <img src={st.picture} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    ) : (
                      st.firstName ? st.firstName[0] : 'S'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {st.firstName} {st.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setStatus(st.studentGuid, true)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
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
                    onClick={() => setStatus(st.studentGuid, false)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer ${
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
            ))}
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