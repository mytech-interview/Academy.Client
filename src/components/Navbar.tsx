import React, { useState } from "react";
import {
  LogIn,
  UserPlus,
  LogOut,
  Home,
  BookOpen,
  Info,
  Tag,
  PhoneCall,
  User as UserIcon,
} from "lucide-react";

import { User } from "../types";
import { useTranslation } from "react-i18next";
import BrandLogo from "./BrandLogo";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;

  onTabChange: (
    tab:
      | "home"
      | "courses"
      | "about"
      | "offers"
      | "contact"
      | "dashboard"
      | "teacher-sessions"
  ) => void;

  activeTab:
    | "home"
    | "courses"
    | "about"
    | "offers"
    | "contact"
    | "dashboard"
    | "teacher-sessions";

  lang: "ka" | "en" | "ru";
  onLangChange: (lang: "ka" | "en" | "ru") => void;
}

export default function Navbar({
  user,
  onLogout,
  onOpenAuth,
  onTabChange,
  activeTab,
  lang,
  onLangChange,
}: NavbarProps) {
  const { t } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);

  // NEW — если ссылка на аватар оказалась битой (404 / CORS / невалидный URL),
  // откатываемся на иконку-заглушку вместо сломанной картинки.
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Реальное поле аватара в User (types.ts) — avatarIcon.
  const resolvedAvatarUrl = user?.avatar || null;

  const showUserAvatarImage = !!resolvedAvatarUrl && !avatarFailed;

  const languages = [
    {
      code: "ka",
      name: "ქართული",
      flag: "🇬🇪",
    },
    {
      code: "en",
      name: "English",
      flag: "🇬🇧",
    },
    {
      code: "ru",
      name: "Русский",
      flag: "🇷🇺",
    },
  ] as const;

  return (
    <header
      id="app-header"
      className="
        sticky top-0 z-40 w-full
        border-b border-slate-100
        bg-white/90 backdrop-blur-md
        flex flex-col
      "
    >
      <div
        className="
          mx-auto w-full max-w-7xl
          flex h-16 items-center
          justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        <BrandLogo
          onTabChange={() => onTabChange("home")}
          size="md"
          lang={lang}
          className="shrink-0"
        />

        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onTabChange("home")}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-xl
              text-xs font-bold transition

              ${
                activeTab === "home"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }
            `}
          >
            <Home className="h-4 w-4" />
            {t("navbar.home")}
          </button>

          <button
            onClick={() => onTabChange("courses")}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-xl
              text-xs font-bold transition

              ${
                activeTab === "courses"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }
            `}
          >
            <BookOpen className="h-4 w-4" />
            {t("navbar.courses")}
          </button>

          <button
            onClick={() => onTabChange("about")}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-xl
              text-xs font-bold transition

              ${
                activeTab === "about"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }
            `}
          >
            <Info className="h-4 w-4" />
            {t("navbar.about")}
          </button>

          <button
            onClick={() => onTabChange("contact")}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-xl
              text-xs font-bold transition

              ${
                activeTab === "contact"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }
            `}
          >
            <PhoneCall className="h-4 w-4" />
            {t("navbar.contact")}
          </button>

          {user?.role === "teacher" && (
            <button
              onClick={() => onTabChange("teacher-sessions")}
              className={`
                flex items-center gap-1.5
                px-3 py-2 rounded-xl
                text-xs font-bold transition
                ${
                  activeTab === "teacher-sessions"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }
              `}
            >
              <BookOpen className="h-4 w-4" />
              {lang === "ka" ? "სესიები" : lang === "ru" ? "Сессии" : "Sessions"}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTabChange("dashboard")}
                title={t("navbar.dashboard")}
                className="
                  flex items-center gap-2
                  rounded-xl
                  bg-slate-50
                  hover:bg-indigo-50
                  border border-slate-100
                  px-2 sm:px-3
                  py-1.5
                  transition
                "
              >
                {showUserAvatarImage ? (
                  <img
                    src={resolvedAvatarUrl as string}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="
                      h-8 w-8
                      rounded-lg
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      h-8 w-8
                      rounded-lg
                      bg-slate-100
                      border border-slate-200
                      flex items-center justify-center
                      text-slate-500
                    "
                  >
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}

                <div className="hidden sm:block text-left">
                  <span
                    className="
                      block text-xs
                      font-bold
                      text-slate-900
                    "
                  >
                    {user.name}
                  </span>

                  <span
  className="
    block text-[9px]
    uppercase
    font-bold
    text-indigo-600
  "
>
  {user.role === "teacher"
    ? t("navbar.teacher")
    : user.role === "admin"
    ? t("navbar.admin")
    : t("navbar.student")}
</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="
                  flex items-center gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-3 py-2
                  text-xs font-bold
                  text-slate-600
                  hover:bg-red-50
                  hover:text-red-600
                  transition
                "
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t("navbar.logout")}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="
                  flex items-center gap-2
                  px-3 py-2
                  text-xs font-bold
                  text-slate-700
                  hover:bg-slate-50
                  rounded-xl
                "
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">{t("navbar.login")}</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="
                  flex items-center gap-2
                  bg-indigo-600
                  text-white
                  px-3 py-2
                  rounded-xl
                  text-xs font-bold
                  hover:bg-indigo-700
                  transition
                "
              >
                <UserPlus size={14} />
                {t("navbar.register")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className="
          lg:hidden
          border-t
          border-slate-100
          bg-slate-50/50
          px-4 py-2
          overflow-x-auto
          flex gap-2
        "
      >
        {[
          {
            id: "home",
            text: t("navbar.home"),
            icon: Home,
          },
          {
            id: "courses",
            text: t("navbar.courses"),
            icon: BookOpen,
          },
          {
            id: "about",
            text: t("navbar.about"),
            icon: Info,
          },
          {
            id: "contact",
            text: t("navbar.contact"),
            icon: PhoneCall,
          },
          ...(user?.role === "teacher"
            ? [
                {
                  id: "teacher-sessions",
                  text:
                    lang === "ka" ? "სესიები" : lang === "ru" ? "Сессии" : "Sessions",
                  icon: BookOpen,
                },
              ]
            : []),
        ].map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`
                flex items-center gap-2
                px-3 py-2
                rounded-lg
                text-xs
                font-bold
                shrink-0

                ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 border"
                }
              `}
            >
              <Icon size={14} />
              {item.text}
            </button>
          );
        })}
      </div>
    </header>
  );
}