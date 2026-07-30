import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

import { User, Course, Enrollment } from '../types';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import ProjectsSection from '../components/ProjectsSection';
import VideoLectures from '../components/VideoLectures';
import { Language } from '../lib/translations';

interface HomePageProps {
  lang: Language;
  activeUser: User | null;
  translatedCourses: Course[];
  enrollments: Enrollment[];
  onBrowseCourses: () => void;
  onOpenAuth: () => void;
  onSelectCourse: (course: Course) => void;
  onEnroll: (courseId: string) => void;
  onViewAllCourses: () => void;
}

export default function HomePage({
  lang,
  activeUser,
  translatedCourses,
  enrollments,
  onBrowseCourses,
  onOpenAuth,
  onSelectCourse,
  onEnroll,
  onViewAllCourses,
}: HomePageProps) {
  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      {/* Visual Header Banner */}
      <Hero
        onBrowseCourses={onBrowseCourses}
        onRegister={onOpenAuth}
        isLoggedIn={activeUser !== null}
        lang={lang}
      />

      {/* Curated Featured Courses */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            {lang === 'ka' ? 'რეკომენდებული პროგრამები' : lang === 'ru' ? 'Рекомендуемые программы' : 'Featured Programs'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {lang === 'ka' ? 'პოპულარული კურსები' : lang === 'ru' ? 'Популярные курсы' : 'Popular Courses'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {lang === 'ka'
              ? 'შეისწავლე ყველაზე მოთხოვნადი პროფესიები მაღალი ანაზღაურებით. დაიწყე ნულიდან და გახდი პროფესიონალი.'
              : lang === 'ru'
              ? 'Изучайте самые востребованные профессии с высокой оплатой. Начните с нуля и станьте профессионалом.'
              : 'Learn the most in-demand skills with top compensations. Start from scratch and become a master.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {translatedCourses.slice(0, 3).map((course) => {
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

        <div className="flex justify-center pt-2">
          <button
            onClick={onViewAllCourses}
            className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-600/10"
          >
            <span>
              {lang === 'ka' ? 'ყველა კურსის ნახვა' : lang === 'ru' ? 'Посмотреть все курсы' : 'View All Courses'}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <ProjectsSection lang={lang} />
      <VideoLectures lang={lang} />
    </div>
  );
}