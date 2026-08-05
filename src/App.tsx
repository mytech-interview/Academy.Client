import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './layouts/AppLayout';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import OffersPage from './pages/OffersPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Auth pages (no Navbar/Footer)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';

import { translateCategory } from './lib/translations';
import { mockCategories } from './data/mockData';
import { useState } from 'react';
import { Course } from './types';

function RequireAuth({
  children,
  teacherOnly = false,
  adminOnly = false,
}: {
  children: React.ReactNode;
  teacherOnly?: boolean;
  adminOnly?: boolean;
}) {
  const { activeUser } = useApp();
  if (!activeUser) return <Navigate to="/login" replace />;
  if (teacherOnly && activeUser.role !== 'teacher') return <Navigate to="/dashboard" replace />;
  if (adminOnly && activeUser.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const {
    lang,
    activeUser,
    courses,
    enrollments,
    activeSessions,
    registeredUsers,
    handleUpdateProfile,
    handleAddCourse,
    handleUpdateEnrollment,
    translatedCourses,
    handleEnrollInCourse,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = translatedCourses.filter((c) => {
    const matchCat = selectedCategory === 'ყველა' || c.category === translateCategory(selectedCategory, lang) || c.category === selectedCategory;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Routes>
      {/* ── Standalone auth pages (no layout) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OtpPage />} />

      {/* ── Main layout ── */}
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <HomePage
              activeUser={activeUser}
              translatedCourses={translatedCourses}
              enrollments={enrollments}
              activeSessions={activeSessions}
              onBrowseCourses={() => window.location.assign('/courses')}
              onOpenAuth={() => window.location.assign('/login')}
              onSelectCourse={setSelectedCourse}
              onEnroll={(id) => handleEnrollInCourse(id, () => window.location.assign('/login'))}
              onViewAllCourses={() => window.location.assign('/courses')}
            />
          }
        />

        <Route path="/courses" element={<CoursesPage lang={lang} activeUser={activeUser} enrollments={enrollments} filteredCourses={filteredCourses} searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} selectedCategory={selectedCategory} onSelectedCategoryChange={setSelectedCategory} onSelectCourse={setSelectedCourse} onEnroll={(id) => handleEnrollInCourse(id, () => window.location.assign('/login'))} />} />

        <Route path="/about" element={<AboutPage lang={lang} />} />
        <Route path="/offers" element={<OffersPage lang={lang} onSelectCoursesTab={() => window.location.assign('/courses')} onOpenConsultation={() => window.location.assign('/contact')} />} />
        <Route path="/contact" element={<ContactPage lang={lang} />} />

        <Route path="/dashboard" element={<RequireAuth><DashboardPage lang={lang} activeUser={activeUser} courses={courses} enrollments={enrollments} onAddCourse={handleAddCourse} onUpdateProfile={handleUpdateProfile} onUpdateEnrollment={handleUpdateEnrollment} onOpenAuth={() => window.location.assign('/login')} /></RequireAuth>} />

        <Route path="/teacher-sessions" element={<RequireAuth teacherOnly><TeacherDashboardPage lang={lang} activeUser={activeUser} courses={courses} enrollments={enrollments} registeredUsers={registeredUsers} onUpdateProfile={handleUpdateProfile} onOpenAuth={() => window.location.assign('/login')} /></RequireAuth>} />

        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth adminOnly>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}