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

// Same category set as the catalog page, kept local since the home page
// only needs the filter buttons (no search/sort UI here).
const backendCategories = [
  { id: "all", numId: 0, labels: { ka: "ყველა", en: "All", ru: "Все" } },
  { id: "1", numId: 1, labels: { ka: "პროგრამირება", en: "Programming", ru: "Программирование" } },
  { id: "2", numId: 2, labels: { ka: "დიაინი", en: "Cybersecurity", ru: "Кибербезопасность" } },
];

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
  const { t, i18n } = useTranslation();

  const [courses, setCourses] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getCategoryLabel = (cat: typeof backendCategories[0]) => {
    return cat.labels[i18n.language as keyof typeof cat.labels] || cat.labels.en;
  };

  useEffect(() => {
    let isMounted = true;

    const loadHomePageCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryIds = [1, 2];
        const results = await Promise.all(
          categoryIds.map((id) =>
            getHomeActiveSessions(id)
              .then((res: any) => {
                const list = Array.isArray(res) ? res : res?.activeSessions || [];
                // Tag each item with the category it came from so we can
                // filter client-side without refetching on category change.
                return list.map((item: any) => ({ ...item, _categoryId: id }));
              })
              .catch(() => [])
          )
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

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((c: any) => String(c._categoryId) === selectedCategory);

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

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {backendCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-extrabold border transition-all duration-150 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
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
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-16 text-center space-y-2 bg-white">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              {t("catalog.notFoundTitle")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 6).map((course: any) => {
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