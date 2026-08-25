// CourseDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Clock, Award, Star, BookOpen, Users, ChevronRight, ChevronDown, ChevronUp,
  Calendar, MapPin, Loader2, AlertCircle, User as UserIcon, GraduationCap,
  Sparkles, Check, Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActiveSession } from '../types';
import { getCourseDetailsBySessionId, CourseDetailsBySessionId } from '../api/sessions';
import { getReviewsBySession, ReviewItem } from '../api/reviews';
import { getCityName } from '../lib/cityNames';

// Fallback placeholder used only until real `picture` arrives from the API,
// or if the backend ever sends an empty string.
const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';

const API_BASE_URL = 'https://localhost:5188/api';

// picture / teacherPicture иногда приходят как полный URL, а иногда просто
// как имя файла (например "abc123.png") — в этом случае URL нужно собрать самим.
function resolveAvatarSrc(value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//.test(value) || value.startsWith('data:image')) {
    return value;
  }
  return `${API_BASE_URL}/Image/downloadImage?fileName=${encodeURIComponent(value)}`;
}

// Фиксированная длительность урока — на бэке нет per-lesson данных,
// продукт решил показывать урок как блок в 2 часа.
const LESSON_DURATION_HOURS = 2;

interface StubLesson {
  id: string;
  title: string;
}

// TODO(stub): нет эндпоинта контента уроков. Генерируем только счётчик
// строк по amountOfLessons (это реальное число), без фейкового контента.
function buildStubLessons(count: number, t: (k: string, o?: any) => string): StubLesson[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `stub-lesson-${i}`,
    title: t('courseDetailModal.lessonPlaceholderTitle', { index: i + 1, defaultValue: `Lesson ${i + 1}` }),
  }));
}

interface CourseDetailModalProps {
  course: ActiveSession;
  isOpen: boolean;
  onClose: () => void;
  isEnrolled: boolean;
  onEnroll: () => void;
  onStartStudy: () => void;
  isLoggedIn: boolean;
  userRole: string | undefined;
}

