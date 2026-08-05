import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { validateOtp, registerUser } from '../api/authApi';
import { User } from '../types';

const OTP_LEN = 6;
const RESEND_SEC = 60;

export default function OtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    lang,
    otpMode, otpPendingUser,
    otpEmail, otpPassword, otpRole, otpName,
    otpFirstName, otpLastName, otpTelephone,
    handleLoginSuccess, handleRegisterUser,
  } = useApp();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SEC);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Guard: no email = navigated here directly
  useEffect(() => {
    if (!otpEmail) navigate(otpMode === 'login' ? '/login' : '/register', { replace: true });
  }, [otpEmail, otpMode, navigate]);

  useEffect(() => {
    startCountdown();
    setTimeout(() => refs.current[0]?.focus(), 80);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const startCountdown = () => {
    setCooldown(RESEND_SEC);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() =>
      setCooldown((p) => { if (p <= 1) { clearInterval(timer.current!); return 0; } return p - 1; }),
      1000);
  };

  const onChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigits((p) => { const n = [...p]; n[i] = d; return n; });
    if (d && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (!p) return;
    e.preventDefault();
    const n = Array(OTP_LEN).fill('');
    for (let i = 0; i < p.length; i++) n[i] = p[i];
    setDigits(n);
    refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = digits.join('');
    if (code.length !== OTP_LEN) { setError(t('auth.errors.otpIncomplete')); return; }

    setLoading(true);
    try {
      const result = await validateOtp({ email: otpEmail, otpNumber: code });

      if (otpMode === 'login') {
        const auth = (result as any)?.authResponse;

        // Map roleId from API to role string
        const roleMap: Record<number, 'student' | 'teacher' | 'admin'> = {
          1: 'student',
          2: 'teacher',
          3: 'admin',
        };
        const resolvedRole = roleMap[auth?.roleId] ?? 'student';

        const loggedInUser: User = otpPendingUser ?? {
          id: auth?.userGuid ?? `user-${Date.now()}`,
          email: auth?.email ?? otpEmail,
          name: `${auth?.firstName ?? ''} ${auth?.lastName ?? ''}`.trim() || otpEmail,
          role: resolvedRole,
          avatar: undefined,
          createdAt: new Date().toISOString(),
        };

        if ((result as any)?.token) {
          localStorage.setItem('academy_token', (result as any).token);
        }

        handleLoginSuccess(loggedInUser);

        // Navigate based on role
        if (resolvedRole === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (resolvedRole === 'teacher') {
          navigate('/teacher-sessions', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // ── REGISTER flow: call registerUser API then create local user ─────
        await registerUser({
          email: otpEmail,
          firstName: otpFirstName,
          lastName: otpLastName,
          password: otpPassword,
          telephone: otpTelephone,
          roleId: otpRole === 'teacher' ? 2 : 1,
        });

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: otpEmail,
          name: otpName,
          role: otpRole,
          avatar:
            otpRole === 'teacher'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          headline: otpRole === 'teacher' ? t('auth.newTeacherHeadline') : undefined,
          createdAt: new Date().toISOString(),
        };
        handleRegisterUser({ ...newUser, password: otpPassword });
        handleLoginSuccess(newUser);
        navigate(otpRole === 'teacher' ? '/teacher-sessions' : '/dashboard', { replace: true });
      }
    } catch {
      setError(t('auth.errors.otpInvalid'));
    } finally {
      setLoading(false);
    }
  };

  const isComplete = digits.every((d) => d !== '');
  const backPath = otpMode === 'login' ? '/login' : '/register';

  // Labels that change based on mode
  const modeLabel = otpMode === 'login'
    ? (lang === 'ka' ? 'შესვლის დადასტურება' : lang === 'ru' ? 'Подтверждение входа' : 'Verify Login')
    : (lang === 'ka' ? 'ანგარიშის შექმნა' : lang === 'ru' ? 'Создание аккаунта' : 'Create Account');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="bg-white rounded-[2.25rem] border border-slate-100/90 shadow-[0_32px_64px_-12px_rgba(30,41,59,0.14)] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />
          <div className="p-8 sm:p-10">

            {/* Back button */}
            <Link
              to={backPath}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {lang === 'ka' ? 'უკან' : lang === 'ru' ? 'Назад' : 'Back'}
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                <ShieldCheck className="h-7 w-7 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('auth.titleOtp')}
              </h1>
              {/* Mode badge */}
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${otpMode === 'login'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                {modeLabel}
              </span>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                {lang === 'ka' ? `კოდი გაიგზავნა: ` : lang === 'ru' ? `Код отправлен на: ` : `Code sent to: `}
                <strong className="text-slate-700">{otpEmail}</strong>
              </p>
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

            {/* OTP inputs */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center gap-2.5">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => onChange(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={onPaste}
                    className={`h-14 w-11 sm:w-12 rounded-2xl border text-center text-lg font-black text-slate-900 focus:outline-none focus:ring-2 transition ${d
                      ? 'border-indigo-400 bg-indigo-50 focus:ring-indigo-200'
                      : 'border-slate-200/80 bg-slate-50/50 focus:ring-indigo-100 focus:border-indigo-500'
                      }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !isComplete}
                className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.verifying') : t('auth.submitVerify')}
              </button>
            </form>

            {/* Resend */}
            <div className="mt-5 text-center text-xs text-slate-500 font-medium">
              {cooldown > 0 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  {lang === 'ka' ? `${cooldown} წმ-ში ხელახლა` : lang === 'ru' ? `Повторная отправка через ${cooldown}с` : `Resend in ${cooldown}s`}
                </span>
              ) : (
                <>
                  {t('auth.didntGetCode')}{' '}
                  <button
                    type="button"
                    onClick={startCountdown}
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    {t('auth.resend')}
                  </button>
                </>
              )}
            </div>

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