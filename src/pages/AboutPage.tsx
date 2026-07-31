import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Award, Laptop, Target, GraduationCap, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { mockTeachers } from '../data/mockData';
import StatsSection from '../components/StatsSection';
import GallerySection from '../components/GallerySection';
import { Language } from '../lib/translations';

interface AboutPageProps {
  lang: Language;
}

export default function AboutPage({ lang }: AboutPageProps) {
  const { t } = useTranslation();

  const pillars = [
    {
      title: t('about.pillars.pillar1.title'),
      text: t('about.pillars.pillar1.text'),
      icon: Laptop,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: t('about.pillars.pillar2.title'),
      text: t('about.pillars.pillar2.text'),
      icon: Target,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: t('about.pillars.pillar3.title'),
      text: t('about.pillars.pillar3.text'),
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: t('about.pillars.pillar4.title'),
      text: t('about.pillars.pillar4.text'),
      icon: Zap,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="pb-20 space-y-20 animate-fade-in">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 left-0 h-40 w-40 bg-emerald-500/5 blur-3xl rounded-full"></div>

          <div className="text-left space-y-4 md:flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 border border-emerald-100">
              <UserCheck className="h-4 w-4" />
              {t('about.missionBadge')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
              {t('about.title')}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">
              {t('about.subtitle')}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                {t('about.storyTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {t('about.storyText')}
              </p>
            </div>
          </div>

          <div className="w-full md:w-96 rounded-3xl overflow-hidden shadow-lg border border-slate-100 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&fit=crop"
              alt="Academy Team Work"
              className="w-full h-64 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
            <Award className="h-3.5 w-3.5" />
            {t('about.pillarsBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t('about.pillarsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t('about.pillarsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, pi) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pi}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.1, duration: 0.3 }}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col space-y-4"
              >
                <div className={`p-3 rounded-2xl w-12 h-12 flex items-center justify-center border ${pillar.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-slate-950 text-base leading-tight">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light flex-1">{pillar.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <StatsSection lang={lang} />
      <GallerySection lang={lang} />

      {/* Mentors */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
            {t('about.mentorsBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t('about.teamTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {t('about.teamSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {mockTeachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="bg-white border border-slate-200/80 rounded-[2rem] p-6 text-center space-y-4 shadow-sm hover:shadow-md transition group"
            >
              <div className="relative inline-block">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="h-24 w-24 rounded-full mx-auto object-cover border-2 border-slate-100 shadow group-hover:border-indigo-500 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-1.5 h-6 w-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                  ✓
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-base">{teacher.name}</h4>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block font-mono">
                  {teacher.headline}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-light">{teacher.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}