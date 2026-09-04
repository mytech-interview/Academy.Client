import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import {
  X,
  BookOpen,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Send,
  Sparkles,
  Download,
  ExternalLink,
  TrendingUp,
  Check,
  UserCheck,
  MessageCircle,
  ChevronDown
} from 'lucide-react';

// --- Types ---
export interface Lesson {
  id: number;
  title: string;
  content?: string;
  duration?: string;
}

export interface Course {
  id: number;
  title: string;
  courseDescription?: string;
  categoryName?: string;
  levelName?: string;
  durationWeeks?: number;
  teacherName?: string;
  lessons?: Lesson[];
  syllabus?: string[];
}

export interface Enrollment {
  id?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  completedLessonIds?: number[];
  progress?: number;
  grade?: number;
  notes?: string;
}

export interface Session {
  id?: number;
  title?: string;
  schedule?: string;
  room?: string;
  startDate?: string;
  endDate?: string;
}

export interface Student {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Homework {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  lessonId?: number;
}

export interface HomeworkSubmission {
  id: number;
  homeworkId: number;
  submissionUrl?: string;
  submissionText?: string;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
}

export interface AttendanceRecord {
  id: number;
  lessonId?: number;
  lessonTitle?: string;
  lessonDate?: string;
  isPresent: boolean;
  message?: string;
}

export interface Material {
  id: number;
  title: string;
  type?: 'DOCUMENT' | 'VIDEO' | 'LINK';
  url?: string;
}

interface StudentCourseDetailModalProps {
  course?: Course;
  enrollment?: Enrollment;
  session?: Session;
  student?: Student;
  homeworks?: Homework[];
  homeworkSubmissions?: HomeworkSubmission[];
  attendanceRecords?: AttendanceRecord[];
  materials?: Material[];
  onClose: () => void;
  onUpdateEnrollment?: (updated: Enrollment) => void;
  onOpenSubmitHomework?: (homework: Homework) => void;
}

type TabId = 'syllabus' | 'attendance' | 'homeworks' | 'schedule' | 'materials';

export const StudentCourseDetailModal: React.FC<StudentCourseDetailModalProps> = ({
  course,
  enrollment = { completedLessonIds: [] },
  session = {},
  student = {},
  homeworks = [],
  homeworkSubmissions = [],
  attendanceRecords = [],
  materials = [],
  onClose,
  onUpdateEnrollment,
  onOpenSubmitHomework
}) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabId>('syllabus');
  const [localEnrollment] = useState<Enrollment>(enrollment);
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  const lessons = course?.lessons || [];
  const completedIds = localEnrollment?.completedLessonIds || [];
  const totalLessons = lessons.length || 1;

  // --- Progress based on course start/end dates ---
  const parseDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const computeDateBasedProgress = (): number | null => {
    const start = parseDate(session.startDate);
    const end = parseDate(session.endDate);
    if (!start || !end || end.getTime() <= start.getTime()) return null;

    const now = Date.now();
    if (now <= start.getTime()) return 0;
    if (now >= end.getTime()) return 100;

    return Math.round(((now - start.getTime()) / (end.getTime() - start.getTime())) * 100);
  };

  const dateBasedProgress = computeDateBasedProgress();

  const computedProgress =
    dateBasedProgress !== null
      ? dateBasedProgress
      : typeof localEnrollment.progress === 'number'
      ? localEnrollment.progress
      : Math.min(100, Math.round((completedIds.length / totalLessons) * 100));

  const totalHomeworksCount = homeworks.length;
  const totalAttendance = attendanceRecords.length;
  const presentAttendance = attendanceRecords.filter((a) => a.isPresent).length;
const georgianMonths = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
];

