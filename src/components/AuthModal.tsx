import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';
import { UserRole, User } from '../types';
import { Language, translations } from '../lib/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (newUser: User & { password?: string }) => void;
  lang: Language;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  registeredUsers,
  onRegisterUser,
  lang
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError(t.authFieldRequired || 'Please fill out all fields');
      return;
    }

    if (isLogin) {
      // Handle Login
      const existingUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!existingUser) {
        setError(
          lang === 'ka'
            ? 'ამ იმეილით მომხმარებელი ვერ მოიძებნა. გთხოვთ დარეგისტრირდეთ.'
            : lang === 'ru'
            ? 'Пользователь с этим email не найден. Пожалуйста, зарегистрируйтесь.'
            : 'User with this email not found. Please register.'
        );
        return;
      }
      
      onSuccess(existingUser);
      onClose();
      resetForm();
    } else {
      // Handle Registration
      const emailExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        setError(
          lang === 'ka'
            ? 'ეს ელ-ფოსტა უკვე გამოყენებულია'
            : lang === 'ru'
            ? 'Этот email уже используется'
            : 'This email is already in use'
        );
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        name,
        role,
        avatar: role === 'teacher' 
          ? `https://images.unsplash.com/photo-${role === 'teacher' ? '1573496359142-b8d87734a5a2' : '1534528741775-53994a69daeb'}?w=150`
          : undefined,
        headline: role === 'teacher' 
          ? (lang === 'ka' 
              ? 'აკადემიის ახალი მასწავლებელი' 
              : lang === 'ru' 
              ? 'Новый преподаватель академии' 
              : 'New teacher of the academy')
          : undefined,
        createdAt: new Date().toISOString()
      };

      onRegisterUser({ ...newUser, password });
      onSuccess(newUser);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
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
          onClick={onClose}
          id="btn-close-auth-modal"
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 cursor-pointer active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-8 text-center relative">
          <div className="mx-auto h-13 w-13 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-sm shadow-indigo-100/50">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {isLogin ? t.authTitleLogin : t.authTitleRegister}
          </h2>
          <p className="mt-2 text-xs text-slate-500 font-medium tracking-wide">
            {isLogin ? t.authSubtitleLogin : t.authSubtitleRegister}
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

        {/* Form */}
        <form onSubmit={handleSubmit} id="auth-form" className="space-y-4 relative">
          
          {/* Toggle Login/Register Role Tabs */}
          {!isLogin && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                {t.authWhoAreYou}
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
                  {t.student}
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
                  {t.teacher}
                </button>
              </div>
            </div>
          )}

          {/* Name Field (Register only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pl-1">
                {t.authFullName}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  id="auth-name"
                  placeholder={lang === 'ka' ? 'მაგ: გიორგი ბერიძე' : lang === 'ru' ? 'напр: Георгий Беридзе' : 'e.g. John Doe'}
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
              {t.authEmail}
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
                {t.authPassword}
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
            className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-100 uppercase tracking-widest cursor-pointer mt-2"
          >
            {isLogin ? t.authSubmitLogin : t.authSubmitRegister}
          </button>
        </form>

        {/* Switch Login / Register link */}
        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
          {isLogin ? (
            <p className="font-medium">
              {lang === 'ka' 
                ? 'ჯერ არ გაქვთ ანგარიში? ' 
                : lang === 'ru' 
                ? 'Нет аккаунта? ' 
                : "Don't have an account? "}
              <button
                type="button"
                id="btn-switch-to-register"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
              >
                {lang === 'ka' 
                  ? 'შექმენით ანგარიში' 
                  : lang === 'ru' 
                  ? 'Создать аккаунт' 
                  : 'Create an account'}
              </button>
            </p>
          ) : (
            <p className="font-medium">
              {lang === 'ka' 
                ? 'უკვე გაქვთ ანგარიში? ' 
                : lang === 'ru' 
                ? 'Уже есть аккаунт? ' 
                : 'Already have an account? '}
              <button
                type="button"
                id="btn-switch-to-login"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
              >
                {t.login}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
