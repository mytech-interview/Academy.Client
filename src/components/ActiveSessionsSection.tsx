import React from "react";
import { Star, User as UserIcon, Users, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActiveSession } from "../types";

interface ActiveSessionsSectionProps {
  sessions: ActiveSession[];
  onSelectSession?: (session: ActiveSession) => void;
}

export default function ActiveSessionsSection({
  sessions,
  onSelectSession,
}: ActiveSessionsSectionProps) {
  const { t } = useTranslation();

  if (!sessions || sessions.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
          <Flame className="h-3.5 w-3.5 animate-pulse" />
          {t("home.activeSessions.badge")}
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
          {t("home.activeSessions.title")}
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
          {t("home.activeSessions.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const spotsLeft = session.maxStudents - session.enrolledCount;

          return (
            <article
              key={session.sessionId}
              className="group flex flex-col bg-white border border-slate-200/80 rounded-[2rem] p-4.5 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-xl border bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {session.categoryName}
                </span>
                <span className="rounded-xl border border-slate-100 bg-white/95 px-3 py-1 text-[10px] font-bold text-slate-700">
                  {session.levelName}
                </span>
              </div>

              <div className="flex flex-1 flex-col pt-4 pb-2 px-1 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-widest mb-1.5">
                  <span>{session.durationWeeks} {t("home.activeSessions.weeks")}</span>
                </div>

                <h3 className="font-sans text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                  {session.title}
                </h3>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                  {session.courseDescription}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 font-bold border border-slate-200/50">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{session.teacherName}</span>
                  </div>

                  {session.averageRating !== null ? (
                    <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100/80 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                      <span>{session.averageRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Users className="h-3.5 w-3.5" />
                      <span>{spotsLeft} {t("home.activeSessions.spotsLeft")}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100/80 pt-4">
                  <div>
                    <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-400">
                      {t("courseCard.priceLabel")}
                    </span>
                    <span className="text-base font-black text-slate-950">
                      {session.price} ₾
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectSession?.(session)}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                  >
                    {t("home.activeSessions.btnJoin")}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}