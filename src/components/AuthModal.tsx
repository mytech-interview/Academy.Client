import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, GraduationCap, Briefcase, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserRole, User } from '../types';
import { 
 registerUser, 
 createOtp,
 validateOtp
} from '../api/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (newUser: User & { password?: string }) => void;
}

type Step = 'login' | 'register' | 'otp';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  registeredUsers,
  onRegisterUser,
}: AuthModalProps) {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState<Step>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLogin = step === 'login';

  if (!isOpen) return null;

  const getLanguageType = (): LanguageType => {
    const lang = i18n.language?.slice(0, 2);
    if (lang === 'en') return LanguageType.En;
    if (lang === 'ka') return LanguageType.Ka;
    return LanguageType.Ru;
  };

  const startResendCooldown = () => {
    setResendCooldown(RESEND_SECONDS);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setResendCooldown(0);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    setStep('login');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!email || !password || (step === 'register' && !name)) {
    setError(t('auth.errors.fieldRequired'));
    return;
  }


  if (isLogin) {

    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );


    if (!existingUser) {
      setError(t('auth.errors.userNotFound'));
      return;
    }


    onSuccess(existingUser);
    handleClose();

    return;
  }



  setIsSubmitting(true);

  try {

    await createOtp({
      email: email.toLowerCase(),
      password
    });


    setOtpDigits(Array(OTP_LENGTH).fill(''));

    setStep('otp');

    startResendCooldown();


    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    },50);


  } catch(err){

    console.error(err);

    setError(
      t(
        'auth.errors.registerFailed',
      )
    );

  } finally {

    setIsSubmitting(false);

  }

};

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpInputsRef.current[focusIndex]?.focus();
  };

const handleVerifyOtp = async (e: React.FormEvent) => {

  e.preventDefault();

  setError('');


  const code = otpDigits.join('');


  if(code.length !== OTP_LENGTH){

    setError(
      t(
        'auth.errors.otpIncomplete',
      )
    );

    return;
  }



  setIsSubmitting(true);


  try {


    await validateOtp({

      email: email.toLowerCase(),

      otpNumber: code

    });



    

    const parts = name.trim().split(' ');


    await registerUser({

      email: email.toLowerCase(),

      firstName: parts[0],

      lastName:
        parts.slice(1).join(' ') || '-',

      password,

      telephone:'',

      roleId:
        role === 'teacher'
        ? 2
        : 1

    });



    const newUser:User = {

      id:`user-${Date.now()}`,

      email:email.toLowerCase(),

      name,

      role,


      avatar:
        role === 'teacher'
        ?
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        :
        undefined,


      headline:
        role === 'teacher'
        ?
        t('auth.newTeacherHeadline')
        :
        undefined,


      createdAt:new Date().toISOString()

    };



    onRegisterUser({
      ...newUser,
      password
    });


    onSuccess(newUser);


    handleClose();



  } catch(err){


    console.error(err);


    setError(
      t(
        'auth.errors.otpInvalid',
      )
    );


  } finally {

    setIsSubmitting(false);

  }

};

