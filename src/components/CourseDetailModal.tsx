import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, Award, Star, BookOpen, GraduationCap, CheckCircle, ChevronRight, MessageSquare, Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { Course, User, Enrollment } from '../types';
import { mockTeachers } from '../data/mockData';
import { Language } from '../lib/translations';

interface CourseDetailModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  isEnrolled: boolean;
  onEnroll: () => void;
  onStartStudy: () => void;
  isLoggedIn: boolean;
  userRole: string | undefined;
  lang: Language;
  registeredUsers?: User[];
  onRegisterUser?: (newUser: User) => void;
  onLoginSuccess?: (user: User) => void;
}

export default function CourseDetailModal({
  course,
  isOpen,
  onClose,
  isEnrolled,
  onEnroll,
  onStartStudy,
  isLoggedIn,
  userRole,
  lang,
  registeredUsers = [],
  onRegisterUser,
  onLoginSuccess
}: CourseDetailModalProps) {
  const [showQuickReg, setShowQuickReg] = useState(false);
  const [isRegLogin, setIsRegLogin] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regEmail || !regPassword || (!isRegLogin && !regName)) {
      setRegError(lang === 'ka' ? 'გთხოვთ შეავსოთ ყველა ველი' : 'Please fill out all fields');
      return;
    }

    if (isRegLogin) {
      // Inline log in
      const matched = registeredUsers.find((u) => u.email.toLowerCase() === regEmail.toLowerCase());
      if (!matched) {
        setRegError(
          lang === 'ka'
            ? 'ამ ელ-ფოსტით მომხმარებელი ვერ მოიძებნა. გთხოვთ დარეგისტრირდეთ.'
            : 'User with this email not found. Please register.'
        );
        return;
      }
      if (onLoginSuccess) onLoginSuccess(matched);
      onEnroll();
    } else {
      // Inline registration
      const exists = registeredUsers.some((u) => u.email.toLowerCase() === regEmail.toLowerCase());
      if (exists) {
        setRegError(
          lang === 'ka'
            ? 'ეს ელ-ფოსტა უკვე გამოყენებულია'
            : 'This email is already in use'
        );
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: regEmail.toLowerCase(),
        name: regName,
        role: 'student',
        createdAt: new Date().toISOString()
      };

      if (onRegisterUser) onRegisterUser(newUser);
      if (onLoginSuccess) onLoginSuccess(newUser);
      onEnroll();
    }
  };

  const t = {
    ka: {
      lblDuration: 'ხანგრძლივობა',
      lblDifficulty: 'სირთულე',
      lblLessons: 'ლექციები',
      lblRating: 'რეიტინგი',
      lessonsCount: `${course.lessons.length} ლექცია`,
      aboutTitle: 'კურსის შესახებ',
      syllabusTitle: 'სასწავლო პროგრამა (სილაბუსი)',
      teacherTitle: 'მასწავლებელი',
      reviewsTitle: 'სტუდენტების შეფასებები',
      lblPrice: 'ღირებულება',
      teacherHeadline: 'აკადემიის ლექტორი',
      teacherBio: 'გამოცდილი პრაქტიკოსი სპეციალისტი, რომელიც ხელმძღვანელობს ამ კურსს.',
      isTeacherLabel: 'თქვენ ხართ კურსის ლექტორი',
      btnStart: 'სწავლის დაწყება',
      btnEnroll: 'რეგისტრაცია კურსზე'
    },
    en: {
      lblDuration: 'Duration',
      lblDifficulty: 'Level',
      lblLessons: 'Lessons',
      lblRating: 'Rating',
      lessonsCount: `${course.lessons.length} Lessons`,
      aboutTitle: 'About the Course',
      syllabusTitle: 'Syllabus (Curriculum)',
      teacherTitle: 'Instructor',
      reviewsTitle: 'Student Reviews',
      lblPrice: 'Price',
      teacherHeadline: 'Academy Mentor',
      teacherBio: 'An experienced industry practitioner leading this interactive course.',
      isTeacherLabel: 'You are the instructor of this course',
      btnStart: 'Start Learning',
      btnEnroll: 'Enroll in Course'
    },
    ru: {
      lblDuration: 'Длительность',
      lblDifficulty: 'Уровень',
      lblLessons: 'Лекции',
      lblRating: 'Рейтинг',
      lessonsCount: `${course.lessons.length} лекций`,
      aboutTitle: 'О курсе',
      syllabusTitle: 'Учебная программа (силлабус)',
      teacherTitle: 'Преподаватель',
      reviewsTitle: 'Отзывы студентов',
      lblPrice: 'Стоимость',
      teacherHeadline: 'Преподаватель академии',
      teacherBio: 'Опытный практикующий специалист, ведущий данный интерактивный курс.',
      isTeacherLabel: 'Вы являетесь преподавателем этого курса',
      btnStart: 'Начать обучение',
      btnEnroll: 'Записаться на курс'
    }
  }[lang] || {
    lblDuration: 'ხანგრძლივობა',
    lblDifficulty: 'სირთულე',
    lblLessons: 'ლექციები',
    lblRating: 'რეიტინგი',
    lessonsCount: `${course.lessons.length} ლექცია`,
    aboutTitle: 'კურსის შესახებ',
    syllabusTitle: 'სასწავლო პროგრამა (სილაბუსი)',
    teacherTitle: 'მასწავლებელი',
    reviewsTitle: 'სტუდენტების შეფასებები',
    lblPrice: 'ღირებულება',
    teacherHeadline: 'აკადემიის ლექტორი',
    teacherBio: 'გამოცდილი პრაქტიკოსი სპეციალისტი, რომელიც ხელმძღვანელობს ამ კურსს.',
    isTeacherLabel: 'თქვენ ხართ კურსის ლექტორი',
    btnStart: 'სწავლის დაწყება',
    btnEnroll: 'რეგისტრაცია კურსზე'
  };

  // Find detailed instructor
  const matchedTeacher = mockTeachers.find((tch) => tch.id === course.teacherId);
  const teacher = {
    name: course.teacherName, // derived dynamically
    headline: matchedTeacher ? (lang === 'en' ? 'Academy Mentor' : lang === 'ru' ? 'Преподаватель академии' : 'აკადემიის ლექტორი') : t.teacherHeadline,
    avatar: matchedTeacher?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: matchedTeacher ? (lang === 'en' ? 'Senior industry expert teaching professional programs with years of active web experience.' : lang === 'ru' ? 'Старший отраслевой эксперт, преподающий профессиональные программы с многолетним опытом.' : 'აკადემიის წამყვანი პრაქტიკოსი სპეციალისტი მრავალწლიანი სამუშაო გამოცდილებით.') : t.teacherBio
  };

  // Generate some realistic course reviews based on rating
  const mockReviews = [
    {
      id: 'r-1',
      studentName: lang === 'en' ? 'Alexander Ganjashvili' : lang === 'ru' ? 'Александр Ганджашвили' : 'ალექსანდრე განჯაშვილი',
      rating: 5,
      comment: lang === 'en' ? 'Excellent course! The material is explained very simply and clearly. I especially loved the hands-on tasks.' : lang === 'ru' ? 'Отличный курс! Материал объясняется очень просто и понятно. Особенно понравились практические задания.' : 'საუკეთესო კურსია, მასალა ახსნილია ძალიან მარტივად და გასაგებად. განსაკუთრებით მომეწონა პრაქტიკული დავალებები.',
      date: lang === 'en' ? 'Yesterday' : lang === 'ru' ? 'Вчера' : 'გუშინ'
    },
    {
      id: 'r-2',
      studentName: lang === 'en' ? 'Ekaterine M.' : lang === 'ru' ? 'Екатерина М.' : 'ეკატერინე მ.',
      rating: Math.floor(course.rating),
      comment: lang === 'en' ? 'Very robust syllabus, we covered Figma prototyping in high detail. Highly recommended!' : lang === 'ru' ? 'Очень хорошая программа обучения, подробно разобрали прототипирование в Figma. Рекомендую!' : 'ძალიან კარგი სილაბუსი აქვს, Figma-ში პროტოტიპირება ძალიან დეტალურად გავიარეთ. რეკომენდაციას ვუწევ!',
      date: lang === 'en' ? '3 days ago' : lang === 'ru' ? '3 дня назад' : '3 დღის წინ'
    }
  ];

  return (
    <div id="course-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        id="course-detail-container"
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          id="btn-close-course-details"
          className="absolute right-6 top-6 z-10 rounded-full bg-slate-900/40 backdrop-blur-md p-2 text-white hover:bg-slate-900/60 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto flex-1 text-left">
          {/* Header Banner */}
          <div className="relative aspect-[21/9] w-full bg-slate-950">
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover opacity-65"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-8 right-8">
              <span className="rounded-xl bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                {course.category}
              </span>
              <h2 id="detail-course-title" className="mt-2 text-xl font-extrabold text-white sm:text-2xl lg:text-3xl leading-snug">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Grid Layout Content */}
          <div className="p-8 space-y-8">
            {/* Quick Specs bar */}
            <div className="grid grid-cols-2 gap-4 rounded-[2rem] bg-slate-50 p-6 sm:grid-cols-4 text-center border border-slate-200/50">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.lblDuration}</span>
                <span className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-800">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {course.duration}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.lblDifficulty}</span>
                <span className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-800">
                  <Award className="h-4 w-4 text-indigo-500" />
                  {course.level}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.lblLessons}</span>
                <span className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-800">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  {t.lessonsCount}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.lblRating}</span>
                <span className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-slate-800">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {course.rating.toFixed(1)} / 5
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-left">
              <h3 className="font-sans text-lg font-bold text-slate-950">{t.aboutTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {course.description}
              </p>
            </div>

            {/* Syllabus */}
            <div className="space-y-3 text-left">
              <h3 className="font-sans text-lg font-bold text-slate-950">{t.syllabusTitle}</h3>
              <div id="syllabus-list" className="space-y-2.5">
                {course.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 border border-indigo-100">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-700 leading-none pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Profile */}
            <div className="space-y-3 border-t border-slate-100 pt-6 text-left">
              <h3 className="font-sans text-lg font-bold text-slate-950">{t.teacherTitle}</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-[2rem] border border-slate-200/60 p-5 bg-white shadow-sm">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h4 className="font-sans text-base font-bold text-slate-950">{teacher.name}</h4>
                  <p className="text-xs font-semibold text-indigo-600">{teacher.headline}</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-normal">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Reviews Section */}
            <div className="space-y-3 border-t border-slate-100 pt-6 text-left">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-slate-600" />
                <h3 className="font-sans text-lg font-bold text-slate-950">{t.reviewsTitle}</h3>
              </div>
              <div id="reviews-list" className="space-y-3">
                {mockReviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-slate-100 p-4 space-y-2 bg-slate-50/30 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{review.studentName}</span>
                      <span className="text-[10px] font-medium text-slate-400">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Quick Registration / Authorization */}
            {!isLoggedIn && showQuickReg && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-indigo-100/60 bg-indigo-50/30 rounded-3xl p-5 sm:p-6 space-y-4 text-left shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-indigo-950">
                      {isRegLogin 
                        ? (lang === 'ka' ? 'ავტორიზაცია და კურსზე ჩაწერა' : 'Log In & Enroll')
                        : (lang === 'ka' ? 'სწრაფი რეგისტრაცია და კურსზე ჩაწერა' : 'Quick Register & Enroll')}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isRegLogin 
                        ? (lang === 'ka' ? 'შეავსეთ ფორმა შესასვლელად' : 'Fill out the form to log in')
                        : (lang === 'ka' ? 'შექმენით უფასო ანგარიში კურსის დასაწყებად' : 'Create a free account to start learning')}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowQuickReg(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-xl transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {regError && (
                  <div className="rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-100 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleQuickSubmit} className="space-y-3.5">
                  {!isRegLogin && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">
                        {lang === 'ka' ? 'სახელი და გვარი' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <UserIcon className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder={lang === 'ka' ? 'მაგ: გიორგი ბერიძე' : 'e.g. John Doe'}
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">
                      {lang === 'ka' ? 'ელ-ფოსტა' : 'Email'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">
                      {lang === 'ka' ? 'პაროლი' : 'Password'}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition shadow-md shadow-indigo-150 uppercase tracking-widest mt-1 cursor-pointer active:scale-[0.98]"
                  >
                    {isRegLogin 
                      ? (lang === 'ka' ? 'შესვლა და რეგისტრაცია კურსზე' : 'Log In & Enroll')
                      : (lang === 'ka' ? 'რეგისტრაცია და კურსზე ჩაწერა' : 'Register & Enroll')}
                  </button>
                </form>

                <div className="text-center text-[11px] text-slate-500 pt-2.5 border-t border-indigo-100/40">
                  {isRegLogin ? (
                    <p>
                      {lang === 'ka' ? 'ჯერ არ გაქვთ ანგარიში? ' : "Don't have an account? "}
                      <button 
                        onClick={() => { setIsRegLogin(false); setRegError(''); }} 
                        className="font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        {lang === 'ka' ? 'შექმენით ანგარიში' : 'Create an account'}
                      </button>
                    </p>
                  ) : (
                    <p>
                      {lang === 'ka' ? 'უკვე გაქვთ ანგარიში? ' : 'Already have an account? '}
                      <button 
                        onClick={() => { setIsRegLogin(true); setRegError(''); }} 
                        className="font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        {lang === 'ka' ? 'შესვლა' : 'Log In'}
                      </button>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white p-6 flex items-center justify-between">
          <div className="px-2 text-left">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none mb-1">{t.lblPrice}</span>
            <span className={`text-xl font-extrabold block leading-none ${course.price === 'უფასო' || course.price === 'Free' || course.price === 'Бесплатно' ? 'text-emerald-600' : 'text-slate-950'}`}>
              {course.price}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isLoggedIn && userRole === 'teacher' ? (
              <span className="rounded-xl bg-slate-50 border border-slate-100 px-5 py-3 text-sm font-bold text-slate-400">
                {t.isTeacherLabel}
              </span>
            ) : isEnrolled ? (
              <button
                onClick={onStartStudy}
                id="btn-detail-start-study"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                {t.btnStart}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={isLoggedIn ? onEnroll : () => setShowQuickReg(!showQuickReg)}
                id="btn-detail-enroll"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                {showQuickReg ? (lang === 'ka' ? 'ფორმის დახურვა' : 'Close Form') : t.btnEnroll}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
