import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Enrollment } from '../types';
import { Language } from '../lib/translations';
import { mockCourses, mockTeachers, mockStudents } from '../data/mockData';
import { getTranslatedCourse } from '../lib/courseTranslations';
import i18n from '../i18n';

interface AppContextValue {
  activeUser: User | null;
  setActiveUser: (u: User | null) => void;
  registeredUsers: User[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  enrollments: Enrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
  translatedCourses: Course[];
  lang: Language;
  setLang: (l: Language) => void;
  handleLoginSuccess: (user: User) => void;
  handleLogout: () => void;
  handleRegisterUser: (user: User & { password?: string }) => void;
  handleUpdateProfile: (fields: Partial<User>) => void;
  handleAddCourse: (course: Course) => void;
  handleEnrollInCourse: (courseId: string, onNeedAuth: () => void) => void;
  handleUpdateEnrollment: (id: string, lessons: string[], progress: number, completed: boolean) => void;
  enrollSuccessMessage: string | null;
  // OTP flow state
  otpMode: 'login' | 'register';          // ← NEW: which flow triggered OTP
  setOtpMode: (v: 'login' | 'register') => void;
  otpPendingUser: User | null;             // ← NEW: the existing user being logged in
  setOtpPendingUser: (u: User | null) => void;
  otpEmail: string; setOtpEmail: (v: string) => void;
  otpPassword: string; setOtpPassword: (v: string) => void;
  otpRole: 'student' | 'teacher'; setOtpRole: (v: 'student' | 'teacher') => void;
  otpName: string; setOtpName: (v: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('academy_lang') as Language) || 'ka');
  const [activeUser, setActiveUserState] = useState<User | null>(() => {
    const s = localStorage.getItem('academy_active_user');
    return s ? JSON.parse(s) : null;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const s = localStorage.getItem('academy_courses');
    return s ? JSON.parse(s) : mockCourses;
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const s = localStorage.getItem('academy_enrollments');
    return s ? JSON.parse(s) : [];
  });
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const s = localStorage.getItem('academy_registered_users');
    return s ? JSON.parse(s) : [...mockTeachers, ...mockStudents];
  });
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // OTP flow
  const [otpMode, setOtpMode] = useState<'login' | 'register'>('login');
  const [otpPendingUser, setOtpPendingUser] = useState<User | null>(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPassword, setOtpPassword] = useState('');
  const [otpRole, setOtpRole] = useState<'student' | 'teacher'>('student');
  const [otpName, setOtpName] = useState('');

  useEffect(() => { localStorage.setItem('academy_lang', lang); }, [lang]);
  useEffect(() => {
    if (activeUser) localStorage.setItem('academy_active_user', JSON.stringify(activeUser));
    else localStorage.removeItem('academy_active_user');
  }, [activeUser]);
  useEffect(() => { localStorage.setItem('academy_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('academy_enrollments', JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem('academy_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  const translatedCourses = courses.map((c) => getTranslatedCourse(c, lang));
  const setLang = (l: Language) => setLangState(l);
  const setActiveUser = (u: User | null) => setActiveUserState(u);
  const handleLoginSuccess = (user: User) => setActiveUserState(user);
  const handleLogout = () => setActiveUserState(null);
  const handleRegisterUser = (u: User & { password?: string }) => setRegisteredUsers((p) => [...p, u]);
  const handleUpdateProfile = (fields: Partial<User>) => {
    if (!activeUser) return;
    const updated = { ...activeUser, ...fields };
    setActiveUserState(updated);
    setRegisteredUsers((p) => p.map((u) => (u.id === activeUser.id ? updated : u)));
  };
  const handleAddCourse = (c: Course) => setCourses((p) => [c, ...p]);
  const handleEnrollInCourse = (courseId: string, onNeedAuth: () => void) => {
    if (!activeUser) { onNeedAuth(); return; }
    if (activeUser.role === 'teacher') return;
    if (enrollments.some((e) => e.studentId === activeUser.id && e.courseId === courseId)) return;
    const newE: Enrollment = { id: `enrollment-${Date.now()}`, studentId: activeUser.id, courseId, progress: 0, completedLessons: [], isCompleted: false, enrolledAt: new Date().toISOString() };
    setEnrollments((p) => [...p, newE]);
    setCourses((p) => p.map((c) => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c));
    const course = courses.find((c) => c.id === courseId);
    setEnrollSuccessMessage(course?.title ?? '');
    setTimeout(() => setEnrollSuccessMessage(null), 4000);
  };
  const handleUpdateEnrollment = (id: string, lessons: string[], progress: number, completed: boolean) => {
    setEnrollments((p) => p.map((e) => e.id === id ? { ...e, completedLessons: lessons, progress, isCompleted: completed, completedAt: completed ? new Date().toISOString() : e.completedAt } : e));
  };

  return (
    <AppContext.Provider value={{
      activeUser, setActiveUser, registeredUsers, setRegisteredUsers,
      courses, setCourses, enrollments, setEnrollments, translatedCourses,
      lang, setLang, handleLoginSuccess, handleLogout, handleRegisterUser,
      handleUpdateProfile, handleAddCourse, handleEnrollInCourse, handleUpdateEnrollment,
      enrollSuccessMessage,
      otpMode, setOtpMode, otpPendingUser, setOtpPendingUser,
      otpEmail, setOtpEmail, otpPassword, setOtpPassword,
      otpRole, setOtpRole, otpName, setOtpName,
    }}>
      {children}
    </AppContext.Provider>
  );
}