export default function CourseDetailModal({
  course,
  isOpen,
  onClose,
  isEnrolled,
  onEnroll,
  onStartStudy,
  isLoggedIn,
  userRole,
}: CourseDetailModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'instructor' | 'reviews'>('overview');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const [details, setDetails] = useState<CourseDetailsBySessionId | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Флаг ошибки загрузки аватара преподавателя — если картинка не пришла
  // или не загрузилась, откатываемся на иконку-заглушку (как в CourseCard).
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Public endpoints — no login required, fetch both as soon as the modal opens.
  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      setReviews([]);
      return;
    }

    let cancelled = false;

    setDetailsLoading(true);
    setDetailsError(null);
    getCourseDetailsBySessionId(course.sessionId)
      .then((data) => { if (!cancelled) setDetails(data); })
      .catch((err) => {
        if (!cancelled) setDetailsError(err.message || t('courseDetailModal.loadError', 'Failed to load course details'));
      })
      .finally(() => { if (!cancelled) setDetailsLoading(false); });

    setReviewsLoading(true);
    setReviewsError(null);
    getReviewsBySession(course.sessionId)
      .then((data) => { if (!cancelled) setReviews(data); })
      .catch((err) => {
        if (!cancelled) setReviewsError(err.message || t('courseDetailModal.reviewsLoadError', 'Failed to load reviews'));
      })
      .finally(() => { if (!cancelled) setReviewsLoading(false); });

    return () => { cancelled = true; };
  }, [isOpen, course.sessionId]);

  // Reset to the overview tab each time a different course is opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setExpandedLessonId(null);
      setAvatarFailed(false);
    }
  }, [isOpen, course.sessionId]);

  if (!isOpen) return null;

  const title = details?.title ?? course.title;
  const courseDescription = details?.courseDescription ?? course.courseDescription;
  const categoryName = details?.categoryName ?? course.categoryName;
  const levelName = details?.levelName ?? course.levelName;
  const durationWeeks = details?.weeks ?? course.durationWeeks;
  const amountOfLessons = details?.amountOfLessons ?? course.amountOfLessons;
  const teacherName = details?.teacherName ?? course.teacherName;
  // бэк отдаёт аватар/картинку учителя под именем teacherPicture (см. CourseCard)
  const teacherPicture = details?.teacherPicture ?? course.teacherPicture;
  const teacherAvatarSrc = resolveAvatarSrc(teacherPicture);
  const price = details?.price ?? course.price;
  const enrolledCount = details?.enrolledCount ?? course.enrolledCount;
  const maxStudents = details?.maxStudents ?? course.maxStudents;
  const picture = resolveAvatarSrc(details?.picture) || DEFAULT_COURSE_IMAGE;
    const teacherDescription = details?.teacherDescription ?? course.teacherDescription;

  const showAvatarImage = !!teacherAvatarSrc && !avatarFailed;

  // Реальное количество отзывов и рейтинг — из данных сессии,
  // как только подтянутся отзывы, используем точную длину списка.
  const reviewCount = reviews.length > 0 ? reviews.length : (details?.reviewCount ?? course.reviewCount ?? 0);

  const averageRatingRaw = details?.averageRating ?? course.averageRating;
  const ratingNum =
    typeof averageRatingRaw === 'number'
      ? averageRatingRaw
      : parseFloat(averageRatingRaw as unknown as string);
  const ratingFormatted =
    Number.isFinite(ratingNum) && ratingNum !== 0 ? ratingNum.toFixed(1) : '—';

  const priceDisplay = price === 0 ? t('courseDetailModal.free', 'Free') : `$${price}`;

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang);
  };

  const cityLabel = details ? getCityName(details.cityId, details.cityName, lang) : '';

  const stubLessons = buildStubLessons(amountOfLessons || 0, t);

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const tabs: { key: typeof activeTab; label: string; count?: number }[] = [
    { key: 'overview', label: t('courseDetailModal.tabOverview', 'Overview') },
    { key: 'lessons', label: t('courseDetailModal.tabLessons', 'Lessons'), count: amountOfLessons },
    { key: 'instructor', label: t('courseDetailModal.tabInstructor', 'Instructor') },
    { key: 'reviews', label: t('courseDetailModal.tabReviews', 'Reviews'), count: reviewCount || undefined },
  ];

  return (
    <div id="course-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        id="course-detail-container"
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]"
      >
        <button
          onClick={onClose}
          id="btn-close-course-details"
          className="absolute right-5 top-5 z-20 rounded-full bg-slate-900/60 backdrop-blur-md p-2.5 text-white hover:bg-slate-900 transition cursor-pointer shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto flex-1 text-left">
          <div className="relative aspect-[21/8] sm:aspect-[21/7] w-full bg-slate-950">
            <img
              src={picture}
              alt={title}
              className="h-full w-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            {detailsLoading && (
              <div className="absolute top-5 left-5 flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{t('courseDetailModal.loading', 'Loading...')}</span>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {categoryName && (
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                    {categoryName}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{ratingFormatted}</span>
                  {reviewCount > 0 && <span>({reviewCount})</span>}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white">
                  <BookOpen className="h-3 w-3 text-indigo-300" />
                  <span>{t('courseCard.lessons', { count: amountOfLessons, defaultValue: `${amountOfLessons} lessons` })}</span>
                </span>
              </div>

              <h2 id="detail-course-title" className="text-xl font-black text-white sm:text-2xl lg:text-3xl leading-snug drop-shadow-sm">
                {title}
              </h2>

              <p className="flex items-center gap-2 text-xs text-slate-300 font-medium max-w-2xl">
                <span className="h-5 w-5 rounded-full overflow-hidden bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  {showAvatarImage ? (
                    <img
                      src={teacherAvatarSrc as string}
                      alt={teacherName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                    />
                  ) : (
                    <UserIcon className="h-3 w-3 text-white" />
                  )}
                </span>
                <span className="line-clamp-1">
                  {t('courseDetailModal.teacherPrefix', 'Instructor:')} <strong className="text-white font-bold">{teacherName}</strong>
                </span>
              </p>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                    activeTab === tab.key ? 'bg-indigo-800 text-white' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3.5 rounded-2xl bg-slate-50 p-5 sm:grid-cols-4 text-center border border-slate-200/60">
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {t('courseDetailModal.lblDuration', 'Duration')}
                    </span>
                    <span className="flex items-center justify-center gap-1.5 text-sm font-black text-slate-900">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      {t('course.durationWeeks', { count: durationWeeks, defaultValue: `${durationWeeks} weeks` })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {t('courseDetailModal.lblLevel', 'Level')}
                    </span>
                    <span className="flex items-center justify-center gap-1.5 text-sm font-black text-slate-900">
                      <Award className="h-4 w-4 text-indigo-600" />
                      {levelName}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {t('courseDetailModal.lblLessons', 'Lessons')}
                    </span>
                    <span className="flex items-center justify-center gap-1.5 text-sm font-black text-slate-900">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                      {amountOfLessons}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {t('courseDetailModal.lblRating', 'Rating')}
                    </span>
                    <span className="flex items-center justify-center gap-1 text-sm font-black text-slate-900">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      {ratingFormatted} / 5.0
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 w-fit">
                  <Users className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>
                    {enrolledCount}
                    {maxStudents ? ` / ${maxStudents}` : ''} {t('courseDetailModal.studentsLabel', 'students enrolled')}
                  </span>
                </div>

                {courseDescription && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <span>{t('courseDetailModal.aboutTitle', 'About the Course')}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {courseDescription}
                    </p>
                  </div>
                )}

                <div className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100 space-y-3">
                  <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    {t('courseDetailModal.scheduleTitle', 'Schedule')}
                  </h4>

                  {detailsLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{t('courseDetailModal.loading', 'Loading...')}</span>
                    </div>
                  )}

                  {detailsError && !detailsLoading && (
                    <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{detailsError}</span>
                    </div>
                  )}

                  {details && !detailsLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-indigo-100 text-xs font-bold text-slate-800">
                        <Calendar className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span>{formatDate(details.startDate)} — {formatDate(details.endDate)}</span>
                      </div>
                      {cityLabel && (
                        <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-indigo-100 text-xs font-bold text-slate-800">
                          <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{cityLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-indigo-100 text-xs font-bold text-slate-800">
                        <UserIcon className="h-4 w-4 text-slate-500 shrink-0" />
                        <span>{details.teacherName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LESSONS — count real, per-lesson content still not backed by API */}
            {activeTab === 'lessons' && (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-indigo-400" />
                      <span>{t('courseDetailModal.lessonsTitle', { count: amountOfLessons, defaultValue: `Lessons (${amountOfLessons})` })}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('courseDetailModal.lessonsSubtitle', 'Full list of lessons attached to this course')}
                    </p>
                  </div>
                </div>

                {stubLessons.length > 0 ? (
                  <div className="space-y-3">
                    {stubLessons.map((les, idx) => {
                      const isExpanded = expandedLessonId === les.id;
                      return (
                        <div key={les.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition hover:border-indigo-300">
                          <div
                            onClick={() => setExpandedLessonId(isExpanded ? null : les.id)}
                            className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none bg-white hover:bg-slate-50/80 transition"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="min-w-0 space-y-1">
                                <h4 className="text-sm font-black text-slate-900 truncate">{les.title}</h4>
                                <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                                  {t('courseDetailModal.lessonPlaceholderContent', 'Lesson content will be added by the instructor.')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                ⏱️ {t('courseDetailModal.lessonDurationHours', { count: LESSON_DURATION_HOURS, defaultValue: `${LESSON_DURATION_HOURS} hours` })}
                              </span>
                              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3 text-xs leading-relaxed text-slate-700">
                              <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  <BookOpen className="h-4 w-4 text-indigo-600" />
                                  <span>{t('courseDetailModal.lessonDetailLabel', 'Lesson description:')}</span>
                                </p>
                                <p className="text-slate-700 font-medium">
                                  {t('courseDetailModal.lessonPlaceholderContent', 'Lesson content will be added by the instructor.')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <BookOpen className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">{t('courseDetailModal.noLessonsYet', 'No lessons attached to this course yet')}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: INSTRUCTOR — real name + real avatar (teacherPicture), no fake bio */}
            {activeTab === 'instructor' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="h-20 w-20 rounded-2xl flex items-center justify-center bg-indigo-50 ring-4 ring-indigo-50 border border-slate-200 shrink-0 overflow-hidden">
                      {showAvatarImage ? (
                        <img
                          src={teacherAvatarSrc as string}
                          alt={teacherName}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarFailed(true)}
                        />
                      ) : (
                        <GraduationCap className="h-9 w-9 text-indigo-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase">
                        {t('courseDetailModal.instructorHeadline', 'Academy Instructor')}
                      </span>
                      <h3 className="text-lg font-black text-slate-950 mt-1">{teacherName}</h3>
                    </div>
                  </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-medium">
                    {teacherDescription
                      ? teacherDescription
                      : 'ინფორმაცია ჯერ არ არის დამატებული'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REVIEWS — fully real data from getReviewsBySession */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-base font-black text-slate-900">{t('courseDetailModal.reviewsTitle', 'Student Reviews')}</h3>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl">
                      <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                      <span className="text-base font-black text-amber-950">
                        {ratingFormatted} / 5.0{reviewCount > 0 && ` (${reviewCount})`}
                      </span>
                    </div>
                  </div>

                  {reviewsLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-4 justify-center">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{t('courseDetailModal.loading', 'Loading...')}</span>
                    </div>
                  )}

                  {reviewsError && !reviewsLoading && (
                    <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{reviewsError}</span>
                    </div>
                  )}

                  {!reviewsLoading && !reviewsError && sortedReviews.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <Star className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {t('courseDetailModal.noReviewsYet', 'No reviews yet')}
                      </p>
                    </div>
                  )}

                  {!reviewsLoading && !reviewsError && sortedReviews.length > 0 && (
                    <div className="space-y-3">
                      {sortedReviews.map((review) => (
                        <div key={review.reviewId} className="rounded-2xl border border-slate-100 p-4 space-y-2 bg-slate-50/50 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">
                              {review.firstName} {review.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < review.mark ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          {review.description && (
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">{review.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky action footer */}
        <div className="sticky bottom-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-md p-5 sm:p-6 flex items-center justify-between">
          <div className="px-2 text-left">
            <span className="block text-[10px] uppercase font-extrabold tracking-widest text-slate-400 leading-none mb-1">
              {t('courseDetailModal.lblPrice', 'Price')}
            </span>
            <span className={`text-xl font-black block leading-none ${price === 0 ? 'text-emerald-600' : 'text-slate-950'}`}>
              {priceDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isLoggedIn && userRole === 'teacher' ? (
              <span className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-3 text-xs font-bold text-slate-400">
                {t('courseDetailModal.isTeacherLabel', 'You are the instructor of this course')}
              </span>
            ) : isEnrolled ? (
              <button
                onClick={onStartStudy}
                id="btn-detail-start-study"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-black text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                {t('courseDetailModal.btnStart', 'Start Learning')}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onEnroll}
                id="btn-detail-enroll"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-black text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                {t('courseDetailModal.btnEnroll', 'Enroll in Course')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}