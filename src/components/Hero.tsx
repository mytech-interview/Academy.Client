import React from 'react';
import { Sparkles, Users, BookOpen, Gift, CheckCircle } from 'lucide-react';
import { Language } from '../lib/translations';

interface HeroProps {
  onBrowseCourses: () => void;
  onRegister: () => void;
  isLoggedIn: boolean;
  lang: Language;
}

export default function Hero({ onBrowseCourses, onRegister, isLoggedIn, lang }: HeroProps) {
  const content = {
    ka: {
      badge: 'თანამედროვე განათლება GeoAlpha-ში',
      title: 'დაეუფლე მომავლის პროფესიას',
      subtitle: 'მიიღე განათლება საუკეთესო პრაქტიკოსი ლექტორებისგან. ისწავლე შენთვის მოსახერხებელ დროს და დაიწყე კარიერა დღესვე.',
      browse: 'ნახე კურსები',
      register: 'გაიარე რეგისტრაცია',
      student: 'სტუდენტი',
      course: 'კურსი',
      offerBadge: 'სპეციალური შეთავაზება',
      offerTitle: 'ზაფხულის აქცია',
      offerDesc: '-20% ყველა ახალ პროგრამაზე',
      t1: 'მუდმივი წვდომა სასწავლო მასალებზე',
      t2: 'ინოვაციური სილაბუსები და მხარდაჭერა',
      t3: 'ორიგინალური პრაქტიკული დავალებები',
      t4: 'ავტორიზებული სასერტიფიკატო გამოცდა'
    },
    en: {
      badge: 'Modern Education at GeoAlpha',
      title: 'Master the Profession of the Future',
      subtitle: 'Get top-tier education from practicing lecturers. Study at your own pace and launch your tech career today.',
      browse: 'Browse Courses',
      register: 'Register Now',
      student: 'Students',
      course: 'Courses',
      offerBadge: 'Special Offer',
      offerTitle: 'Summer Promo',
      offerDesc: '-20% on all new programs',
      t1: 'Lifetime access to study materials',
      t2: 'Innovative syllabus and mentorship',
      t3: 'Real-world practical assignments',
      t4: 'Official certificate upon completion'
    },
    ru: {
      badge: 'Современное образование в GeoAlpha',
      title: 'Освойте профессию будущего',
      subtitle: 'Получите качественное образование у лучших практиков. Учитесь в своем темпе и начните карьеру в ИТ уже сегодня.',
      browse: 'Найти курсы',
      register: 'Регистрация',
      student: 'Студентов',
      course: 'Курсов',
      offerBadge: 'Специальное предложение',
      offerTitle: 'Летняя акция',
      offerDesc: '-20% на все новые программы',
      t1: 'Пожизненный доступ к материалам',
      t2: 'Инновационные планы и поддержка',
      t3: 'Реальные практические задания',
      t4: 'Официальный сертификат выпускника'
    }
  };

  const h = content[lang] || content.ka;

  return (
    <section id="academy-hero" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Indigo Hero Block (8 cols on desktop) */}
        <div className="lg:col-span-8 bg-indigo-600 rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-white shadow-md shadow-indigo-100/50 min-h-[380px] lg:min-h-[440px]">
          {/* Decorative background shape */}
          <div className="absolute top-10 right-10 opacity-15 pointer-events-none">
            <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Tag */}
          <div className="self-start inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            <span>{h.badge}</span>
          </div>

          {/* Title & Body */}
          <div className="my-8 space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {h.title}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-lg font-light leading-relaxed">
              {h.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3.5">
            <button
              onClick={onBrowseCourses}
              className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition active:scale-[0.98] shadow-lg shadow-black/10 text-xs sm:text-sm cursor-pointer"
            >
              {h.browse}
            </button>
            {!isLoggedIn && (
              <button
                onClick={onRegister}
                className="bg-indigo-500/50 text-white px-6 py-3 rounded-2xl font-bold border border-indigo-400/45 hover:bg-indigo-500 transition active:scale-[0.98] text-xs sm:text-sm cursor-pointer"
              >
                {h.register}
              </button>
            )}
          </div>
        </div>

        {/* Side Bento Block Column (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Stats Sub-row Grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Dark Charcoal Stat Block */}
            <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col justify-center items-center text-white text-center shadow-sm">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-black">1,240+</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{h.student}</span>
            </div>

            {/* Indigo Lite Course Count Block */}
            <div className="bg-indigo-50 rounded-[2rem] p-6 flex flex-col justify-center items-center text-indigo-900 text-center shadow-sm border border-indigo-100">
              <div className="h-10 w-10 bg-indigo-600/10 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-display font-black text-indigo-900">45+</span>
              <span className="text-indigo-600/70 text-[10px] font-bold uppercase tracking-widest mt-1">{h.course}</span>
            </div>
          </div>

          {/* Emerald Premium Discount Offer Box */}
          <div className="bg-emerald-500 rounded-[2rem] p-6 flex items-center justify-between gap-4 text-white overflow-hidden shadow-md shadow-emerald-500/10 min-h-[140px] relative">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="flex-1 text-left space-y-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-[9px] font-extrabold uppercase tracking-wider">
                <Gift className="h-3 w-3" />
                <span>{h.offerBadge}</span>
              </div>
              <h4 className="font-display font-bold text-lg sm:text-xl leading-snug">{h.offerTitle}</h4>
              <p className="text-emerald-100 text-xs">{h.offerDesc}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 z-10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Values Sub-bar */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{h.t1}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{h.t2}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{h.t3}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{h.t4}</span>
        </div>
      </div>
    </section>
  );
}
