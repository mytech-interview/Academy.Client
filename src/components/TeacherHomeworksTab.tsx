import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  FileText,
  Send,
  Clock,
  CheckCircle2,
  Pin,
  Paperclip,
  Calendar,
  Award,
  Search,
  Filter,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Users,
  UserX,
  Download,
} from 'lucide-react';
import {
  TeacherHomeWorkDto,
  HomeWorkSubmissionDto,
  TeacherSessionDto,
  SessionLessonDto,
  SessionStudentDto,
  getSubmissionsForHomeWork,
  gradeHomeWorkSubmission,
  getTeacherSessions,
  getLessonsForSession,
  getAllStudentsOfSpecificSession,
  getHomeWorksForTeacher,
} from '@/src/api/teacher';

import { downloadHomeworkFile } from '@/src/api/sessions';

interface TeacherHomeworksTabProps {
  teacherGuid: string;
  homeworks: TeacherHomeWorkDto[];
  onOpenAddHW: () => void;
}

type StatusFilter = 'all' | 'submitted' | 'pending';

export default function TeacherHomeworksTab({
  teacherGuid,
  homeworks: initialHomeworks = [],
  onOpenAddHW,
}: TeacherHomeworksTabProps) {
  const { t } = useTranslation();

  // ---------- Курс / Урок / Статус фильтры ----------
  const [sessions, setSessions] = useState<TeacherSessionDto[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  const [lessons, setLessons] = useState<SessionLessonDto[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const [roster, setRoster] = useState<SessionStudentDto[]>([]);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [homeworksList, setHomeworksList] = useState<TeacherHomeWorkDto[]>(initialHomeworks);
  const [hwLoading, setHwLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [hwError, setHwError] = useState<string | null>(null);

  // Список курсов (сессий) учителя — грузим один раз.
  // По умолчанию сразу выбираем первый курс (а не "все курсы"): бэкенд не
  // трактует sessionId=0 как "все курсы", поэтому без выбранного курса
  // getHomeWorksForTeacher / getAllStudentsOfSpecificSession возвращают пусто.
  useEffect(() => {
    if (!teacherGuid) return;
    let cancelled = false;
    getTeacherSessions(teacherGuid)
      .then((res) => {
        if (cancelled) return;
        const list = res.sessions ?? [];
        setSessions(list);
        if (list.length > 0) {
          setSelectedSessionId((prev) => prev ?? list[0].sessionId);
        }
      })
      .catch((err) => {
        console.error('getTeacherSessions failed:', err);
        if (!cancelled) setSessions([]);
      })
      .finally(() => {
        if (!cancelled) setSessionsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherGuid]);

  // Домашки конкретного курса
  useEffect(() => {
    if (!teacherGuid || !selectedSessionId) return;
    let cancelled = false;
    setHwLoading(true);
    setHwError(null);
    setSelectedHwId(null);
    getHomeWorksForTeacher(teacherGuid, selectedSessionId)
      .then((res) => {
        if (!cancelled) setHomeworksList(res.homeWorks ?? []);
      })
      .catch((err: any) => {
        console.error('getHomeWorksForTeacher failed:', err);
        if (!cancelled) {
          setHomeworksList([]);
          setHwError(err?.message || 'Failed to load homeworks');
        }
      })
      .finally(() => {
        if (!cancelled) setHwLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherGuid, selectedSessionId]);

  // Уроки выбранного курса
  useEffect(() => {
    setSelectedLessonId(null);
    if (!teacherGuid || !selectedSessionId) {
      setLessons([]);
      return;
    }
    let cancelled = false;
    getLessonsForSession(selectedSessionId)
      .then((res) => {
        if (!cancelled) setLessons(res.lessons ?? []);
      })
      .catch((err) => {
        console.error('getLessonsForSession failed:', err);
        if (!cancelled) setLessons([]);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherGuid, selectedSessionId]);

  // Список всех учеников курса — нужен для "не сдали"
  useEffect(() => {
    if (!teacherGuid || !selectedSessionId) {
      setRoster([]);
      return;
    }
    let cancelled = false;
    getAllStudentsOfSpecificSession(teacherGuid, selectedSessionId)
      .then((res) => {
        if (!cancelled) setRoster(res.students ?? []);
      })
      .catch((err) => {
        console.error('getAllStudentsOfSpecificSession failed:', err);
        if (!cancelled) setRoster([]);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherGuid, selectedSessionId]);

  // ---------- Раскрытая карточка домашки ----------
  const [selectedHwId, setSelectedHwId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<HomeWorkSubmissionDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedHwId) {
      setSubmissions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getSubmissionsForHomeWork(teacherGuid, selectedHwId)
      .then((res) => {
        if (!cancelled) setSubmissions(res.submissions ?? []);
      })
      .catch((err) => {
        console.error('getSubmissionsForHomeWork failed:', err);
        if (!cancelled) setSubmissions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHwId, teacherGuid]);

  // Открыть/закрыть карточку: клик по открытой — закрывает,
  // клик по другой — закрывает предыдущую и открывает новую
  // (т.к. state selectedHwId один на всех карточках)
  const toggleHomework = (hwId: number) => {
    setSelectedHwId((prev) => (prev === hwId ? null : hwId));
  };

  // Modal State (оценка)
  const [gradingSubId, setGradingSubId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState('100');
  const [feedbackValue, setFeedbackValue] = useState('');
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

  const openGrade = (sub: HomeWorkSubmissionDto) => {
    setGradingSubId(sub.submissionId);
    setGradeValue(sub.grade || '100');
    setFeedbackValue(sub.feedback || '');
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;

    setGradeSubmitting(true);
    try {
      await gradeHomeWorkSubmission({
        submissionId: gradingSubId,
        teacherGuid,
        grade: gradeValue,
        feedback: feedbackValue,
      });
      // NOTE(backend): бэк не возвращает feedback обратно в списке
      // submissions (getHomeworkSubmissionByHomework его не отдаёт),
      // поэтому здесь мы держим его в стейте оптимистично — только
      // чтобы не пропадал сразу после сохранения в рамках текущей
      // сессии страницы. После перезагрузки/повторного открытия
      // карточки текст снова будет пустым, т.к. бэк его не хранит
      // в этом ответе.
      setSubmissions((prev) =>
        prev.map((s) =>
          s.submissionId === gradingSubId
            ? { ...s, grade: gradeValue, feedback: feedbackValue }
            : s
        )
      );
      setGradingSubId(null);
    } catch (err) {
      // Error handling
    } finally {
      setGradeSubmitting(false);
    }
  };

  // Stats calculation
  const totalHomeworks = homeworksList.length;
  const totalSubmissions = homeworksList.reduce((acc, hw) => acc + (hw.submittedCount || 0), 0);
  const pendingSubmissions = submissions.filter((s) => !s.grade).length;
  const gradedSubmissions = submissions.filter((s) => Boolean(s.grade)).length;

  // Ученики курса, которые ещё не отправили работу по выбранной домашке
  const pendingRoster = useMemo(() => {
    if (roster.length === 0) return [];
    const submittedGuids = new Set(submissions.map((s) => s.studentGuid));
    return roster.filter((st) => !submittedGuids.has(st.studentGuid));
  }, [roster, submissions]);

  // NOTE(backend): у TeacherHomeWorkDto нет courseLessonId, поэтому точного
  // маппинга "домашка -> урок" сделать нельзя. Пока фильтруем по вхождению
  // названия урока в заголовок/описание домашки — это эвристика. Как только
  // на бэке появится homework.courseLessonId, заменить на строгое сравнение id.
  const selectedLessonTitle = lessons.find((l) => l.courseLessonId === selectedLessonId)?.title;

  // Название реального курса выбранной сессии — раньше вместо него
  // всегда показывался статичный лейбл из переводов
  // (teacherDashboard.homeworks.fullCourseTag), никак не связанный
  // с тем, какой курс реально выбран.
  const selectedCourseTitle = sessions.find((s) => s.sessionId === selectedSessionId)?.title;

  const filteredHomeworks = homeworksList.filter((hw) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      hw.title.toLowerCase().includes(q) ||
      (hw.description && hw.description.toLowerCase().includes(q));

    const matchesLesson =
      !selectedLessonTitle ||
      hw.title.toLowerCase().includes(selectedLessonTitle.toLowerCase()) ||
      (hw.description ?? '').toLowerCase().includes(selectedLessonTitle.toLowerCase());

    return matchesSearch && matchesLesson;
  });

  const initials = (first?: string, last?: string) =>
    `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || 'S';

  // Скачивание файла (файл ДЗ или файл ответа ученика) — единая точка входа.
  // downloadHomeworkFile возвращает Blob, поэтому сохраняем его вручную
  // под оригинальным именем файла через временную ссылку.
  const handleFileDownload = async (fileName?: string, originalFileName?: string) => {
    if (!fileName) return;
    try {
      const blob = await downloadHomeworkFile(fileName);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = originalFileName || fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('handleFileDownload failed:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Dark Main Banner */}
      <div className="bg-[#0b132b] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-indigo-200 border border-white/10">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span>{t('teacherDashboard.homeworks.badgeText')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t('teacherDashboard.homeworks.title')}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              {t('teacherDashboard.homeworks.subtitle')}
            </p>
          </div>

          <button
            onClick={onOpenAddHW}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-3.5 text-xs md:text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t('teacherDashboard.homeworks.addHomework')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="bg-[#17213c]/80 border border-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-400">
                {t('teacherDashboard.homeworks.stats.totalHomeworks')}
              </p>
              <p className="text-2xl font-extrabold text-white">{totalHomeworks}</p>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1 cursor-pointer hover:underline">
                {t('teacherDashboard.homeworks.stats.clickToView')} &rarr;
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#17213c]/80 border border-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-400">
                {t('teacherDashboard.homeworks.stats.totalSubmissions')}
              </p>
              <p className="text-2xl font-extrabold text-white">{totalSubmissions}</p>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1 cursor-pointer hover:underline">
                {t('teacherDashboard.homeworks.stats.clickToView')} &rarr;
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Send className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#1e1b2e]/90 border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-amber-400/90">
                {t('teacherDashboard.homeworks.stats.pendingSubmissions')}
              </p>
              <p className="text-2xl font-extrabold text-amber-400">{pendingSubmissions}</p>
              <span className="text-[10px] text-amber-400/80 flex items-center gap-1 cursor-pointer hover:underline">
                {t('teacherDashboard.homeworks.stats.clickToView')} &rarr;
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-[#122b27]/90 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-emerald-400/90">
                {t('teacherDashboard.homeworks.stats.gradedSubmissions')}
              </p>
              <p className="text-2xl font-extrabold text-emerald-400">{gradedSubmissions}</p>
              <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 cursor-pointer hover:underline">
                {t('teacherDashboard.homeworks.stats.clickToView')} &rarr;
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar: Курс / Урок / Статус + Поиск */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Курс (сессия) */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 min-w-[180px]">
            <BookOpen className="h-4 w-4 text-indigo-500 shrink-0" />
            <select
              value={selectedSessionId ?? ''}
              onChange={(e) =>
                setSelectedSessionId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full bg-transparent outline-none cursor-pointer truncate"
              disabled={sessions.length === 0}
            >
              {sessions.length === 0 && (
                <option value="">
                  {sessionsLoaded
                    ? t('teacherDashboard.homeworks.noCourses', 'კურსები არ მოიძებნა')
                    : t('teacherDashboard.homeworks.loading')}
                </option>
              )}
              {sessions.map((s) => (
                <option key={s.sessionId} value={s.sessionId}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Урок */}
          <div
            className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-bold min-w-[180px] ${
              selectedSessionId
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-50/50 border-slate-100 text-slate-400'
            }`}
          >
            <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
            <select
              value={selectedLessonId ?? ''}
              disabled={!selectedSessionId || lessons.length === 0}
              onChange={(e) =>
                setSelectedLessonId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed truncate"
            >
              <option value="">
                {t('teacherDashboard.homeworks.allLessonsOption', 'ყველა გაკვეთილი')}
              </option>
              {lessons.map((l) => (
                <option key={l.courseLessonId} value={l.courseLessonId}>
                  {l.lessonNumber}. {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* Статус: сдали / не сдали (применяется к раскрытой домашке) */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl">
            {(
              [
                { key: 'all', label: t('teacherDashboard.homeworks.statusAll', 'ყველა'), icon: Filter },
                {
                  key: 'submitted',
                  label: t('teacherDashboard.homeworks.statusSubmittedOnly', 'ჩააბარეს'),
                  icon: CheckCircle2,
                },
                {
                  key: 'pending',
                  label: t('teacherDashboard.homeworks.statusPendingOnly', 'არ ჩაბარებულა'),
                  icon: UserX,
                },
              ] as { key: StatusFilter; label: string; icon: typeof Filter }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                  statusFilter === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('teacherDashboard.homeworks.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
          />
        </div>
      </div>

      {hwError && (
        <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
          <span>
            {t('teacherDashboard.homeworks.loadError', 'დავალებების ჩატვირთვა ვერ მოხერხდა')}:{' '}
            {hwError}
          </span>
        </div>
      )}

      {/* Homework Cards */}
      <div className="space-y-4">
        {hwLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-400 font-medium">
              {t('teacherDashboard.homeworks.loading')}
            </p>
          </div>
        ) : filteredHomeworks.length > 0 ? (
          filteredHomeworks.map((hw) => {
            const isSelected = selectedHwId === hw.homeworkId;
            const submittedCount = hw.submittedCount || 0;
            const totalStudents = hw.totalEnrolledStudents || 1;
            const percent = Math.round(
              hw.submissionPercentage ?? (submittedCount / totalStudents) * 100
            );

            return (
              <div
                key={hw.homeworkId}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                  isSelected
                    ? 'border-indigo-400 ring-2 ring-indigo-500/10'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Main Card Info */}
                <div className="p-5 md:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{selectedCourseTitle || t('teacherDashboard.homeworks.fullCourseTag')}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>
                        {t('teacherDashboard.homeworks.dueDate')}:{' '}
                        {new Date(hw.dueDate).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 className="text-base font-extrabold text-slate-900">{hw.title}</h3>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-extrabold">
                        <Clock className="h-3.5 w-3.5" />
                        {pendingSubmissions} {t('teacherDashboard.homeworks.toGrade')}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-extrabold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {gradedSubmissions} {t('teacherDashboard.homeworks.graded')}
                      </span>
                    </div>
                  </div>

                  {hw.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {hw.description}
                    </p>
                  )}

                  {/* Файл самого домашнего задания (то, что прикрепил учитель при создании ДЗ) */}
                  {hw.originalFileName && (
                    <button
                      type="button"
                      onClick={() => handleFileDownload(hw.newFileName, hw.originalFileName)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition w-fit cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-[220px]">{hw.originalFileName}</span>
                    </button>
                  )}

                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700 shrink-0">
                        {percent}% ({submittedCount} / {totalStudents}{' '}
                        {t('teacherDashboard.homeworks.students')})
                      </span>
                    </div>

                    <button
                      onClick={() => toggleHomework(hw.homeworkId)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold transition shrink-0 cursor-pointer"
                    >
                      <span>
                        {t('teacherDashboard.homeworks.viewAnswers')} ({submittedCount})
                      </span>
                      {isSelected ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submissions List Section (Accordion Body) */}
                {isSelected && (
                  <div className="bg-slate-50/80 border-t border-slate-200/80 p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {t('teacherDashboard.homeworks.submissionsTitle')} ({submissions.length})
                      </h4>
                      {roster.length > 0 && (
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {t('teacherDashboard.homeworks.rosterCount', 'სულ კურსზე')}:{' '}
                          {roster.length}
                        </span>
                      )}
                    </div>

                    {loading ? (
                      <div className="p-8 text-center text-xs font-medium text-slate-400">
                        {t('teacherDashboard.homeworks.loading')}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Сдали */}
                        {statusFilter !== 'pending' &&
                          submissions.map((sub) => {
                            const isGraded = Boolean(sub.grade);

                            return (
                              <div
                                key={sub.submissionId}
                                className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                                      {sub.studentFirstName ? sub.studentFirstName[0] : 'S'}
                                    </div>
                                    <div>
                                      <p className="text-xs font-extrabold text-slate-900">
                                        {sub.studentFirstName} {sub.studentLastName}
                                      </p>
                                      <p className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 mt-0.5">
                                        <Pin className="h-3 w-3" />
                                        <span>{hw.title}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(sub.submittedAt).toLocaleDateString('sv-SE')}
                                    </span>

                                    {isGraded ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {t('teacherDashboard.homeworks.statusGraded')} (
                                        {sub.grade})
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                                        <Clock className="h-3 w-3" />
                                        {t('teacherDashboard.homeworks.statusPending')}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* NOTE(backend): бэк не отдаёт текст ответа ученика
                                    в этой ручке (только файл). Раньше здесь пустая
                                    строка выглядела как "ученик ничего не написал" —
                                    показываем честный placeholder вместо этого. */}
                                {sub.hasTextContent ? (
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      {t('teacherDashboard.homeworks.studentWorkLabel')}
                                    </p>
                                    <p className="font-medium text-slate-800 whitespace-pre-wrap">
                                      {sub.content}
                                    </p>
                                  </div>
                                ) : !sub.submissionFileName ? (
                                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200/60 text-[11px] text-slate-400 font-medium">
                                    {t(
                                      'teacherDashboard.homeworks.noTextAvailable',
                                      'ტექსტური პასუხი მიუწვდომელია'
                                    )}
                                  </div>
                                ) : null}

                                {/* Файл, приложенный учеником к сдаче */}
                                {sub.submissionFileName && (
                                  <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 min-w-0">
                                      <Paperclip className="h-4 w-4 text-indigo-600 shrink-0" />
                                      <span className="truncate">
                                        {sub.submissionOriginalFileName ||
                                          t('teacherDashboard.homeworks.attachedFileLabel')}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleFileDownload(
                                          sub.submissionFileName,
                                          sub.submissionOriginalFileName
                                        )
                                      }
                                      className="px-3 py-1 text-[11px] font-bold text-indigo-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shrink-0 cursor-pointer"
                                    >
                                      {t('teacherDashboard.homeworks.openFile')}
                                    </button>
                                  </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                  <div className="text-xs">
                                    {isGraded ? (
                                      <p className="text-slate-600 font-medium">
                                        {t('teacherDashboard.homeworks.teacherComment')}:{' '}
                                        <span className="italic text-slate-800 font-semibold">
                                          "{sub.feedback || t('teacherDashboard.homeworks.noComment')}"
                                        </span>
                                      </p>
                                    ) : (
                                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                        {t('teacherDashboard.homeworks.notGradedWarning')}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => openGrade(sub)}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                                  >
                                    {isGraded
                                      ? t('teacherDashboard.homeworks.editGradeBtn')
                                      : t('teacherDashboard.homeworks.addGradeBtn')}
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                        {/* Не сдали */}
                        {statusFilter !== 'submitted' &&
                          pendingRoster.map((st) => (
                            <div
                              key={st.studentGuid}
                              className="bg-white/60 p-4 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                                  {initials(st.firstName, st.lastName)}
                                </div>
                                <div>
                                  <p className="text-xs font-extrabold text-slate-700">
                                    {st.firstName} {st.lastName}
                                  </p>
                                  <p className="text-[11px] font-medium text-slate-400">
                                    {st.email}
                                  </p>
                                </div>
                              </div>

                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg shrink-0">
                                <UserX className="h-3 w-3" />
                                {t('teacherDashboard.homeworks.statusNotSubmitted', 'არ ჩაბარებულა')}
                              </span>
                            </div>
                          ))}

                        {/* Пусто */}
                        {statusFilter !== 'pending' &&
                          submissions.length === 0 &&
                          (statusFilter === 'submitted' ||
                            pendingRoster.length === 0) && (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/60">
                              <p className="text-xs text-slate-400 font-medium">
                                {t('teacherDashboard.homeworks.noSubmissions')}
                              </p>
                            </div>
                          )}
                        {statusFilter === 'pending' && pendingRoster.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/60">
                            <p className="text-xs text-slate-400 font-medium">
                              {t(
                                'teacherDashboard.homeworks.everyoneSubmitted',
                                'ყველამ ჩააბარა დავალება'
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-400 font-medium">
              {t('teacherDashboard.homeworks.noHomeworksCreated')}
            </p>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradingSubId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-100">
              {t('teacherDashboard.modals.gradeTitle')}
            </h3>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('teacherDashboard.modals.gradeLabel')}
                </label>
                {/* NOTE(backend): бэк принимает Grade как int, не строку
                    "100/100" — поле оценки сделано числовым инпутом,
                    чтобы значение сразу совпадало с ожиданиями бэка. */}
                <input
                  type="number"
                  min={0}
                  max={100}
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  {t('teacherDashboard.modals.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={gradeSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50 transition"
                >
                  {gradeSubmitting ? '...' : t('teacherDashboard.modals.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}