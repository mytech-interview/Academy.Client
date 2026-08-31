// CourseCard.tsx
import React from 'react';
import { Star, User as UserIcon, CheckCircle2, Loader2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActiveSession } from '../types';
import DOMPurify from 'dompurify';
import { API_BASE_URL } from '../services/baseApi';

// Default thumbnail used for every course card — backend has no image field
// TODO: заглушка. Пока бэк не отдаёт courseImage — используется одна картинка на все карточки.
const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';



function resolveAvatarSrc(value?: string | null): string | null {
  if (!value) return null;

  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }

  const driveOpenMatch = value.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w800`;
  }

  if (/^https?:\/\//.test(value) || value.startsWith('data:image')) {
    return value;
  }

  return `${API_BASE_URL}/Image/downloadImage?fileName=${encodeURIComponent(value)}`;
}

// No exact duration-in-hours field from backend — but each lesson is a fixed
// 2-hour session, so total hours = amountOfLessons × 2.
const HOURS_PER_LESSON = 2;

interface CourseCardProps {
  course: ActiveSession;
  isEnrolled: boolean;
  onSelect: () => void;
  onEnroll: (e?: React.MouseEvent) => void;
  isLoggedIn: boolean;
  userRole: string | undefined;
  isEnrolling?: boolean;
}

export default function CourseCard({
  course,
  isEnrolled,
  onSelect,
  onEnroll,
  isLoggedIn,
  userRole,
  isEnrolling = false,
}: CourseCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'ka';

  const {
    sessionId,
    title,
    courseDescription,
    categoryName,
    levelName,
    amountOfLessons,
    teacherName,
    teacherPicture, // бэк отдаёт аватар/картинку учителя под этим именем (было teacherAvatarUrl — не совпадало с API)
    averageRating,
    price,
    cityName,
    startDate,
    endDate,
    attendanceModeName,

  } = course;

  // Если картинка не пришла или не загрузилась, откатываемся на иконку-заглушку
  const [avatarFailed, setAvatarFailed] = React.useState(false);
  const avatarSrc = resolveAvatarSrc(teacherPicture);
  const picture = resolveAvatarSrc(course.picture) || DEFAULT_COURSE_IMAGE;
  const showAvatarImage = !!avatarSrc && !avatarFailed;
  const [courseImageFailed, setCourseImageFailed] = React.useState(false);
  const courseImageSrc =
    picture && !courseImageFailed ? picture : DEFAULT_COURSE_IMAGE;

  // Пока нет ни одного отзыва (reviewCount === 0) — показываем дефолтный рейтинг 5.0,
  // а не 0, чтобы новый курс без отзывов не выглядел "плохим".
  const hasReviews = !!course.reviewCount && course.reviewCount > 0;
  const ratingNum = hasReviews && averageRating ? parseFloat(String(averageRating)) : 5;
  const ratingFormatted = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : '5.0';
  const priceDisplay = price === 0 ? t('courseCard.free', 'უფასო') : `${price} ₾`;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const hasValidDates = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());
  const durationHours = amountOfLessons > 0 ? amountOfLessons * HOURS_PER_LESSON : 0;

  const dateLocale =
    lang.startsWith('ru')
      ? 'ru-RU'
      : lang.startsWith('ka')
        ? 'ka-GE'
        : 'en-US';

  const formatDate = (d: Date) => {
    const months = {
      en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      ru: [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ],
      ka: [
        'იან',
        'თებ',
        'მარ',
        'აპრ',
        'მაი',
        'ივნ',
        'ივლ',
        'აგვ',
        'სექ',
        'ოქტ',
        'ნოე',
        'დეკ',
      ],
    };

    const currentLang = lang.startsWith('ru')
      ? 'ru'
      : lang.startsWith('ka')
        ? 'ka'
        : 'en';

    const day = d.getDate();
    const month = months[currentLang][d.getMonth()];
    const year = d.getFullYear();

    if (currentLang === 'ru') {
      return `${day} ${month} ${year} г.`;
    }

    if (currentLang === 'ka') {
      return `${day} ${month}, ${year}`;
    }

    return `${month} ${day}, ${year}`;
  };

  // Session status derived from its date range — backend doesn't send one directly
  const now = new Date();
  const status = !hasValidDates
    ? null
    : now < start
      ? 'upcoming'
      : now > end
        ? 'completed'
        : 'ongoing';

  const statusMeta = status && {
    upcoming: { text: t('courseCard.statusUpcoming', 'მალე დაიწყება'), cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    ongoing: { text: t('courseCard.statusOngoing', 'მიმდინარეობს'), cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    completed: { text: t('courseCard.statusCompleted', 'დასრულებული'), cls: 'bg-slate-200 text-slate-700 border-slate-300' },
  }[status];

  // TODO: исправлен баг — грузинское слово для "cyber"-ветки было
  // "დიძაინი" (design, да ещё с опечаткой) и попадало не в ту категорию.
  const getCategoryColor = (cat?: string) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('programming') || lower.includes('პროგრამირება') || lower.includes('программирование')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100/80';
    }
    if (lower.includes('cyber') || lower.includes('კიბერუსაფრთხოება') || lower.includes('кибербезопасность')) {
      return 'bg-sky-50 text-sky-700 border-sky-100/80';
    }
    if (lower.includes('design') || lower.includes('დიზაინი') || lower.includes('дизайн')) {
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100/80';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200/60';
  };

  return (
    <article
      id={`course-card-${sessionId}`}
      className="group flex flex-col bg-white border border-slate-200/80 rounded-[2rem] p-4.5 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 relative"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-50">
        <img
          src={picture}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setCourseImageFailed(true)}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getCategoryColor(categoryName)}`}>
            {categoryName}
          </span>
          <span className="rounded-xl border border-slate-100/80 bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
            {levelName}
          </span>
        </div>
      </div>

      {/* Main body */}
      <div className="flex flex-1 flex-col pt-4 pb-1 px-1 text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-widest mb-1.5">
          {amountOfLessons > 0 && (
            <span>{t('courseCard.lessons', { count: amountOfLessons, defaultValue: `${amountOfLessons} გაკვეთილი` })}</span>
          )}
          {durationHours > 0 && (
            <>
              {amountOfLessons > 0 && <span>•</span>}
              <span>{t('courseCard.hours', { count: durationHours, defaultValue: `${durationHours} საათი` })}</span>
            </>
          )}
        </div>

        <h3 className="font-sans text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {courseDescription && (
          <div
            className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light [&>p]:inline [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(courseDescription) }}
          />
        )}

        {/* Format & city pills */}
        {(attendanceModeName || cityName) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            {attendanceModeName && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200">
                <Briefcase className="h-3 w-3 text-amber-500" />
                <span>{attendanceModeName}</span>
              </span>
            )}
            {cityName && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-emerald-700 border border-emerald-200">
                <MapPin className="h-3 w-3 text-emerald-600" />
                <span>{cityName}</span>
              </span>
            )}
          </div>
        )}

        {/* Date range bar with inline status pill */}
        {hasValidDates && (
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span className="truncate">{formatDate(start)} — {formatDate(end)}</span>
            </div>
            {statusMeta && (
              <span className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 ${statusMeta.cls}`}>
                {statusMeta.text}
              </span>
            )}
          </div>
        )}

        {/* Author / rating row */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-500 font-bold border border-slate-200/50 shadow-inner overflow-hidden">
              {showAvatarImage ? (
                <img
                  src={avatarSrc as string}
                  alt={teacherName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <UserIcon className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate">{teacherName}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50/80 px-2 py-1 rounded-xl border border-amber-200/60 text-xs shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>{ratingFormatted}</span>
          </div>
        </div>

        {/* Price & actions */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
              {t('courseCard.priceLabel', 'ფასი')}
            </span>
            <span className={`text-lg font-black tracking-tight ${price === 0 ? 'text-emerald-600' : 'text-slate-950'}`}>
              {priceDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              id={`btn-course-details-${sessionId}`}
              className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {t('courseCard.btnDetails', 'დეტალები')}
            </button>

            {isLoggedIn && userRole === 'teacher' ? (
              <span className="inline-flex items-center rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-500 border border-slate-200/60">
                {t('courseCard.roleAuthor', 'ავტორი')}
              </span>
            ) : isEnrolled ? (
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                id={`btn-course-active-${sessionId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t('courseCard.statusActive', 'აქტიური')}</span>
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onEnroll(e); }}
                disabled={isEnrolling}
                id={`btn-course-enroll-${sessionId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEnrolling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isEnrolling ? t('courseCard.btnEnrolling', 'ჩარიცხვა...') : t('courseCard.btnEnroll', 'ჩარიცხვა')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}