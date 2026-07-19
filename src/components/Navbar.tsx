import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, LayoutDashboard, Compass, Home, BookOpen, Info, Tag, PhoneCall } from 'lucide-react';
import { User } from '../types';
import { translations, Language } from '../lib/translations';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  onTabChange: (tab: 'home' | 'courses' | 'about' | 'offers' | 'contact' | 'dashboard') => void;
  activeTab: 'home' | 'courses' | 'about' | 'offers' | 'contact' | 'dashboard';
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export default function Navbar({
  user,
  onLogout,
  onOpenAuth,
  onTabChange,
  activeTab,
  lang,
  onLangChange
}: NavbarProps) {
  const t = translations[lang];
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md flex flex-col">
      <div className="mx-auto w-full max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Modern high-fidelity Brand Logo */}
        <BrandLogo onTabChange={() => onTabChange('home')} size="md" lang={lang} className="shrink-0" />

        {/* Navigation Middle Actions for Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <Home className="h-4 w-4" />
            {t.homeTab || 'მთავარი'}
          </button>

          <button
            onClick={() => onTabChange('courses')}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t.coursesTab || 'კურსები'}
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <Info className="h-4 w-4" />
            {t.aboutTab || 'ჩვენ შესახებ'}
          </button>

          <button
            onClick={() => onTabChange('offers')}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <Tag className="h-4 w-4" />
            {t.offersTab || 'აქციები'}
          </button>

          <button
            onClick={() => onTabChange('contact')}
            className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
            }`}
          >
            <PhoneCall className="h-4 w-4" />
            {t.contactTab || 'კონტაქტი'}
          </button>
        </nav>

        {/* Auth & Language Switchers */}
        <div id="nav-auth-controls" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Modern Elegant Dropdown Language Switcher */}
          <div className="relative" id="lang-switcher-dropdown">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 sm:gap-2 rounded-xl border border-slate-200/80 bg-white px-2 sm:px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <span className="text-base leading-none">
                {lang === 'ka' ? '🇬🇪' : lang === 'en' ? '🇬🇧' : '🇷🇺'}
              </span>
              <span className="uppercase text-[11px] tracking-wider text-slate-600 font-mono hidden sm:inline">
                {lang}
              </span>
              <svg
                className={`h-3 w-3 text-slate-400 transition-transform duration-250 hidden sm:block ${isLangOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-fade-in-quick">
                  {(['ka', 'en', 'ru'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onLangChange(l);
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all duration-150 ${
                        lang === l
                          ? 'bg-indigo-50/70 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-base leading-none">
                        {l === 'ka' ? '🇬🇪' : l === 'en' ? '🇬🇧' : '🇷🇺'}
                      </span>
                      <span className="flex-1">
                        {l === 'ka' ? 'ქართული' : l === 'en' ? 'English' : 'Русский'}
                      </span>
                      {lang === l && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onTabChange('dashboard')}
                title={lang === 'ka' ? 'პირადი კაბინეტი' : lang === 'ru' ? 'Личный кабинет' : 'Personal Cabinet'}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all rounded-xl p-1 pr-1 sm:pr-3 border border-slate-100 max-w-[44px] sm:max-w-none overflow-hidden cursor-pointer"
              >
                <img
                  src={user.avatar || `https://images.unsplash.com/photo-${user.role === 'teacher' ? '1573496359142-b8d87734a5a2' : '1534528741775-53994a69daeb'}?w=80&h=80&fit=crop`}
                  alt={user.name}
                  className="h-8 w-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left leading-none hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[90px]">{user.name}</span>
                  <span className="text-[9px] font-bold font-mono mt-0.5 block uppercase tracking-wider text-indigo-600">
                    {user.role === 'teacher' ? t.teacher : t.student}
                  </span>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                id="btn-navbar-logout"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition active:scale-[0.98]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAuth}
                id="btn-navbar-login"
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.login}</span>
              </button>
              <button
                onClick={onOpenAuth}
                id="btn-navbar-register"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition active:scale-[0.98] shadow-md shadow-indigo-100"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{t.register}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scrolling Nav Rail */}
      <div className="lg:hidden w-full border-t border-slate-100 bg-slate-50/50 px-4 py-2 overflow-x-auto flex items-center gap-1.5 select-none scrollbar-none shrink-0">
        <button
          onClick={() => onTabChange('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            activeTab === 'home'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-150 hover:bg-slate-100'
          }`}
        >
          <Home className="h-3.5 w-3.5" />
          {t.homeTab || 'მთავარი'}
        </button>

        <button
          onClick={() => onTabChange('courses')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-150 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          {t.coursesTab || 'კურსები'}
        </button>

        <button
          onClick={() => onTabChange('about')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            activeTab === 'about'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-150 hover:bg-slate-100'
          }`}
        >
          <Info className="h-3.5 w-3.5" />
          {t.aboutTab || 'ჩვენ შესახებ'}
        </button>

        <button
          onClick={() => onTabChange('offers')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            activeTab === 'offers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-150 hover:bg-slate-100'
          }`}
        >
          <Tag className="h-3.5 w-3.5" />
          {t.offersTab || 'აქციები'}
        </button>

        <button
          onClick={() => onTabChange('contact')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-150 hover:bg-slate-100'
          }`}
        >
          <PhoneCall className="h-3.5 w-3.5" />
          {t.contactTab || 'კონტაქტი'}
        </button>
      </div>
    </header>
  );
}
