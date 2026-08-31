import React, { useState } from 'react';
import { BookOpen, Loader2, Star, CheckCircle2, Calendar, Wallet, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../lib/translations';
import { StudentSession } from '../api/sessions';
import { StudentCourseDetailContainer } from './Studentcoursedetailmodal.container';
import { ReviewModal } from './ReviewModal';
import DOMPurify from 'dompurify';

const COURSE_IMAGE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

interface StudentStudyTabProps {
  sessionsLoading: boolean;
  sessionsError: string;
  sessions: StudentSession[];
  avgProgress: number;
  lang: Language;
  /** Current student's GUID — required for fetching course details in the modal */
  studentGuid: string;
}

// форматирует диапазон дат курса, напр. "12 окт 2026 — 7 იან 2027"
const formatDateRange = (startDate?: string, endDate?: string, locale: string = 'ka-GE') => {
  if (!startDate) return null;
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const start = new Date(startDate);
  const startStr = start.toLocaleDateString(locale, opts);

  if (!endDate) return startStr;

  const end = new Date(endDate);
  const endStr = end.toLocaleDateString(locale, { ...opts, year: 'numeric' });
  return `${startStr} — ${endStr}`;
};

/**
 * Считает прогресс курса как долю времени, прошедшего между startDate и endDate.
 * До начала курса — 0%, после окончания — 100%.
 * Возвращает null, если даты некорректны/отсутствуют — тогда используем фолбэк.
 */
const getDateBasedProgress = (startDate?: string, endDate?: string): number | null => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  if (now <= start) return 0;
  if (now >= end) return 100;

  return ((now - start) / (end - start)) * 100;
};

export const StudentStudyTab: React.FC<StudentStudyTabProps> = ({
  sessionsLoading,
  sessionsError,
  sessions,
  avgProgress,
  lang,
  studentGuid,
}) => {
  const { t } = useTranslation();

  const [viewingCourseDetail, setViewingCourseDetail] = useState<StudentSession | null>(null);
  const [reviewingSession, setReviewingSession] = useState<StudentSession | null>(null);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
          {t('studentDashboard.activeCoursesTitle')}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
          {t(
            'studentDashboard.activeCoursesSubtitle',
            'იხილეთ ლექციები, პროგრესი და დატოვეთ შეფასება (Review for session)'
          )}
        </p>
      </div>

      {sessionsLoading ? (
        <div className="rounded-[2rem] border border-slate-100 py-16 text-center space-y-3 bg-white flex flex-col items-center justify-center shadow-sm">
          <Loader2 className="h-9 w-9 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">{t('studentDashboard.loading', 'Loading courses...')}</p>
        </div>
      ) : sessionsError ? (
        <div className="rounded-[2rem] border border-red-100 bg-red-50/50 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">{sessionsError}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-12 text-center space-y-4 shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-800">{t('studentDashboard.noCoursesYet')}</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('studentDashboard.noCoursesSubtitle')}
            </p>
          </div>
        </div>
      ) : (
        /* Course card list */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sessions.map((session) => {
            const dateRange = formatDateRange(session.startDate, session.endDate);
            const isFree = !session.price || session.price === 0;

            return (
              <div
                key={session.sessionId}
                className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm hover:shadow-md transition duration-300"
              >
                <div>
                  {/* Image and category badge */}
                  <div className="relative h-52 sm:h-60 w-full overflow-hidden">
                    <img
                      src={session.picture || COURSE_IMAGE_PLACEHOLDER}
                      alt={session.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // на случай если ссылка есть, но битая — тоже подставляем дефолт
                        (e.currentTarget as HTMLImageElement).src = COURSE_IMAGE_PLACEHOLDER;
                      }}
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        {session.categoryName}
                      </span>
                      {session.levelName && (
                        <span className="rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md">
                          {session.levelName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2">
                      {session.title}
                    </h4>

                    {/* Date range badge — как в примере с Angular-курсом */}
                    {dateRange && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dateRange}</span>
                      </div>
                    )}

                    {/* Information block */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100/80 p-4 text-xs space-y-2">
                      {session.lessonDaysDescription && (
                        <div className="text-slate-600 font-medium">
                          <span className="text-indigo-900 font-bold">
                            {t('studentDashboard.scheduleWord', 'განრიგი')}:
                          </span>{' '}
                          {session.lessonDaysDescription}
                        </div>
                      )}

                      {session.cityName && (
                        <div className="text-slate-600 font-medium">
                          <span className="text-indigo-900 font-bold">
                            {t('studentDashboard.locationWord', 'ლოკაცია')}:
                          </span>{' '}
                          {session.cityName}
                        </div>
                      )}
                    </div>

     

                    {/* Progress bar block — прогресс считается по датам курса */}
                    {(() => {
                      const dateProgress = getDateBasedProgress(session.startDate, session.endDate);
                      // фолбэк на случай отсутствующих/некорректных дат
                      const fallbackProgress = (session as any).progress ?? avgProgress ?? 0;
                      const progress = Math.max(
                        0,
                        Math.min(100, Math.round(dateProgress ?? fallbackProgress))
                      );

                      return (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-[#161d2f] p-4 text-white shadow-sm">
                          {/* Title & Lecturer */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                              <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="text-sm font-bold text-slate-100">
                                {t('studentDashboard.progressTitle', 'კურსის ათვისების პროგრესი')}
                              </h5>
                              {session.lecturerName && (
                                <p className="text-xs text-slate-400">
                                  {t('studentDashboard.lecturerWord', 'ლექტორი')}:{' '}
                                  <span className="font-semibold text-slate-200">{session.lecturerName}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar + Badge */}
                          <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 sm:max-w-xs">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="shrink-0 rounded-xl bg-indigo-900/40 border border-indigo-500/30 px-3 py-1.5 text-xs font-bold text-indigo-300">
                              {progress}%
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Main Action Button */}
                    <button
                      onClick={() => setViewingCourseDetail(session)}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4d3bf3] hover:bg-[#3d2be3] py-4 text-xs font-bold text-white transition duration-200 active:scale-[0.98] shadow-md shadow-indigo-200 cursor-pointer"
                    >
                      <BookOpen size={16} />
                      <span>{t('studentDashboard.startStudy', 'სილაბუსი, პროგრესი & დარჩენილი მასალა')}</span>
                    </button>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100/80 bg-slate-50/30">
                  <button
                    type="button"
                    onClick={() => setReviewingSession(session)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-white px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 transition active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>{t('studentDashboard.writeReview', 'შეფასების დაწერა')}</span>
                  </button>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t('studentDashboard.enrolledStatus', 'ჩარიცხული')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Modal windows --- */}
      {viewingCourseDetail && (
        <StudentCourseDetailContainer
          sessionId={viewingCourseDetail.sessionId}
          studentGuid={studentGuid}
          listItem={viewingCourseDetail}
          onClose={() => setViewingCourseDetail(null)}
        />
      )}

      {reviewingSession && (
        <ReviewModal
          sessionId={reviewingSession.sessionId}
          studentGuid={studentGuid}
          onClose={() => setReviewingSession(null)}
        />
      )}
    </div>
  );
};