import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CourseItem } from '../types';

export interface CourseFormValues {
  title: string;
  description: string;
  courseCategoryId: number;
  courseEntryLevelId: number;
  price: number;
  maxStudents: number;
  // edit-only fields (backend's UpdateCourseRequest asks for these, AddCourseRequest doesn't)
  startDate?: string;
  endDate?: string;
  picture?: string;
  isActive?: boolean;
}

interface CourseFormModalProps {
  mode: 'add' | 'edit';
  initial?: CourseItem;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => void;
}

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export default function CourseFormModal({ mode, initial, submitting, onClose, onSubmit }: CourseFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [courseCategoryId, setCourseCategoryId] = useState('0');
  const [courseEntryLevelId, setCourseEntryLevelId] = useState('0');
  const [price, setPrice] = useState(initial ? String(initial.price) : '0');
  const [maxStudents, setMaxStudents] = useState('0');
  const [startDate, setStartDate] = useState(toDateInputValue(initial?.startDate));
  const [endDate, setEndDate] = useState('');
  const [picture, setPicture] = useState('');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('შეავსეთ სავალდებულო ველები: სათაური და აღწერა.');
      return;
    }

    if (mode === 'edit' && (!startDate || !endDate)) {
      alert('რედაქტირებისას სავალდებულოა დაწყების და დასრულების თარიღები.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseCategoryId: Number(courseCategoryId) || 0,
      courseEntryLevelId: Number(courseEntryLevelId) || 0,
      price: Number(price) || 0,
      maxStudents: Number(maxStudents) || 0,
      ...(mode === 'edit'
        ? {
            startDate,
            endDate,
            picture: picture.trim(),
            isActive,
          }
        : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-base">
            {mode === 'add' ? 'ახალი კურსის დამატება' : 'კურსის რედაქტირება'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="სათაური *">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
          </Field>

          <Field label="აღწერა *">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input resize-y"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="კატეგორიის ID">
              <input
                type="number"
                value={courseCategoryId}
                onChange={(e) => setCourseCategoryId(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="დონის ID (Entry Level)">
              <input
                type="number"
                value={courseEntryLevelId}
                onChange={(e) => setCourseEntryLevelId(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="ფასი">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
            </Field>
            <Field label="მაქს. სტუდენტები">
              <input
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          {mode === 'edit' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="დაწყების თარიღი *">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                    required
                  />
                </Field>
                <Field label="დასრულების თარიღი *">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                    required
                  />
                </Field>
              </div>

              <Field label="სურათის URL">
                <input type="text" value={picture} onChange={(e) => setPicture(e.target.value)} className="input" />
              </Field>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                აქტიურია
              </label>
            </>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition"
            >
              {submitting ? 'ინახება...' : mode === 'add' ? 'დამატება' : 'შენახვა'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              გაუქმება
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #a855f7;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}