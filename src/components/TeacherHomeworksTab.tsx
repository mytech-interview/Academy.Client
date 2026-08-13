import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import {
  TeacherHomeWorkDto,
  HomeWorkSubmissionDto,
  getSubmissionsForHomeWork,
  gradeHomeWorkSubmission,
} from '@/src/api/teacher';

interface TeacherHomeworksTabProps {
  teacherGuid: string;
  homeworks: TeacherHomeWorkDto[];
  onOpenAddHW: () => void;
}

export default function TeacherHomeworksTab({
  teacherGuid,
  homeworks = [],
  onOpenAddHW,
}: TeacherHomeworksTabProps) {
  const { t } = useTranslation();

  const [selectedHwId, setSelectedHwId] = useState<number | null>(
    homeworks[0]?.homeworkId ?? null
  );
  const [submissions, setSubmissions] = useState<HomeWorkSubmissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      .catch(() => {
        if (!cancelled) setSubmissions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHwId, teacherGuid]);

  // Modal State
  const [gradingSubId, setGradingSubId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState('100/100');
  const [feedbackValue, setFeedbackValue] = useState('');
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

  const openGrade = (sub: HomeWorkSubmissionDto) => {
    setGradingSubId(sub.submissionId);
    setGradeValue(sub.grade || '100/100');
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
  const totalHomeworks = homeworks.length;
  const totalSubmissions = homeworks.reduce((acc, hw) => acc + (hw.submittedCount || 0), 0);
  const pendingSubmissions = submissions.filter((s) => !s.grade).length;
  const gradedSubmissions = submissions.filter((s) => Boolean(s.grade)).length;

  const filteredHomeworks = homeworks.filter(
    (hw) =>
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hw.description && hw.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Dark Main Banner */}
      <div className="bg-[#0b132b] text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden">
        {/* Subtle glow background effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
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

        {/* Dark Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {/* Total HW */}
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

          {/* Submissions */}
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

          {/* Pending */}
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

          {/* Graded */}
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

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-xl w-full md:w-auto text-xs font-semibold text-slate-700">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>{t('teacherDashboard.homeworks.allCoursesFilter')} ({homeworks.length})</span>
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

      {/* Homework Cards */}
      <div className="space-y-4">
        {filteredHomeworks.length > 0 ? (
          filteredHomeworks.map((hw) => {
            const isSelected = selectedHwId === hw.homeworkId;
            const submittedCount = hw.submittedCount || 0;
            const totalStudents = hw.totalEnrolledStudents || 1;
            const percent = Math.round(hw.submissionPercentage ?? (submittedCount / totalStudents) * 100);

            return (
              <div
                key={hw.homeworkId}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                  isSelected ? 'border-indigo-400 ring-2 ring-indigo-500/10' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Main Card Info */}
                <div className="p-5 md:p-6 space-y-4">
                  {/* Top Bar: Course Tag + Due Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{t('teacherDashboard.homeworks.fullCourseTag')}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>
                        {t('teacherDashboard.homeworks.dueDate')}: {new Date(hw.dueDate).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>

                  {/* Title & Badges */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {hw.title}
                    </h3>

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

                  {/* Description */}
                  {hw.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {hw.description}
                    </p>
                  )}

                  {/* Progress & Submissions Accordion Trigger */}
                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700 shrink-0">
                        {percent}% ({submittedCount} / {totalStudents} {t('teacherDashboard.homeworks.students')})
                      </span>
                    </div>

                    {/* Expand/Collapse Answers Button */}
                    <button
                      onClick={() => setSelectedHwId(isSelected ? null : hw.homeworkId)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold transition shrink-0 cursor-pointer"
                    >
                      <span>
                        {t('teacherDashboard.homeworks.viewAnswers')} ({submittedCount})
                      </span>
                      {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                    </div>

                    {loading ? (
                      <div className="p-8 text-center text-xs font-medium text-slate-400">
                        {t('teacherDashboard.homeworks.loading')}
                      </div>
                    ) : submissions.length > 0 ? (
                      <div className="space-y-4">
                        {submissions.map((sub) => {
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
                                      {t('teacherDashboard.homeworks.statusGraded')} ({sub.grade})
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                                      <Clock className="h-3 w-3" />
                                      {t('teacherDashboard.homeworks.statusPending')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Student Answer Box */}
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {t('teacherDashboard.homeworks.studentWorkLabel')}
                                </p>
                                <p className="font-medium text-slate-800 whitespace-pre-wrap">
                                  {sub.content}
                                </p>
                              </div>

                              {/* File Attachment */}
                              {sub.filePath && (
                                <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                    <Paperclip className="h-4 w-4 text-indigo-600" />
                                    <span>{t('teacherDashboard.homeworks.attachedFileLabel')}</span>
                                  </div>

                                  <a
                                    href={sub.filePath}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1 text-[11px] font-bold text-indigo-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                  >
                                    {t('teacherDashboard.homeworks.openFile')}
                                  </a>
                                </div>
                              )}

                              {/* Footer Comment & Grade Action */}
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
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/60">
                        <p className="text-xs text-slate-400 font-medium">
                          {t('teacherDashboard.homeworks.noSubmissions')}
                        </p>
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