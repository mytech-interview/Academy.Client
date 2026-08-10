import React, { useState } from 'react';
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
  UserCheck
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
  course = { id: 0, title: 'Загрузка курса...' },
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
  const [activeTab, setActiveTab] = useState<TabId>('syllabus');
  const [localEnrollment, setLocalEnrollment] = useState<Enrollment>(enrollment);

  const lessons = course.lessons || [];
  const completedIds = localEnrollment?.completedLessonIds || [];
  const totalLessons = lessons.length || 1;

  const computedProgress =
    typeof localEnrollment.progress === 'number'
      ? localEnrollment.progress
      : Math.min(100, Math.round((completedIds.length / totalLessons) * 100));

  const totalHomeworksCount = homeworks.length;
  const totalAttendance = attendanceRecords.length;
  const presentAttendance = attendanceRecords.filter((a) => a.isPresent).length;
  const attendancePercentage =
    totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 100;

  const pendingHomework = homeworks.find(
    (hw) => !homeworkSubmissions.some((s) => s.homeworkId === hw.id)
  );

  const toggleLesson = (lessonId: number) => {
    const isDone = completedIds.includes(lessonId);
    const next = isDone ? completedIds.filter((id) => id !== lessonId) : [...completedIds, lessonId];
    const newProgress = Math.min(100, Math.round((next.length / totalLessons) * 100));
    const updated: Enrollment = { ...localEnrollment, completedLessonIds: next, progress: newProgress };
    setLocalEnrollment(updated);
    onUpdateEnrollment?.(updated);
  };

  const TABS: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'syllabus', label: '📖 სილაბუსი & პროგრესი', icon: BookOpen },
    { id: 'attendance', label: '📋 ჩემი დასწრება', icon: CheckCircle },
    { id: 'homeworks', label: '📝 კურსის დავალებები', icon: FileText, count: totalHomeworksCount },
    { id: 'schedule', label: '📅 სესია & განრიგი', icon: Calendar },
    { id: 'materials', label: '📁 სასწავლო მასალები', icon: FileText }
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
                  {course?.categoryName || 'Без категории'}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {course?.title || 'Название курса'}
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
                <p className="font-bold text-white">კურსის ათვისების პროგრესი</p>
                <p className="text-[11px] text-slate-400">
                  ლექტორი: <span className="text-indigo-300 font-semibold">{course?.teacherName || 'არ არის მითითებული'}</span>
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
                      <span>გაკვეთილების ჩექლისტი, დასწრება & პროგრესი</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      იხილეთ თითოეულ გაკვეთილზე თქვენი დასწრების სტატუსი და მონიშნეთ გავლილი გაკვეთილები
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                    {completedIds.length} / {lessons.length || 1} დასრულებული
                  </span>
                </div>

                {lessons.length > 0 ? (
                  <div className="space-y-2.5">
                    {lessons.map((les, idx) => {
                      const isDone = completedIds.includes(les.id);
                      const lessonAtt = attendanceRecords.find(
                        (rec) => rec.lessonId === les.id || rec.lessonTitle === les.title
                      );

                      return (
                        <div
                          key={les.id ?? idx}
                          className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isDone
                              ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => toggleLesson(les.id)}
                          >
                            <div
                              className={`h-6 w-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                                isDone ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                              }`}
                            >
                              {isDone && <Check className="h-4 w-4 stroke-[3]" />}
                            </div>
                            <div>
                              <p className={`text-xs font-black ${isDone ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                                გაკვეთილი #{idx + 1}: {les.title}
                              </p>
                              {les.content && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{les.content}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {lessonAtt ? (
                              lessonAtt.isPresent ? (
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[11px] flex items-center gap-1 shadow-2xs">
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                  <span>ესწრებოდა</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 font-black text-[11px] flex items-center gap-1 shadow-2xs">
                                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                                  <span>არ ესწრებოდა</span>
                                </span>
                              )
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center gap-1 border border-slate-200">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>აღურიცხავია</span>
                              </span>
                            )}

                            {les.duration && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200/60">
                                ⏱️ {les.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium p-4 text-center bg-white rounded-xl border border-slate-200/60">
                    ინტეგრირებული გაკვეთილების სია ჯერ არ არის დამატებული
                  </p>
                )}
              </div>

              {course.syllabus && course.syllabus.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span>კურსის სილაბუსის თემები (Course Syllabus)</span>
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
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase">დასწრების პროცენტი</p>
                    <p className="text-xl font-black text-indigo-900 mt-0.5">{attendancePercentage}%</p>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">დასწრებული ლექციები</p>
                    <p className="text-xl font-black text-emerald-950 mt-0.5">{presentAttendance} ლექცია</p>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">სულ აღრიცხული</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{totalAttendance} სესია</p>
                  </div>
                  <span className="text-2xl">📅</span>
                </div>
              </div> */}

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  <span>დასწრების დეტალური ჟურნალი</span>
                </h4>

                {attendanceRecords.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {attendanceRecords.map((rec) => (
                      <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">
                            {rec.lessonTitle || `გაკვეთილი #${rec.lessonId ?? ''}`}
                          </p>
                          {rec.lessonDate && (
                            <p className="text-[11px] text-slate-500 font-mono">📅 თარიღი: {rec.lessonDate}</p>
                          )}
                        </div>
                        <div>
                          {rec.isPresent ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold flex items-center gap-1 text-[11px]">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              <span>ესწრებოდა</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-extrabold flex items-center gap-1 text-[11px]">
                              <X className="h-3.5 w-3.5 text-rose-600" />
                              <span>არ ესწრებოდა</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-700">ამ კურსზე დასწრების აღრიცხვა ჯერ არ არის შეყვანილი</p>
                    <p className="text-[11px] text-slate-400">ლექტორი დასწრებას აღრიცხავს ჩატარებული ლექციის შემდეგ.</p>
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
                      ⚡ შემდეგი დღის დავალება (Next Upcoming Task)
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      📅 ვადა: {pendingHomework.dueDate || 'აქტიური'}
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
                        <span>დავალების გაგზავნა (Submit Now)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>ყველა მიმდინარე დავალება ჩაბარებულია! ახალი დავალებები ჯერ არ არის გამოქვეყნებული.</span>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>ამ კურსის ყველა დავალება & შეფასებები ({totalHomeworksCount})</span>
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
                                <span className="text-[10px] font-bold text-slate-500 font-mono">📅 ვადა: {hw.dueDate}</span>
                              )}
                              <h5 className="text-sm font-black text-slate-900">{hw.title}</h5>
                            </div>

                            {sub ? (
                              sub.grade ? (
                                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                                  🏆 შეფასება: {sub.grade}
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                                  ⏳ ჩაბარებულია (შემოწმების პროცესში)
                                </span>
                              )
                            ) : (
                              onOpenSubmitHomework && (
                                <button
                                  onClick={() => onOpenSubmitHomework(hw)}
                                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-2xs"
                                >
                                  ჩაბარება
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
                                  🌟 ლექტორის კომენტარი: "{sub.feedback || 'შესანიშნავია!'}"
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
                    ამ კურსზე დავალებები ჯერ არ არის გამოქვეყნებული
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
                  <span>სესიის განრიგი & ლოკაცია</span>
                </h4>

                {session?.title ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">სესიის დასახელება</p>
                      <p className="text-xs font-black text-slate-900">{session.title}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">ლექციის განრიგი</p>
                      <p className="text-xs font-black text-indigo-600">{session.schedule || 'არ არის მითითებული'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">ლოკაცია</p>
                      <p className="text-xs font-black text-slate-900">{session.room || 'ონლაინ ლექცია'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">დაწყების თარიღი</p>
                      <p className="text-xs font-black text-slate-900">{session.startDate || 'არ არის მითითებული'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">სესიის ინფორმაცია იტვირთება...</p>
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
                  <span>სასწავლო მასალები & ბმულები</span>
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
                            <p className="text-[10px] text-slate-500 font-mono uppercase">{mat.type || 'ფაილი'}</p>
                          </div>
                        </div>
                        {mat.url && (
                          <a
                            href={mat.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                          >
                            გახსნა
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium p-8 text-center bg-slate-50 rounded-xl">
                    ამ კურსზე დამხმარე ფაილები და მასალები ჯერ არ არის ატვირთული
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
            დახურვა
          </button>
        </div>

      </div>
    </div>
  );
};