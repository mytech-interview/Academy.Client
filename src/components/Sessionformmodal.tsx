import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SessionItem } from '../types';

export interface SessionFormValues {
  courseId: number;
  teacherGuid: string;
  maxStudents: number;
  schedule: string;
  location: string;
  isActive?: boolean;
}

interface SessionFormModalProps {
  mode: 'add' | 'edit';
  initial?: SessionItem;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => void;
}

export default function SessionFormModal({ mode, initial, submitting, onClose, onSubmit }: SessionFormModalProps) {
  const [courseId, setCourseId] = useState(initial ? String(initial.courseId ?? 1) : '1');
  const [teacherGuid, setTeacherGuid] = useState(initial?.teacherGuid ?? '1');
  const [maxStudents, setMaxStudents] = useState(initial?.maxStudents ? String(initial.maxStudents) : '30');
  const [schedule, setSchedule] = useState(initial?.schedule ?? 'ორშაბათი, ოთხშაბათი 19:00');
  const [location, setLocation] = useState(initial?.location ?? 'თბილისი, ცენტრალური ფილიალი / ონლაინ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      courseId: Number(courseId) || 1,
      teacherGuid: teacherGuid.trim(),
      maxStudents: Number(maxStudents) || 0,
      schedule: schedule.trim(),
      location: location.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">
            {mode === 'add' ? 'ახალი სესიის დამატება' : 'სესიის რედაქტირება'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          <Field label="აირჩიეთ კურსი">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="styled-input"
            >
              <option value="1">ვებ დეველოპმენტის სრული კურსი (React & Node.js)</option>
              <option value="2">UX/UI დიზაინის საფუძვლები Figma-ში</option>
              <option value="3">ციფრული მარკეტინგი და SEO ოპტიმიზაცია</option>
            </select>
            <p className="text-[11px] text-purple-600 font-medium mt-1.5 flex items-center gap-1">
              <span>💡</span> სესიის სახელი ავტომატურად განისაზღვრება არჩეული კურსის მიხედვით.
            </p>
          </Field>

          <Field label="მიჩენილი ლექტორი">
            <select
              value={teacherGuid}
              onChange={(e) => setTeacherGuid(e.target.value)}
              className="styled-input"
            >
              <option value="1">მარიამ ბერიძე</option>
              <option value="2">გიორგი კალანდაძე</option>
              <option value="3">ნინო შენგელია</option>
            </select>
          </Field>

          <Field label="მაქს. სტუდენტები">
            <input
              type="number"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
              className="styled-input"
            />
          </Field>

          <Field label="განრიგი">
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="მაგ: ორშაბათი, ოთხშაბათი 19:00"
              className="styled-input"
            />
          </Field>

          <Field label="🏢 ქალაქი / ლოკაცია (City)">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="თბილისი, ცენტრალური ფილიალი"
              className="styled-input"
            />
          </Field>

          {/* Action Buttons */}
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
              className="px-7 py-2.5 rounded-2xl text-xs font-bold bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition shadow-md disabled:opacity-50"
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