import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { User, Course, Enrollment, ActiveSession } from '../types';
import CourseCard from '../components/CourseCard';
import { mockCategories } from '../data/mockData';
import { Language, translateCategory } from '../lib/translations';
import { getHomeActiveSessions } from '../api/courseApi'; // Adjust the import path according to your structure

interface CoursesPageProps {
  lang: Language;
  activeUser: User | null; 
  enrollments: Enrollment[];
  courses?: (Course | ActiveSession)[]; // Accepts both legacy Courses and backend ActiveSessions
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCategory: string;
  onSelectedCategoryChange: (value: string) => void;
  onSelectCourse: (course: Course | ActiveSession) => void;
  onEnroll: (courseId: string | number) => void;
}

export default function CoursesPage({
  lang,
  activeUser,
  enrollments = [],
  courses,
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectedCategoryChange,
  onSelectCourse,
  onEnroll,
}: CoursesPageProps) {
  const { t } = useTranslation();

  // 1. Internal state management for backend API data fetching
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch active sessions from backend when category changes
  useEffect(() => {
    // If external courses array is provided, skip internal fetch
    if (courses && courses.length > 0) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Map category string to category ID (defaulting to 0 for "All")
    const categoryId = selectedCategory === 'all' || !selectedCategory ? 0 : 1; 

    getHomeActiveSessions(categoryId)
      .then((data) => {
        if (isMounted) {
          setSessions(data || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load courses');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, courses]);

  // Determine source list (props or fetched API data)
  const displayList: (Course | ActiveSession)[] = courses && courses.length > 0 ? courses : sessions;

  // 3. Client-side search filtering logic
  const filteredCourses = displayList.filter((item) => {
    const title = 'title' in item ? item.title : '';
    const description =
      'description' in item
        ? item.description
        : 'courseDescription' in item
        ? item.courseDescription
        : '';

    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Search / Hero Banner */}
      <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>

        <div className="text-left space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
            {t('catalog.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t('catalog.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t('catalog.subtitle')}
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
              <Search className="h-4 w-4 text-indigo-500" />
            </span>
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Category Filters Bar */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-4 shadow-sm flex flex-wrap gap-2 items-center justify-start">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-3 hidden sm:inline">
          {t('catalog.filterLabel')}
        </span>
        {mockCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectedCategoryChange(cat)}
            className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold border transition-all duration-150 ${
              selectedCategory === cat
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {translateCategory(cat, lang)}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="rounded-[2.5rem] border border-slate-100 py-24 text-center space-y-3 bg-white shadow-sm flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">
            {t('catalog.loading', 'Loading active sessions...')}
          </p>
        </div>
      ) : error ? (
        /* Error State Notice */
        <div className="rounded-[2.5rem] border border-red-100 bg-red-50/50 py-12 text-center space-y-2">
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        /* Empty State */
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center space-y-3 bg-white">
          <BookOpen className="mx-auto h-16 w-16 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {t('catalog.notFoundTitle')}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t('catalog.notFoundSubtitle')}
          </p>
        </div>
      ) : (
        /* Courses & Sessions Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((item) => {
            // Unify ID resolution across types
            const targetId = 'id' in item ? item.id : item.sessionId;

            // Check if current user is enrolled in this course/session
            const isEnrolled = activeUser
              ? enrollments.some(
                  (e) =>
                    e.studentId === activeUser.id &&
                    String(e.courseId) === String(targetId)
                )
              : false;

            return (
              <CourseCard
                key={targetId}
                course={item}
                isEnrolled={isEnrolled}
                onSelect={() => onSelectCourse(item)}
                onEnroll={() => onEnroll(targetId)}
                isLoggedIn={activeUser !== null}
                userRole={activeUser?.role}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}