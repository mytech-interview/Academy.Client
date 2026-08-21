import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { CourseItem } from '../types';

export interface CourseCategoryOption {
  id: number;
  name: string;
}

export interface CourseFormValues {
  courseId?: number; // нужен для update — без него бэкенд не знает, какой курс редактировать
  title: string;
  description: string;
  courseCategoryId: number;
  courseEntryLevelId: number;
  price: number;
  maxStudents: number;
  startDate?: string;
  endDate?: string;
  picture?: string;
  isActive?: boolean;
}

interface CourseFormModalProps {
  mode: 'add' | 'edit';
  initial?: CourseItem;
  submitting?: boolean;
  categories: CourseCategoryOption[];
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => void;
}

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

// NOTE: `format`, `city`, `guide` fields were removed — they were never part
// of CourseFormValues and were never actually submitted anywhere (dead UI).
// The `lecturer` select was also removed: courses aren't assigned a teacher
// in AddCourseRequestDto/UpdateCourseRequestDto — teachers get assigned per
// *session*, not per course (see SessionFormModal / teacherGuid there).
// If it turns out courses DO need a teacher field, confirm the DTO first —
// don't re-add a hardcoded list.
export default function CourseFormModal({
  mode,
  initial,
  submitting,
  categories,
  onClose,
  onSubmit,
}: CourseFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(
    initial?.categoryId ? String(initial.categoryId) : String(categories[0]?.id ?? '')
  );
  // TODO(api): no confirmed CourseEntryLevels lookup table/endpoint seen yet
  // (unlike Categories, which we verified against the DB). Keeping this as
  // a manual field until that's confirmed — don't treat these labels as real.
  const [level, setLevel] = useState('1');
  const [price, setPrice] = useState(initial ? (initial.price === 0 ? 'უფასო' : String(initial.price)) : 'უფასო');
  const [maxStudents, setMaxStudents] = useState(
    initial?.maxStudents != null ? String(initial.maxStudents) : '20'
  );
  const [startDate, setStartDate] = useState(toDateInputValue(initial?.startDate) || '2026-09-15');
  const [endDate, setEndDate] = useState(toDateInputValue(initial?.endDate) || '2026-12-25');
  const [status, setStatus] = useState(initial?.isActive === false ? 'completed' : 'ongoing');
  const [picture, setPicture] = useState(
    initial?.pictureUrl ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('შეავსეთ სავალდებულო ველები: სათაური და აღწერა.');
      return;
    }

    if (!category) {
      alert('აირჩიეთ კატეგორია.');
      return;
    }

    const parsedPrice = price === 'უფასო' || price === '' ? 0 : Number(price) || 0;
    const parsedMaxStudents = Number(maxStudents) || 0;

    onSubmit({
      ...(mode === 'edit' && initial ? { courseId: initial.id } : {}),
      title: title.trim(),
      description: description.trim(),
      courseCategoryId: Number(category),
      courseEntryLevelId: Number(level) || 1,
      price: parsedPrice,
      maxStudents: parsedMaxStudents,
      ...(mode === 'edit'
        ? {
            startDate,
            endDate,
            picture: picture.trim(),
            isActive: status === 'ongoing',
          }
        : {
            picture: picture.trim(),
          }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-slate-100 bg-white">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {mode === 'add' ? 'ახალი კურსის დამატება' : 'კურსის რედაქტირება'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {mode === 'add'
                ? 'ახალი კურსის ძირითადი ინფორმაციის შევსება'
                : 'კურსის მონაცემების და თარიღების განახლება'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 overflow-y-auto flex-1 text-slate-800">
          <Field label="კურსის დასახელება">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="მაგ: Full-Stack Web Development"
              className="styled-input"
              required
            />
          </Field>

          <Field label="აღწერა">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="კურსის მოკლე აღწერა..."
              rows={3}
              className="styled-input resize-y min-h-[80px]"
              required
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="კატეგორია">
              {categories.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-2">კატეგორიები არ არის ჩატვირთული</p>
              ) : (
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="styled-input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="დონე">
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="styled-input">
                <option value="1">დამწყები / Beginner</option>
                <option value="2">საშუალო / Intermediate</option>
                <option value="3">მაღალი / Advanced</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="ფასი">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="უფასო"
                className="styled-input"
              />
            </Field>

            <Field label="სტუდენტების მაქსიმალური რაოდენობა">
              <input
                type="number"
                min={0}
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                placeholder="20"
                className="styled-input"
              />
            </Field>
          </div>

          {/* Special date box in Edit mode */}
          {mode === 'edit' && (
            <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>თარიღების მართვა (რედაქტირების რეჟიმი)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="დაწყების თარიღი (Start Date)">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="styled-input bg-white"
                  />
                </Field>
                <Field label="დასრულების თარიღი (End Date)">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="styled-input bg-white"
                  />
                </Field>
              </div>
            </div>
          )}

          <Field label="კურსის სტატუსი">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="styled-input">
              <option value="ongoing">🟢 მიმდინარე (Ongoing)</option>
              <option value="completed">🔴 დასრულებული (Completed)</option>
            </select>
          </Field>

          <Field label="გარეკანის ფოტო (URL)">
            <input
              type="text"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              className="styled-input"
            />
          </Field>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-2xl text-xs font-bold bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition shadow-md disabled:opacity-50"
            >
              {submitting ? 'ინახება...' : 'შენახვა'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .styled-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.85rem;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .styled-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-800">{label}</label>
      {children}
    </div>
  );
}