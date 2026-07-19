import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Sparkles, FolderGit2, ArrowRight, X, Heart, Eye } from 'lucide-react';
import { Language } from '../lib/translations';

interface Project {
  id: string;
  title: string;
  studentName: string;
  category: string;
  description: string;
  image: string;
  link: string;
  likes: number;
}

interface ProjectsSectionProps {
  lang: Language;
}

export default function ProjectsSection({ lang }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const headers = {
    ka: {
      badge: 'სტუდენტების შემოქმედება',
      title: 'გამორჩეული პროექტები',
      desc: 'გაეცანით ჩვენი სტუდენტების მიერ სწავლის განმავლობაში შექმნილ რეალურ ციფრულ პროდუქტებსა და ხელოვნების ნიმუშებს.',
      view: 'ნახვა',
      author: 'ავტორი',
      open: 'გახსენი პროექტი',
      info: 'ეს პროექტი შეიქმნა GeoAlpha academy-ის პრაქტიკული ვორქშოფების ფარგლებში.'
    },
    en: {
      badge: 'Student Portfolio',
      title: 'Featured Projects',
      desc: 'Explore real-world digital products and creative artworks crafted by our talented students.',
      view: 'View',
      author: 'Author',
      open: 'Open Project',
      info: 'This project was developed within the framework of GeoAlpha academy workshops.'
    },
    ru: {
      badge: 'Портфолио студентов',
      title: 'Выдающиеся проекты',
      desc: 'Ознакомьтесь с реальными цифровыми продуктами и работами, созданными нашими талантливыми студентами.',
      view: 'Смотреть',
      author: 'Автор',
      open: 'Открыть проект',
      info: 'Этот проект был разработан в рамках практических воркшопов GeoAlpha academy.'
    }
  };

  const h = headers[lang] || headers.ka;

  const rawProjects = [
    {
      id: 'proj-1',
      title: {
        ka: 'Water Pollution – ანი დოლიძე',
        en: 'Water Pollution – Ani Dolidze',
        ru: 'Water Pollution – Ани Долидзе'
      },
      studentName: {
        ka: 'ანი დოლიძე',
        en: 'Ani Dolidze',
        ru: 'Ани Долидзе'
      },
      category: {
        ka: 'ინტერაქტიული დიზაინი',
        en: 'Interactive Design',
        ru: 'Интерактивный дизайн'
      },
      description: {
        ka: 'ინტერაქტიული 3D ვებ-გვერდი, რომელიც ასახავს მსოფლიო ოკეანეების დაბინძურების პრობლემას და მოუწოდებს საზოგადოებას ეკო-აქტივიზმისკენ.',
        en: 'Interactive 3D website illustrating global ocean pollution and promoting active environmental awareness.',
        ru: 'Интерактивный 3D-сайт, иллюстрирующий загрязнение океана и призывающий к эко-активизму.'
      },
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
      link: 'https://geolab.edu.ge/',
      likes: 124
    },
    {
      id: 'proj-2',
      title: {
        ka: 'The War – ბექა მამფორია',
        en: 'The War – Beka Mamphoria',
        ru: 'The War – Бека Мамфория'
      },
      studentName: {
        ka: 'ბექა მამფორია',
        en: 'Beka Mamphoria',
        ru: 'Бека Мамфория'
      },
      category: {
        ka: 'თამაშების დეველოპმენტი',
        en: 'Game Development',
        ru: 'Разработка игр'
      },
      description: {
        ka: 'Unity-ზე შექმნილი 2D სათავგადასავლო პლატფორმერი, რომელიც გვიამბობს ისტორიულ ბრძოლებსა და სტრატეგიულ თავდაცვაზე.',
        en: 'A 2D adventure platformer built with Unity, retelling historical battles and strategic defense.',
        ru: 'Двумерный приключенческий платформер на Unity, повествующий об исторических битвах.'
      },
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      link: 'https://geolab.edu.ge/',
      likes: 98
    },
    {
      id: 'proj-3',
      title: {
        ka: 'Shattered Silence – ნათია თორონჯაძე',
        en: 'Shattered Silence – Natia Toronjadze',
        ru: 'Shattered Silence – Натия Торонджадзе'
      },
      studentName: {
        ka: 'ნათია თორონჯაძე',
        en: 'Natia Toronjadze',
        ru: 'Натия Торонджадзе'
      },
      category: {
        ka: 'ციფრული ილუსტრაცია',
        en: 'Digital Illustration',
        ru: 'Цифровая иллюстрация'
      },
      description: {
        ka: 'კონცეპტუალური პოსტერებისა და ციფრული ხელოვნების სერია, რომელიც იკვლევს ადამიანის ფსიქოლოგიურ მდგომარეობებს თანამედროვე ეპოქაში.',
        en: 'A series of conceptual posters and digital art exploring human psychology in the modern era.',
        ru: 'Серия концептуальных плакатов и цифрового арта, исследующая психологию человека.'
      },
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      link: 'https://geolab.edu.ge/',
      likes: 156
    },
    {
      id: 'proj-4',
      title: {
        ka: 'EduTrack Mobile – ლაშა ხარატიშვილი',
        en: 'EduTrack Mobile – Lasha Kharatishvili',
        ru: 'EduTrack Mobile – Лаша Харатишвили'
      },
      studentName: {
        ka: 'ლაშა ხარატიშვილი',
        en: 'Lasha Kharatishvili',
        ru: 'Лаша Харатишвили'
      },
      category: {
        ka: 'UX/UI დიზაინი',
        en: 'UX/UI Design',
        ru: 'UX/UI Дизайн'
      },
      description: {
        ka: 'მობილური აპლიკაციის დიზაინი და ინტერაქტიული პროტოტიპი, რომელიც სტუდენტებს ეხმარება ლექციებისა და სასწავლო დავალებების ორგანიზებაში.',
        en: 'Mobile app design and interactive prototype helping students organize lectures and assignments.',
        ru: 'Дизайн мобильного приложения и прототип, помогающий организовывать учебу.'
      },
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      link: 'https://geolab.edu.ge/',
      likes: 84
    }
  ];

  const projects: Project[] = rawProjects.map((p) => ({
    id: p.id,
    title: p.title[lang] || p.title.ka,
    studentName: p.studentName[lang] || p.studentName.ka,
    category: p.category[lang] || p.category.ka,
    description: p.description[lang] || p.description.ka,
    image: p.image,
    link: p.link,
    likes: p.likes
  }));

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 block">{h.badge}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
              {h.title}
            </h2>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-md">
              {h.desc}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
            <FolderGit2 className="h-6 w-6" />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((proj) => {
            const currentLikes = proj.likes + (likes[proj.id] || 0);

            return (
              <article
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group flex flex-col bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
              >
                {/* Image Wrap */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/45 transition-colors duration-300" />

                  {/* Absolute Badge */}
                  <span className="absolute top-3 left-3 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-indigo-600 border border-slate-100">
                    {proj.category}
                  </span>

                  {/* Zoom Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-md">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Body Text */}
                <div className="flex flex-1 flex-col pt-4 pb-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{proj.studentName}</span>
                  <h3 className="text-sm font-extrabold text-slate-950 leading-snug mt-1 group-hover:text-indigo-600 transition duration-150 line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-light leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <button
                      onClick={(e) => handleLike(proj.id, e)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-50 px-2.5 py-1 rounded-xl hover:bg-rose-100 transition active:scale-95 border border-rose-100 cursor-pointer"
                    >
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      <span>{currentLikes}</span>
                    </button>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      {h.view} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6 text-left">
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-indigo-50 text-indigo-700 px-3 py-1 text-[10px] font-bold border border-indigo-100">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{h.author}: {selectedProject.studentName}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
                    {selectedProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {selectedProject.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      {h.info}
                    </div>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-700 active:scale-95 transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                      <span>{h.open}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