const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // სათადარიგო ვარიანტი, თუ ფორმატი მოულოდნელია

  const day = date.getDate();
  const month = georgianMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

  const pendingHomework = homeworks.find(
    (hw) => !homeworkSubmissions.some((s) => s.homeworkId === hw.id)
  );

  const TABS: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'syllabus', label: `📖 ${t('studentModal.tabs.syllabus')}`, icon: BookOpen },
    { id: 'attendance', label: `📋 ${t('studentModal.tabs.attendance')}`, icon: CheckCircle },
    { id: 'homeworks', label: `📝 ${t('studentModal.tabs.homeworks')}`, icon: FileText, count: totalHomeworksCount },
    { id: 'schedule', label: `📅 ${t('studentModal.tabs.schedule')}`, icon: Calendar },
    { id: 'materials', label: `📁 ${t('studentModal.tabs.materials')}`, icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 my-auto max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900 text-white shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider">
                  {course?.categoryName || t('studentModal.noCategory')}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {course?.title || t('studentModal.loadingCourse')}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Summary */}
          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{t('studentModal.courseProgress')}</p>
                <p className="text-[11px] text-slate-400">
                  {t('studentModal.teacher')}: <span className="text-indigo-300 font-semibold">{course?.teacherName || t('studentModal.notSpecified')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:w-1/2">
              <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${computedProgress}%` }}
                />
              </div>
              <span className="font-black text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800/80 shrink-0">
                {computedProgress}%
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-900 text-indigo-200 text-[10px]">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* TAB: SYLLABUS & PROGRESS */}
         {activeTab === 'syllabus' && (
  <div className="space-y-6">
    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{t('studentModal.syllabus.title')}</span>
          </h4>
        </div>
      </div>

      {lessons.length > 0 ? (
        <div className="space-y-2.5">
          {lessons.map((les, idx) => {
            const lessonAtt = attendanceRecords.find(
              (rec) => rec.lessonId === les.id || rec.lessonTitle === les.title
            );
            const isExpanded = expandedLessonId === les.id;

            return (
              <div
                key={les.id ?? idx}
                className="rounded-2xl border transition bg-white border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedLessonId(isExpanded ? null : les.id)}
                  className="w-full p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900">
                        {t('studentModal.syllabus.lessonNumber', { number: idx + 1, title: les.title })}
                      </p>
                      {les.content && !isExpanded && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{les.content}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {les.duration && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200/60">
                        ⏱️ {les.duration}
                      </span>
                    )}
                  </div>
                </button>

                {isExpanded && les.content && (
                  <div className="px-3.5 pb-3.5 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                        {les.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 font-medium p-4 text-center bg-white rounded-xl border border-slate-200/60">
          {t('studentModal.syllabus.noLessons')}
        </p>
      )}
    </div>

    {course?.syllabus && course.syllabus.length > 0 && (
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" />
          <span>{t('studentModal.syllabus.topicsTitle')}</span>
        </h4>
        <div className="space-y-2">
          {course.syllabus.map((syl, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0"></span>
              <span>{syl}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

          {/* TAB: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  <span>{t('studentModal.attendance.title')}</span>
                </h4>

               {attendanceRecords.length > 0 ? (
  <div className="divide-y divide-slate-100">
    {attendanceRecords.map((rec) => {
      const isExpanded = expandedMessageId === rec.id;
      return (
        <div key={rec.id} className="py-3">
          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900">
                {rec.lessonTitle || t('studentModal.attendance.lessonDefaultTitle', { id: rec.id ?? '' })}
              </p>
              {rec.lessonDate && (
                <p className="text-[11px] text-slate-500 font-mono">📅 {t('studentModal.attendance.date', { date: rec.lessonDate })}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {rec.isPresent ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t('studentModal.attendanceStatus.present')}</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-extrabold flex items-center gap-1 text-[11px]">
                  <X className="h-3.5 w-3.5 text-rose-600" />
                  <span>{t('studentModal.attendanceStatus.absent')}</span>
                </span>
              )}

              {rec.message && (
                <button
                  onClick={() => setExpandedMessageId(isExpanded ? null : rec.id)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                    isExpanded
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                  }`}
                  title={t('studentModal.attendance.viewMessage')}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {isExpanded && rec.message && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 animate-fade-in">
              <div className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 shrink-0">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mb-0.5">
                  მასწავლებლის შენიშვნა
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">{rec.message}</p>
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
) : (
  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
    <p className="text-xs font-bold text-slate-700">{t('studentModal.attendance.noRecords')}</p>
    <p className="text-[11px] text-slate-400">{t('studentModal.attendance.noRecordsSub')}</p>
  </div>
)}
              </div>
            </div>
          )}

          {/* TAB: HOMEWORKS */}
          {activeTab === 'homeworks' && (
            <div className="space-y-6">
              {pendingHomework ? (
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-md border border-indigo-700/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      ⚡ {t('studentModal.homeworks.nextTaskTag')}
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      📅 {t('studentModal.homeworks.dueDate', { date: pendingHomework.dueDate || t('studentModal.homeworks.active') })}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">{pendingHomework.title}</h4>
                    {pendingHomework.description && (
                      <p className="text-xs text-indigo-100/90 leading-relaxed mt-1.5 line-clamp-3">
                        {pendingHomework.description}
                      </p>
                    )}
                  </div>

                  {onOpenSubmitHomework && (
                    <div className="pt-2 border-t border-indigo-800/80 flex justify-end">
                      <button
                        onClick={() => onOpenSubmitHomework(pendingHomework)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs transition cursor-pointer shadow-md active:scale-95"
                      >
                        <Send className="h-4 w-4" />
                        <span>{t('studentModal.homeworks.submitNowBtn')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>{t('studentModal.homeworks.allCompleted')}</span>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>{t('studentModal.homeworks.allTasksTitle', { count: totalHomeworksCount })}</span>
                </h4>

                {homeworks.length > 0 ? (
                  <div className="space-y-4">
                    {homeworks.map((hw) => {
                      const sub = homeworkSubmissions.find((s) => s.homeworkId === hw.id);

                      return (
                        <div key={hw.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              {hw.dueDate && (
                                <span className="text-[10px] font-bold text-slate-500 font-mono">📅 {t('studentModal.homeworks.dueDate', { date: hw.dueDate })}</span>
                              )}
                              <h5 className="text-sm font-black text-slate-900">{hw.title}</h5>
                            </div>

                            {sub ? (
                              sub.grade ? (
                                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                                  🏆 {t('studentModal.homeworks.grade', { grade: sub.grade })}
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                  ⏳ {t('studentModal.homeworks.underReview')}
                                </span>
                              )
                            ) : (
                              onOpenSubmitHomework && (
                                <button
                                  onClick={() => onOpenSubmitHomework(hw)}
                                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-2xs"
                                >
                                  {t('studentModal.homeworks.submitBtn')}
                                </button>
                              )
                            )}
                          </div>

                          {hw.description && (
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {hw.description}
                            </p>
                          )}

                          {sub && (
                            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2 text-xs">
                              {sub.submissionText && (
                                <p className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                                  {sub.submissionText}
                                </p>
                              )}
                              {sub.grade && (
                                <p className="text-xs font-bold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-200">
                                  🌟 {t('studentModal.homeworks.teacherFeedback', { feedback: sub.feedback || t('studentModal.homeworks.defaultFeedback') })}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
                    {t('studentModal.homeworks.noHomeworks')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span>{t('studentModal.schedule.title')}</span>
                </h4>

                {session?.title ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('studentModal.schedule.sessionName')}</p>
                      <p className="text-xs font-black text-slate-900">{session.title}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('studentModal.schedule.lectureSchedule')}</p>
                      <p className="text-xs font-black text-indigo-600">{session.schedule || t('studentModal.notSpecified')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('studentModal.schedule.location')}</p>
                      <p className="text-xs font-black text-slate-900">{session.room || t('studentModal.schedule.onlineLecture')}</p>
                    </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('studentModal.schedule.startDate')}</p>
                      <p className="text-xs font-black text-slate-900">{formatDate(session.startDate) || t('studentModal.notSpecified')}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{t('studentModal.schedule.loading')}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>{t('studentModal.materials.title')}</span>
                </h4>

                {materials.length > 0 ? (
                  <div className="space-y-3">
                    {materials.map((mat) => (
                      <div key={mat.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                            {mat.type === 'LINK' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{mat.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono uppercase">{mat.type || t('studentModal.materials.defaultFileType')}</p>
                          </div>
                        </div>
                        {mat.url && (
                          <a
                            href={mat.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                          >
                            {t('studentModal.materials.openBtn')}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium p-8 text-center bg-slate-50 rounded-xl">
                    {t('studentModal.materials.noMaterials')}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            {t('studentModal.closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};