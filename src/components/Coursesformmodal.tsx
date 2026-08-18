import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { CourseItem } from '../types';

export interface CourseFormValues {
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
  const [category, setCategory] = useState(initial?.categoryId ? String(initial.categoryId) : '1');
  const [level, setLevel] = useState('1');
  const [lecturer, setLecturer] = useState('1');
  const [price, setPrice] = useState(initial ? (initial.price === 0 ? 'უფასო' : String(initial.price)) : 'უფასო');
  const [startDate, setStartDate] = useState(toDateInputValue(initial?.startDate) || '2026-09-15');
  const [endDate, setEndDate] = useState(toDateInputValue(initial?.endDate) || '2026-12-25');
  const [format, setFormat] = useState('hybrid');
  const [city, setCity] = useState('თბილისი');
  const [status, setStatus] = useState('ongoing');
  const [guide, setGuide] = useState('აკადემიის LMS პლატფორმის გამოყენების ინსტრუქცია...');
  const [picture, setPicture] = useState(initial?.pictureUrl ?? 'https://images.unsplash.com/...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('შეავსეთ სავალდებულო ველები: სათაური და აღწერა.');
      return;
    }

    const parsedPrice = price === 'უფასო' || price === '' ? 0 : Number(price) || 0;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseCategoryId: Number(category) || 1,
      courseEntryLevelId: Number(level) || 1,
      price: parsedPrice,
      maxStudents: initial?.maxStudents ?? 20,
      ...(mode === 'edit'
        ? {
            startDate,
            endDate,
            picture: picture.trim(),
            isActive: status === 'ongoing',
          }
        : {}),
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
                : 'კურსის მონაცემების, თარიღების და სილაბუსის განახლება'}
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
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="styled-input">
                <option value="1">პროგრამირება</option>
                <option value="2">დიზაინი</option>
                <option value="3">მარკეტინგი</option>
              </select>
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
            <Field label="მიჩენილი ლექტორი">
              <select value={lecturer} onChange={(e) => setLecturer(e.target.value)} className="styled-input">
                <option value="1">მარიამ ბერიძე (m.beridze@academy.ge)</option>
                <option value="2">გიორგი გელაშვილი (g.gelashvili@academy.ge)</option>
              </select>
            </Field>

            <Field label="ფასი">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="უფასო"
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
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="styled-input bg-white"
                  />
                </Field>
                <Field label="დასრულების თარიღი (End Date)">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="styled-input bg-white"
                  />
                </Field>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="კურსის ფორმატი">
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="styled-input">
                <option value="hybrid">🏢 / 🌐 ჰიბრიდული (Hybrid)</option>
                <option value="online">🌐 ონლაინ (Online)</option>
                <option value="offline">🏢 აუდიტორიაში (Offline)</option>
              </select>
            </Field>

            <Field label="მდებარეობა / ქალაქი">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="styled-input"
              />
            </Field>
          </div>

          <Field label="კურსის სტატუსი (დინამიური)">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="styled-input">
              <option value="ongoing">🟢 მიმდინარე (Ongoing)</option>
              <option value="planned">🟡 დაგეგმილი (Planned)</option>
              <option value="completed">🔴 დასრულებული (Completed)</option>
            </select>
          </Field>

          <Field label="სტუდენტის გზამკვლევი (Process Guide)">
            <textarea
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              rows={2}
              className="styled-input resize-y"
            />
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