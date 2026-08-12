import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Send, Clock, CheckCircle2, Pin, Paperclip, Calendar, Award } from 'lucide-react';
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

  // Grade modal state
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
      // можно показать тост с ошибкой
    } finally {
      setGradeSubmitting(false);
    }
  };

  const totalHomeworks = homeworks.length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter((s) => !s.grade).length;
  const gradedSubmissions = submissions.filter((s) => s.grade).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#f1f2fe] text-[#4f46e5] rounded-xl shrink-0 mt-0.5">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {t('teacherDashboard.homeworks.title')}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {t('teacherDashboard.homeworks.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAddHW}
            className="flex items-center gap-2 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] px-5 py-2.5 text-xs font-bold text-white transition shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t('teacherDashboard.homeworks.addHomework')}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#f8fafc] border border-slate-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#4f46e5] uppercase tracking-wider">
                {t('teacherDashboard.homeworks.stats.totalHomeworks')}
              </p>
              <p className="text-xl font-black text-slate-900 mt-1">{totalHomeworks}</p>
            </div>
            <FileText className="h-5 w-5 text-[#818cf8]" />
          </div>

          <div className="bg-[#f0f9ff] border border-sky-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                {t('teacherDashboard.homeworks.stats.totalSubmissions')}
              </p>
              <p className="text-xl font-black text-slate-900 mt-1">{totalSubmissions}</p>
            </div>
            <Send className="h-5 w-5 text-sky-400" />
          </div>

          <div className="bg-[#fffbeb] border border-amber-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                {t('teacherDashboard.homeworks.stats.pendingSubmissions')}
              </p>
              <p className="text-xl font-black text-slate-900 mt-1">{pendingSubmissions}</p>
            </div>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>

          <div className="bg-[#f0fdf4] border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                {t('teacherDashboard.homeworks.stats.gradedSubmissions')}
              </p>
              <p className="text-xl font-black text-slate-900 mt-1">{gradedSubmissions}</p>
            </div>
            <Award className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Published Homeworks Box */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#4f46e5]" />
          <span>{t('teacherDashboard.homeworks.listTitle')}</span>
          <span className="px-2 py-0.5 rounded bg-[#f1f2fe] text-[#4f46e5] text-xs font-extrabold ml-1">
            {homeworks.length}
          </span>
        </h3>

        {homeworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {homeworks.map((hw) => (
              <button
                key={hw.homeworkId}
                onClick={() => setSelectedHwId(hw.homeworkId)}
                className={`text-left p-4 rounded-xl border space-y-2 transition ${
                  selectedHwId === hw.homeworkId
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-[#f8fafc] border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{hw.title}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {t('teacherDashboard.homeworks.duePrefix')} {new Date(hw.dueDate).toLocaleDateString()}
                  </span>
                </div>
                {hw.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{hw.description}</p>
                )}
                <p className="text-[10px] font-bold text-slate-400">
                  {hw.submittedCount}/{hw.totalEnrolledStudents} сдали ({hw.submissionPercentage.toFixed(0)}%)
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-[#f8fafc] rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              {t('teacherDashboard.homeworks.noHomeworksCreated')}
            </p>
          </div>
        )}
      </div>

      {/* Student Submissions Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{t('teacherDashboard.homeworks.submissionsTitle')}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-extrabold ml-1">
            {submissions.length}
          </span>
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 font-medium">…</p>
        ) : submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const isGraded = Boolean(sub.grade);

              return (
                <div
                  key={sub.submissionId}
                  className="p-5 rounded-2xl border border-slate-100 bg-[#f8fafc] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100/70 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.studentFirstName ? sub.studentFirstName[0] : 'S'}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">
                          {sub.studentFirstName} {sub.studentLastName}
                        </p>
                        <p className="text-[11px] font-bold text-[#4f46e5] flex items-center gap-1 mt-0.5">
                          <Pin className="h-3 w-3" />
                          <span>
                            {homeworks.find((h) => h.homeworkId === selectedHwId)?.title ??
                              t('teacherDashboard.homeworks.assignmentFallback')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.submittedAt).toLocaleDateString()}
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

                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('teacherDashboard.homeworks.studentWorkLabel')}
                    </p>
                    <p className="font-medium text-slate-800 whitespace-pre-wrap">{sub.content}</p>
                  </div>

                {sub.filePath && (
  <div className="p-3 bg-[#f1f5f9]/70 rounded-xl border border-slate-200/50 flex items-center justify-between">
    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
      <Paperclip className="h-4 w-4 text-[#4f46e5]" />
      <span>{t('teacherDashboard.homeworks.attachedFileLabel')}</span>
    </div>

    <a
      href={sub.filePath}
      target="_blank"
      rel="noreferrer"
      className="px-3 py-1 text-[10px] font-bold text-[#4f46e5] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
    >
      {t('teacherDashboard.homeworks.openFile')}
    </a>
  </div>
)}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/50">
                    <div className="text-xs">
                      {isGraded ? (
                        <p className="text-slate-600 font-medium">
                          {t('teacherDashboard.homeworks.teacherComment')}:{' '}
                          <span className="italic text-slate-800">
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
                      className="px-4 py-2 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer self-end sm:self-auto shrink-0"
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
          <div className="p-12 text-center bg-[#f8fafc] rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              {t('teacherDashboard.homeworks.noSubmissions')}
            </p>
          </div>
        )}
      </div>

      {/* GRADE SUBMISSION MODAL */}
      {gradingSubId !== null && (
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
                  disabled={gradeSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50"
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