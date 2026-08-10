import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { User, Enrollment, ActiveSession } from "../types";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import ProjectsSection from "../components/ProjectsSection";
import VideoLectures from "../components/VideoLectures";
import ActiveSessionsSection from "../components/ActiveSessionsSection";
import { getHomeActiveSessions } from "../api/sessions";

interface HomePageProps {
  activeUser: User | null;
  enrollments: Enrollment[];
  // Course id currently being enrolled into (drives the button's loading state)
  enrollingCourseId: string | null;
  onBrowseCourses: () => void;
  onOpenAuth: () => void;
  onSelectCourse: (course: any) => void;
  onEnroll: (courseId: string | number) => void;
  onViewAllCourses: () => void;
}

export default function HomePage({
  activeUser,
  enrollments,
  enrollingCourseId,
  onBrowseCourses,
  onOpenAuth,
  onSelectCourse,
  onEnroll,
  onViewAllCourses,
}: HomePageProps) {
  const { t } = useTranslation();

  const [courses, setCourses] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadHomePageCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryIds = [1, 2];
        const results = await Promise.all(
          categoryIds.map((id) => getHomeActiveSessions(id).catch(() => []))
        );

        const combined = results.flat();
        const uniqueMap = new Map<number | string, ActiveSession>();

        combined.forEach((item) => {
          const id = item.sessionId || item.courseId;
          if (id && !uniqueMap.has(id)) {
            uniqueMap.set(id, item);
          }
        });

        if (isMounted) {
          setCourses(Array.from(uniqueMap.values()));
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Ошибка при загрузке курсов");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomePageCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      <Hero
        onBrowseCourses={onBrowseCourses}
        onRegister={onOpenAuth}
        isLoggedIn={activeUser !== null}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            {t("home.featured.badge")}
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t("home.featured.title")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t("home.featured.description")}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2.5rem] border border-slate-100 py-16 text-center space-y-3 bg-white shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="h-9 w-9 text-indigo-600 animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">
              {t("catalog.loading")}
            </p>
          </div>
        ) : error ? (
          <div className="rounded-[2.5rem] border border-red-100 bg-red-50/50 py-8 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-16 text-center space-y-2 bg-white">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              {t("catalog.notFoundTitle")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course: any) => {
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
                />
              );
            })}
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={onViewAllCourses}
            className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <span>{t("home.featured.button")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* <ActiveSessionsSection sessions={courses} /> */}
      {/* <ProjectsSection /> */}
      {/* <VideoLectures /> */}
    </div>
  );
}