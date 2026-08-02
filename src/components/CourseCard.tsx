import React from 'react';
import { Star, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Course } from '../types';

interface CourseCardProps {
  key?: string | number;
  course: Course;
  isEnrolled: boolean;
  onSelect: () => void;
  onEnroll: (e: React.MouseEvent) => void;
  isLoggedIn: boolean;
  userRole: string | undefined;
}

export default function CourseCard({
  course,
  isEnrolled,
  onSelect,
  onEnroll,
  isLoggedIn,
  userRole
}: CourseCardProps) {
  const { t } = useTranslation();

  // Map category to aesthetic color schemes
  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('პროგრამირება') || lower.includes('programming') || lower.includes('программирование')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    if (lower.includes('დიზაინი') || lower.includes('design') || lower.includes('дизайн')) {
      return 'bg-pink-50 text-pink-700 border-pink-100';
    }
    if (lower.includes('ბიზნესი') || lower.includes('business') || lower.includes('მარკეტინგი') || lower.includes('маркетинг') || lower.includes('marketing')) {
      return 'bg-sky-50 text-sky-700 border-sky-100';
    }
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  return (
    <article
      id={`course-card-${course.id}`}
      className="group flex flex-col bg-white border border-slate-200/80 rounded-[2rem] p-4.5 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 relative"
    >
      {/* Thumbnail Inner Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-50">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Absolute Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(course.category)}`}>
            {course.category}
          </span>
          <span className="rounded-xl border border-slate-100 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-slate-700">
            {course.level}
          </span>
        </div>
      </div>

      {/* Main Metadata & Body */}
      <div className="flex flex-1 flex-col pt-4 pb-2 px-1 text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-widest mb-1.5">
          <span>{t('courseCard.lessons', { count: course.lessons.length })}</span>
          <span>•</span>
          <span>{course.duration}</span>
        </div>

        <h3 className="font-sans text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
          {course.title}
        </h3>

        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
          {course.description}
        </p>

        {/* Author / Teacher Bento Sub-row */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 font-bold border border-slate-200/50">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{course.teacherName}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100/80 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100/80 pt-4">
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-400">{t('courseCard.priceLabel')}</span>
            <span className={`text-base font-black ${course.price === 'უფასო' || course.price === 'Free' || course.price === 'Бесплатно' ? 'text-emerald-600' : 'text-slate-950'}`}>
              {course.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              id={`btn-course-details-${course.id}`}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t('courseCard.btnDetails')}
            </button>

            {/* Dynamic Interactive Action Buttons */}
            {isLoggedIn && userRole === 'teacher' ? (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                {t('courseCard.roleAuthor')}
              </span>
            ) : isEnrolled ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                id={`btn-course-active-${course.id}`}
                className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {t('courseCard.statusActive')}
              </button>
            ) : (
              <button
                onClick={onEnroll}
                id={`btn-course-enroll-${course.id}`}
                className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                {t('courseCard.btnEnroll')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}