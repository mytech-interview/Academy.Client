import React, { useState } from 'react';
import { BookOpen, Loader2, Star, CheckCircle2 } from 'lucide-react';
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

export const StudentStudyTab: React.FC<StudentStudyTabProps> = ({
  sessionsLoading,
  sessionsError,
  sessions,
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
          {sessions.map((session) => (
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
                  <div className="absolute left-4 top-4">
                    <span className="rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-md">
                      {session.categoryName}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-5">
                  <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {session.title}
                  </h4>

                  {/* Information block */}
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100/80 p-4 text-xs space-y-2">
                    <div className="font-extrabold text-indigo-950">
                      
                      {session.levelName ? ` ${session.levelName}` : ''}
                    </div>

                    {/* Подготовлено для будущей логики расписания */}
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
          ))}
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