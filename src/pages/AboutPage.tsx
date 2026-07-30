import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Award, Laptop, Target, GraduationCap, Zap } from 'lucide-react';

import { mockTeachers } from '../data/mockData';
import StatsSection from '../components/StatsSection';
import GallerySection from '../components/GallerySection';
import { Language } from '../lib/translations';

interface AboutPageProps {
  lang: Language;
}

const aboutContent = {
  ka: {
    title: 'ინოვაცია განათლებაში',
    subtitle: 'აკადემია არის ადგილი, სადაც იწყება თქვენი ტექნოლოგიური მომავალი. ჩვენ გთავაზობთ პრაქტიკაზე ორიენტირებულ საგანმანათლებლო პროგრამებს.',
    storyTitle: 'ჩვენი ისტორია',
    storyText: 'აკადემია დაარსდა იმ მიზნით, რომ საქართველოში შეექმნა უმაღლესი დონის IT განათლების კერა. ჩვენი სტუდენტები სწავლობენ რეალურ ინდუსტრიულ ქეისებზე და თანამშრომლობენ წამყვან მენტორებთან. დღეს ჩვენ ვართ ერთ-ერთი ყველაზე სწრაფად მზარდი საზოგადოება.',
    teamTitle: 'ჩვენი წამყვანი მენტორები',
    teamSubtitle: 'გაიცანით პროფესიონალები, რომლებიც გაგიძღვებიან IT სამყაროში.',
    pillarsBadge: 'აკადემიის ღირებულებები',
    pillarsTitle: 'როგორ ვასწავლით GeoAlpha-ში?',
    pillarsSubtitle: 'ჩვენი საგანმანათლებლო მოდელი ორიენტირებულია თითოეული სტუდენტის რეალურ შედეგზე და კარიერულ წინსვლაზე.',
    pillar1_title: 'პრაქტიკაზე ორიენტირებული სწავლება',
    pillar1_text: 'არავითარი მშრალი თეორია! კურსის განმავლობაში სტუდენტები მუშაობენ რეალურ ინდუსტრიულ ქეისებზე და ქმნიან საკუთარ ციფრულ პროდუქტებს.',
    pillar2_title: 'დასაქმების ხელშეწყობა',
    pillar2_text: 'აკადემიის კარიერული ცენტრი აქტიურად თანამშრომლობს პარტნიორ კომპანიებთან, ეხმარება სტუდენტებს რეზიუმეს მომზადებასა და გასაუბრებების დაგეგმვაში.',
    pillar3_title: 'მენტორული მხარდაჭერა',
    pillar3_text: 'ინდივიდუალური უკუკავშირი ყოველი დავალების შემდეგ. ჩვენი პრაქტიკოსი ლექტორები მზად არიან დაგეხმარონ ნებისმიერი სირთულის საკითხის გარჩევაში.',
    pillar4_title: 'სტაჟირება და ვორქშოფები',
    pillar4_text: 'საუკეთესო სტუდენტები იღებენ რეალურ სტაჟირების შესაძლებლობებს და მონაწილეობას იღებენ შიდა პროდუქტების დეველოპმენტში.',
  },
  en: {
    title: 'Innovation in Education',
    subtitle: 'Our academy is where your technological future begins. We offer fully practice-oriented learning programs.',
    storyTitle: 'Our Story',
    storyText: 'The academy was founded with the mission to build a premium IT education ecosystem in Georgia. Our students learn through real industry business cases and cooperate with senior mentors. Today we are one of the fastest growing tech communities.',
    teamTitle: 'Our Leading Mentors',
    teamSubtitle: 'Meet the industry practitioners who will guide you through the tech landscape.',
    pillarsBadge: 'Academy Values',
    pillarsTitle: 'How We Teach At GeoAlpha?',
    pillarsSubtitle: 'Our educational model is focused on real results and career advancement for every student.',
    pillar1_title: 'Practice-Oriented Learning',
    pillar1_text: 'No dry theory! Throughout the course, students work on real-world industrial cases and build their own digital products.',
    pillar2_title: 'Career & Placement Center',
    pillar2_text: 'The academy career center actively cooperates with partner companies, helping students write resumes and prepare for job interviews.',
    pillar3_title: 'Mentor Support',
    pillar3_text: 'Individual feedback after every assignment. Our active practitioners are ready to guide you through any complex tech concept.',
    pillar4_title: 'Internships & Workshops',
    pillar4_text: 'Top performing students receive real internship opportunities and work on internal production software development.',
  },
  ru: {
    title: 'Инновации в образовании',
    subtitle: 'Наша академия — это место, где начинается ваше технологическое будущее. Мы предлагаем полностью практические учебные программы.',
    storyTitle: 'Наша история',
    storyText: 'Академия была основана с миссией создать экосистему IT-образования премиум-класса в Грузии. Наши студенты обучаются на реальных кейсах и работают с ведущими менторами. Сегодня мы — одно из самых быстрорастущих технологических сообществ.',
    teamTitle: 'Наши ведущие менторы',
    teamSubtitle: 'Познакомьтесь с практикующими специалистами, которые проведут вас в мир IT.',
    pillarsBadge: 'Ценности Академии',
    pillarsTitle: 'Как мы обучаем в GeoAlpha?',
    pillarsSubtitle: 'Наша образовательная модель ориентирована на реальные результаты и карьерный рост каждого студента.',
    pillar1_title: 'Практическое обучение',
    pillar1_text: 'Никакой сухой теории! На протяжении всего курса студенты работают над реальными бизнес-кейсами и создают свои цифровые продукты.',
    pillar2_title: 'Центр карьеры и трудоустройства',
    pillar2_text: 'Центр карьеры академии активно сотрудничает с компаниями-партнерами, помогая составлять резюме и готовиться к собеседованиям.',
    pillar3_title: 'Поддержка менторов',
    pillar3_text: 'Индивидуальная обратная связь по каждому заданию. Наши практикующие лекторы готовы помочь разобраться в любых сложных темах.',
    pillar4_title: 'Стажировки и воркшопы',
    pillar4_text: 'Лучшие студенты получают реальную возможность стажировки и участвуют в разработке внутренних программных продуктов.',
  },
};

export default function AboutPage({ lang }: AboutPageProps) {
  const aboutLabels = aboutContent[lang];

  const pillars = [
    { title: aboutLabels.pillar1_title, text: aboutLabels.pillar1_text, icon: Laptop, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: aboutLabels.pillar2_title, text: aboutLabels.pillar2_text, icon: Target, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: aboutLabels.pillar3_title, text: aboutLabels.pillar3_text, icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: aboutLabels.pillar4_title, text: aboutLabels.pillar4_text, icon: Zap, color: 'text-rose-600 bg-rose-50 border-rose-100' },
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
              {lang === 'ka' ? 'აკადემიის მისია' : lang === 'ru' ? 'Наша миссия' : 'Academy Mission'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
              {aboutLabels.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">
              {aboutLabels.subtitle}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                {aboutLabels.storyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {aboutLabels.storyText}
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
            {aboutLabels.pillarsBadge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {aboutLabels.pillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {aboutLabels.pillarsSubtitle}
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
            {lang === 'ka' ? 'პროფესიონალი მასწავლებლები' : lang === 'ru' ? 'Профессиональные преподаватели' : 'Professional Mentors'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {aboutLabels.teamTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            {aboutLabels.teamSubtitle}
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