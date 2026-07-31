import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import i18n from './i18n';
import { User, Course, Enrollment, Language } from './types';
import { getTranslatedCourse, translateCategory } from './lib/courseTranslations';
import { mockCourses, mockTeachers } from './data/mockData';

import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import CourseDetailModal from './components/CourseDetailModal';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import OffersPage from './pages/OffersPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';

type ActiveTabType = 'home' | 'courses' | 'about' | 'offers' | 'contact' | 'dashboard';

export default function App() {
  const { t } = useTranslation();

  // --- Persistent State Hooks ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('academy_lang');
    return (saved as Language) || 'ka';
  });

  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('academy_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('academy_courses');
    return saved ? JSON.parse(saved) : mockCourses;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('academy_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('academy_registered_users');
    return saved ? JSON.parse(saved) : [...mockTeachers];
  });

  // --- UI Layout & Modal Hooks ---
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // --- Synced Local Storage Updates ---
  useEffect(() => {
    localStorage.setItem('academy_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('academy_active_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('academy_active_user');
    }
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem('academy_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('academy_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('academy_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // --- Navigation helper ---
  const goToTab = (tab: ActiveTabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // --- Auth Event Handlers ---
  const handleLoginSuccess = (user: User) => {
    setActiveUser(user);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setActiveUser(null);
    setActiveTab('home');
    setSelectedCourse(null);
  };

  // --- Course Enrollment Handlers ---
  const handleEnrollInCourse = (courseId: string) => {
    if (!activeUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (activeUser.role === 'teacher') {
      alert(t('alerts.teacherCannotEnroll'));
      return;
    }

    const exists = enrollments.some((e) => e.studentId === activeUser.id && e.courseId === courseId);

    if (exists) {
      alert(t('alerts.alreadyEnrolled'));
      return;
    }

    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      studentId: activeUser.id,
      courseId,
      progress: 0,
      completedLessons: [],
      isCompleted: false,
      enrolledAt: new Date().toISOString(),
    };

    setEnrollments((prev) => [...prev, newEnrollment]);

    setCourses((prevCourses) =>
      prevCourses.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c))
    );

    const targetCourse = courses.find((c) => c.id === courseId);
    setEnrollSuccessMessage(
      t('alerts.enrollSuccess', { course: targetCourse?.title })
    );
    setTimeout(() => setEnrollSuccessMessage(null), 4000);

    setActiveTab('dashboard');
    setSelectedCourse(null);
  };

  // --- Lesson Progression Handlers ---
  const handleUpdateEnrollment = (
    enrollmentId: string,
    completedLessonIds: string[],
    progress: number,
    isCompleted: boolean
  ) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === enrollmentId
          ? {
              ...e,
              completedLessons: completedLessonIds,
              progress,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : e.completedAt,
            }
          : e
      )
    );
  };

  // --- Profile Modification Handler ---
  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    if (!activeUser) return;
    const updatedUser = { ...activeUser, ...updatedFields };
    setActiveUser(updatedUser);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === activeUser.id ? updatedUser : u)));
  };

  // --- Instructor Course Creation Handler ---
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  // --- Catalog Filters & Query Searches ---
  const translatedCourses = courses.map((c) => getTranslatedCourse(c, lang));

  const filteredCourses = translatedCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'ყველა' ||
      course.category === translateCategory(selectedCategory, lang) ||
      course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased">
      <Navbar
        user={activeUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onTabChange={goToTab}
        activeTab={activeTab}
        lang={lang}
        onLangChange={setLang}
      />

      {enrollSuccessMessage && (
        <div
          id="enroll-success-banner"
          className="fixed top-20 right-4 z-50 max-w-md rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-xl flex items-center gap-3 animate-bounce"
        >
          <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
          <div className="text-left">
            <span className="text-xs font-bold text-emerald-800 block">{t('alerts.congratulations')}</span>
            <span className="text-xs text-emerald-600 block mt-0.5">{enrollSuccessMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            lang={lang}
            activeUser={activeUser}
            translatedCourses={translatedCourses}
            enrollments={enrollments}
            onBrowseCourses={() => goToTab('courses')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSelectCourse={setSelectedCourse}
            onEnroll={handleEnrollInCourse}
            onViewAllCourses={() => goToTab('courses')}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesPage
            lang={lang}
            activeUser={activeUser}
            enrollments={enrollments}
            filteredCourses={filteredCourses}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={setSelectedCategory}
            onSelectCourse={setSelectedCourse}
            onEnroll={handleEnrollInCourse}
          />
        )}

        {activeTab === 'about' && <AboutPage lang={lang} />}

        {activeTab === 'offers' && (
          <OffersPage
            lang={lang}
            onSelectCoursesTab={() => goToTab('courses')}
            onOpenConsultation={() => goToTab('contact')}
          />
        )}

        {activeTab === 'contact' && <ContactPage lang={lang} />}

        {activeTab === 'dashboard' && (
          <DashboardPage
            lang={lang}
            activeUser={activeUser}
            courses={courses}
            enrollments={enrollments}
            onAddCourse={handleAddCourse}
            onUpdateProfile={handleUpdateProfile}
            onUpdateEnrollment={handleUpdateEnrollment}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-slate-100 bg-white py-10 text-slate-400 text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-left leading-tight flex items-center gap-2.5">
            <BrandLogo size="sm" onTabChange={() => goToTab('home')} lang={lang} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <button onClick={() => goToTab('about')} className="hover:text-slate-800 transition">
              {t('footer.about')}
            </button>
            <button onClick={() => goToTab('offers')} className="hover:text-slate-800 transition">
              {t('footer.offers')}
            </button>
            <button onClick={() => goToTab('contact')} className="hover:text-slate-800 transition">
              {t('footer.contact')}
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal
            course={selectedCourse}
            isOpen={selectedCourse !== null}
            onClose={() => setSelectedCourse(null)}
            isEnrolled={
              activeUser
                ? enrollments.some((e) => e.studentId === activeUser.id && e.courseId === selectedCourse.id)
                : false
            }
            onEnroll={() => handleEnrollInCourse(selectedCourse.id)}
            onStartStudy={() => {
              setSelectedCourse(null);
              setActiveTab('dashboard');
            }}
            isLoggedIn={activeUser !== null}
            userRole={activeUser?.role}
            lang={lang}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
            onLoginSuccess={(user) => setActiveUser(user)}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}