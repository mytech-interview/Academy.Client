import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { createOtpRegistration } from '../api/authApi';

const GEORGIA_PREFIX = '+995';
const PHONE_DIGITS_LENGTH = 9; // например, 5XX XXX XXX для Грузии
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, setOtpEmail, setOtpPassword, setOtpRole, setOtpName, setOtpFirstName, setOtpLastName, setOtpTelephone, setOtpMode } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telephone, setTelephone] = useState(GEORGIA_PREFIX);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/[^\d+]/g, '');

    if (value.includes('+')) {
      value = '+' + value.replace(/\+/g, '');
    }

    // Maximum 15 digits after +
    const digits = value.replace(/\D/g, '').slice(0, 15);

    setTelephone('+' + digits);
  };

  const handlePhoneFocus = () => {
    if (!telephone) setTelephone(GEORGIA_PREFIX);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // запрещаем стирать сам префикс +995 через backspace/delete
    const input = e.currentTarget;
    const caret = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;

    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      caret <= GEORGIA_PREFIX.length &&
      selectionEnd <= GEORGIA_PREFIX.length
    ) {
      e.preventDefault();
    }
  };

  const phoneDigitsCount = telephone.replace(GEORGIA_PREFIX, '').length;
  const isPhoneValid = PHONE_REGEX.test(telephone);

  // Маппинг известных ошибок бэкенда на грузинский
  const mapErrorToGeorgian = (res: any): string => {
    const raw = (res?.errMsg || res?.errorCode || '').toString().toLowerCase();

    if (raw.includes('already') || raw.includes('exist') || raw.includes('duplicate')) {
      return 'ამ ელ-ფოსტით მომხმარებელი უკვე რეგისტრირებულია';
    }
    if (raw.includes('email')) {
      return 'ელ-ფოსტის მისამართი არასწორია';
    }
    if (raw.includes('phone') || raw.includes('telephone')) {
      return 'ტელეფონის ნომერი არასწორია';
    }
    if (raw.includes('password')) {
      return 'პაროლი არ აკმაყოფილებს მოთხოვნებს';
    }
    if (raw.includes('network') || raw.includes('timeout')) {
      return 'კავშირის შეცდომა, სცადეთ თავიდან';
    }

    // Дефолтная ошибка — вместо необработанного текста с бэкенда
    return 'რეგისტრაცია ვერ მოხერხდა, სცადეთ თავიდან';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !telephone) {
      setError('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    if (!isPhoneValid) {
      setError('ტელეფონის ნომერი უნდა იყოს საერთაშორისო ფორმატში, მაგალითად: +995555123456');
      return;
    }

    if (password.length < 6) {
      setError('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
      return;
    }

    setLoading(true);

    try {
      const res = await createOtpRegistration({
        email,
        password
      });

      if (!res || res.errorCode) {
        setError(mapErrorToGeorgian(res));
        setLoading(false);
        return;
      }

      const roleId = 1;

      setOtpEmail(email.toLowerCase());
      setOtpPassword(password);
      setOtpMode('register');
      setOtpRole(roleId);
      setOtpName(`${firstName} ${lastName}`);
      setOtpFirstName(firstName);
      setOtpLastName(lastName);
      setOtpTelephone(telephone);

      navigate('/otp');
    } catch {
      setError('რეგისტრაცია ვერ მოხერხდა, სცადეთ თავიდან');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-[440px]">
        <div className="bg-white rounded-[2.25rem] border border-slate-100/90 shadow-[0_32px_64px_-12px_rgba(30,41,59,0.14)] overflow-hidden">

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                <ShieldCheck className="h-7 w-7 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('auth.titleRegister')}</h1>
              <p className="mt-2 text-xs text-slate-500 font-medium">{t('auth.subtitleRegister')}</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-5 rounded-2xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-bold text-rose-700 flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">სახელი</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='სახელი' required className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
              </div>
              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">გვარი</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='გვარი' required className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
              </div>
              {/* Telephone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">ტელეფონის ნომერი</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={telephone}
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    placeholder="+995 5XX XX XX XX"
                    required
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 pl-1">{phoneDigitsCount}/{PHONE_DIGITS_LENGTH} ციფრი</p>
              </div>
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-11 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest mt-2 disabled:opacity-60">
                {loading ? t('auth.sending') : t('auth.submitContinue')}
              </button>
            </form>
            <p className="mt-7 text-center text-xs text-slate-500 border-t border-slate-100 pt-5 font-medium">
              {t('auth.hasAccount')}{' '}<Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition">{t('auth.loginLink')}</Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-5">
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">← {lang === 'ka' ? 'მთავარ გვერდზე' : 'Back to home'}</Link>
        </div>
      </motion.div>
    </div>
  );
}