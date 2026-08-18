import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SessionItem } from '../types';

export interface SessionFormValues {
  courseId: number;
  teacherGuid: string;
  weeks: number; // backend type is byte — keep 0-255
  startDate: string; // ISO date
  endDate: string; // ISO date
  cityId: number;
  attendanceModeId: number;
  isActive?: boolean;
}

interface SessionFormModalProps {
  mode: 'add' | 'edit';
  initial?: SessionItem;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => void;
}

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export default function SessionFormModal({ mode, initial, submitting, onClose, onSubmit }: SessionFormModalProps) {
  const [courseId, setCourseId] = useState(initial ? String(initial.courseId ?? 1) : '1');
  const [teacherGuid, setTeacherGuid] = useState(initial?.teacherGuid ?? '1');
  const [weeks, setWeeks] = useState(initial?.weeks ? String(initial.weeks) : '8');
  const [startDate, setStartDate] = useState(toDateInputValue(initial?.startDate) || '2026-09-15');
  const [endDate, setEndDate] = useState(toDateInputValue(initial?.endDate) || '2026-11-15');
  const [cityId, setCityId] = useState(initial?.cityId ? String(initial.cityId) : '1');
  const [attendanceModeId, setAttendanceModeId] = useState(
    initial?.attendanceModeId ? String(initial.attendanceModeId) : '1'
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeeks = Math.min(255, Math.max(0, Number(weeks) || 0));

    onSubmit({
      courseId: Number(courseId) || 1,
      teacherGuid: teacherGuid.trim(),
      weeks: parsedWeeks,
      startDate,
      endDate,
      cityId: Number(cityId) || 1,
      attendanceModeId: Number(attendanceModeId) || 1,
      ...(mode === 'edit' ? { isActive } : {}),
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="ხანგრძლივობა (კვირები)">
              <input
                type="number"
                min={0}
                max={255}
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="styled-input"
              />
            </Field>

            <Field label="დასწრების ფორმატი">
              <select
                value={attendanceModeId}
                onChange={(e) => setAttendanceModeId(e.target.value)}
                className="styled-input"
              >
                <option value="1">🏢 / 🌐 ჰიბრიდული (Hybrid)</option>
                <option value="2">🌐 ონლაინ (Online)</option>
                <option value="3">🏢 აუდიტორიაში (Offline)</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="დაწყების თარიღი">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="styled-input"
              />
            </Field>
            <Field label="დასრულების თარიღი">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="styled-input"
              />
            </Field>
          </div>

          <Field label="🏢 ქალაქი (City)">
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="styled-input">
              <option value="1">თბილისი</option>
              <option value="2">ბათუმი</option>
              <option value="3">ქუთაისი</option>
            </select>
          </Field>

          {mode === 'edit' && (
            <Field label="სტატუსი">
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="styled-input"
              >
                <option value="active">🟢 აქტიური</option>
                <option value="inactive">🔴 დასრულებული</option>
              </select>
            </Field>
          )}

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