import React, { useMemo } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VideoItem } from '../types';
import { EmptyState } from './Asyncstates';

interface VideosTabProps {
  videos: VideoItem[];
  searchQuery: string;
  onDelete: (id: string) => void;
}

// NOTE: no backend endpoint for free videos yet — local state only.

export default function VideosTab({ videos, searchQuery, onDelete }: VideosTabProps) {
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase();
    return videos.filter(
      (v) =>
        v.category.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.instructor.toLowerCase().includes(q)
    );
  }, [videos, searchQuery]);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">{t('videosTab.title')}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t('videosTab.subtitle')}</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
          <Plus className="w-4 h-4" /> {t('videosTab.addBtn')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            searchQuery.trim()
              ? t('videosTab.notFound', { query: searchQuery })
              : t('videosTab.empty')
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-md backdrop-blur-sm">
                  {video.duration}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-purple-600 mb-1">{video.category}</p>
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    {t('videosTab.instructor', { name: video.instructor })}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button className="flex-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200">
                    <Pencil className="w-3.5 h-3.5 text-purple-600" />
                    {t('videosTab.editBtn')}
                  </button>
                  <button
                    onClick={() => onDelete(video.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center border border-rose-100"
                    title={t('videosTab.deleteTitle')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}