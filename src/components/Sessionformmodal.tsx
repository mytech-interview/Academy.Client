import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SessionItem } from '../types';

export interface SessionFormValues {
  courseId: number;
  teacherGuid: string;
  weeks: number;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  cityId: number;
  attendanceModeId: number;
  isActive: boolean;
}

interface SessionFormModalProps {
  mode: 'add' | 'edit';
  initial?: SessionItem;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => void;
}

function toDateInputValue(iso: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export default function SessionFormModal({ mode, initial, submitting, onClose, onSubmit }: SessionFormModalProps) {
  const [courseId, setCourseId] = useState(initial ? String(initial.courseId) : '');
  const [teacherGuid, setTeacherGuid] = useState(initial?.teacherGuid ?? '');
  const [weeks, setWeeks] = useState('4');
  const [startDate, setStartDate] = useState(initial ? toDateInputValue(initial.startDate) : '');
  const [endDate, setEndDate] = useState(initial ? toDateInputValue(initial.endDate) : '');
  const [cityId, setCityId] = useState('0');
  const [attendanceModeId, setAttendanceModeId] = useState('0');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId.trim() || !teacherGuid.trim() || !startDate || !endDate) {
      alert('შეავსეთ სავალდებულო ველები: კურსის ID, ლექტორის GUID, დაწყების და დასრულების თარიღები.');
      return;
    }

    onSubmit({
      courseId: Number(courseId),
      teacherGuid: teacherGuid.trim(),
      weeks: Number(weeks) || 0,
      startDate,
      endDate,
      cityId: Number(cityId) || 0,
      attendanceModeId: Number(attendanceModeId) || 0,
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-base">
            {mode === 'add' ? 'ახალი სესიის დამატება' : 'სესიის რედაქტირება'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="კურსის ID *">
            <input
              type="number"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="input"
              required
            />
          </Field>

          <Field label="ლექტორის GUID * (TODO: ჯერ არ არსებობს ლექტორის picker — backend-მა GetAllTeachers-ში UserGuid უნდა დააბრუნოს)">
            <input
              type="text"
              value={teacherGuid}
              onChange={(e) => setTeacherGuid(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              className="input"
              required
            />
          </Field>

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

          <div className="grid grid-cols-3 gap-3">
            <Field label="კვირები">
              <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="input" />
            </Field>
            <Field label="ქალაქის ID">
              <input type="number" value={cityId} onChange={(e) => setCityId(e.target.value)} className="input" />
            </Field>
            <Field label="დასწრების რეჟიმის ID">
              <input
                type="number"
                value={attendanceModeId}
                onChange={(e) => setAttendanceModeId(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          {mode === 'edit' && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              აქტიურია
            </label>
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