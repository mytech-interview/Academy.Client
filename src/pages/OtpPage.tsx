import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Lock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useApp } from '../context/AppContext';
import { validateOtp, validateOtpRegitration } from '../api/authApi';
import { User } from '../types';

const OTP_LEN = 6;
const RESEND_SEC = 60;

const roleMap: Record<number, 'student' | 'teacher' | 'admin'> = {
  1: 'student',
  2: 'teacher',
  3: 'admin',
};

export default function OtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    lang,

    otpMode,
    otpPendingUser,

    otpEmail,
    otpPassword,
    otpRole,
    otpName,
    otpFirstName,
    otpLastName,
    otpTelephone,

    handleLoginSuccess,
    handleRegisterUser,
  } = useApp();

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LEN).fill('')
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SEC);

  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* =====================================================
      GUARD
  ===================================================== */

  useEffect(() => {
    if (!otpEmail) {
      navigate(
        otpMode === 'login'
          ? '/login'
          : '/register',
        { replace: true }
      );
    }
  }, [otpEmail, otpMode, navigate]);

  /* =====================================================
      OTP COUNTDOWN
  ===================================================== */

  useEffect(() => {
    startCountdown();

    const focusTimer = setTimeout(() => {
      refs.current[0]?.focus();
    }, 80);

    return () => {
      clearTimeout(focusTimer);

      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setCooldown(RESEND_SEC);

    if (timer.current) {
      clearInterval(timer.current);
    }

    timer.current = setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          if (timer.current) {
            clearInterval(timer.current);
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  /* =====================================================
      OTP INPUT
  ===================================================== */

  const onChange = (
    index: number,
    value: string
  ) => {
    const digit = value
      .replace(/\D/g, '')
      .slice(-1);

    setDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    if (
      digit &&
      index < OTP_LEN - 1
    ) {
      refs.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (
    index: number,
    event: React.KeyboardEvent
  ) => {
    if (
      event.key === 'Backspace' &&
      !digits[index] &&
      index > 0
    ) {
      refs.current[index - 1]?.focus();
    }
  };

  const onPaste = (
    event: React.ClipboardEvent
  ) => {
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LEN);

    if (!pasted) {
      return;
    }

    event.preventDefault();

    const next = Array(OTP_LEN).fill('');

    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }

    setDigits(next);

    refs.current[
      Math.min(
        pasted.length,
        OTP_LEN - 1
      )
    ]?.focus();
  };

  /* =====================================================
      SUBMIT OTP
  ===================================================== */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    const code = digits.join('');

    if (code.length !== OTP_LEN) {
      setError(
        t('auth.errors.otpIncomplete')
      );

      return;
    }

    setLoading(true);

    try {
      const result =
        otpMode === 'login'
          ? await validateOtp({
              email: otpEmail,
              otpNumber: code,
            })
          : await validateOtpRegitration({
              email: otpEmail,
              otpNumber: code,
              firstName: otpFirstName,
              lastName: otpLastName,
              password: otpPassword,
              telephone: otpTelephone,
              roleId: otpRole,
            });

      if (otpMode === 'login') {
        const auth =
          (result as any)?.authResponse ??
          result;

        localStorage.setItem(
          'academy_token',
          (result as any)?.token ??
          ''
        );

        const resolvedRole =
          roleMap[Number(auth?.roleId)] ??
          'student';

        const loggedInUser: User = {
          id:
            auth?.userGuid ??
            auth?.userId?.toString() ??
            otpPendingUser?.id ??
            `user-${Date.now()}`,

          email:
            auth?.email ??
            otpPendingUser?.email ??
            otpEmail,

          name:
            `${auth?.firstName ?? ''} ${auth?.lastName ?? ''
              }`.trim() ||
            otpPendingUser?.name ||
            otpEmail,

          role: resolvedRole,

          avatar:
            auth?.picture ??
            otpPendingUser?.avatar,

          headline:
            otpPendingUser?.headline,

          createdAt:
            otpPendingUser?.createdAt ??
            new Date().toISOString(),
        };

        if ((result as any)?.token) {
          localStorage.setItem(
            'academy_token',
            (result as any).token
          );
        }

        handleLoginSuccess(
          loggedInUser
        );

        switch (resolvedRole) {
          case 'teacher':
            navigate(
              '/teacher-sessions',
              { replace: true }
            );
            break;

          case 'admin':
            navigate(
              '/admin-dashboard',
              { replace: true }
            );
            break;

          case 'student':
          default:
            navigate(
              '/dashboard',
              { replace: true }
            );
            break;
        }
      } else {
        const auth =
          (result as any)?.authResponse ??
          result;

        if ((result as any)?.token) {
          localStorage.setItem(
            'academy_token',
            (result as any).token
          );
        }

        const resolvedRegisterRole =
          roleMap[Number(auth?.roleId ?? otpRole)] ??
          'student';
        const isTeacher = resolvedRegisterRole === 'teacher';

        const newUser: User = {
          id:
            auth?.userGuid ??
            auth?.userId?.toString() ??
            `user-${Date.now()}`,

          email:
            auth?.email ??
            otpEmail,

          name:
            `${auth?.firstName ?? otpFirstName ?? ''} ${auth?.lastName ?? otpLastName ?? ''
              }`.trim() ||
            otpName ||
            otpEmail,

          role: resolvedRegisterRole,

          avatar:
            auth?.picture ??
            (isTeacher
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),

          headline: isTeacher
            ? t('auth.newTeacherHeadline')
            : undefined,

          createdAt:
            new Date().toISOString(),
        };

        handleRegisterUser({
          ...newUser,
          password: otpPassword,
        });

        handleLoginSuccess(
          newUser
        );

        if (isTeacher) {
          navigate(
            '/teacher-sessions',
            { replace: true }
          );
        } else {
          navigate(
            '/dashboard',
            { replace: true }
          );
        }
      }

    } catch (error) {
      console.error(
        'OTP verification error:',
        error
      );

      setError(
        t('auth.errors.otpInvalid')
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      UI STATE
  ===================================================== */

  const isComplete =
    digits.every(
      (digit) => digit !== ''
    );

  const backPath =
    otpMode === 'login'
      ? '/login'
      : '/register';

  /* =====================================================
      RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.25,
          ease: 'easeOut',
        }}
        className="relative w-full max-w-[440px] bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl"
      >
        {/* Кнопка закрытия/возврата */}
        <Link
          to={backPath}
          className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </Link>

        {/* Иконка в шапке */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50/80 text-indigo-600">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            2FA უსაფრთხოების შემოწმება
          </h1>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            შეიყვანეთ ერთჯერადი უსაფრთხოების კოდი (OTP)
          </p>
        </div>

        {/* Ошибка */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs font-semibold text-rose-600 flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              ერთჯერადი კოდი (OTP)
            </label>

            {/* Контейнер ввода OTP */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Lock className="h-5 w-5 text-slate-300 shrink-0 mr-3" />
              <div className="flex items-center justify-between w-full gap-1.5 sm:gap-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      refs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    placeholder={(index + 1).toString()}
                    onChange={(event) => onChange(index, event.target.value)}
                    onKeyDown={(event) => onKeyDown(index, event)}
                    onPaste={onPaste}
                    className="w-full text-center bg-transparent text-slate-800 font-semibold text-base focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center gap-3">
            <Link
              to={backPath}
              className="w-1/3 py-3.5 rounded-2xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition text-center"
            >
              უკან
            </Link>

            <button
              type="submit"
              disabled={loading || !isComplete}
              className="w-2/3 py-3.5 rounded-2xl bg-[#432bf0] text-xs font-bold text-white hover:bg-[#3721d6] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
            >
              {loading ? t('auth.verifying') : 'დადასტურება'}
            </button>
          </div>
        </form>

        {/* Нижний колонтитул */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
          ჯერ არ გაქვთ ანგარიში?{' '}
          <Link
            to="/register"
            className="font-bold text-[#432bf0] hover:underline"
          >
            შექმენით ანგარიში
          </Link>
        </div>
      </motion.div>
    </div>
  );
}