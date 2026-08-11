import React, { useState } from 'react';
import { BookOpen, Loader2, Star, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../lib/translations';
import { StudentSession } from '../api/sessions';
import { StudentCourseDetailContainer } from './Studentcoursedetailmodal.container';
// at the beginning of StudentStudyTab component
import { ReviewModal } from './ReviewModal';

const COURSE_IMAGE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

function formatDate(iso: string, lang: Language) {
  try {
    const locale = lang === 'ka' ? 'ka-GE' : lang === 'ru' ? 'ru-RU' : 'en-US';
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

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
              className="flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition duration-300"
            >
              <div>
                {/* Image and category */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <img
                    src={COURSE_IMAGE_PLACEHOLDER}
                    alt={session.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-black text-white shadow-lg">
                      {session.categoryName}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 space-y-5">
                  <h4 className="text-lg font-black text-slate-950 tracking-tight leading-snug line-clamp-2">
                    {session.title}
                  </h4>

                  <div className="rounded-2xl bg-indigo-50/40 border border-indigo-100/60 p-4 text-xs space-y-1.5 text-slate-700">
                    <div className="font-extrabold text-indigo-950">
                      {t('studentDashboard.sessionLabel', 'სესია')} #{session.sessionId}
                      {session.levelName ? ` (${session.levelName})` : ''}
                    </div>
                    {session.lessonDaysDescription && (
                      <div className="text-slate-600 font-medium">
                        <strong className="text-slate-800">{t('studentDashboard.scheduleWord', 'განრიგი')}:</strong> {session.lessonDaysDescription}
                      </div>
                    )}
                    {session.cityName && (
                      <div className="text-slate-600 font-medium">
                        <strong className="text-slate-800">{t('studentDashboard.locationWord', 'ლოკაცია')}:</strong> {session.cityName}
                      </div>
                    )}
                  </div>

                  {/* Modal open button */}
                  <button
                    onClick={() => setViewingCourseDetail(session)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#5842F8] hover:bg-[#4832E6] py-3.5 text-xs font-extrabold text-white transition duration-200 active:scale-[0.98] shadow-md shadow-indigo-200 cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>{t('studentDashboard.startStudy', 'სილაბუსი, პროგრესი & დარჩენილი მასალა')}</span>
                  </button>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-6 pb-6 pt-1 flex items-center justify-between border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setReviewingSession(session)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-indigo-600 hover:bg-slate-50 transition active:scale-95 shadow-2xs"
                >
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span>{t('studentDashboard.writeReview', 'შეფასების დაწერა (Review)')}</span>
                </button>

                <div className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
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