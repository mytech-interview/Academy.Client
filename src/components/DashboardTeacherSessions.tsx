import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Plus,
  CheckCircle,
  Calendar,
  FileText,
  Briefcase,
} from 'lucide-react';
import { Course, Session, User, Enrollment, HomeWork, HomeWorkSubmission } from '../types';
import { Language } from '../lib/translations';

interface DashboardTeacherSessionsProps {
  teacher: User;
  courses: Course[];
  sessions: Session[];
  enrollments: Enrollment[];
  homeworks: HomeWork[];
  homeworkSubmissions: HomeWorkSubmission[];
  registeredUsers: User[];
  onAddHomeWork: (newHW: HomeWork) => void;
  onGradeSubmission: (submissionId: string, grade: string, feedback: string) => void;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
  lang: Language;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
];

export default function DashboardTeacherSessions({
  teacher,
  courses,
  sessions,
  enrollments,
  homeworks,
  homeworkSubmissions,
  registeredUsers,
  onAddHomeWork,
  onGradeSubmission,
  onUpdateProfile,
  lang,
}: DashboardTeacherSessionsProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'homeworks' | 'profile'>('sessions');

  const mySessions = sessions.filter(
    (s) => s.teacherId === teacher.id || teacher.role === 'teacher'
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    mySessions[0]?.id || sessions[0]?.id || ''
  );

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) || mySessions[0] || sessions[0];
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

  const [showAddHWModal, setShowAddHWModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState('100/100');
  const [feedbackValue, setFeedbackValue] = useState('ძალიან კარგი ნამუშევარია!');

  const [profName, setProfName] = useState(teacher.name);
  const [profEmail, setProfEmail] = useState(teacher.email);
  const [profPhone, setProfPhone] = useState((teacher as any).phone || '+995 599 11 22 33');
  const [profHeadline, setProfHeadline] = useState(teacher.headline || 'აკადემიის ლექტორი');
  const [profBio, setProfBio] = useState(teacher.bio || 'პრაქტიკოსი მენტორი.');
  const [profAvatar, setProfAvatar] = useState(teacher.avatar || AVATAR_PRESETS[0]);
  const [profSuccess, setProfSuccess] = useState(false);

  const teacherHomeWorks = homeworks.filter(
    (hw) =>
      mySessions.some((s) => s.id === hw.sessionId) ||
      hw.assignedByTeacherId === teacher.id
  );

  const handleAddHomeWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !hwTitle) return;

    const newHW: HomeWork = {
      id: `hw-${Date.now()}`,
      sessionId: activeSession.id,
      courseId: activeSession.courseId,
      title: hwTitle,
      description: hwDesc,
      dueDate:
        hwDueDate ||
        new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedByTeacherId: teacher.id,
    };

    onAddHomeWork(newHW);
    setShowAddHWModal(false);
    setHwTitle('');
    setHwDesc('');
    setHwDueDate('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubId) return;
    onGradeSubmission(gradingSubId, gradeValue, feedbackValue);
    setGradingSubId(null);
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
        ...({ phone: profPhone } as any),
      });
    }
    setProfSuccess(true);
    setTimeout(() => setProfSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">

      {/* Header Banner */}
      <div className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={profAvatar}
              alt={teacher.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg shrink-0"
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase tracking-widest">
                {lang === 'ka' ? 'მასწავლებლის კაბინეტი' : lang === 'ru' ? 'Кабинет учителя' : 'Teacher Cabinet'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {teacher.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {teacher.headline ||
                  (lang === 'ka'
                    ? 'აკადემიის ლექტორი'
                    : lang === 'ru'
                    ? 'Лектор академии'
                    : 'Academy Lecturer')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-white">{mySessions.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ka' ? 'ჩემი სესიები' : lang === 'ru' ? 'Мои сессии' : 'My Sessions'}
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-emerald-400">{teacherHomeWorks.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ka' ? 'დავალებები' : lang === 'ru' ? 'Задания' : 'HomeWorks'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>
              {lang === 'ka'
                ? '1. ჩემი სესიები & სტუდენტები'
                : lang === 'ru'
                ? '1. Мои сессии & студенты'
                : '1. My Sessions & Students'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('homeworks')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'homeworks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>
              {lang === 'ka'
                ? '2. დავალებები & შეფასებები'
                : lang === 'ru'
                ? '2. Задания & оценки'
                : '2. HomeWorks & Grades'}
            </span>
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'homeworks'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {homeworkSubmissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>
              {lang === 'ka'
                ? '3. პირადი პროფილი'
                : lang === 'ru'
                ? '3. Мой профиль'
                : '3. My Profile'}
            </span>
          </button>
        </div>

        {/* TAB 1: MY SESSIONS & ENROLLED STUDENTS */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">

            {/* Session Selector Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {lang === 'ka'
                    ? 'აირჩიეთ აკადემიური სესია'
                    : lang === 'ru'
                    ? 'Выберите сессию'
                    : 'Select Session'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'ka'
                    ? 'იხილეთ მიბმული ლექციები, დარეგისტრირებული სტუდენტები და დაამატეთ დავალებები'
                    : lang === 'ru'
                    ? 'Просмотрите лекции, студентов и добавьте задания'
                    : 'View lessons, enrolled students, and assign homework'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.teacherName})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddHWModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {lang === 'ka'
                      ? 'დავალების დამატება'
                      : lang === 'ru'
                      ? 'Добавить задание'
                      : 'Add HomeWork'}
                  </span>
                </button>
              </div>
            </div>

            {/* Selected Session Details */}
            {activeSession && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Session Info & Lessons (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {activeCourse ? activeCourse.title : (lang === 'ka' ? 'კურსი' : 'Course')}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {activeSession.schedule}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900">{activeSession.title}</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {lang === 'ka' ? 'ლოკაცია' : lang === 'ru' ? 'Локация' : 'Location'}
                        </p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          {activeSession.room || (lang === 'ka' ? 'ონლაინ' : 'Online')}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {lang === 'ka' ? 'დაწყების თარიღი' : lang === 'ru' ? 'Дата начала' : 'Start Date'}
                        </p>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          {activeSession.startDate}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {lang === 'ka' ? 'სტუდენტები' : lang === 'ru' ? 'Студенты' : 'Students'}
                        </p>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5">
                          {enrolledStudents.length} / {activeSession.maxStudents}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      <span>
                        {lang === 'ka'
                          ? 'კურსზე მიბმული ლექციები & სილაბუსი'
                          : lang === 'ru'
                          ? 'Лекции и силлабус курса'
                          : 'Lessons Attached to Course'}
                      </span>
                    </h3>

                    {activeCourse && activeCourse.lessons && activeCourse.lessons.length > 0 ? (
                      <div className="space-y-3">
                        {activeCourse.lessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4"
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
                            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shrink-0">
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">
                        {lang === 'ka'
                          ? 'ლექციები ჯერ არ არის მიბმული'
                          : lang === 'ru'
                          ? 'Лекции ещё не добавлены'
                          : 'No lessons attached yet'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enrolled Students Panel */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span>
                          {lang === 'ka'
                            ? 'სესიაზე ჩარიცხული სტუდენტები'
                            : lang === 'ru'
                            ? 'Студенты сессии'
                            : 'Students Enrolled'}
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {enrolledStudents.length}
                      </span>
                    </h3>

                    {enrolledStudents.length > 0 ? (
                      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                        {enrolledStudents.map((st) => (
                          <div
                            key={st.id}
                            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
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
                            <span
                              className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"
                              title="Active Student"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">
                          {lang === 'ka'
                            ? 'სესიაზე ჯერ არ არიან ჩარიცხული სტუდენტები'
                            : lang === 'ru'
                            ? 'Студенты ещё не записаны'
                            : 'No students enrolled yet'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {sessions.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'ka'
                    ? 'სესიები ჯერ არ არის შექმნილი'
                    : lang === 'ru'
                    ? 'Сессии ещё не созданы'
                    : 'No sessions created yet'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOMEWORKS & SUBMISSIONS */}
        {activeTab === 'homeworks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {lang === 'ka'
                    ? 'სტუდენტების დავალებები & პასუხები'
                    : lang === 'ru'
                    ? 'Задания и ответы студентов'
                    : 'Students Responses for HomeWork'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'ka'
                    ? 'შეამოწმეთ სტუდენტების მიერ გამოგზავნილი პასუხები და მიანიჭეთ შეფასება'
                    : lang === 'ru'
                    ? 'Проверьте ответы студентов и добавьте оценки'
                    : 'Review student submissions and add grades'}
                </p>
              </div>

              <button
                onClick={() => setShowAddHWModal(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {lang === 'ka'
                    ? 'ახალი დავალების შექმნა'
                    : lang === 'ru'
                    ? 'Создать задание'
                    : 'Add HomeWork'}
                </span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">
                {lang === 'ka'
                  ? 'გამოგზავნილი პასუხების სია'
                  : lang === 'ru'
                  ? 'Список ответов'
                  : 'Submissions List'}
              </h3>

              {homeworkSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {homeworkSubmissions.map((sub) => {
                    const hw = homeworks.find((h) => h.id === sub.homeworkId);
                    return (
                      <div
                        key={sub.id}
                        className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                              {hw ? hw.title : (lang === 'ka' ? 'დავალება' : 'Homework')}
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              {lang === 'ka' ? 'სტუდენტი:' : lang === 'ru' ? 'Студент:' : 'Student:'}{' '}
                              <span className="text-indigo-600">{sub.studentName}</span>
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{sub.submittedAt}</span>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-mono">
                          {sub.content}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                          {sub.grade ? (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                {lang === 'ka' ? 'ქულა:' : lang === 'ru' ? 'Оценка:' : 'Grade:'} {sub.grade}
                              </span>
                              {sub.feedback && (
                                <span className="text-slate-500 italic">"{sub.feedback}"</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              {lang === 'ka' ? 'შესაფასებელია' : lang === 'ru' ? 'Требует оценки' : 'Pending Grade'}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setGradingSubId(sub.id);
                              setGradeValue(sub.grade || '100/100');
                              setFeedbackValue(sub.feedback || '');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer self-end sm:self-auto"
                          >
                            {sub.grade
                              ? (lang === 'ka' ? 'შეფასების შეცვლა' : lang === 'ru' ? 'Изменить оценку' : 'Update Grade')
                              : (lang === 'ka' ? 'შეფასების დაწერა (+Grade)' : lang === 'ru' ? 'Поставить оценку' : 'Add Grade')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">
                    {lang === 'ka'
                      ? 'სტუდენტების პასუხები ჯერ არ არის შემოსული'
                      : lang === 'ru'
                      ? 'Ответы студентов ещё не поступили'
                      : 'No student submissions yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TEACHER PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              {lang === 'ka'
                ? 'პირადი პროფილის რედაქტირება'
                : lang === 'ru'
                ? 'Редактировать профиль'
                : 'Update Profile'}
            </h2>

            {profSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>
                  {lang === 'ka'
                    ? 'პროფილი წარმატებით განახლდა'
                    : lang === 'ru'
                    ? 'Профиль успешно обновлён'
                    : 'Profile updated successfully'}
                </span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'სახელი და გვარი' : lang === 'ru' ? 'Имя и фамилия' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'ელ-ფოსტა' : lang === 'ru' ? 'Эл. почта' : 'Email'}
                </label>
                <input
                  type="email"
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'ტელეფონი' : lang === 'ru' ? 'Телефон' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'სათაური / სპეციალიზაცია' : lang === 'ru' ? 'Должность / специализация' : 'Headline / Specialization'}
                </label>
                <input
                  type="text"
                  value={profHeadline}
                  onChange={(e) => setProfHeadline(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'ბიოგრაფია / გამოცდილება' : lang === 'ru' ? 'Биография / Опыт' : 'Bio / Experience'}
                </label>
                <textarea
                  rows={3}
                  value={profBio}
                  onChange={(e) => setProfBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'პროფილის ფოტო' : lang === 'ru' ? 'Фото профиля' : 'Profile Photo'}
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfAvatar(preset)}
                      className={`h-12 w-12 rounded-full overflow-hidden border-2 shrink-0 transition ${
                        profAvatar === preset
                          ? 'border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm cursor-pointer"
                >
                  {lang === 'ka' ? 'შენახვა' : lang === 'ru' ? 'Сохранить' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ADD HOMEWORK MODAL */}
      {showAddHWModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {lang === 'ka'
                ? 'ახალი დავალების დამატება'
                : lang === 'ru'
                ? 'Добавить задание'
                : 'Add HomeWork for Session'}
            </h3>

            <form onSubmit={handleAddHomeWorkSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'სესია' : lang === 'ru' ? 'Сессия' : 'Session'}
                </label>
                <input
                  type="text"
                  value={activeSession?.title || ''}
                  disabled
                  className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'დავალების სათაური' : lang === 'ru' ? 'Название задания' : 'Homework Title'}
                </label>
                <input
                  type="text"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder={lang === 'ka' ? 'მაგ: დავალება 1: React State Management' : 'e.g. Homework 1: React State'}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'აღწერა / პირობა' : lang === 'ru' ? 'Описание / условие' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder={lang === 'ka' ? 'აღწერეთ დავალების მოთხოვნები...' : 'Describe the homework requirements...'}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'ჩაბარების ბოლო ვადა (Due Date)' : lang === 'ru' ? 'Срок сдачи' : 'Due Date'}
                </label>
                <input
                  type="date"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHWModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  {lang === 'ka' ? 'გაუქმება' : lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  {lang === 'ka' ? 'დამატება' : lang === 'ru' ? 'Добавить' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE SUBMISSION MODAL */}
      {gradingSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {lang === 'ka'
                ? 'დავალების შეფასება (Add Grade)'
                : lang === 'ru'
                ? 'Оценить задание'
                : 'Grade Homework'}
            </h3>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka' ? 'ქულა (Grade)' : lang === 'ru' ? 'Оценка' : 'Grade'}
                </label>
                <input
                  type="text"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  placeholder="100/100"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'ka'
                    ? 'კომენტარი / უკუკავშირი (Feedback)'
                    : lang === 'ru'
                    ? 'Комментарий / обратная связь'
                    : 'Feedback'}
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
                  {lang === 'ka' ? 'გაუქმება' : lang === 'ru' ? 'Отмена' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  {lang === 'ka' ? 'შენახვა' : lang === 'ru' ? 'Сохранить' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
