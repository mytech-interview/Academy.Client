import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Tv, Sparkles, X, Clock, User } from 'lucide-react';
import { useTranslation } from 'next-intl';

interface LectureItem {
  id: string;
  thumbnail: string;
  youtubeId: string;
}

const LECTURES_DATA: LectureItem[] = [
  {
    id: 'lec-1',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    youtubeId: 'SqcY0GlETPk',
  },
  {
    id: 'lec-2',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    youtubeId: 'm7XmfeZzWl8',
  },
  {
    id: 'lec-3',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
    youtubeId: 'F3XQ68SOnE4',
  },
];

interface SelectedLecture extends LectureItem {
  title: string;
  lecturer: string;
  duration: string;
  category: string;
  description: string;
}

export default function VideoLectures() {
  const t = useTranslation('videoLectures');
  const [activeVideo, setActiveVideo] = useState<SelectedLecture | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 block">
              {t('badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
              {t('title')}
            </h2>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-md">
              {t('desc')}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
            <Tv className="h-6 w-6" />
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LECTURES_DATA.map((item) => {
            const title = t(`lectures.${item.id}.title`);
            const lecturer = t(`lectures.${item.id}.lecturer`);
            const duration = t(`lectures.${item.id}.duration`);
            const category = t(`lectures.${item.id}.category`);
            const description = t(`lectures.${item.id}.description`);

            return (
              <div
                key={item.id}
                onClick={() =>
                  setActiveVideo({
                    ...item,
                    title,
                    lecturer,
                    duration,
                    category,
                    description,
                  })
                }
                className="group bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail with overlay play */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={item.thumbnail}
                    alt={title}
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
                    {duration}
                  </span>
                </div>

                <div className="pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600 block">
                      {category}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-950 leading-snug mt-1.5 group-hover:text-indigo-600 transition line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed line-clamp-2">
                      {description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                    <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <span>
                      {t('mentor')}: {lecturer}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
                    {t('leadBy')}:{' '}
                    <strong className="font-semibold text-slate-700">
                      {activeVideo.lecturer}
                    </strong>
                    .
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