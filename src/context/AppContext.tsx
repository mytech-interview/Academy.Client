import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Enrollment, ActiveSession } from '../types';
import { Language } from '../lib/translations';
import { mockCourses, mockTeachers, mockStudents } from '../data/mockData';
import { getTranslatedCourse } from '../lib/courseTranslations';
import { getHomeActiveSessions } from '../api/sessions';
import { addEnrollment as addEnrollmentRequest } from '../api/enrollments';
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
  activeSessions: ActiveSession[];
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveSession[]>>;
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
  // Tracks which course is currently being enrolled into (for button loading state)
  enrollingCourseId: string | null;
  // Holds the last enrollment error message, if any
  enrollError: string | null;
  // OTP flow state
  otpMode: 'login' | 'register';
  setOtpMode: (v: 'login' | 'register') => void;
  otpPendingUser: User | null;
  setOtpPendingUser: (u: User | null) => void;
  otpEmail: string; setOtpEmail: (v: string) => void;
  otpPassword: string; setOtpPassword: (v: string) => void;
  otpRole: number;
  setOtpRole: (role: number) => void;
  otpName: string; setOtpName: (v: string) => void;
  otpFirstName: string; setOtpFirstName: (v: string) => void;
  otpLastName: string; setOtpLastName: (v: string) => void;
  otpTelephone: string; setOtpTelephone: (v: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ka');
  const [activeUser, setActiveUserState] = useState<User | null>(() => {
    const s = localStorage.getItem('academy_active_user');
    return s ? JSON.parse(s) : null;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const s = localStorage.getItem('academy_courses');
    return s ? JSON.parse(s) : mockCourses;
  });
  // NOTE: enrollments are no longer seeded with mock/local-only data on write.
  // They still hydrate from localStorage as a cache for a snappier first paint,
  // but are only ever appended to after a confirmed backend response.
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const s = localStorage.getItem('academy_enrollments');
    return s ? JSON.parse(s) : [];
  });
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const s = localStorage.getItem('academy_registered_users');
    return s ? JSON.parse(s) : [...mockTeachers, ...mockStudents];
  });
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

  // OTP flow
  const [otpMode, setOtpMode] = useState<'login' | 'register'>('login');
  const [otpPendingUser, setOtpPendingUser] = useState<User | null>(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPassword, setOtpPassword] = useState('');
  const [otpRole, setOtpRole] = useState<number>(1); // 1 = ученик, 2 = учитель
  const [otpName, setOtpName] = useState('');
  const [otpFirstName, setOtpFirstName] = useState('');
  const [otpLastName, setOtpLastName] = useState('');
  const [otpTelephone, setOtpTelephone] = useState('');

  useEffect(() => { localStorage.setItem('academy_lang', lang); }, [lang]);
  useEffect(() => {
    if (activeUser) localStorage.setItem('academy_active_user', JSON.stringify(activeUser));
    else localStorage.removeItem('academy_active_user');
  }, [activeUser]);
  useEffect(() => { localStorage.setItem('academy_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('academy_enrollments', JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem('academy_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  useEffect(() => {
    getHomeActiveSessions(1)
      .then(setActiveSessions)
      .catch((err) => console.error('Ошибка загрузки активных сессий:', err));
  }, []);

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

  // Real enrollment flow: calls the backend, and only touches local state
  // (enrollments / courses / success message) once the request succeeds.
  const handleEnrollInCourse = async (courseId: string, onNeedAuth: () => void) => {
    if (!activeUser) { onNeedAuth(); return; }
    if (activeUser.role === 'teacher') return;

    // Already enrolled locally — nothing to do.
    if (enrollments.some((e) => e.studentId === activeUser.id && e.courseId === courseId)) return;

    // Prevent duplicate in-flight requests for the same course.
    if (enrollingCourseId === courseId) return;

    setEnrollError(null);
    setEnrollingCourseId(courseId);

    try {
      // NOTE: assumes activeUser.id holds the student's GUID.
      // If your User type stores it under a different field (e.g. `guid`),
      // change the line below accordingly.
      const studentGuid = activeUser.id;

      await addEnrollmentRequest({
        studentGuid,
        sessionId: Number(courseId),
      });

      // Only update local state after the backend confirms success.
      const newE: Enrollment = {
        id: `enrollment-${Date.now()}`,
        studentId: activeUser.id,
        courseId,
        progress: 0,
        completedLessons: [],
        isCompleted: false,
        enrolledAt: new Date().toISOString(),
      };
      setEnrollments((p) => [...p, newE]);
      setCourses((p) => p.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c)));

      const course = courses.find((c) => c.id === courseId);
      setEnrollSuccessMessage(course?.title ?? '');
      setTimeout(() => setEnrollSuccessMessage(null), 4000);
    } catch (err: any) {
      setEnrollError(err?.message || 'Не удалось записаться на курс. Попробуйте ещё раз.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleUpdateEnrollment = (id: string, lessons: string[], progress: number, completed: boolean) => {
    setEnrollments((p) => p.map((e) => e.id === id ? { ...e, completedLessons: lessons, progress, isCompleted: completed, completedAt: completed ? new Date().toISOString() : e.completedAt } : e));
  };

  return (
    <AppContext.Provider value={{
      activeUser, setActiveUser, registeredUsers, setRegisteredUsers,
      courses, setCourses, enrollments, setEnrollments, translatedCourses,
      activeSessions, setActiveSessions,
      lang, setLang, handleLoginSuccess, handleLogout, handleRegisterUser,
      handleUpdateProfile, handleAddCourse, handleEnrollInCourse, handleUpdateEnrollment,
      enrollSuccessMessage, enrollingCourseId, enrollError,
      otpMode, setOtpMode, otpPendingUser, setOtpPendingUser,
      otpEmail, setOtpEmail, otpPassword, setOtpPassword,
      otpRole, setOtpRole, otpName, setOtpName,
      otpFirstName, setOtpFirstName, otpLastName, setOtpLastName,
      otpTelephone, setOtpTelephone,
    }}>
      {children}
    </AppContext.Provider>
  );
}