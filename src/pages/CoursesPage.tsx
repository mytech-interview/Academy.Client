import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Loader2, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { User, Enrollment, ActiveSession } from '../types';
import CourseCard from '../components/CourseCard';
import { Language } from '../lib/translations';
import { getHomeActiveSessions } from '../api/sessions';

interface CoursesPageProps {
  lang: Language;
  activeUser: User | null;
  enrollments: Enrollment[];
  // Course id currently being enrolled into (drives the button's loading state)
  enrollingCourseId: string | null;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCategory: string;
  onSelectedCategoryChange: (value: string) => void;
  onSelectCourse: (course: any) => void;
  onEnroll: (courseId: string | number) => void;
}

const backendCategories = [
  { id: 'all', numId: 0, labels: { ka: 'ყველა', en: 'All', ru: 'Все' } },
  { id: '1', numId: 1, labels: { ka: 'პროგრამირება', en: 'Programming', ru: 'Программирование' } },
  { id: '2', numId: 2, labels: { ka: 'კიბერუსაფრთხოება', en: 'Cybersecurity', ru: 'Кибербезопасность' } },
];

export default function CoursesPage({
  lang,
  activeUser,
  enrollments,
  enrollingCourseId,
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectedCategoryChange,
  onSelectCourse,
  onEnroll,
}: CoursesPageProps) {
  const { t } = useTranslation();

  const [courses, setCourses] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Frontend sorting state
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'title' | 'duration'>('default');

  const getCategoryLabel = (cat: typeof backendCategories[0]) => {
    return cat.labels[lang as keyof typeof cat.labels] || cat.labels.en;
  };

  // Safe fetch courses implementation
  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError('');

        let sessionsList: ActiveSession[] = [];

        // Normalize selectedCategory (defaults to 'all' if empty or invalid)
        const currentCategory = (!selectedCategory || selectedCategory === '0') ? 'all' : selectedCategory;

        if (currentCategory === 'all') {
          // Fetch categories 1 and 2 individually with catch block to prevent throwing
          const cat1Promise = getHomeActiveSessions(1).then(res => Array.isArray(res) ? res : (res as any)?.activeSessions || []).catch(() => []);
          const cat2Promise = getHomeActiveSessions(2).then(res => Array.isArray(res) ? res : (res as any)?.activeSessions || []).catch(() => []);

          const [cat1Res, cat2Res] = await Promise.all([cat1Promise, cat2Promise]);

          // Combine results and remove duplicates
          const combined = [...cat1Res, ...cat2Res];
          const uniqueMap = new Map<number | string, ActiveSession>();

          combined.forEach((item) => {
            if (!item) return;
            const id = item.sessionId || item.courseId;
            if (id && !uniqueMap.has(id)) {
              uniqueMap.set(id, item);
            }
          });

          sessionsList = Array.from(uniqueMap.values());
        } else {
          // Fetch specific category safely
          try {
            const categoryId = Number(currentCategory);
            const result = await getHomeActiveSessions(categoryId);
            sessionsList = Array.isArray(result) ? result : (result as any)?.activeSessions || [];
          } catch (e) {
            sessionsList = [];
          }
        }

        if (isMounted) {
          setCourses(sessionsList);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || 'Error loading courses');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // 1. Frontend search filtering
  const filteredCourses = courses.filter((item: any) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const title = (item.title || '').toLowerCase();
    const description = (item.courseDescription || item.description || '').toLowerCase();
    const teacher = (item.teacherName || '').toLowerCase();

    return title.includes(query) || description.includes(query) || teacher.includes(query);
  });

  // 2. Frontend sorting logic
  const sortedCourses = [...filteredCourses].sort((a: any, b: any) => {
    if (sortBy === 'price-asc') {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    if (sortBy === 'price-desc') {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'duration') {
      return (b.durationWeeks ?? 0) - (a.durationWeeks ?? 0);
    }
    return 0; // Default
  });

  const activeCategory = (!selectedCategory || selectedCategory === '0') ? 'all' : selectedCategory;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Search / Hero Header */}
      <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>

        <div className="text-left space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
            {t('catalog.badge', 'Catalog')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t('catalog.title', 'Courses & Sessions')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t('catalog.subtitle', 'Choose the right direction for your learning')}
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
              <Search className="h-4 w-4 text-indigo-500" />
            </span>
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder', 'Search courses or instructors...')}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Filter and Sort Panel */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 items-center justify-start w-full sm:w-auto">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            {t('catalog.filterLabel', 'Categories:')}
          </span>
          {backendCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectedCategoryChange(cat.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-extrabold border transition-all duration-150 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="default">{t('catalog.sortDefault', 'Sort: Default')}</option>
            <option value="price-asc">{t('catalog.sortPriceAsc', 'Price: Low to High')}</option>
            <option value="price-desc">{t('catalog.sortPriceDesc', 'Price: High to Low')}</option>
            <option value="title">{t('catalog.sortTitle', 'By Title (A-Z)')}</option>
            <option value="duration">{t('catalog.sortDuration', 'By Duration (Longest)')}</option>
          </select>
        </div>
      </div>

      {/* Loading / Error / Empty / Grid States */}
      {loading ? (
        <div className="rounded-[2.5rem] border border-slate-100 py-24 text-center space-y-3 bg-white shadow-sm flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">
            {t('catalog.loading', 'Loading courses...')}
          </p>
        </div>
      ) : error ? (
        <div className="rounded-[2.5rem] border border-red-100 bg-red-50/50 py-12 text-center space-y-2">
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center space-y-3 bg-white">
          <BookOpen className="mx-auto h-16 w-16 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {t('catalog.notFoundTitle', 'No courses found')}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t('catalog.notFoundSubtitle', 'Try changing your search query or selected category.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course: any) => {
            const courseId = course.sessionId || course.courseId;
            const isEnrolled = activeUser
              ? enrollments.some(
                  (e) =>
                    e.studentId === activeUser.id &&
                    String(e.courseId) === String(courseId)
                )
              : false;

            return (
              <CourseCard
                key={courseId}
                course={course}
                isEnrolled={isEnrolled}
                isEnrolling={String(enrollingCourseId) === String(courseId)}
                onSelect={() => onSelectCourse(course)}
                onEnroll={() => onEnroll(courseId)}
                isLoggedIn={activeUser !== null}
                userRole={activeUser?.role}
                lang={lang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}