import React from 'react';
import { CheckCircle2, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { AVATAR_OPTIONS, avatarUrl } from '../lib/avatars';
import { PHONE_REGEX, PHONE_MAX_LENGTH } from '../constants/validation';

interface StudentProfileTabProps {
  student: User;
  profName: string;
  setProfName: (val: string) => void;
  profEmail: string;
  setProfEmail: (val: string) => void;
  profPhone: string;
  setProfPhone: (val: string) => void;
  profHeadline: string;
  setProfHeadline: (val: string) => void;
  profBio: string;
  setProfBio: (val: string) => void;
  profAvatar: string;
  setProfAvatar: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  profileSuccess: boolean;
  profileSaving?: boolean;
  profileError?: string;
}

export const StudentProfileTab: React.FC<StudentProfileTabProps> = ({
  student,
  profName,
  setProfName,
  profEmail,
  setProfEmail,
  profPhone,
  setProfPhone,
  profHeadline,
  setProfHeadline,
  profBio,
  setProfBio,
  profAvatar,
  setProfAvatar,
  onSubmit,
  profileSuccess,
  profileSaving = false,
  profileError = ''
}) => {
  const { t } = useTranslation();

  const activeAvatarOption = AVATAR_OPTIONS.find(
    (opt) => avatarUrl(opt.seed, opt.bg) === profAvatar
  ) || AVATAR_OPTIONS[0];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Пропускаем только разрешённые символы, остальное отсекаем на лету
    const raw = e.target.value.replace(/[^0-9\s+-]/g, '');
    setProfPhone(raw.slice(0, PHONE_MAX_LENGTH));
  };

  const isPhoneValid = PHONE_REGEX.test(profPhone);

  return (
    <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm animate-fade-in text-left max-w-4xl mx-auto">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
          {t('studentDashboard.profEditTitle', 'პირადი პროფილის პარამეტრები')}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            {t('studentDashboard.fullNameLabel', 'სახელი და გვარი')}
          </label>
          <input
            type="text"
            value={profName}
            onChange={(e) => setProfName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            {t('studentDashboard.emailLabel', 'ელ-ფოსტა')}
          </label>
          <input
            type="email"
            value={profEmail}
            onChange={(e) => setProfEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            {t('studentDashboard.phoneLabel', 'ტელეფონის ნომერი')}
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={profPhone}
            onChange={handlePhoneChange}
            maxLength={PHONE_MAX_LENGTH}
            placeholder="+995..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
            required
          />
          {profPhone && !isPhoneValid && (
            <p className="text-xs font-semibold text-slate-400">
              {t('studentDashboard.phoneInvalid', 'შეიყვანეთ ვალიდური ტელეფონის ნომერი')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            {t('studentDashboard.headlineLabel', 'სათაური / ინტერესები')}
          </label>
          <input
            type="text"
            value={profHeadline}
            onChange={(e) => setProfHeadline(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition"
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              {t('studentDashboard.avatarSelectLabel', 'ავატარის არჩევა (18 აბსტრაქტული სტილი)')}
            </label>
            <span className="text-xs font-bold text-indigo-600">
              {activeAvatarOption.label}
            </span>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((opt) => {
                const url = avatarUrl(opt.seed, opt.bg);
                const isSelected = profAvatar === url;

                return (
                  <button
                    key={opt.seed}
                    type="button"
                    onClick={() => setProfAvatar(url)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-4 ring-indigo-500/20 scale-105 shadow-md bg-white'
                        : 'border-transparent hover:border-slate-300 bg-white/80 hover:bg-white'
                    }`}
                  >
                    <img
                      src={url}
                      alt={opt.label}
                      className="h-full w-full object-contain rounded-xl"
                    />

                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-900/30 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              readOnly
              value={profAvatar || avatarUrl(activeAvatarOption.seed, activeAvatarOption.bg)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-500 selection:bg-indigo-100"
            />
          </div>
        </div>

        {profileError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            {profileError}
          </div>
        )}

        {profileSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            {t('studentDashboard.profileSavedSuccess', 'პროფილი წარმატებით განახლდა')}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={profileSaving || !isPhoneValid}
            className="rounded-2xl bg-[#5842F8] hover:bg-[#4832E6] px-8 py-3.5 text-xs font-extrabold text-white transition duration-200 active:scale-[0.98] shadow-md shadow-indigo-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {profileSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {t('studentDashboard.saveChangesBtn', 'შენახვა')}
          </button>
        </div>
      </form>
    </div>
  );
};