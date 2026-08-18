import React, { useMemo } from 'react';
import { Calendar, FileText, Plus, Sparkles, Trash2 } from 'lucide-react';
import { MediaItem } from '../types';
import { EmptyState } from './Asyncstates';

interface MediaTabProps {
  media: MediaItem[];
  searchQuery: string;
  onDelete: (id: string) => void;
}

// NOTE: no backend endpoint for the media library yet — local state only.

export default function MediaTab({ media, searchQuery, onDelete }: MediaTabProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return media;
    const q = searchQuery.toLowerCase();
    return media.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
  }, [media, searchQuery]);

  return (
    <>
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <span className="text-lg">📚</span> მედია ბიბლიოთეკა & სასწავლო მასალები
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ატვირთეთ სასწავლო მასალა (PDF, Word დოკუმენტები, წიგნები (ZIP)) და დააკავშირეთ კურსებთან
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition shrink-0">
          <Plus className="w-4 h-4" /> ახალი მასალის ატვირთვა
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={searchQuery.trim() ? `მასალა ვერ მოიძებნა: "${searchQuery}"` : 'მასალები ჯერ არ ატვირთულა'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((mediaItem) => (
            <div key={mediaItem.id} className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-5 flex flex-col min-h-[245px] hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-md">
                  {mediaItem.type} • {mediaItem.size}
                </span>
              </div>
              <div className="mt-4 flex-1">
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">{mediaItem.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">{mediaItem.description}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-start justify-between gap-3 text-[10px] text-slate-500 font-semibold min-h-[42px]">
                  <span className="flex items-start gap-1.5 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{mediaItem.category}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    {mediaItem.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition">
                    ⇩ გადმოწერა
                  </button>
                  <button
                    onClick={() => onDelete(mediaItem.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2 rounded-xl transition flex items-center justify-center border border-rose-100"
                    title="წაშლა"
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