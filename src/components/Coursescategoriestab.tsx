import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  FolderPlus,
  Inbox,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { CourseItem } from '../types';

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

function LoadingState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-12 border border-rose-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
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
    <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Inbox className="w-6 h-6" />
      <p className="text-xs font-semibold text-center">{message}</p>
    </div>
  );
}

// ── Обновленное модальное окно подтверждения удаления ──
function DeleteConfirmModal({
  courseTitle,
  onClose,
  onConfirm,
}: {
  courseTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-sm">წაშლის დადასტურება</h3>
            <p className="text-xs text-slate-500 mt-0.5">ეს მოქმედება შეუქცევადია.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed text-center">
          დარწმუნებული ხართ რომ გსურთ წაშალოთ: <br />
          <strong className="font-bold text-rose-600">{`"${courseTitle}"`}</strong>?
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition text-slate-700"
          >
            გაუქმება
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" /> წაშლა
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Обновленное модальное окно прикрепленных уроков ──
function LessonsModal({
  courseTitle,
  onClose,
}: {
  courseTitle: string;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');

  const sampleLessons = [
    { id: '1', title: 'გაკვეთილი #1: HTML5 & CSS3 სემანტიკა და Flexbox', desc: 'სემანტიკური ტეგები, flexbox განლაგება და responsive დიზაინი.', duration: 'ვიდეო (45 წთ)', checked: true },
    { id: '2', title: 'გაკვეთილი #2: JavaScript ES6+ Async/Await და API Calls', desc: 'Promises, Async/Await, Fetch API და მონაცემების დამუშავება.', duration: 'ვიდეო (60 წთ)', checked: true },
    { id: '3', title: 'გაკვეთილი #3: React.js Component Architecture & Hooks', desc: 'useState, useEffect, custom hooks და კომპონენტების ოპტიმიზაცია.', duration: 'ვიდეო (50 წთ)', checked: true },
    { id: '4', title: 'გაკვეთილი #4: State Management & Context API', desc: 'გლობალური მდგომარეობის მართვა პროექტში.', duration: 'სტატია (40 წთ)', checked: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
              მიმაგრებული გაკვეთილების არჩევა
            </span>
            <h3 className="font-bold text-slate-800 text-sm mt-2">{courseTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              მონიშნეთ გაკვეთილები, რომლებიც უნდა შედიოდეს ამ კურსის პროგრამაში
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ძიება გაკვეთილების ბანკში..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
          <span>არჩეულია 3 გაკვეთილი</span>
          <button className="text-purple-600 hover:underline flex items-center gap-1 font-semibold">
            <Plus className="w-3.5 h-3.5" /> ახალი გაკვეთილის შექმნა
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {sampleLessons.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-3 hover:border-purple-200 transition"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="mt-0.5 w-4 h-4 accent-purple-600 rounded border-slate-300"
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                {item.duration}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            დასრულება / შენახვა
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<CourseItem | null>(null);
  const [selectedCourseForDelete, setSelectedCourseForDelete] = useState<CourseItem | null>(null);

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
      {/* ── Блок управления категориями ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-600" />
              კურსების კატეგორიები
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ააკადემიის არსებული კატეგორიების ჩამონათვალი და ახლის დამატება
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

        <div className="flex flex-wrap gap-2 pt-2">
          <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-sm">
            ყველა
          </button>
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-200 transition"
            >
              <span>{cat}</span>
              <button onClick={() => onRemoveCategory(cat)} className="text-slate-400 hover:text-rose-500 transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Блок заголовка списка ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            კურსების სრული სია
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">დაამატეთ, ჩაასწორეთ ან წაშალეთ აკადემიის კურსები</p>
        </div>

        <button
          onClick={onAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> ახალი კურსის დამატება
        </button>
      </div>

      {/* ── Состояния загрузки и ошибок ── */}
      {loading && <LoadingState label="კურსები იტვირთება..." />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          message={searchQuery.trim() ? `კურსი ვერ მოიძებნა: "${searchQuery}"` : 'კურსები ჯერ არ დამატებულა'}
        />
      )}

      {/* ── Сетка карточек курсов ── */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition duration-200"
            >
              {/* Превью / Баннер курса */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={c.picture || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800'}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-xl">
                  პროგრამირება
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-sm">
                  {c.price ? `${c.price} ₾` : 'უფასო'}
                </div>
              </div>

              {/* Содержимое карточки */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{c.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>

                {/* Мета-информация */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-xl">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{c.startDate ? c.startDate.slice(0, 10) : '15 სექტემბერი'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                      მიმდინარე
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-600">
                        МБ
                      </div>
                      <span className="font-semibold text-xs text-slate-700">მარიამ ბერიძე</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{c.averageReviewMark ? c.averageReviewMark.toFixed(1) : '4.8'}</span>
                    </div>
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-purple-50/60 border border-purple-100/80 p-2 rounded-xl">
                    <span className="block text-[10px] text-purple-600 font-semibold">გაკვეთილები</span>
                    <span className="font-extrabold text-purple-700">{c.lessonsAmount ?? 5}</span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-2 rounded-xl">
                    <span className="block text-[10px] text-emerald-600 font-semibold">სტუდენტები</span>
                    <span className="font-extrabold text-emerald-700">{c.enrolledStudentsAmount ?? 143}</span>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourseForLessons(c)}
                    title="გაკვეთილების მართვა"
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(c)}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    რედაქტირება
                  </button>
                  <button
                    onClick={() => setSelectedCourseForDelete(c)}
                    title="წაშლა"
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалоги / Модальные окна */}
      {selectedCourseForLessons && (
        <LessonsModal
          courseTitle={selectedCourseForLessons.title}
          onClose={() => setSelectedCourseForLessons(null)}
        />
      )}

      {selectedCourseForDelete && (
        <DeleteConfirmModal
          courseTitle={selectedCourseForDelete.title}
          onClose={() => setSelectedCourseForDelete(null)}
          onConfirm={() => {
            setSelectedCourseForDelete(null);
          }}
        />
      )}
    </>
  );
}