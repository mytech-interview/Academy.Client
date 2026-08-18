import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, FolderPlus, Inbox, Loader2, Pencil, Plus, Star, Trash2, Users, X } from 'lucide-react';
import { CourseItem } from '../types';

function LoadingState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-rose-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle className="w-6 h-6 text-rose-500" />
      <p className="text-xs font-semibold text-rose-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition"
      >
        თავიდან ცდა
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Inbox className="w-6 h-6" />
      <p className="text-xs font-semibold text-center">{message}</p>
    </div>
  );
}

interface CoursesCategoriesTabProps {
  courses: CourseItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  searchQuery: string;
  onRetry: () => void;
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onAdd: () => void;
  onEdit: (course: CourseItem) => void;
}

// NOTE: GetAllCoursesResponse has no category field at all (only
// AddCourseRequest/UpdateCourseRequest accept a CourseCategoryId when
// writing). So the category chips below are still local-only and NOT
// linked to real courses yet — there's nothing in the read response to
// filter by. Once the backend returns a category on each course, wire
// the filter back up here.
//
// Also: no deleteCourse endpoint exists yet, so the delete button is
// disabled rather than removed, to keep the layout close to the old design.

export default function CoursesCategoriesTab({
  courses,
  loading,
  error,
  categories,
  searchQuery,
  onRetry,
  onAddCategory,
  onRemoveCategory,
  onAdd,
  onEdit,
}: CoursesCategoriesTabProps) {
  const [newCategory, setNewCategory] = useState('');

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [courses, searchQuery]);

  const handleAdd = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-600" />
              კურსების კატეგორიების მართვა
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              დაამატეთ ან წაშალეთ კატეგორიები (ჯერ ლოკალურია — backend-ს კატეგორიების endpoint ჯერ არ აქვს)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ახალი კატეგორია..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 placeholder:text-slate-400"
            />
            <button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-200 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              კატეგორიის დამატება
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <EmptyState message="კატეგორიები ჯერ არ დამატებულა" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200"
              >
                <span>{cat}</span>
                <button onClick={() => onRemoveCategory(cat)} className="text-slate-400 hover:text-red-500 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">კურსების სრული სია</h2>
          <p className="text-xs text-slate-400 mt-0.5">დაამატეთ ან ჩაასწორეთ აკადემიის კურსები</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition"
        >
          <Plus className="w-4 h-4" /> ახალი კურსის დამატება
        </button>
      </div>

      {loading && <LoadingState label="კურსები იტვირთება..." />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          message={searchQuery.trim() ? `კურსი ვერ მოიძებნა: "${searchQuery}"` : 'კურსები ჯერ არ დამატებულა'}
        />
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
            >
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">{c.title}</h3>
                  <span
                    className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg ${
                      c.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.isActive ? 'აქტიური' : 'არააქტიური'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>

                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{c.startDate ? c.startDate.slice(0, 10) : '—'}</span>
                  </div>
                  <span className="font-black text-slate-800 text-xs">{c.price} ₾</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>{c.enrolledStudentsAmount} სტუდენტი</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{c.averageReviewMark.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">{c.lessonsAmount} გაკვეთილი</p>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    კურსის რედაქტირება
                  </button>
                  <button
                    disabled
                    title="deleteCourse endpoint ჯერ არ არსებობს backend-ში"
                    className="bg-rose-50 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center opacity-50 cursor-not-allowed"
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