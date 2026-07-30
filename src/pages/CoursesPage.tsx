import React from 'react';
import { Search, BookOpen } from 'lucide-react';

import { User, Course, Enrollment } from '../types';
import CourseCard from '../components/CourseCard';
import { mockCategories } from '../data/mockData';
import { Language, translations, translateCategory } from '../lib/translations';

interface CoursesPageProps {
  lang: Language;
  activeUser: User | null;
  enrollments: Enrollment[];
  filteredCourses: Course[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCategory: string;
  onSelectedCategoryChange: (value: string) => void;
  onSelectCourse: (course: Course) => void;
  onEnroll: (courseId: string) => void;
}

export default function CoursesPage({
  lang,
  activeUser,
  enrollments,
  filteredCourses,
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectedCategoryChange,
  onSelectCourse,
  onEnroll,
}: CoursesPageProps) {
  const t = translations[lang];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Search / Hero box */}
      <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>

        <div className="text-left space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
            {t.catalogBadge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t.catalogTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t.catalogSubtitle}
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
              <Search className="h-4 w-4 text-indigo-500" />
            </span>
            <input
              type="text"
              placeholder={t.catalogSearchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white border border-slate-200/80 rounded-[2rem] p-4 shadow-sm flex flex-wrap gap-2 items-center justify-start">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-3 hidden sm:inline">
          {t.catalogFilter}
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

      {/* Courses grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center space-y-3 bg-white">
          <BookOpen className="mx-auto h-16 w-16 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {lang === 'ka'
              ? 'კურსები მოცემული კრიტერიუმით ვერ მოიძებნა'
              : lang === 'ru'
              ? 'Курсы по вашему запросу не найдены'
              : 'No courses found matching the search criteria'}
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {lang === 'ka'
              ? 'სცადეთ შეცვალოთ საძიებო სიტყვა ან აირჩიოთ სხვა კატეგორია.'
              : lang === 'ru'
              ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию.'
              : 'Try changing your search query or selecting another category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const isEnrolled = activeUser
              ? enrollments.some((e) => e.studentId === activeUser.id && e.courseId === course.id)
              : false;

            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onSelect={() => onSelectCourse(course)}
                onEnroll={() => onEnroll(course.id)}
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