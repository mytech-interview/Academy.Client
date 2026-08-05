import React from 'react';
import { Star, User as UserIcon, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
  course: any;
  isEnrolled: boolean;
  onSelect: () => void;
  onEnroll: (e?: React.MouseEvent) => void;
  isLoggedIn: boolean;
  userRole: string | undefined;
  lang?: string;
}

export default function CourseCard({
  course,
  isEnrolled,
  onSelect,
  onEnroll,
  isLoggedIn,
  userRole,
  lang = 'en',
}: CourseCardProps) {
  const { t } = useTranslation();

  // 1. Unique ID (sessionId from backend)
  const courseId = course.sessionId ?? course.courseId ?? course.id ?? '0';

  // 2. Title & Description
  const title = course.title || 'Untitled Course';
  const description = course.courseDescription || course.description || '';

  // 3. Category & Level
  const categoryName = course.categoryName || 'Programming';
  const level = course.levelName || 'MID';

  // 4. Lessons, Duration & Students Count
  const lessonsCount = course.amountOfLessons ?? 0;
  const durationWeeks = course.durationWeeks ?? course.weeks;

  const enrolledCount = course.enrolledCount ?? 0;
  const maxStudents = course.maxStudents;

  const durationText = durationWeeks 
    ? t("course.durationWeeks", { count: durationWeeks, defaultValue: `${durationWeeks} weeks` }) 
    : "";

  // 5. Teacher Name
  const teacherName = course.teacherName || course.teacherFullName || 'Instructor';

  // 6. Rating & Price
  const rawRating = course.averageRating ?? 0;
  const ratingFormatted = typeof rawRating === 'number' ? rawRating.toFixed(1) : '0.0';

  const priceVal = course.price;
  const priceDisplay =
    priceVal === 0 || priceVal === '0' || priceVal === null || priceVal === undefined
      ? 'Free'
      : `$${priceVal}`;

  // 7. Image Fallback
  const imageUrl =
    course.image ||
    course.imageUrl ||
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

  const getCategoryColor = (cat?: string) => {
    const lower = (cat || '').toLowerCase();
    if (
      lower.includes('html') ||
      lower.includes('программирование') ||
      lower.includes('programming') ||
      lower.includes('პროგრამირება')
    ) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  return (
    <article
      id={`course-card-${courseId}`}
      className="group flex flex-col bg-white border border-slate-200/80 rounded-[2rem] p-4.5 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 relative"
    >
      {/* Thumbnail Inner Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-50">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(
              categoryName
            )}`}
          >
            {categoryName}
          </span>
          <span className="rounded-xl border border-slate-100 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-slate-700">
            {level}
          </span>
        </div>
      </div>

      {/* Main Metadata & Body */}
      <div className="flex flex-1 flex-col pt-4 pb-2 px-1 text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-widest mb-1.5">
          {lessonsCount > 0 && (
            <span>{t('courseCard.lessons', { count: lessonsCount, defaultValue: `${lessonsCount} lessons` })}</span>
          )}
          {durationText && (
            <>
              {lessonsCount > 0 && <span>•</span>}
              <span>{durationText}</span>
            </>
          )}
        </div>

        <h3 className="font-sans text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
            {description}
          </p>
        )}

        {/* Author & Students Count */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 font-bold border border-slate-200/50">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {teacherName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Students Counter */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
              <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                {enrolledCount}
                {maxStudents ? ` / ${maxStudents}` : ''}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100/80 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>{ratingFormatted}</span>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100/80 pt-4">
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-400">
              {t('courseCard.priceLabel', 'Price')}
            </span>
            <span
              className={`text-base font-black ${
                priceDisplay === 'Free' ? 'text-emerald-600' : 'text-slate-950'
              }`}
            >
              {priceDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              id={`btn-course-details-${courseId}`}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t('courseCard.btnDetails', 'Details')}
            </button>

            {isLoggedIn && userRole === 'teacher' ? (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                {t('courseCard.roleAuthor', 'Author')}
              </span>
            ) : isEnrolled ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                id={`btn-course-active-${courseId}`}
                className="rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {t('courseCard.statusActive', 'Active')}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll(e);
                }}
                id={`btn-course-enroll-${courseId}`}
                className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                {t('courseCard.btnEnroll', 'Enroll')}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}