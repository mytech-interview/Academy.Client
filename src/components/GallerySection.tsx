import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Language } from '../lib/translations';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description: string;
}

interface GallerySectionProps {
  lang: Language;
}

export default function GallerySection({ lang }: GallerySectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const headers = {
    ka: {
      badge: 'ჩვენი გარემო',
      title: 'აკადემიის გალერეა',
      desc: 'დაათვალიერეთ ჩვენი შემოქმედებითი ლაბორატორია, კომფორტული სამუშაო სივრცეები და სტუდენტური ცხოვრება.',
      loc: 'ლოკაცია'
    },
    en: {
      badge: 'Our Campus',
      title: 'Academy Gallery',
      desc: 'Explore our creative laboratories, cozy co-working spaces, and student campus life.',
      loc: 'Location'
    },
    ru: {
      badge: 'Наш кампус',
      title: 'Галерея академии',
      desc: 'Посмотрите наши творческие лаборатории, комфортные рабочие пространства и яркую студенческую жизнь.',
      loc: 'Локация'
    }
  };

  const h = headers[lang] || headers.ka;

  const rawPhotos = [
    {
      id: 'photo-1',
      title: {
        ka: 'თანამედროვე აუდიტორია',
        en: 'Modern Lecture Rooms',
        ru: 'Современные аудитории'
      },
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      description: {
        ka: 'აკადემიის სტუდენტები მუშაობენ თანამედროვე აპარატურით აღჭურვილ კლასებში, სადაც თითოეულ მათგანს აქვს ინდივიდუალური სამუშაო სივრცე.',
        en: 'Academy students study in spaces equipped with modern technology and individual workstations.',
        ru: 'Студенты академии занимаются в классах, оборудованных современными компьютерами с индивидуальными рабочими местами.'
      }
    },
    {
      id: 'photo-2',
      title: {
        ka: 'co-working და რეკრეაციული ზონა',
        en: 'Co-working & Recreation Areas',
        ru: 'Коворкинг и зоны отдыха'
      },
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      description: {
        ka: 'მყუდრო და თავისუფალი გარემო იდეების გასაცვლელად, გუნდური პროექტებისთვის და ლექციებს შორის განტვირთვისთვის.',
        en: 'A cozy, creative environment for brainstorming, team projects, and relaxing between lectures.',
        ru: 'Уютная атмосфера для обмена идеями, командной работы и отдыха в перерывах между лекциями.'
      }
    },
    {
      id: 'photo-3',
      title: {
        ka: 'პრაქტიკული ვორქშოფები',
        en: 'Hands-on Workshops',
        ru: 'Практические воркшопы'
      },
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      description: {
        ka: 'სტუდენტები აქტიურად არიან ჩართულები პრაქტიკული ამოცანების გადაჭრასა და გამოცდილების გაზიარებაში.',
        en: 'Students are actively involved in solving real development problems and sharing direct peer experience.',
        ru: 'Студенты вовлечены в решение реальных бизнес-задач и обмен опытом с практикующими менторами.'
      }
    },
    {
      id: 'photo-4',
      title: {
        ka: 'ყოველწლიური ჰაკათონები',
        en: 'Annual Hackathons',
        ru: 'Ежегодные хакатоны'
      },
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      description: {
        ka: 'აკადემიაში რეგულარულად ტარდება შიდა და გარე პროექტები, სადაც სტუდენტები ქმნიან რეალურ აპლიკაციებს შეზღუდულ დროში.',
        en: 'We regularly host internal and external hackathons, where students build real-world applications under tight deadlines.',
        ru: 'В академии регулярно проводятся хакатоны, где студенты создают рабочие приложения в ограниченные сроки.'
      }
    }
  ];

  const photos: GalleryItem[] = rawPhotos.map((p) => ({
    id: p.id,
    title: p.title[lang] || p.title.ka,
    image: p.image,
    description: p.description[lang] || p.description.ka
  }));

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : (prev ?? 0) - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : (prev ?? 0) + 1));
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
            <ImageIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Photos grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((ph, index) => (
            <div
              key={ph.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer"
            >
              <img
                src={ph.image}
                alt={ph.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/50 transition-all flex flex-col justify-end p-4 text-left" />

              {/* Title fade in bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider">{h.loc}</span>
                <h4 className="text-white text-xs font-bold leading-tight mt-0.5">{ph.title}</h4>
              </div>

              {/* Eye icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-md">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <div
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-4 sm:p-6 shadow-2xl border border-slate-200/80"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute right-6 top-6 z-10 rounded-full bg-slate-900/40 p-2 text-white hover:bg-slate-950/60 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/95 p-2 text-slate-800 hover:bg-slate-50 shadow-md transition cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/95 p-2 text-slate-800 hover:bg-slate-50 shadow-md transition cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="space-y-4 text-left">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={photos[activePhotoIndex].image}
                    alt={photos[activePhotoIndex].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="px-2 pb-2 text-left">
                  <h4 className="text-lg font-black text-slate-950 tracking-tight leading-none mb-2">
                    {photos[activePhotoIndex].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                    {photos[activePhotoIndex].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
