import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, BookOpen, GraduationCap, ArrowRight, UserCheck, MessageCircle, Star, Filter, CheckCircle, Mail, Phone, MapPin, Clock, Award, Laptop, Target, Zap } from 'lucide-react';

import { User, Course, Enrollment } from './types';
import { mockCourses, mockTeachers, mockCategories } from './data/mockData';

import Navbar from './components/Navbar';
import BrandLogo from './components/BrandLogo';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import CourseDetailModal from './components/CourseDetailModal';
import AuthModal from './components/AuthModal';
import DashboardStudent from './components/DashboardStudent';
import DashboardTeacher from './components/DashboardTeacher';
import StatsSection from './components/StatsSection';
import ProjectsSection from './components/ProjectsSection';
import VideoLectures from './components/VideoLectures';
import GallerySection from './components/GallerySection';
import ConsultationForm from './components/ConsultationForm';
import FAQSection from './components/FAQSection';
import SpecialOffers from './components/SpecialOffers';

import { Language, translations, getTranslatedCourse, translateCategory } from './lib/translations';

type ActiveTabType = 'home' | 'courses' | 'about' | 'offers' | 'contact' | 'dashboard';

export default function App() {
  // --- Persistent State Hooks ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('academy_lang');
    return (saved as Language) || 'ka';
  });

  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('academy_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('academy_courses');
    return saved ? JSON.parse(saved) : mockCourses;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('academy_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('academy_registered_users');
    // Ensure mock teachers are preloaded as valid accounts
    return saved ? JSON.parse(saved) : [...mockTeachers];
  });

  // --- UI Layout & Modal Hooks ---
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // --- Synced Local Storage Updates ---
  useEffect(() => {
    localStorage.setItem('academy_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('academy_active_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('academy_active_user');
    }
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem('academy_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('academy_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('academy_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // --- Auth Event Handlers ---
  const handleLoginSuccess = (user: User) => {
    setActiveUser(user);
    setIsAuthModalOpen(false);
    // If logging in, redirect them to their dashboard
    setActiveTab('dashboard');
  };

  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setActiveUser(null);
    setActiveTab('home');
    setSelectedCourse(null);
  };

  // --- Course Enrollment Handlers ---
  const handleEnrollInCourse = (courseId: string) => {
    if (!activeUser) {
      // Prompt user to login first
      setIsAuthModalOpen(true);
      return;
    }

    if (activeUser.role === 'teacher') {
      alert(
        lang === 'ka' 
          ? 'მასწავლებლებს არ შეუძლიათ კურსებზე დარეგისტრირება მოსწავლის სტატუსით.'
          : lang === 'ru'
          ? 'Преподаватели не могут регистрироваться на курсы в статусе студента.'
          : 'Teachers cannot register for courses as students.'
      );
      return;
    }

    // Check if already enrolled
    const exists = enrollments.some(
      (e) => e.studentId === activeUser.id && e.courseId === courseId
    );

    if (exists) {
      alert(
        lang === 'ka' 
          ? 'თქვენ უკვე დარეგისტრირებული ხართ ამ კურსზე!' 
          : lang === 'ru'
          ? 'Вы уже зарегистрированы на этот курс!'
          : 'You are already registered for this course!'
      );
      return;
    }

    const newEnrollment: Enrollment = {
      id: `enrollment-${Date.now()}`,
      studentId: activeUser.id,
      courseId,
      progress: 0,
      completedLessons: [],
      isCompleted: false,
      enrolledAt: new Date().toISOString()
    };

    setEnrollments((prev) => [...prev, newEnrollment]);

    // Increment enrolledCount on the course
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
      )
    );

    const targetCourse = courses.find((c) => c.id === courseId);
    setEnrollSuccessMessage(
      lang === 'ka' 
        ? `თქვენ წარმატებით დარეგისტრირდით კურსზე: "${targetCourse?.title}"!` 
        : lang === 'ru'
        ? `Вы успешно зарегистрировались на курс: "${targetCourse?.title}"!`
        : `You have successfully registered for the course: "${targetCourse?.title}"!`
    );
    setTimeout(() => {
      setEnrollSuccessMessage(null);
    }, 4000);

    // Auto open dashboard and jump to course study
    setActiveTab('dashboard');
    setSelectedCourse(null);
  };

  // --- Lesson Progression Handlers ---
  const handleUpdateEnrollment = (
    enrollmentId: string,
    completedLessonIds: string[],
    progress: number,
    isCompleted: boolean
  ) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === enrollmentId
          ? {
              ...e,
              completedLessons: completedLessonIds,
              progress,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : e.completedAt
            }
          : e
      )
    );
  };

  // --- Profile Modification Handler ---
  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    if (!activeUser) return;
    const updatedUser = { ...activeUser, ...updatedFields };
    setActiveUser(updatedUser);
    
    // Update registeredUsers list to keep data consistent
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === activeUser.id ? updatedUser : u))
    );
  };

  // --- Instructor Course Creation Handler ---
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  // --- Catalog Filters & Query Searches ---
  const t = translations[lang];

  const translatedCourses = courses.map((c) => getTranslatedCourse(c, lang));

  const filteredCourses = translatedCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'ყველა' || 
      course.category === translateCategory(selectedCategory, lang) ||
      course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBrowseCoursesScroll = () => {
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contact labels localization
  const contactLabels = {
    ka: {
      title: 'საკონტაქტო ინფორმაცია',
      subtitle: 'მოგვწერეთ, დაგვირეკეთ ან გვეწვიეთ ჩვენს აკადემიურ სივრცეებში. ჩვენ ყოველთვის მზად ვართ გიპასუხოთ!',
      branches: 'ჩვენი ფილიალები',
      mainOffice: 'თბილისი (სათაო ოფისი)',
      kutaisiOffice: 'ქუთაისი ფილიალი',
      batumiOffice: 'ბათუმის ფილიალი',
      addressLabel: 'მისამართი',
      phoneLabel: 'ტელეფონი',
      emailLabel: 'ელ-ფოსტა',
      hoursLabel: 'სამუშაო საათები',
      hoursValue: 'ორშაბათი - შაბათი, 10:00 - 20:00',
      mapDirections: 'რუკაზე ნახვა',
      tbilisiAddress: 'ალ. ყაზბეგის გამზირი 24, თბილისი',
      kutaisiAddress: 'რუსთაველის გამზირი 12, ქუთაისი',
      batumiAddress: 'მემედ აბაშიძის გამზირი 45, ბათუმი',
    },
    en: {
      title: 'Contact Information',
      subtitle: 'Get in touch with us via email, phone, or by visiting our branches. We are always happy to assist you!',
      branches: 'Our Branches',
      mainOffice: 'Tbilisi (Head Office)',
      kutaisiOffice: 'Kutaisi Branch',
      batumiOffice: 'Batumi Branch',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hoursLabel: 'Working Hours',
      hoursValue: 'Monday - Saturday, 10:00 - 20:00',
      mapDirections: 'View on map',
      tbilisiAddress: '24 Al. Kazbegi Ave, Tbilisi',
      kutaisiAddress: '12 Rustaveli Ave, Kutaisi',
      batumiAddress: '45 Memed Abashidze Ave, Batumi',
    },
    ru: {
      title: 'Контактная информация',
      subtitle: 'Свяжитесь с нами по электронной почте, телефону или посетите наши филиалы. Мы всегда рады помочь!',
      branches: 'Наши филиалы',
      mainOffice: 'Тбилиси (Главный офис)',
      kutaisiOffice: 'Кутаисский филиал',
      batumiOffice: 'Батумский филиал',
      addressLabel: 'Адрес',
      phoneLabel: 'Телефон',
      emailLabel: 'Эл. почта',
      hoursLabel: 'Рабочие часы',
      hoursValue: 'Понедельник - Суббота, 10:00 - 20:00',
      mapDirections: 'Показать на карте',
      tbilisiAddress: 'Тбилиси, пр. Ал. Казбеги 24',
      kutaisiAddress: 'Кутаиси, пр. Руставели 12',
      batumiAddress: 'Батуми, пр. Мемеда Абашидзе 45',
    }
  }[lang];

  // About localization labels
  const aboutLabels = {
    ka: {
      title: 'ინოვაცია განათლებაში',
      subtitle: 'აკადემია არის ადგილი, სადაც იწყება თქვენი ტექნოლოგიური მომავალი. ჩვენ გთავაზობთ პრაქტიკაზე ორიენტირებულ საგანმანათლებლო პროგრამებს.',
      storyTitle: 'ჩვენი ისტორია',
      storyText: 'აკადემია დაარსდა იმ მიზნით, რომ საქართველოში შეექმნა უმაღლესი დონის IT განათლების კერა. ჩვენი სტუდენტები სწავლობენ რეალურ ინდუსტრიულ ქეისებზე და თანამშრომლობენ წამყვან მენტორებთან. დღეს ჩვენ ვართ ერთ-ერთი ყველაზე სწრაფად მზარდი საზოგადოება.',
      teamTitle: 'ჩვენი წამყვანი მენტორები',
      teamSubtitle: 'გაიცანით პროფესიონალები, რომლებიც გაგიძღვებიან IT სამყაროში.',
      pillarsBadge: 'აკადემიის ღირებულებები',
      pillarsTitle: 'როგორ ვასწავლით GeoAlpha-ში?',
      pillarsSubtitle: 'ჩვენი საგანმანათლებლო მოდელი ორიენტირებულია თითოეული სტუდენტის რეალურ შედეგზე და კარიერულ წინსვლაზე.',
      pillar1_title: 'პრაქტიკაზე ორიენტირებული სწავლება',
      pillar1_text: 'არავითარი მშრალი თეორია! კურსის განმავლობაში სტუდენტები მუშაობენ რეალურ ინდუსტრიულ ქეისებზე და ქმნიან საკუთარ ციფრულ პროდუქტებს.',
      pillar2_title: 'დასაქმების ხელშეწყობა',
      pillar2_text: 'აკადემიის კარიერული ცენტრი აქტიურად თანამშრომლობს პარტნიორ კომპანიებთან, ეხმარება სტუდენტებს რეზიუმეს მომზადებასა და გასაუბრებების დაგეგმვაში.',
      pillar3_title: 'მენტორული მხარდაჭერა',
      pillar3_text: 'ინდივიდუალური უკუკავშირი ყოველი დავალების შემდეგ. ჩვენი პრაქტიკოსი ლექტორები მზად არიან დაგეხმარონ ნებისმიერი სირთულის საკითხის გარჩევაში.',
      pillar4_title: 'სტაჟირება და ვორქშოფები',
      pillar4_text: 'საუკეთესო სტუდენტები იღებენ რეალურ სტაჟირების შესაძლებლობებს და მონაწილეობას იღებენ შიდა პროდუქტების დეველოპმენტში.',
    },
    en: {
      title: 'Innovation in Education',
      subtitle: 'Our academy is where your technological future begins. We offer fully practice-oriented learning programs.',
      storyTitle: 'Our Story',
      storyText: 'The academy was founded with the mission to build a premium IT education ecosystem in Georgia. Our students learn through real industry business cases and cooperate with senior mentors. Today we are one of the fastest growing tech communities.',
      teamTitle: 'Our Leading Mentors',
      teamSubtitle: 'Meet the industry practitioners who will guide you through the tech landscape.',
      pillarsBadge: 'Academy Values',
      pillarsTitle: 'How We Teach At GeoAlpha?',
      pillarsSubtitle: 'Our educational model is focused on real results and career advancement for every student.',
      pillar1_title: 'Practice-Oriented Learning',
      pillar1_text: 'No dry theory! Throughout the course, students work on real-world industrial cases and build their own digital products.',
      pillar2_title: 'Career & Placement Center',
      pillar2_text: 'The academy career center actively cooperates with partner companies, helping students write resumes and prepare for job interviews.',
      pillar3_title: 'Mentor Support',
      pillar3_text: 'Individual feedback after every assignment. Our active practitioners are ready to guide you through any complex tech concept.',
      pillar4_title: 'Internships & Workshops',
      pillar4_text: 'Top performing students receive real internship opportunities and work on internal production software development.',
    },
    ru: {
      title: 'Инновации в образовании',
      subtitle: 'Наша академия — это место, где начинается ваше технологическое будущее. Мы предлагаем полностью практические учебные программы.',
      storyTitle: 'Наша история',
      storyText: 'Академия была основана с миссией создать экосистему IT-образования премиум-класса в Грузии. Наши студенты обучаются на реальных кейсах и работают с ведущими менторами. Сегодня мы — одно из самых быстрорастущих технологических сообществ.',
      teamTitle: 'Наши ведущие менторы',
      teamSubtitle: 'Познакомьтесь с практикующими специалистами, которые проведут вас в мир IT.',
      pillarsBadge: 'Ценности Академии',
      pillarsTitle: 'Как мы обучаем в GeoAlpha?',
      pillarsSubtitle: 'Наша образовательная модель ориентирована на реальные результаты и карьерный рост каждого студента.',
      pillar1_title: 'Практическое обучение',
      pillar1_text: 'Никакой сухой теории! На протяжении всего курса студенты работают над реальными бизнес-кейсами и создают свои цифровые продукты.',
      pillar2_title: 'Центр карьеры и трудоустройства',
      pillar2_text: 'Центр карьеры академии активно сотрудничает с компаниями-партнерами, помогая составлять резюме и готовиться к собеседованиям.',
      pillar3_title: 'Поддержка менторов',
      pillar3_text: 'Индивидуальная обратная связь по каждому заданию. Наши практикующие лекторы готовы помочь разобраться в любых сложных темах.',
      pillar4_title: 'Стажировки и воркшопы',
      pillar4_text: 'Лучшие студенты получают реальную возможность стажировки и участвуют в разработке внутренних программных продуктов.',
    }
  }[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Navigation Module */}
      <Navbar
        user={activeUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Scroll to top when changing primary view tabs
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        activeTab={activeTab}
        lang={lang}
        onLangChange={setLang}
      />

      {/* Floating Success Notification Alert */}
      {enrollSuccessMessage && (
        <div id="enroll-success-banner" className="fixed top-20 right-4 z-50 max-w-md rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
          <div className="text-left">
            <span className="text-xs font-bold text-emerald-800 block">გილოცავთ!</span>
            <span className="text-xs text-emerald-600 block mt-0.5">{enrollSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Main Body Content Canvas */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-20 pb-20 animate-fade-in">
            {/* Visual Header Banner */}
            <Hero
              onBrowseCourses={handleBrowseCoursesScroll}
              onRegister={() => setIsAuthModalOpen(true)}
              isLoggedIn={activeUser !== null}
              lang={lang}
            />

            {/* CURATED FEATURED COURSES SECTION (Solves Clumping) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  {lang === 'ka' ? 'რეკომენდებული პროგრამები' : lang === 'ru' ? 'Рекомендуемые программы' : 'Featured Programs'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
                  {lang === 'ka' ? 'პოპულარული კურსები' : lang === 'ru' ? 'Популярные курсы' : 'Popular Courses'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {lang === 'ka' 
                    ? 'შეისწავლე ყველაზე მოთხოვნადი პროფესიები მაღალი ანაზღაურებით. დაიწყე ნულიდან და გახდი პროფესიონალი.' 
                    : lang === 'ru'
                    ? 'Изучайте самые востребованные профессии с высокой оплатой. Начните с нуля и станьте профессионалом.'
                    : 'Learn the most in-demand skills with top compensations. Start from scratch and become a master.'}
                </p>
              </div>

              {/* Grid showing only 3 top-tier featured courses */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {translatedCourses.slice(0, 3).map((course) => {
                  const isEnrolled = activeUser
                    ? enrollments.some(
                        (e) => e.studentId === activeUser.id && e.courseId === course.id
                      )
                    : false;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={isEnrolled}
                      onSelect={() => setSelectedCourse(course)}
                      onEnroll={() => handleEnrollInCourse(course.id)}
                      isLoggedIn={activeUser !== null}
                      userRole={activeUser?.role}
                      lang={lang}
                    />
                  );
                })}
              </div>

              {/* View All Courses Call to Action */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    setActiveTab('courses');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-600/10"
                >
                  <span>
                    {lang === 'ka' 
                      ? 'ყველა კურსის ნახვა' 
                      : lang === 'ru' 
                      ? 'Посмотреть все курсы' 
                      : 'View All Courses'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </section>

            {/* Student Projects Showcase (GeoLab Style) */}
            <ProjectsSection lang={lang} />

            {/* Free Video Lectures (GeoLab Style) */}
            <VideoLectures lang={lang} />
          </div>
        )}

        {/* VIEW 2: DEDICATED COURSES CATALOG PAGE */}
        {activeTab === 'courses' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
            {/* Search, Stats and Catalog Hero Box */}
            <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>
              
              <div className="text-left space-y-2 max-w-lg">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
                  {translations[lang].catalogBadge}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
                  {translations[lang].catalogTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {translations[lang].catalogSubtitle}
                </p>
              </div>

              {/* Search input field */}
              <div className="w-full lg:max-w-md">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
                    <Search className="h-4 w-4 text-indigo-500" />
                  </span>
                  <input
                    type="text"
                    placeholder={translations[lang].catalogSearchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Category selection bar */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-4 shadow-sm flex flex-wrap gap-2 items-center justify-start">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-3 hidden sm:inline">
                {translations[lang].catalogFilter}
              </span>
              {mockCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold border transition-all duration-150 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {translateCategory(cat, lang)}
                </button>
              ))}
            </div>

            {/* Interactive Grid of Courses */}
            {filteredCourses.length === 0 ? (
              <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center space-y-3 bg-white">
                <BookOpen className="mx-auto h-16 w-16 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">
                  {lang === 'ka' 
                    ? 'კურსები მოცემული კრიტერიუმით ვერ მოიძებნა' 
                    : lang === 'ru' 
                    ? 'Курсы по вашему запросу не найдены' 
                    : 'No courses found matching the search criteria'}
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {lang === 'ka' 
                    ? 'სცადეთ შეცვალოთ საძიებო სიტყვა ან აირჩიოთ სხვა კატეგორია.' 
                    : lang === 'ru' 
                    ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию.' 
                    : 'Try changing your search query or selecting another category.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => {
                  const isEnrolled = activeUser
                    ? enrollments.some(
                        (e) => e.studentId === activeUser.id && e.courseId === course.id
                      )
                    : false;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={isEnrolled}
                      onSelect={() => setSelectedCourse(course)}
                      onEnroll={() => handleEnrollInCourse(course.id)}
                      isLoggedIn={activeUser !== null}
                      userRole={activeUser?.role}
                      lang={lang}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: DEDICATED ABOUT US PAGE */}
        {activeTab === 'about' && (
          <div className="pb-20 space-y-20 animate-fade-in">
            {/* About Narrative Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
              <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                <div className="absolute top-0 left-0 h-40 w-40 bg-emerald-500/5 blur-3xl rounded-full"></div>
                
                <div className="text-left space-y-4 md:flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 border border-emerald-100">
                    <UserCheck className="h-4 w-4" />
                    {lang === 'ka' ? 'აკადემიის მისია' : lang === 'ru' ? 'Наша миссия' : 'Academy Mission'}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
                    {aboutLabels.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">
                    {aboutLabels.subtitle}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      {aboutLabels.storyTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                      {aboutLabels.storyText}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-96 rounded-3xl overflow-hidden shadow-lg border border-slate-100 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&fit=crop"
                    alt="Academy Team Work"
                    className="w-full h-64 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Academy Core Pillars and Methodology */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
                  <Award className="h-3.5 w-3.5" />
                  {aboutLabels.pillarsBadge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
                  {aboutLabels.pillarsTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {aboutLabels.pillarsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: aboutLabels.pillar1_title,
                    text: aboutLabels.pillar1_text,
                    icon: Laptop,
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
                  },
                  {
                    title: aboutLabels.pillar2_title,
                    text: aboutLabels.pillar2_text,
                    icon: Target,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  },
                  {
                    title: aboutLabels.pillar3_title,
                    text: aboutLabels.pillar3_text,
                    icon: GraduationCap,
                    color: 'text-amber-600 bg-amber-50 border-amber-100'
                  },
                  {
                    title: aboutLabels.pillar4_title,
                    text: aboutLabels.pillar4_text,
                    icon: Zap,
                    color: 'text-rose-600 bg-rose-50 border-rose-100'
                  }
                ].map((pillar, pi) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pi}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pi * 0.1, duration: 0.3 }}
                      className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col space-y-4"
                    >
                      <div className={`p-3 rounded-2xl w-12 h-12 flex items-center justify-center border ${pillar.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-light flex-1">
                        {pillar.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Interactive Statistics Block */}
            <StatsSection lang={lang} />

            {/* Campus & Labs Gallery */}
            <GallerySection lang={lang} />

            {/* Our Mentors Faculty Grid (Saves from Home Clutter) */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 border border-indigo-100">
                  {lang === 'ka' ? 'პროფესიონალი მასწავლებლები' : lang === 'ru' ? 'Профессиональные преподаватели' : 'Professional Mentors'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
                  {aboutLabels.teamTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {aboutLabels.teamSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {mockTeachers.map((teacher, idx) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="bg-white border border-slate-200/80 rounded-[2rem] p-6 text-center space-y-4 shadow-sm hover:shadow-md transition group"
                  >
                    <div className="relative inline-block">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="h-24 w-24 rounded-full mx-auto object-cover border-2 border-slate-100 shadow group-hover:border-indigo-500 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 right-1.5 h-6 w-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                        ✓
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-base">{teacher.name}</h4>
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block font-mono">
                        {teacher.headline}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      {teacher.bio}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 4: DEDICATED SPECIAL OFFERS PAGE */}
        {activeTab === 'offers' && (
          <div className="pb-10 animate-fade-in">
            <SpecialOffers
              lang={lang}
              onSelectCoursesTab={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onOpenConsultation={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          </div>
        )}

        {/* VIEW 5: DEDICATED CONTACT US PAGE */}
        {activeTab === 'contact' && (
          <div className="pb-20 space-y-20 animate-fade-in">
            {/* Header and Branch list */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
              <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl rounded-full"></div>
                
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-rose-700 border border-rose-100">
                    <Phone className="h-3.5 w-3.5" />
                    {lang === 'ka' ? 'კავშირი' : lang === 'ru' ? 'Контакты' : 'Get In Touch'}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none font-display">
                    {contactLabels.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                    {contactLabels.subtitle}
                  </p>
                </div>

                {/* Branches visual cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                  {[
                    { title: contactLabels.mainOffice, addr: contactLabels.tbilisiAddress, phone: '+995 322 199 200', email: 'info@geoalfa.edu.ge' },
                    { title: contactLabels.kutaisiOffice, addr: contactLabels.kutaisiAddress, phone: '+995 431 223 344', email: 'kutaisi@geoalfa.edu.ge' },
                    { title: contactLabels.batumiOffice, addr: contactLabels.batumiAddress, phone: '+995 422 554 433', email: 'batumi@geoalfa.edu.ge' }
                  ].map((branch, bi) => (
                    <div key={bi} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-4 hover:border-indigo-200 transition">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono block">Branch {bi + 1}</span>
                        <h3 className="font-extrabold text-slate-900 text-sm">{branch.title}</h3>
                      </div>
                      
                      <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{branch.addr}</span>
                        </div>
                        <div className="flex gap-2">
                          <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex gap-2">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{branch.email}</span>
                        </div>
                        <div className="flex gap-2 border-t border-slate-200/50 pt-2.5 mt-2.5">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{contactLabels.hoursValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Free Consultation form */}
            <ConsultationForm lang={lang} />

            {/* FAQs section Accordion */}
            <FAQSection lang={lang} />
          </div>
        )}

        {/* VIEW 6: PERSONAL USER CABINET & LEARNING ZONE */}
        {activeTab === 'dashboard' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {activeUser ? (
              activeUser.role === 'teacher' ? (
                /* Teacher dashboard */
                <DashboardTeacher
                  teacher={activeUser}
                  courses={courses}
                  enrollments={enrollments}
                  onAddCourse={handleAddCourse}
                  onUpdateProfile={handleUpdateProfile}
                  lang={lang}
                />
              ) : (
                /* Student dashboard */
                <DashboardStudent
                  student={activeUser}
                  courses={courses}
                  enrollments={enrollments}
                  onUpdateEnrollment={handleUpdateEnrollment}
                  onUpdateProfile={handleUpdateProfile}
                  lang={lang}
                />
              )
            ) : (
              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full"></div>
                <GraduationCap className="mx-auto h-16 w-16 text-indigo-500 animate-pulse" />
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
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md active:scale-[0.98]"
                >
                  {lang === 'ka' 
                    ? 'ავტორიზაციის გავლა' 
                    : lang === 'ru' 
                    ? 'Войти / Зарегистрироваться' 
                    : 'Log In / Register'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-100 bg-white py-10 text-slate-400 text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-left leading-tight flex items-center gap-2.5">
            <BrandLogo size="sm" onTabChange={() => { setActiveTab('home'); window.scrollTo({ top: 0 }); }} lang={lang} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0 }); }} className="hover:text-slate-800 transition">
              {lang === 'ka' ? 'აკადემიის შესახებ' : lang === 'ru' ? 'Об академии' : 'About Academy'}
            </button>
            <button onClick={() => { setActiveTab('offers'); window.scrollTo({ top: 0 }); }} className="hover:text-slate-800 transition">
              {lang === 'ka' ? 'აქციები' : lang === 'ru' ? 'Специальные акции' : 'Special Offers'}
            </button>
            <button onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0 }); }} className="hover:text-slate-800 transition">
              {lang === 'ka' ? 'კონტაქტი' : lang === 'ru' ? 'Контакты' : 'Contact'}
            </button>
          </div>
        </div>
      </footer>

      {/* --- Overlay Modals Portal --- */}
      <AnimatePresence>
        {/* Course detail Modal */}
        {selectedCourse && (
          <CourseDetailModal
            course={selectedCourse}
            isOpen={selectedCourse !== null}
            onClose={() => setSelectedCourse(null)}
            isEnrolled={
              activeUser
                ? enrollments.some(
                    (e) => e.studentId === activeUser.id && e.courseId === selectedCourse.id
                  )
                : false
            }
            onEnroll={() => {
              handleEnrollInCourse(selectedCourse.id);
            }}
            onStartStudy={() => {
              setSelectedCourse(null);
              setActiveTab('dashboard');
            }}
            isLoggedIn={activeUser !== null}
            userRole={activeUser?.role}
            lang={lang}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
            onLoginSuccess={(user) => setActiveUser(user)}
          />
        )}

        {/* Auth / Register Modal */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            onRegisterUser={handleRegisterUser}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
