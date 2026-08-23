import React, { useState, useEffect } from 'react';
import { X, Key, Upload, Dice5 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StudentItem } from '../types';

export interface StudentFormValues {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password?: string;
  role?: string;
  title?: string;
  bio?: string;
  picture?: string;
  isActive: boolean;
}

interface StudentFormModalProps {
  initial?: StudentItem | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => void;
}

export default function StudentFormModal({
  initial,
  submitting,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Student');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState('');

  useEffect(() => {
    if (initial) {
      setFullName(initial.name || '');
      setEmail(initial.email || '');
      setPhone(initial.phone || '');
      setTitle(initial.role || '');
      setPicture(initial.picture || '');
    }
  }, [initial]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    onSubmit({
      studentId: initial?.userId ?? 0,
      firstName,
      lastName,
      email,
      telephone: phone,
      password,
      role,
      title,
      bio,
      picture,
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">{t('studentsModal.editTitle')}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4 max-h-[80vh] overflow-y-auto pr-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('studentsModal.fullName')}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('studentsModal.fullNamePlaceholder')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('studentsModal.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('studentsModal.emailPlaceholder')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('studentsModal.phone')}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('studentsModal.phonePlaceholder')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('studentsModal.bio')}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('studentsModal.bioPlaceholder')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                {t('studentsModal.avatarLabel')}
              </label>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {t('studentsModal.customPhoto')}
              </span>
            </div>
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl overflow-hidden shrink-0">
                  {picture ? (
                    <img src={picture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    '🤖'
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition">
                    <Upload className="w-4 h-4" /> {t('studentsModal.uploadBtn')}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    {t('studentsModal.fileHint')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
            >
              {t('studentsModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition disabled:opacity-50"
            >
              {submitting ? t('studentsModal.saving') : t('studentsModal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}