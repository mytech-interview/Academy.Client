import React, { useState, useEffect } from 'react';
import { X, Key, Dice5 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LecturerItem } from '../types';

interface LecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<LecturerItem>) => void;
  initialData?: LecturerItem | null;
}

export default function LecturerModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LecturerModalProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+995 ',
    role: 'Teacher / Lecturer',
    avatarBg: 'bg-purple-600',
    avatarIcon: '🎓',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        phone: (initialData as any).phone || '+995 ',
        role: initialData.role || 'Teacher / Lecturer',
        avatarBg: initialData.avatarBg || 'bg-purple-600',
        avatarIcon: initialData.avatarIcon || '🎓',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '+995 ',
        role: 'Teacher / Lecturer',
        avatarBg: 'bg-purple-600',
        avatarIcon: '🎓',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Генерация случайного 6-значного пароля
  const generatePassword = () => {
    const randomPass = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData((prev) => ({ ...prev, password: randomPass }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-xl font-black text-slate-800">
            {initialData ? t('lecturersModal.editTitle') : t('lecturersModal.addTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              {t('lecturersModal.fullName')}
            </label>
            <input
              type="text"
              required
              placeholder="Giorgi Beridze"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 transition text-slate-800 placeholder-slate-300"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              {t('lecturersModal.email')}
            </label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 transition text-slate-800 placeholder-slate-300"
            />
          </div>

          {/* Password Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                {t('lecturersModal.password')}
              </label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs font-black text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
              >
                <Dice5 className="w-3.5 h-3.5" />
                {t('lecturersModal.randomPassword')}
              </button>
            </div>
            <input
              type="text"
              placeholder="123456"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 transition text-purple-900 font-bold placeholder-slate-300 bg-purple-50/30"
            />
            <p className="text-[11px] text-slate-400">
              {t('lecturersModal.passwordHint')}
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              {t('lecturersModal.phone')}
            </label>
            <input
              type="text"
              placeholder="+995 599 12 34 56"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 transition text-slate-800 placeholder-slate-300"
            />
          </div>

          {/* Avatar / Photo selection section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700">
                {t('lecturersModal.avatarLabel')}
              </label>
              <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                {t('lecturersModal.lecturerBadge')}
              </span>
            </div>
            <input
              type="text"
              placeholder="https://..."
              value={formData.avatarIcon}
              onChange={(e) => setFormData({ ...formData, avatarIcon: e.target.value })}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-purple-500 transition text-slate-800 placeholder-slate-300"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              {t('lecturersModal.cancel')}
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-200 transition"
            >
              {t('lecturersModal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}