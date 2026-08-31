import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import BrandLogo from '../components/BrandLogo';
import CourseDetailModal from '../components/CourseDetailModal';
import { Course } from '../types';
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (!payload.exp) {
            return true;
        }

        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};
type NavTab = 'home' | 'courses' | 'about' | 'offers' | 'contact' | 'dashboard' | 'teacher-sessions';
const PATH_TO_TAB: Record<string, NavTab> = { '/': 'home', '/courses': 'courses', '/about': 'about', '/offers': 'offers', '/contact': 'contact', '/dashboard': 'dashboard', '/teacher-sessions': 'teacher-sessions' };
const TAB_TO_PATH: Record<NavTab, string> = { home: '/', courses: '/courses', about: '/about', offers: '/offers', contact: '/contact', dashboard: '/dashboard', 'teacher-sessions': '/teacher-sessions' };

export default function AppLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        activeUser,
        lang,
        setLang,
        handleLogout,
        handleLoginSuccess,
        handleRegisterUser,
        handleEnrollInCourse,
        enrollSuccessMessage,
        enrollments,
        registeredUsers
    } = useApp();

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('academy_token');

        if (!token) {
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            if (!payload.exp) {
                return;
            }

            const expiresIn = payload.exp * 1000 - Date.now();

            if (expiresIn <= 0) {
                handleLogout();
                localStorage.removeItem('academy_token');
                navigate('/login', { replace: true });
                return;
            }

            const timer = setTimeout(() => {
                handleLogout();
                localStorage.removeItem('academy_token');
                navigate('/login', { replace: true });
            }, expiresIn);

            return () => clearTimeout(timer);
        } catch {
            handleLogout();
            localStorage.removeItem('academy_token');
            navigate('/login', { replace: true });
        }
    }, [location.pathname]);

    const activeTab: NavTab =
        PATH_TO_TAB[location.pathname] ?? 'home';
    const goToTab = (tab: NavTab) => { navigate(TAB_TO_PATH[tab]); window.scrollTo({ top: 0, behavior: 'instant' }); };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased">
            <Navbar user={activeUser} onLogout={() => { handleLogout(); navigate('/'); }} onOpenAuth={() => navigate('/login')} onTabChange={goToTab} activeTab={activeTab} lang={lang} onLangChange={setLang} />

            {enrollSuccessMessage && (
                <div className="fixed top-20 right-4 z-50 max-w-md rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-xl flex items-center gap-3 animate-bounce">
                    <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                    <div><span className="text-xs font-bold text-emerald-800 block">{lang === 'ka' ? 'გილოცავ! 🎉' : 'Congratulations! 🎉'}</span><span className="text-xs text-emerald-600 block mt-0.5">{enrollSuccessMessage}</span></div>
                </div>
            )}

            <main className="flex-1"><Outlet context={{ setSelectedCourse }} /></main>

            <footer className="border-t border-slate-100 bg-white py-10 text-slate-400 text-xs sm:text-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <BrandLogo size="sm" onTabChange={() => goToTab('home')} lang={lang} />
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                        <button onClick={() => goToTab('about')} className="hover:text-slate-800 transition">{t('footer.about')}</button>
                        <button onClick={() => goToTab('offers')} className="hover:text-slate-800 transition">{t('footer.offers')}</button>
                        <button onClick={() => goToTab('contact')} className="hover:text-slate-800 transition">{t('footer.contact')}</button>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {selectedCourse && (
                    <CourseDetailModal course={selectedCourse} isOpen onClose={() => setSelectedCourse(null)}
                        isEnrolled={activeUser ? enrollments.some((e) => e.studentId === activeUser.id && e.courseId === selectedCourse.id) : false}
                        onEnroll={() => { handleEnrollInCourse(selectedCourse.id, () => navigate('/login')); setSelectedCourse(null); navigate('/dashboard'); }}
                        onStartStudy={() => { setSelectedCourse(null); navigate('/dashboard'); }}
                        isLoggedIn={activeUser !== null} userRole={activeUser?.role} lang={lang}
                        registeredUsers={registeredUsers} onRegisterUser={handleRegisterUser} onLoginSuccess={handleLoginSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}