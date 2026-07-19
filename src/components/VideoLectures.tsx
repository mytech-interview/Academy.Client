import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Tv, Sparkles, X, Clock, User, ArrowRight } from 'lucide-react';
import { Language } from '../lib/translations';

interface Lecture {
  id: string;
  title: string;
  lecturer: string;
  duration: string;
  category: string;
  thumbnail: string;
  youtubeId: string;
  description: string;
}

interface VideoLecturesProps {
  lang: Language;
}

export default function VideoLectures({ lang }: VideoLecturesProps) {
  const [activeVideo, setActiveVideo] = useState<Lecture | null>(null);

  const headers = {
    ka: {
      badge: 'საჩუქარი ჩვენგან',
      title: 'უფასო ვიდეო ლექციები',
      desc: 'მიიღეთ საწყისი ცოდნა სრულიად უფასოდ. უყურეთ ჩვენი წამყვანი ლექტორების საინტერესო საინფორმაციო ლექციებსა და ვორქშოფებს.',
      mentor: 'ლექტორი',
      leadBy: 'ლექციას უძღვება აკადემიის მოწვეული სპეციალისტი'
    },
    en: {
      badge: 'Free Resource',
      title: 'Free Video Lectures',
      desc: 'Get initial knowledge completely free. Watch interesting informational sessions and workshops by our lead mentors.',
      mentor: 'Mentor',
      leadBy: 'The lecture is led by our guest specialist'
    },
    ru: {
      badge: 'Подарок от нас',
      title: 'Бесплатные видеоуроки',
      desc: 'Получите базовые знания совершенно бесплатно. Посмотрите увлекательные вебинары и воркшопы наших преподавателей.',
      mentor: 'Преподаватель',
      leadBy: 'Лекцию ведет приглашенный специалист академии'
    }
  };

  const h = headers[lang] || headers.ka;

  const rawLectures = [
    {
      id: 'lec-1',
      title: {
        ka: 'JavaScript / React საფუძვლები – გიორგი არშავაძე',
        en: 'JavaScript / React Basics – Giorgi Arshavadze',
        ru: 'Основы JavaScript / React – Георгий Аршавадзе'
      },
      lecturer: {
        ka: 'გიორგი არშავაძე',
        en: 'Giorgi Arshavadze',
        ru: 'Георгий Аршавадзе'
      },
      duration: {
        ka: '45 წუთი',
        en: '45 min',
        ru: '45 мин'
      },
      category: {
        ka: 'ვებ დეველოპმენტი',
        en: 'Web Development',
        ru: 'Веб-разработка'
      },
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      youtubeId: 'SqcY0GlETPk', // React basic
      description: {
        ka: 'გაეცანით React-ის საფუძვლებს: კომპონენტები, props, state და ძირითადი ჰუკები, რაც დაგეხმარებათ ინტერაქტიული საიტების აწყობაში.',
        en: 'Learn the essentials of React: components, props, state, and standard hooks to help you build interactive apps.',
        ru: 'Изучите основы React: компоненты, props, state и ключевые хуки для создания интерактивных сайтов.'
      }
    },
    {
      id: 'lec-2',
      title: {
        ka: 'Python-ის გამოყენება ყოველდღიურობაში',
        en: 'Python in Everyday Life',
        ru: 'Использование Python в повседневной жизни'
      },
      lecturer: {
        ka: 'მარიამ ბერიძე',
        en: 'Mariam Beridze',
        ru: 'Мариам Беридзе'
      },
      duration: {
        ka: '35 წუთი',
        en: '35 min',
        ru: '35 мин'
      },
      category: {
        ka: 'პროგრამირება',
        en: 'Programming',
        ru: 'Программирование'
      },
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      youtubeId: 'm7XmfeZzWl8', // Python usage
      description: {
        ka: 'გაიგეთ, როგორ შეგიძლიათ გამოიყენოთ Python ყოველდღიური რუტინული პროცესების ავტომატიზაციისა და მონაცემების დასამუშავებლად.',
        en: 'Understand how Python can be utilized to automate routine daily tasks and process data efficiently.',
        ru: 'Узнайте, как использовать Python для автоматизации рутины и интеллектуальной обработки данных.'
      }
    },
    {
      id: 'lec-3',
      title: {
        ka: 'Figma-ს უტილიტები სწრაფი მუშაობისთვის',
        en: 'Figma Utilities for High-Speed Workflows',
        ru: 'Утилиты Figma для быстрой работы'
      },
      lecturer: {
        ka: 'გიორგი კალანდაძე',
        en: 'Giorgi Kalandadze',
        ru: 'Георгий Каландадзе'
      },
      duration: {
        ka: '30 წუთი',
        en: '30 min',
        ru: '30 мин'
      },
      category: {
        ka: 'დიზაინი',
        en: 'Design',
        ru: 'Дизайн'
      },
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
      youtubeId: 'F3XQ68SOnE4', // Figma tips
      description: {
        ka: 'პროფესიონალური რჩევები Figma-ში მუშაობის სიჩქარის გაორმაგებისთვის: Autolayout, Components და Components properties.',
        en: 'Professional tips to double your design speed in Figma: Auto-layout, component structures, and variants.',
        ru: 'Профессиональные советы для ускорения работы в Figma: Auto-layout, компоненты и свойства.'
      }
    }
  ];

  const lectures: Lecture[] = rawLectures.map((l) => ({
    id: l.id,
    title: l.title[lang] || l.title.ka,
    lecturer: l.lecturer[lang] || l.lecturer.ka,
    duration: l.duration[lang] || l.duration.ka,
    category: l.category[lang] || l.category.ka,
    thumbnail: l.thumbnail,
    youtubeId: l.youtubeId,
    description: l.description[lang] || l.description.ka
  }));

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
            <Tv className="h-6 w-6" />
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lectures.map((lec) => (
            <div
              key={lec.id}
              onClick={() => setActiveVideo(lec)}
              className="group bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail with overlay play */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={lec.thumbnail}
                  alt={lec.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/35 group-hover:bg-slate-950/45 transition-colors" />

                {/* Animated Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-12 w-12 rounded-full bg-white/95 backdrop-blur-sm text-indigo-600 flex items-center justify-center shadow-lg"
                  >
                    <Play className="h-5 w-5 fill-indigo-600 ml-0.5" />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 rounded-lg bg-slate-950/75 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-white flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {lec.duration}
                </span>
              </div>

              <div className="pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600 block">
                    {lec.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-950 leading-snug mt-1.5 group-hover:text-indigo-600 transition line-clamp-2">
                    {lec.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed line-clamp-2">
                    {lec.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <span>{h.mentor}: {lec.lecturer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6 text-left">
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  {/* Embedded responsive YouTube video */}
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{activeVideo.category}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-snug">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {activeVideo.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                    {h.leadBy}: <strong className="font-semibold text-slate-700">{activeVideo.lecturer}</strong>.
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