const handleResend = async () => {

  if(resendCooldown > 0) return;


  setError('');

  setIsSubmitting(true);


  try {


    await createOtp({

      email:email.toLowerCase(),

      password

    });



    startResendCooldown();


  } catch(err){

    console.error(err);


    setError(
      t(
        'auth.errors.otpSendFailed',
      )
    );


  } finally {

    setIsSubmitting(false);

  }

};

  const titles: Record<Step, string> = {
    login: t('auth.titleLogin'),
    register: t('auth.titleRegister'),
    otp: t('auth.titleOtp', 'Подтверждение почты'),
  };

  const subtitles: Record<Step, string> = {
    login: t('auth.subtitleLogin'),
    register: t('auth.subtitleRegister'),
    otp: t('auth.subtitleOtp', 'Мы отправили код на {{email}}').replace('{{email}}', email),
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        id="auth-modal-container"
        className="relative w-full max-w-[440px] overflow-hidden rounded-[2.25rem] bg-white p-7 sm:p-9 shadow-[0_32px_64px_-12px_rgba(30,41,59,0.18)] border border-slate-100/90"
      >
        {/* Dynamic Abstract Background Glows */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          id="btn-close-auth-modal"
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 cursor-pointer active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back button on OTP step */}
        {step === 'otp' && (
          <button
            type="button"
            onClick={() => {
              setStep('register');
              setError('');
            }}
            id="btn-back-to-register"
            className="absolute left-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-8 text-center relative">
          <div className="mx-auto h-13 w-13 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-sm shadow-indigo-100/50">
            {step === 'otp' ? <ShieldCheck className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {titles[step]}
          </h2>
          <p className="mt-2 text-xs text-slate-500 font-medium tracking-wide">
            {subtitles[step]}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            id="auth-error-alert"
            className="mb-5 rounded-2xl bg-rose-50/80 p-4 text-xs font-bold text-rose-700 border border-rose-100/70 flex items-center gap-2.5 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step !== 'otp' ? (
            <motion.div
              key="auth-form-step"
              initial={{ opacity: 0, x: step === 'register' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 'register' ? -20 : 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Form */}
              <form onSubmit={handleSubmit} id="auth-form" className="space-y-4 relative">

                {/* Toggle Login/Register Role Tabs */}
                {!isLogin && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                      {t('auth.whoAreYou')}
                    </label>
                    <div id="role-selector-container" className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                      <button
                        type="button"
                        id="btn-select-role-student"
                        onClick={() => setRole('student')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          role === 'student'
                            ? 'bg-white text-indigo-600 shadow-md shadow-slate-100/80 ring-1 ring-slate-100'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <GraduationCap className="h-4 w-4" />
                        {t('auth.student')}
                      </button>
                      <button
                        type="button"
                        id="btn-select-role-teacher"
                        onClick={() => setRole('teacher')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          role === 'teacher'
                            ? 'bg-white text-indigo-600 shadow-md shadow-slate-100/80 ring-1 ring-slate-100'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Briefcase className="h-4 w-4" />
                        {t('auth.teacher')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Name Field (Register only) */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label htmlFor="auth-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                      {t('auth.fullName')}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </span>
                      <input
                        type="text"
                        id="auth-name"
                        placeholder={t('auth.namePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 text-xs transition duration-200 font-medium"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="email"
                      id="auth-email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 text-xs transition duration-200 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                      {t('auth.password')}
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="auth-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-11 pr-11 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 text-xs transition duration-200 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="btn-auth-submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-100 uppercase tracking-widest cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? t('auth.sending', 'Отправка...')
                    : isLogin
                    ? t('auth.submitLogin')
                    : t('auth.submitContinue', 'Продолжить')}
                </button>
              </form>

              {/* Switch Login / Register link */}
              <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
                {isLogin ? (
                  <p className="font-medium">
                    {t('auth.noAccount')}{' '}
                    <button
                      type="button"
                      id="btn-switch-to-register"
                      onClick={() => {
                        setStep('register');
                        setError('');
                      }}
                      className="font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                    >
                      {t('auth.createAccount')}
                    </button>
                  </p>
                ) : (
                  <p className="font-medium">
                    {t('auth.hasAccount')}{' '}
                    <button
                      type="button"
                      id="btn-switch-to-login"
                      onClick={() => {
                        setStep('login');
                        setError('');
                      }}
                      className="font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                    >
                      {t('auth.loginLink')}
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleVerifyOtp} id="otp-form" className="space-y-6 relative">
                <div className="flex items-center justify-center gap-2.5" id="otp-inputs-container">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      id={`otp-digit-${index}`}
                      className="h-14 w-11 sm:w-12 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-center text-lg font-black text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition duration-200"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  id="btn-verify-otp"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-100 uppercase tracking-widest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('auth.verifying', 'Проверка...') : t('auth.submitVerify', 'Подтвердить и создать аккаунт')}
                </button>

                <p className="text-center text-xs text-slate-500 font-medium">
                  {resendCooldown > 0 ? (
                    t('auth.resendIn', 'Отправить код повторно через {{s}} сек').replace('{{s}}', String(resendCooldown))
                  ) : (
                    <>
                      {t('auth.didntGetCode', 'Не пришёл код?')}{' '}
                      <button
                        type="button"
                        id="btn-resend-otp"
                        onClick={handleResend}
                        disabled={isSubmitting}
                        className="font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer disabled:opacity-60"
                      >
                        {t('auth.resend', 'Отправить снова')}
                      </button>
                    </>
                  )}
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}