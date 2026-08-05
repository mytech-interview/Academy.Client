import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Clock,
  Check,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  Lock,
  Camera,
  Edit3,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course, Enrollment, User } from '../types';
import { Language, getTranslatedCourse } from '../lib/translations';

interface DashboardStudentProps {
  student: User;
  courses: Course[];
  enrollments: Enrollment[];
  onUpdateEnrollment: (enrollmentId: string, completedLessonIds: string[], progress: number, isCompleted: boolean) => void;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
  lang: Language;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
];

export default function DashboardStudent({
  student,
  courses,
  enrollments,
  onUpdateEnrollment,
  onUpdateProfile,
  lang
}: DashboardStudentProps) {
  const { t } = useTranslation();

  // Tab control
  const [activeSubTab, setActiveSubTab] = useState<'study' | 'profile'>('study');

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [attendanceCodeInput, setAttendanceCodeInput] = useState('');
  const [attendanceError, setAttendanceError] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const [showCertificateId, setShowCertificateId] = useState<string | null>(null);

  // Profile fields state
  const [profName, setProfName] = useState(student.name);
  const [profEmail, setProfEmail] = useState(student.email);
  const [profPhone, setProfPhone] = useState((student as any).phone || '+995 599 123 456');
  const [profHeadline, setProfHeadline] = useState(student.headline || t('studentDashboard.defaultHeadline', 'სტუდენტი აკადემიაში'));
  const [profBio, setProfBio] = useState(student.bio || t('studentDashboard.defaultBio', 'მიზანდასახული სტუდენტი, რომელიც ეუფლება ტექნოლოგიურ უნარებს.'));
  const [profAvatar, setProfAvatar] = useState(student.avatar || AVATAR_PRESETS[0]);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Filter enrollments for this student
  const studentEnrollments = enrollments.filter((e) => e.studentId === student.id);

  // Find course details for each enrollment and translate them
  const enrolledCoursesWithEnrollment = studentEnrollments.map((enr) => {
    const rawCourse = courses.find((c) => c.id === enr.courseId);
    const course = rawCourse ? getTranslatedCourse(rawCourse, lang) : undefined;
    return {
      enrollment: enr,
      course
    };
  }).filter(item => item.course !== undefined) as { enrollment: Enrollment; course: Course }[];

  // Global calculations
  const totalEnrolled = studentEnrollments.length;
  const totalCompleted = studentEnrollments.filter((e) => e.isCompleted).length;
  const avgProgress = totalEnrolled > 0
    ? Math.round(studentEnrollments.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrolled)
    : 0;

  // Active classroom details
  const activeItem = enrolledCoursesWithEnrollment.find(item => item.course?.id === activeCourseId);
  const activeCourse = activeItem?.course;
  const activeEnrollment = activeItem?.enrollment;

  // Lessons for active course
  const activeLessons = activeCourse?.lessons || [];
  const currentLessonIndex = activeLessonId
    ? activeLessons.findIndex(l => l.id === activeLessonId)
    : 0;
  const currentLesson = activeLessons[currentLessonIndex] || activeLessons[0];

  // Attendance check-in code generation (deterministic per lesson)
  const getExpectedCode = (idx: number) => {
    return String(1000 + ((idx + 2) * 357) % 8999);
  };

  const currentExpectedCode = getExpectedCode(currentLessonIndex >= 0 ? currentLessonIndex : 0);

  const handleSelectCourse = (courseId: string) => {
    const item = enrolledCoursesWithEnrollment.find(i => i.course?.id === courseId);
    if (item && item.course) {
      setActiveCourseId(courseId);
      const completed = item.enrollment.completedLessons;
      const nextUncompleted = item.course.lessons.find(l => !completed.includes(l.id));
      setActiveLessonId(nextUncompleted ? nextUncompleted.id : item.course.lessons[0]?.id || null);
      setAttendanceCodeInput('');
      setAttendanceError(false);
      setAttendanceSuccess(false);
    }
  };

  const handleConfirmAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrollment || !activeCourse || !currentLesson) return;

    if (attendanceCodeInput.trim() === currentExpectedCode) {
      setAttendanceError(false);
      setAttendanceSuccess(true);

      // Mark as completed
      let updatedCompleted = [...activeEnrollment.completedLessons];
      if (!updatedCompleted.includes(currentLesson.id)) {
        updatedCompleted.push(currentLesson.id);
      }

      const totalLessons = activeCourse.lessons.length;
      const progress = totalLessons > 0 ? Math.round((updatedCompleted.length / totalLessons) * 100) : 0;
      const isCompleted = progress === 100;

      onUpdateEnrollment(activeEnrollment.id, updatedCompleted, progress, isCompleted);

      setTimeout(() => {
        setAttendanceSuccess(false);
        setAttendanceCodeInput('');
        // Auto navigate to next lesson if any
        if (currentLessonIndex < activeCourse.lessons.length - 1) {
          setActiveLessonId(activeCourse.lessons[currentLessonIndex + 1].id);
        }
      }, 1500);
    } else {
      setAttendanceError(true);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profName,
        email: profEmail,
        headline: profHeadline,
        bio: profBio,
        avatar: profAvatar,
        ...({ phone: profPhone } as any)
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2000);
    }
  };

  return (
    <div id="student-dashboard" className="space-y-8 py-4 text-left">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-indigo-950 to-indigo-800 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10 relative">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">{t('studentWelcomeBadge')}</span>
            <h2 id="welcome-student-title" className="text-2xl font-black tracking-tight sm:text-3xl">
              {t('studentDashboard.greeting', { name: student.name })}
            </h2>
            <p className="text-sm text-indigo-100/90 font-light leading-relaxed">
              {t('studentWelcomeText')}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shrink-0">
            <Sparkles className="h-6 w-6 text-indigo-300" />
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-6 pb-0.5">
        <button
          onClick={() => setActiveSubTab('study')}
          className={`pb-3 text-sm font-extrabold transition relative ${
            activeSubTab === 'study' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('studentDashboard.studyTab')}
          {activeSubTab === 'study' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 text-sm font-extrabold transition relative ${
            activeSubTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {t('studentDashboard.profileTab')}
          {activeSubTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === 'profile' ? (
        /* PROFILE EDITOR TAB */
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fade-in text-left">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-black text-slate-950 tracking-tight">{t('studentDashboard.profEditTitle')}</h3>
            <p className="text-xs text-slate-400 mt-1">{t('studentDashboard.profEditSub')}</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Preset selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">{t('studentDashboard.avatarSelectLabel')}</label>
              <div className="flex flex-wrap items-center gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <div className="relative group shrink-0">
                  <img
                    src={profAvatar}
                    alt="Current Avatar"
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-600/30 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{t('studentDashboard.chooseReadyAvatar')}</span>
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfAvatar(preset)}
                        className={`h-10 w-10 rounded-full overflow-hidden border-2 transition ${
                          profAvatar === preset ? 'border-indigo-600 scale-105 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{t('studentDashboard.uploadOwnPhoto')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    id="student-custom-avatar"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setProfAvatar(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="student-custom-avatar"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-sm active:scale-[0.98]"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-500" />
                    <span>{t('studentDashboard.selectPhotoBtn')}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('studentDashboard.fullNameLabel')}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Email (Readonly mock-up of auth state) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('studentDashboard.emailLabel')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('studentDashboard.phoneLabel')}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t('studentDashboard.headlineLabel')}</label>
                <div className="relative">
                  <Edit3 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profHeadline}
                    onChange={(e) => setProfHeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t('studentDashboard.bioLabel')}</label>
              <textarea
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Success feedback */}
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                {t('studentDashboard.profileSavedSuccess')}
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition active:scale-[0.98] shadow-md cursor-pointer"
              >
                {t('studentDashboard.saveChangesBtn')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* LEARNING / CLASSROOM CABINET TAB */
        <>
          {/* Stats row */}
          <div id="student-stats-row" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t('studentStatActive')}</span>
                <span id="stat-active-courses" className="block text-2xl font-black text-slate-900 font-display">{totalEnrolled}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t('studentStatCompleted')}</span>
                <span id="stat-completed-courses" className="block text-2xl font-black text-slate-900 font-display">{totalCompleted}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-bold border border-amber-100">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{t('studentStatProgress')}</span>
                <span id="stat-avg-progress" className="block text-2xl font-black text-slate-900 font-display">{avgProgress}%</span>
              </div>
            </div>
          </div>

          {/* Classroom layout vs Enrolled courses list */}
          {activeCourseId && activeCourse && activeEnrollment ? (
            /* Classroom Workspace */
            <div id="classroom-workspace" className="rounded-[2.5rem] border border-slate-200/85 bg-white overflow-hidden shadow-md">
              {/* Header */}
              <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left space-y-1">
                  <button
                    onClick={() => setActiveCourseId(null)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {t('studentDashboard.leaveClassroom')}
                  </button>
                  <h3 className="text-base font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
                    {activeCourse.title}
                  </h3>
                </div>

                {/* Progress status */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">{t('studentDashboard.overallProgress')}</span>
                    <span className="text-sm font-extrabold text-indigo-600 block">{activeEnrollment.progress}%</span>
                  </div>
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${activeEnrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                {/* Syllabus Navigation Left Sidebar */}
                <div className="lg:col-span-4 border-r border-slate-100 p-4 bg-slate-50/30 overflow-y-auto max-h-[500px]">
                  <span className="block text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">{t('studentDashboard.lessonsList')}</span>
                  <div className="space-y-1.5">
                    {activeLessons.map((lesson, idx) => {
                      const isCompleted = activeEnrollment.completedLessons.includes(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setAttendanceCodeInput('');
                            setAttendanceError(false);
                            setAttendanceSuccess(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left border ${
                            isActive
                              ? 'bg-white border-slate-200 shadow-sm'
                              : 'border-transparent hover:bg-slate-100/75'
                          }`}
                        >
                          {/* Attendance Checkbox Badge */}
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-xs ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 text-slate-400 bg-white'
                          }`}>
                            {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                          </span>

                          {/* Lesson Title and Schedule metadata */}
                          <div className="space-y-0.5 leading-none">
                            <span className={`text-xs font-bold block ${isActive ? 'text-indigo-600' : 'text-slate-800'}`}>
                              {lesson.title}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-slate-400 block pt-0.5">
                              {lesson.duration} • {t('studentDashboard.physicalLec')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Workspace Physical Lecture Details */}
                <div className="lg:col-span-8 p-6 flex flex-col justify-between max-h-[550px] overflow-y-auto">
                  {currentLesson ? (
                    <div className="space-y-6 flex-1 text-left">
                      {/* Title and Auditorium metadata banner */}
                      <div className="border-b border-slate-100 pb-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100/50 px-2 py-1 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider font-mono">
                          <MapPin className="h-3 w-3" />
                          {t('studentDashboard.auditoriumBadge')}
                        </div>
                        <h4 className="mt-2 text-lg font-black text-slate-950 leading-tight font-sans">
                          {currentLesson.title}
                        </h4>
                        <span className="text-xs text-slate-400 mt-1 block flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 inline text-slate-300" />
                          {t('studentDashboard.scheduleInfo', { duration: currentLesson.duration })}
                        </span>
                      </div>

                      {/* Physical Attendance & Lesson description */}
                      <div className="py-2 space-y-6">
                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 sm:p-5 text-xs text-slate-600 leading-relaxed space-y-3">
                          <h5 className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {t('studentDashboard.lectureTopicsHeader')}
                          </h5>
                          <p className="font-light">
                            {currentLesson.content || t('studentDashboard.defaultLessonContent')}
                          </p>
                          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-indigo-800 font-medium">
                            💡 {t('studentDashboard.onSiteAssignment')}
                          </div>
                        </div>

                        {/* PHYSICAL ATTENDANCE REGISTER TERMINAL */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                          <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone className="h-4.5 w-4.5 text-indigo-600" />
                            {t('studentDashboard.attendanceCheckHeader')}
                          </h5>

                          {activeEnrollment.completedLessons.includes(currentLesson.id) ? (
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs font-bold space-y-1">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                {t('studentDashboard.attendanceConfirmedTitle')}
                              </div>
                              <p className="text-[10px] font-normal text-emerald-600/90 pl-6">
                                {t('studentDashboard.attendanceConfirmedDesc')}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                                {t('studentDashboard.enterCodePrompt')}
                              </p>

                              <form onSubmit={handleConfirmAttendance} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                                <div className="relative flex-1">
                                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                  <input
                                    type="text"
                                    maxLength={4}
                                    placeholder={t('studentDashboard.codePlaceholder')}
                                    value={attendanceCodeInput}
                                    onChange={(e) => setAttendanceCodeInput(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-center font-mono font-bold tracking-widest text-slate-900 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold transition active:scale-[0.98]"
                                >
                                  {t('studentDashboard.confirmAttendanceBtn')}
                                </button>
                              </form>

                              {attendanceError && (
                                <p className="text-[10px] text-red-600 font-bold">
                                  ❌ {t('studentDashboard.incorrectCodeError')}
                                </p>
                              )}

                              {attendanceSuccess && (
                                <p className="text-[10px] text-emerald-600 font-bold">
                                  ✅ {t('studentDashboard.attendanceVerifiedSuccess')}
                                </p>
                              )}

                              {/* Interactive Help for Demo */}
                              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-[10px] text-amber-800 leading-relaxed font-light">
                                💡 <strong>{t('studentDashboard.demoHintLabel')}</strong>{' '}
                                {t('studentDashboard.demoHintText')}{' '}
                                <strong className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-amber-200 font-black">{currentExpectedCode}</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                      <BookOpen className="h-10 w-10 mb-2 opacity-55" />
                      <p className="text-sm">{t('studentDashboard.selectLesson')}</p>
                    </div>
                  )}

                  {/* Complete Lesson Navigation */}
                  {currentLesson && (
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-mono">
                        {currentLessonIndex + 1} / {activeLessons.length}
                      </span>
                      {activeEnrollment.completedLessons.includes(currentLesson.id) && currentLessonIndex < activeLessons.length - 1 && (
                        <button
                          onClick={() => setActiveLessonId(activeLessons[currentLessonIndex + 1].id)}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                        >
                          {t('studentDashboard.nextLectureBtn')}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Enrolled Courses catalog */
            <div className="space-y-4">
              <h3 className="font-sans text-lg font-bold text-slate-950">{t('studentDashboard.activeCoursesTitle')}</h3>

              {enrolledCoursesWithEnrollment.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">{t('studentDashboard.noCoursesYet')}</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      {t('studentDashboard.noCoursesSubtitle')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {enrolledCoursesWithEnrollment.map(({ enrollment, course }) => {
                    if (!course) return null;
                    return (
                      <div
                        key={enrollment.id}
                        className="rounded-[2rem] border border-slate-200 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left leading-none">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 block mb-0.5">{course.category}</span>
                            <h4 className="text-sm font-bold text-slate-950 line-clamp-1">{course.title}</h4>
                          </div>
                        </div>

                        {/* Progress tracking */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{t('studentDashboard.progressLabel')}</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Button actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                          {enrollment.isCompleted ? (
                            <button
                              onClick={() => setShowCertificateId(course.id)}
                              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition"
                            >
                              <Award className="h-4 w-4" />
                              {t('studentDashboard.certificateBtn')}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              {t('studentDashboard.lessonsLeft', { count: course.lessons.length - enrollment.completedLessons.length })}
                            </span>
                          )}

                          <button
                            onClick={() => handleSelectCourse(course.id)}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
                          >
                            {enrollment.progress === 0 ? t('studentDashboard.startStudy') : t('studentDashboard.continueStudy')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Graduation Certificate Modal popup */}
      {showCertificateId && (
        <div id="cert-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-slate-100 p-8 shadow-2xl text-center space-y-6">
            <button
              onClick={() => setShowCertificateId(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            >
              <XClose className="h-5 w-5" />
            </button>

            {/* Certificate visual box */}
            <div className="border-[8px] border-indigo-900 rounded-lg p-8 bg-slate-50/50 space-y-5 relative">
              <div className="absolute right-4 top-4 opacity-15">
                <Award className="h-28 w-28 text-indigo-900" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">{t('studentDashboard.certTitle')}</span>
                <h3 className="text-2xl font-black text-slate-900 font-sans">{t('brandName').toUpperCase()}</h3>
              </div>

              <div className="py-2 border-y border-indigo-100/60 max-w-sm mx-auto">
                <span className="text-xs font-medium text-slate-400 block">{t('studentDashboard.certSub')}</span>
                <span className="text-lg font-extrabold text-indigo-700 block mt-1">{student.name}</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 block font-normal">{t('studentDashboard.certCompleted')}</span>
                <span className="text-sm font-extrabold text-slate-800 block">
                  {courses.find(c => c.id === showCertificateId)?.title || t('studentDashboard.certFallbackCourseTitle', 'აკადემიის სასწავლო კურსი')}
                </span>
              </div>

              <div className="flex justify-between items-end pt-4 max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-normal">{t('studentDashboard.certDate')}</span>
                  <span className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString(lang === 'ka' ? 'ka-GE' : lang === 'ru' ? 'ru-RU' : 'en-US')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-normal">{t('studentDashboard.certSignature')}</span>
                  <span className="text-xs font-serif font-semibold text-indigo-600 block italic leading-none">Beridze M.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => window.print()}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
              >
                {t('studentDashboard.certPrintBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Close SVG to keep clean modularity
function XClose({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}