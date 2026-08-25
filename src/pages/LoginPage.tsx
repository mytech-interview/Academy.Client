import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { createOtp } from '../api/authApi';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    lang,
    setOtpMode,
    setOtpEmail, setOtpPassword,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  if (!email || !password) { setError(t('auth.errors.fieldRequired')); return; }

  setLoading(true);
  try {
    const res = await createOtp({ email, password });

    // проверяем поля ошибки в теле ответа
    if (res?.errorCode && res.errorCode !== 0) {
      setError('ავტორიზაცია ვერ მოხერხდა. გთხოვთ, შეამოწმოთ ელფოსტა და პაროლი.');
      return; // не переходим на /otp
    }

    setOtpMode('login');
    setOtpEmail(email.toLowerCase());
    setOtpPassword(password);
    navigate('/otp');
  } catch {
    setError('ავტორიზაცია ვერ მოხერხდა. გთხოვთ, შეამოწმოთ ელფოსტა და პაროლი.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/8 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px]"
      >
        <div className="bg-white rounded-[2.25rem] border border-slate-100/90 shadow-[0_32px_64px_-12px_rgba(30,41,59,0.14)] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />
          <div className="p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                <GraduationCap className="h-7 w-7 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('auth.titleLogin')}</h1>
              <p className="mt-2 text-xs text-slate-500 font-medium">{t('auth.subtitleLogin')}</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-2xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-bold text-rose-700 flex items-center gap-2.5"
              >
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com" required
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-11 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest mt-2 disabled:opacity-60"
              >
                {loading
                  ? (lang === 'ka' ? 'კოდის გაგზავნა...' : lang === 'ru' ? 'Отправка кода...' : 'Sending code...')
                  : (lang === 'ka' ? 'გაგრძელება →' : lang === 'ru' ? 'Продолжить →' : 'Continue →')}
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-slate-500 border-t border-slate-100 pt-5 font-medium">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-5">
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">
            ← {lang === 'ka' ? 'მთავარ გვერდზე' : lang === 'ru' ? 'На главную' : 'Back to home'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}