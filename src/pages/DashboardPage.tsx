import React from 'react';
import { GraduationCap } from 'lucide-react';

import { User, Course, Enrollment } from '../types';
import DashboardStudent from '../components/DashboardStudent';
import { Language } from '../lib/translations';


interface DashboardPageProps {
  lang: Language;
  activeUser: User | null;
  courses: Course[];
  enrollments: Enrollment[];

  onAddCourse: (course: Course) => void;

  onUpdateProfile: (
    fields: Partial<User>
  ) => void;

  onUpdateEnrollment: (
    enrollmentId: string,
    completedLessonIds: string[],
    progress: number,
    isCompleted: boolean
  ) => void;

  onOpenAuth: () => void;
}


export default function DashboardPage({
  lang,
  activeUser,
  onUpdateProfile,
  onOpenAuth,
}: DashboardPageProps) {

  /* =====================================================
     NOT AUTHORIZED
  ===================================================== */

  if (!activeUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg relative overflow-hidden">

          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />

          <GraduationCap
            className="mx-auto h-16 w-16 text-indigo-500 animate-pulse"
          />

          <div className="space-y-2">

            <h3 className="text-lg font-black text-slate-950 tracking-tight">
              {lang === 'ka'
                ? 'კაბინეტი ხელმისაწვდომია მხოლოდ ავტორიზებული წევრებისთვის'
                : lang === 'ru'
                ? 'Личный кабинет доступен только авторизованным пользователям'
                : 'Cabinet is only accessible for authorized members'}
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-light">
              {lang === 'ka'
                ? 'გთხოვთ გაიაროთ ავტორიზაცია ან შექმნათ ახალი ანგარიში, რათა მართოთ სასწავლო პროცესი.'
                : lang === 'ru'
                ? 'Пожалуйста, войдите в систему или создайте новый аккаунт, чтобы управлять учебным процессом.'
                : 'Please log in or create a new account to manage your learning process.'}
            </p>

          </div>

          <button
            onClick={onOpenAuth}
            className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md active:scale-[0.98]"
          >
            {lang === 'ka'
              ? 'ავტორიზაციის გავლა'
              : lang === 'ru'
              ? 'Войти / Зарегистрироваться'
              : 'Log In / Register'}
          </button>

        </div>

      </div>
    );
  }


  /* =====================================================
     STUDENT DASHBOARD
  ===================================================== */

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">

      <DashboardStudent
        student={activeUser}
        onUpdateProfile={onUpdateProfile}
        lang={lang}
      />

    </div>
  );
}