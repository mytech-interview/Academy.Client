import React, { useEffect, useState, useRef } from 'react';
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
      /* =================================================
         VALIDATE OTP
      ================================================= */

      const result = await validateOtp({
        email: otpEmail,
        otpNumber: code,
      });


      /* =================================================
         LOGIN
      ================================================= */

      if (otpMode === 'login') {
        /*
         * Backend returns the authentication object directly.
         * In some versions it may be wrapped inside authResponse.
         */
        const auth =
          (result as any)?.authResponse ??
          result;


        localStorage.setItem(
          'academy_token',
          (result as any)?.token ??
          ''
        );
        console.log('================ LOGIN DEBUG ================');
        console.log('FULL OTP RESULT:', result);
        console.log('AUTH RESPONSE:', auth);
        console.log('ROLE ID:', auth?.roleId);
        console.log('ROLE:', auth?.role);
        console.log('USER ROLE:', auth?.userRole);
        console.log('OTP PENDING USER:', otpPendingUser);
        console.log('=============================================');


        /*
         * Backend roles:
         *
         * 1 = student
         * 2 = teacher
         * 3 = admin
         */

        const roleMap: Record<
          number,
          'student' | 'teacher' | 'admin'
        > = {
          1: 'student',
          2: 'teacher',
          3: 'admin',
        };


        const resolvedRole =
          roleMap[Number(auth?.roleId)] ??
          'student';


        console.log(
          'LOGIN ROLE ID:',
          auth?.roleId
        );

        console.log(
          'RESOLVED ROLE:',
          resolvedRole
        );


        /*
         * Create the logged-in user.
         *
         * IMPORTANT:
         * Role always comes from backend.
         */

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


        console.log(
          'FINAL LOGGED USER:',
          loggedInUser
        );


        /*
         * Save token
         */

        if ((result as any)?.token) {
          localStorage.setItem(
            'academy_token',
            (result as any).token
          );
        }


        /*
         * Save active user
         */

        handleLoginSuccess(
          loggedInUser
        );


        /*
         * Redirect according to backend role
         */

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

        /* =================================================
           REGISTER
        ================================================= */

        await registerUser({
          email: otpEmail,
          firstName: otpFirstName,
          lastName: otpLastName,
          password: otpPassword,
          telephone: otpTelephone,

          roleId:
            otpRole === 'teacher'
              ? 2
              : 1,
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

          headline:
            otpRole === 'teacher'
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


        /*
         * Registration redirect
         */

        if (
          otpRole === 'teacher'
        ) {
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


  const modeLabel =
    otpMode === 'login'
      ? (
        lang === 'ka'
          ? 'შესვლის დადასტურება'
          : lang === 'ru'
            ? 'Подтверждение входа'
            : 'Verify Login'
      )
      : (
        lang === 'ka'
          ? 'ანგარიშის შექმნა'
          : lang === 'ru'
            ? 'Создание аккаунта'
            : 'Create Account'
      );


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4">

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/8 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-3xl" />

      </div>


      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-[420px]"
      >

        <div className="bg-white rounded-[2.25rem] border border-slate-100/90 shadow-[0_32px_64px_-12px_rgba(30,41,59,0.14)] overflow-hidden">

          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />

          <div className="p-8 sm:p-10">

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <Link
              to={backPath}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />

              {lang === 'ka'
                ? 'უკან'
                : lang === 'ru'
                  ? 'Назад'
                  : 'Back'}
            </Link>


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="text-center mb-8">

              <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">

                <ShieldCheck className="h-7 w-7 text-indigo-600" />

              </div>


              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('auth.titleOtp')}
              </h1>


              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${otpMode === 'login'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
              >
                {modeLabel}
              </span>


              <p className="mt-2 text-xs text-slate-500 font-medium">

                {lang === 'ka'
                  ? 'კოდი გაიგზავნა: '
                  : lang === 'ru'
                    ? 'Код отправлен на: '
                    : 'Code sent to: '}

                <strong className="text-slate-700">
                  {otpEmail}
                </strong>

              </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-5 rounded-2xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-bold text-rose-700 flex items-center gap-2.5"
              >

                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />

                {error}

              </motion.div>
            )}


            {/* =================================================
                OTP INPUTS
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="flex items-center justify-center gap-2.5">

                {digits.map((digit, index) => (

                  <input
                    key={index}

                    ref={(element) => {
                      refs.current[index] =
                        element;
                    }}

                    type="text"

                    inputMode="numeric"

                    maxLength={1}

                    value={digit}

                    onChange={(event) =>
                      onChange(
                        index,
                        event.target.value
                      )
                    }

                    onKeyDown={(event) =>
                      onKeyDown(
                        index,
                        event
                      )
                    }

                    onPaste={onPaste}

                    className={`h-14 w-11 sm:w-12 rounded-2xl border text-center text-lg font-black text-slate-900 focus:outline-none focus:ring-2 transition ${digit
                      ? 'border-indigo-400 bg-indigo-50 focus:ring-indigo-200'
                      : 'border-slate-200/80 bg-slate-50/50 focus:ring-indigo-100 focus:border-indigo-500'
                      }`}
                  />

                ))}

              </div>


              {/* =================================================
                  VERIFY BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !isComplete
                }
                className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading
                  ? t('auth.verifying')
                  : t('auth.submitVerify')}

              </button>

            </form>


            {/* =================================================
                RESEND
            ================================================= */}

            <div className="mt-5 text-center text-xs text-slate-500 font-medium">

              {cooldown > 0 ? (

                <span className="flex items-center justify-center gap-1.5">

                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />

                  {lang === 'ka'
                    ? `${cooldown} წმ-ში ხელახლა`
                    : lang === 'ru'
                      ? `Повторная отправка через ${cooldown}с`
                      : `Resend in ${cooldown}s`}

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


        {/* =================================================
            HOME LINK
        ================================================= */}

        <div className="text-center mt-5">

          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            ←{' '}

            {lang === 'ka'
              ? 'მთავარ გვერდზე'
              : lang === 'ru'
                ? 'На главную'
                : 'Back to home'}

          </Link>

        </div>

      </motion.div>

    </div>
  );
}