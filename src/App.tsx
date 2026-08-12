import React, { useState } from 'react';
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

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';

import { translateCategory } from './lib/translations';
import { ActiveSession } from './types';
import CourseDetailModal from './components/CourseDetailModal';


/* =========================================================
   AUTH GUARD
========================================================= */

function RequireAuth({
  children,
  teacherOnly = false,
  adminOnly = false,
  studentOnly = false,
}: {
  children: React.ReactNode;
  teacherOnly?: boolean;
  adminOnly?: boolean;
  studentOnly?: boolean;
}) {
  const { activeUser } = useApp();

  // Not logged in
  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  // Teacher-only page
  if (teacherOnly && activeUser.role !== 'teacher') {
    if (activeUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  // Admin-only page
  if (adminOnly && activeUser.role !== 'admin') {
    if (activeUser.role === 'teacher') {
      return <Navigate to="/teacher-sessions" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  // Student-only page
  if (studentOnly && activeUser.role !== 'student') {
    if (activeUser.role === 'teacher') {
      return <Navigate to="/teacher-sessions" replace />;
    }

    if (activeUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}


/* =========================================================
   ROUTES
========================================================= */

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

  const [selectedCourse, setSelectedCourse] =
    useState<ActiveSession | null>(null);


  /* =========================================================
     FILTER COURSES
  ========================================================= */

  const filteredCourses = translatedCourses.filter((c) => {
    const matchCat =
      selectedCategory === 'ყველა' ||
      c.category === translateCategory(selectedCategory, lang) ||
      c.category === selectedCategory;

    const matchSearch =
      c.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });


  /* =========================================================
     ENROLLMENT CHECK
  ========================================================= */

  const isSelectedCourseEnrolled = selectedCourse
    ? enrollments.some(
        (e) =>
          activeUser != null &&
          e.studentId === activeUser.id &&
          String(e.courseId) === String(selectedCourse.sessionId)
      )
    : false;


  return (
    <>
      <Routes>

        {/* =================================================
            AUTH PAGES
        ================================================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/otp"
          element={<OtpPage />}
        />


        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <Route element={<AppLayout />}>

          {/* ================= HOME ================= */}

          <Route
            path="/"
            element={
              <HomePage
                activeUser={activeUser}
                translatedCourses={translatedCourses}
                enrollments={enrollments}
                activeSessions={activeSessions}

                onBrowseCourses={() =>
                  window.location.assign('/courses')
                }

                onOpenAuth={() =>
                  window.location.assign('/login')
                }

                onSelectCourse={setSelectedCourse}

                onEnroll={(id) =>
                  handleEnrollInCourse(
                    id,
                    () => window.location.assign('/login')
                  )
                }

                onViewAllCourses={() =>
                  window.location.assign('/courses')
                }
              />
            }
          />


          {/* ================= COURSES ================= */}

          <Route
            path="/courses"
            element={
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

                onEnroll={(id) =>
                  handleEnrollInCourse(
                    id,
                    () => window.location.assign('/login')
                  )
                }
              />
            }
          />


          {/* ================= ABOUT ================= */}

          <Route
            path="/about"
            element={
              <AboutPage lang={lang} />
            }
          />


          {/* ================= OFFERS ================= */}

          <Route
            path="/offers"
            element={
              <OffersPage
                lang={lang}
                onSelectCoursesTab={() =>
                  window.location.assign('/courses')
                }
                onOpenConsultation={() =>
                  window.location.assign('/contact')
                }
              />
            }
          />


          {/* ================= CONTACT ================= */}

          <Route
            path="/contact"
            element={
              <ContactPage lang={lang} />
            }
          />


          {/* =================================================
              STUDENT DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={
              <RequireAuth studentOnly>
                <DashboardPage
                  lang={lang}
                  activeUser={activeUser}
                  courses={courses}
                  enrollments={enrollments}
                  onAddCourse={handleAddCourse}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateEnrollment={handleUpdateEnrollment}
                  onOpenAuth={() =>
                    window.location.assign('/login')
                  }
                />
              </RequireAuth>
            }
          />


          {/* =================================================
              TEACHER DASHBOARD
          ================================================= */}

          <Route
            path="/teacher-sessions"
            element={
              <RequireAuth teacherOnly>
                <TeacherDashboardPage
                  lang={lang}
                  activeUser={activeUser}
                  courses={courses}
                  enrollments={enrollments}
                  registeredUsers={registeredUsers}
                  onUpdateProfile={handleUpdateProfile}
                  onOpenAuth={() =>
                    window.location.assign('/login')
                  }
                />
              </RequireAuth>
            }
          />


          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin-dashboard"
            element={
              <RequireAuth adminOnly>
                <AdminDashboardPage />
              </RequireAuth>
            }
          />


          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Route>
      </Routes>


      {/* =====================================================
          COURSE DETAIL MODAL
      ===================================================== */}

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}

          isOpen={
            selectedCourse !== null
          }

          onClose={() =>
            setSelectedCourse(null)
          }

          isEnrolled={
            isSelectedCourseEnrolled
          }

          isLoggedIn={
            activeUser !== null
          }

          userRole={
            activeUser?.role
          }

          studentGuid={
            activeUser?.id
          }

          onEnroll={() =>
            handleEnrollInCourse(
              selectedCourse.sessionId,
              () =>
                window.location.assign('/login')
            )
          }

          onStartStudy={() =>
            window.location.assign('/dashboard')
          }
        />
      )}
    </>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}