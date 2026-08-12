import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import { User, Course, Enrollment, Session, HomeWork, HomeWorkSubmission } from '../types';
import { Language } from '../lib/translations';
import DashboardTeacherSessions from '../components/DashboardTeacherSessions';

interface TeacherDashboardPageProps {
  lang: Language;
  activeUser: User | null;
  courses: Course[];
  enrollments: Enrollment[];
  registeredUsers: User[];
  onUpdateProfile: (fields: Partial<User>) => void;
  onOpenAuth: () => void;
}

// Demo sessions seeded from the teacher mock data
const DEMO_SESSIONS: Session[] = [
  {
    id: 'session-1',
    courseId: 'course-1',
    title: 'React & Node.js — ჯგუფი A (2025 გაზაფხული)',
    teacherId: 'teacher-1',
    teacherName: 'მარიამ ბერიძე',
    startDate: '2025-03-01',
    schedule: 'ორ / ოთხ — 18:00–20:00',
    room: 'აუდიტორია #204',
    maxStudents: 20,
    enrolledStudentIds: [],
  },
  {
    id: 'session-2',
    courseId: 'course-2',
    title: 'UX/UI Design — ჯგუფი B (2025 ზაფხული)',
    teacherId: 'teacher-2',
    teacherName: 'გიორგი კალანდაძე',
    startDate: '2025-06-15',
    schedule: 'სამ / პარ — 17:00–19:00',
    room: 'სტუდია #101',
    maxStudents: 15,
    enrolledStudentIds: [],
  },
  {
    id: 'session-3',
    courseId: 'course-3',
    title: 'Digital Marketing — ჯგუფი C (2025 შემოდგომა)',
    teacherId: 'teacher-3',
    teacherName: 'ნინო შენგელია',
    startDate: '2025-09-10',
    schedule: 'ხუთ / შაბ — 11:00–13:00',
    room: 'ონლაინ (Zoom)',
    maxStudents: 25,
    enrolledStudentIds: [],
  },
];

const DEMO_HOMEWORKS: HomeWork[] = [
  {
    id: 'hw-1',
    sessionId: 'session-1',
    courseId: 'course-1',
    title: 'დავალება 1: React State Management',
    description: 'შექმენით მარტივი To-Do App React Hooks-ის გამოყენებით.',
    dueDate: '2025-03-15',
    assignedByTeacherId: 'teacher-1',
  },
  {
    id: 'hw-2',
    sessionId: 'session-1',
    courseId: 'course-1',
    title: 'დავალება 2: REST API Integration',
    description: 'დააკავშირეთ React-ის Front-End Node.js Back-End-თან.',
    dueDate: '2025-03-29',
    assignedByTeacherId: 'teacher-1',
  },
];

const DEMO_SUBMISSIONS: HomeWorkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    studentId: 'student-demo-1',
    studentName: 'გიორგი მამულაშვილი',
    content: 'https://github.com/giorgi/todo-app — To-Do App დასრულებულია Hooks-ით.',
    submittedAt: '2025-03-12',
    grade: '95/100',
    feedback: 'ძალიან კარგი ნამუშევარია!',
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-1',
    studentId: 'student-demo-2',
    studentName: 'ანა კვარაცხელია',
    content: 'https://github.com/ana/todo-react — Hooks + TypeScript.',
    submittedAt: '2025-03-13',
  },
];

export default function TeacherDashboardPage({
  activeUser,
  courses,
  enrollments,
  registeredUsers,
  onUpdateProfile,
  onOpenAuth,
}: TeacherDashboardPageProps) {
  const { t } = useTranslation();

  const [homeworks, setHomeworks] = useState<HomeWork[]>(DEMO_HOMEWORKS);
  const [submissions, setSubmissions] = useState<HomeWorkSubmission[]>(DEMO_SUBMISSIONS);

  const handleAddHomeWork = (newHW: HomeWork) => {
    setHomeworks((prev) => [...prev, newHW]);
  };

  const handleGradeSubmission = (submissionId: string, grade: string, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, grade, feedback } : s))
    );
  };

  if (!activeUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />
          <GraduationCap className="mx-auto h-16 w-16 text-indigo-500 animate-pulse" />
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-950 tracking-tight">
              {t('teacherDashboard.page.authRequiredTitle')}
            </h3>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md active:scale-[0.98]"
          >
            {t('teacherDashboard.page.loginBtn')}
          </button>
        </div>
      </div>
    );
  }

  if (activeUser.role !== 'teacher') {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg">
          <GraduationCap className="mx-auto h-16 w-16 text-amber-500" />
          <h3 className="text-lg font-black text-slate-950 tracking-tight">
            {t('teacherDashboard.page.teachersOnlyTitle')}
          </h3>
        </div>
      </div>
    );
  }

  // Filter sessions for this teacher
  const teacherSessions = DEMO_SESSIONS.filter(
    (s) => s.teacherId === activeUser.id || DEMO_SESSIONS.length > 0
  );

  return (
    <DashboardTeacherSessions
      teacher={activeUser}
      courses={courses}
      sessions={teacherSessions}
      enrollments={enrollments}
      homeworks={homeworks}
      homeworkSubmissions={submissions}
      registeredUsers={registeredUsers}
      onAddHomeWork={handleAddHomeWork}
      onGradeSubmission={handleGradeSubmission}
      onUpdateProfile={onUpdateProfile}
    />
  );
}