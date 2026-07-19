import React from 'react';
import { motion } from 'motion/react';
import { Globe, GraduationCap, MapPin, Users, Award, PlayCircle } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface StatsSectionProps {
  lang: Language;
}

export default function StatsSection({ lang }: StatsSectionProps) {
  const t = translations[lang];

  const stats = [
    {
      id: 1,
      label: t.statsLabelCountry,
      value: '25',
      icon: Globe,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      id: 2,
      label: t.statsLabelBranch,
      value: '116',
      icon: MapPin,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      id: 3,
      label: t.statsLabelStudent,
      value: '68,000+',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      id: 4,
      label: t.statsLabelLecturer,
      value: '2,900+',
      icon: GraduationCap,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      id: 5,
      label: t.statsLabelAlumni,
      value: '267,000+',
      icon: Award,
      color: 'text-sky-600 bg-sky-50 border-sky-100'
    }
  ];

  // return (
  //   <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
  //     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  //       {/* Left column: Video Tour invitation & Heading */}
  //       <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
  //         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:bg-indigo-100 transition-colors" />
          
  //         <div className="space-y-4">
  //           <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 block">{t.statsAboutBadge}</span>
  //           <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
  //             {t.statsTitle}
  //           </h2>
  //           <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
  //             {t.statsSubtitle}
  //           </p>
  //         </div>

  //         {/* Simulated Interactive Video Tour Block */}
  //         <div className="mt-8 relative rounded-3xl overflow-hidden aspect-video border border-slate-200 group-hover:border-indigo-300 transition-all shadow-sm">
  //           <img 
  //             src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=600" 
  //             alt="Video Tour" 
  //             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  //             referrerPolicy="no-referrer"
  //           />
  //           <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center">
  //             <motion.button 
  //               whileHover={{ scale: 1.1 }}
  //               whileTap={{ scale: 0.95 }}
  //               onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
  //               className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-indigo-600 shadow-xl cursor-pointer"
  //             >
  //               <PlayCircle className="h-8 w-8 fill-indigo-100" />
  //             </motion.button>
  //             <span className="text-white text-xs font-bold mt-3 drop-shadow">{t.statsVideoTour}</span>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Right column: Stats Grid (Bento Style) */}
  //       <div className="lg:col-span-7 grid grid-cols-2 gap-6">
  //         {stats.map((stat, i) => {
  //           const Icon = stat.icon;
  //           // The 3rd stat (students) or 5th can be double width for aesthetic bento rhythm
  //           const isFullWidth = i === 2;

  //           return (
  //             <div
  //               key={stat.id}
  //               className={`bg-white border border-slate-200/80 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-150 transition-all ${
  //                 isFullWidth ? 'col-span-2' : 'col-span-1'
  //               }`}
  //             >
  //               <div className="flex items-center justify-between">
  //                 <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${stat.color}`}>
  //                   <Icon className="h-5 w-5" />
  //                 </div>
  //                 <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
  //                   {lang === 'ka' ? 'სტატისტიკა' : lang === 'en' ? 'Statistics' : 'Статистика'}
  //                 </span>
  //               </div>

  //               <div className="mt-6">
  //                 <span className="block text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight">
  //                   {stat.value}
  //                 </span>
  //                 <span className="block text-xs sm:text-sm font-semibold text-slate-600 mt-1">
  //                   {stat.label}
  //                 </span>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   </section>
  // );
}
