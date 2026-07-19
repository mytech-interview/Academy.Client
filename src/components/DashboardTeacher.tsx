import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Award, 
  Trash, 
  Star, 
  CheckCircle, 
  ChevronDown, 
  Check,
  User as UserIcon,
  Mail,
  Phone,
  Edit3,
  MapPin,
  Clock,
  Briefcase,
  Camera
} from 'lucide-react';
import { Course, Lesson, User, Enrollment } from '../types';
import { Language, translations, getTranslatedCourse } from '../lib/translations';

interface DashboardTeacherProps {
  teacher: User;
  courses: Course[];
  enrollments: Enrollment[];
  onAddCourse: (newCourse: Course) => void;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
  lang: Language;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
];

export default function DashboardTeacher({
  teacher,
  courses,
  enrollments,
  onAddCourse,
  onUpdateProfile,
  lang
}: DashboardTeacherProps) {
  const t = translations[lang];
  
  // Tab controller
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'profile'>('courses');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('პროგრამირება');
  const [level, setLevel] = useState<'დამწყები' | 'საშუალო' | 'პროფესიონალი'>('დამწყები');
  const [duration, setDuration] = useState('16 საათი');
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [priceValue, setPriceValue] = useState('49');
  const [image, setImage] = useState('');
  const [syllabusInput, setSyllabusInput] = useState('');
  
  // Custom physical meetings builder
  const [lessons, setLessons] = useState<{ title: string; duration: string; room: string; content: string }[]>([
    { 
      title: 'შესავალი შეხვედრა და პრაქტიკული სამუშაო გარემოს გამართვა', 
      duration: '2 საათი', 
      room: 'აუდიტორია #204', 
      content: 'შევხვდებით GeoAlpha-ს მთავარ კამპუსში. განვიხილავთ კურსის მიზნებს და მოვამზადებთ სამუშაო გარემოს.' 
    }
  ]);

  const [formSuccess, setFormSuccess] = useState(false);

  // Profile forms state
  const [profName, setProfName] = useState(teacher.name);
  const [profEmail, setProfEmail] = useState(teacher.email);
  const [profPhone, setProfPhone] = useState((teacher as any).phone || '+995 577 987 654');
  const [profHeadline, setProfHeadline] = useState(teacher.headline || 'აკადემიის წამყვანი ლექტორი');
  const [profBio, setProfBio] = useState(teacher.bio || 'გამოცდილი პრაქტიკოსი მენტორი, მზად არის დაგეხმაროთ უახლესი ტექნოლოგიების ათვისებაში.');
  const [profAvatar, setProfAvatar] = useState(teacher.avatar || AVATAR_PRESETS[1]);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Filter courses created by this teacher
  const teacherCourses = courses.filter((c) => c.teacherId === teacher.id);
  const totalCreated = teacherCourses.length;

  // Calculate total students enrolled in this teacher's courses
  const enrolledStudentIds = enrollments
    .filter((e) => teacherCourses.some((tc) => tc.id === e.courseId))
    .map((e) => e.studentId);
  const totalStudents = enrolledStudentIds.length;

  // Average Rating
  const avgRating = teacherCourses.length > 0
    ? (teacherCourses.reduce((acc, curr) => acc + curr.rating, 0) / teacherCourses.length).toFixed(1)
    : '5.0';

  const handleAddLessonField = () => {
    setLessons([...lessons, { title: '', duration: '2 საათი', room: 'აუდიტორია #204', content: '' }]);
  };

  const handleRemoveLessonField = (idx: number) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  const handleLessonChange = (idx: number, field: string, value: string) => {
    const updated = [...lessons];
    updated[idx] = { ...updated[idx], [field]: value };
    setLessons(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) return;

    // Build syllabus array
    const syllabusArray = syllabusInput
      ? syllabusInput.split(',').map((item) => item.trim()).filter((item) => item !== '')
      : ['შესავალი და გარემოს მომზადება', 'პრაქტიკული სავარჯიშოები აუდიტორიაში', 'ფინალური პროექტის პრეზენტაცია'];

    const formattedLessons: Lesson[] = lessons.map((l, idx) => ({
      id: `lesson-${Date.now()}-${idx}`,
      title: l.title || `ლექცია ${idx + 1}: თემატიკა`,
      duration: l.duration,
      type: 'classroom', // set to classroom for auditorial classes
      content: l.content,
      ...({ room: l.room } as any) // assign physical room details
    }));

    const priceString = priceType === 'free' ? 'უფასო' : `${priceValue} ₾`;
    const defaultImage = category === 'პროგრამირება' 
      ? 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800'
      : category === 'დიზაინი'
      ? 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=800'
      : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800';

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      description,
      category,
      level,
      duration,
      image: image || defaultImage,
      teacherId: teacher.id,
      teacherName: teacher.name,
      lessons: formattedLessons,
      enrolledCount: 0,
      rating: 5.0,
      price: priceString,
      syllabus: syllabusArray
    };

    onAddCourse(newCourse);
    setFormSuccess(true);
    
    // Reset Form
    setTimeout(() => {
      setShowAddForm(false);
      setFormSuccess(false);
      setTitle('');
      setDescription('');
      setSyllabusInput('');
      setLessons([{ 
        title: 'შესავალი შეხვედრა და პრაქტიკული სამუშაო გარემოს გამართვა', 
        duration: '2 საათი', 
        room: 'აუდიტორია #204', 
        content: 'შევხვდებით GeoAlpha-ს მთავარ კამპუსში. განვიხილავთ კურსის მიზნებს და მოვამზადებთ სამუშაო გარემოს.' 
      }]);
    }, 1500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profName,
        email: profEmail,
        headline: profHeadline,
        bio: profBio,
        avatar: profAvatar,
        ...({ phone: profPhone } as any)
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2000);
    }
  };

  const helloTexts = {
    ka: `გამარჯობა, ${teacher.name}! 🎓`,
    en: `Hello, ${teacher.name}! 🎓`,
    ru: `Привет, ${teacher.name}! 🎓`
  };

  const localT = {
    coursesTab: { ka: 'ჩემი კურსები', en: 'My Courses', ru: 'Мои курсы' },
    profileTab: { ka: 'პირადი მონაცემები', en: 'Personal Data', ru: 'Личные данные' },
    teacherCabinet: { ka: 'მასწავლებლის კაბინეტი', en: 'Teacher Cabinet', ru: 'Личный кабинет преподавателя' },
    teacherWelcomeText: {
      ka: 'მართეთ თქვენი აუდიტორიული კურსები, დაგეგმეთ ფიზიკური შეხვედრები და შეადგინეთ ცხრილი.',
      en: 'Manage your physical courses, schedule classroom meetings, and organize timetables.',
      ru: 'Управляйте офлайн курсами, планируйте занятия в классах и составляйте расписание.'
    },
    newCourse: { ka: 'ახალი კურსი', en: 'New Course', ru: 'Новый курс' },
    createdCourses: { ka: 'შექმნილი კურსები', en: 'Created Courses', ru: 'Созданные курсы' },
    totalStudents: { ka: 'ჯამური სტუდენტები', en: 'Total Students', ru: 'Всего студентов' },
    avgRating: { ka: 'საშუალო რეიტინგი', en: 'Average Rating', ru: 'Средний рейтинг' },
    coursesCount: {
      ka: (n: number) => `${n} კურსი`,
      en: (n: number) => `${n} courses`,
      ru: (n: number) => `${n} курсов`
    },
    studentsCount: {
      ka: (n: number) => `${n} სტუდენტი`,
      en: (n: number) => `${n} students`,
      ru: (n: number) => `${n} студентов`
    },
    courseBuilderTitle: { ka: 'აუდიტორიული კურსის შექმნა', en: 'Create Classroom Course', ru: 'Создание офлайн курса' },
    courseBuilderSub: {
      ka: 'შეავსეთ სალექციო განრიგი, მიუთითეთ შესაბამისი აუდიტორიის ნომერი და გამოაქვეყნეთ კატალოგში',
      en: 'Fill in the lecture schedule, specify the physical classrooms, and publish to the catalog',
      ru: 'Заполните расписание лекций, укажите учебные аудитории и опубликуйте в каталоге'
    },
    courseAddedSuccess: { ka: 'კურსი წარმატებით დაემატა კატალოგში!', en: 'Course successfully added to the catalog!', ru: 'Курс успешно добавлен в каталог!' },
    panelClosingSoon: { ka: 'პანელი მალე დაიხურება...', en: 'Panel closing soon...', ru: 'Панель скоро закроется...' },
    courseTitleLabel: { ka: 'კურსის დასახელება *', en: 'Course Title *', ru: 'Название курса *' },
    courseTitlePlaceholder: { ka: 'მაგ: Full-Stack ვებ-დეველოპმენტი აუდიტორიაში', en: 'e.g. On-site Full-Stack Development', ru: 'напр. Офлайн Full-Stack разработка' },
    categoryLabel: { ka: 'კატეგორია *', en: 'Category *', ru: 'Категория *' },
    difficultyLabel: { ka: 'სირთულე', en: 'Difficulty', ru: 'Сложность' },
    durationLabel: { ka: 'სასწავლო საათები', en: 'Study Hours', ru: 'Учебные часы' },
    durationPlaceholder: { ka: 'მაგ: 16 საათი', en: 'e.g. 16 hours', ru: 'напр. 16 часов' },
    priceLabel: { ka: 'ღირებულება', en: 'Price', ru: 'Стоимость' },
    freeOpt: { ka: 'უფასო', en: 'Free', ru: 'Бесплатно' },
    paidOpt: { ka: 'ფასიანი', en: 'Paid', ru: 'Платно' },
    imageUrlLabel: { ka: 'სურათის ბმული (სურვილისამებრ)', en: 'Image URL (Optional)', ru: 'Ссылка на изображение (опционально)' },
    courseDescLabel: { ka: 'კურსის აღწერა *', en: 'Course Description *', ru: 'Описание курса *' },
    courseDescPlaceholder: { ka: 'აღწერეთ მოკლედ რას შეისწავლის სტუდენტი ამ კურსის განმავლობაში აუდიტორიაში...', en: 'Briefly describe what students will learn during this on-site course...', ru: 'Кратко опишите, что студенты изучат в ходе этого офлайн-курса...' },
    syllabusLabel: { ka: 'სილაბუსის პუნქტები (მძიმით გამოყოფილი)', en: 'Syllabus items (comma-separated)', ru: 'Пункты программы (через запятую)' },
    syllabusPlaceholder: { ka: 'მაგ: შესავალი, კომპონენტები, მონაცემთა მართვა', en: 'e.g. Introduction, Components, State Management', ru: 'напр. Введение, Компоненты, Управление состоянием' },
    courseLessonsTitle: { ka: 'სალექციო შეხვედრების დაგეგმვა', en: 'Lecture Meetings Scheduling', ru: 'Планирование лекционных занятий' },
    addLessonBtn: { ka: '+ შეხვედრის დამატება', en: '+ Add Meeting', ru: '+ Добавить занятие' },
    lessonTitlePlaceholder: { ka: 'ლექციის თემა', en: 'Lecture Topic', ru: 'Тема лекции' },
    lessonDurationPlaceholder: { ka: 'ხანგრძლივობა (მაგ: 2 საათი)', en: 'Duration (e.g. 2 hours)', ru: 'Длительность (напр. 2 часа)' },
    lessonContentPlaceholder: { ka: 'ლექციის მოკლე კონტენტი ან პრაქტიკული დავალება', en: 'Lecture content or classroom assignment', ru: 'Содержимое лекции или практическое задание' },
    cancelBtn: { ka: 'გაუქმება', en: 'Cancel', ru: 'Отмена' },
    publishBtn: { ka: 'გამოქვეყნება', en: 'Publish', ru: 'Опубликовать' },
    myCreatedCoursesTitle: { ka: 'ჩემ მიერ შექმნილი კურსები', en: 'My Created Courses', ru: 'Мои созданные курсы' },
    noCoursesYet: { ka: 'თქვენ ჯერ არ გაქვთ შექმნილი კურსი', en: "You haven't created any courses yet", ru: 'Вы еще не создали ни одного курса' },
    createFirstCourseBtn: { ka: 'შექმენით თქვენი პირველი კურსი ახლავე →', en: 'Create your first course now →', ru: 'Создайте свой первый курс прямо сейчас →' },
    studentsTableLabel: { ka: 'სტუდენტები', en: 'Students', ru: 'Студенты' },
    lessonsTableLabel: { ka: 'ლექციები', en: 'Lectures', ru: 'Лекции' },
    ratingTableLabel: { ka: 'რეიტინგი', en: 'Rating', ru: 'Рейтинг' },
    pricePrefix: { ka: 'ღირებულება:', en: 'Price:', ru: 'Стоимость:' },
    durationPrefix: { ka: 'ხანგრძლივობა:', en: 'Duration:', ru: 'Длительность:' },
    
    // Profile labels
    profEditTitle: { ka: 'ლექტორის პროფილის რედაქტირება', en: 'Edit Lecturer Profile', ru: 'Редактировать профиль преподавателя' },
    profEditSub: { ka: 'განაახლეთ თქვენი მონაცემები, რომლებიც აისახება კატალოგში სტუდენტებისთვის', en: 'Update your profile details displayed to students in the catalog', ru: 'Обновите свои данные, отображаемые студентам в каталоге' },
    fullNameLabel: { ka: 'სახელი და გვარი *', en: 'Full Name *', ru: 'Имя и фамилия *' },
    phoneLabel: { ka: 'ტელეფონის ნომერი *', en: 'Phone Number *', ru: 'Номер телефона *' },
    headlineLabel: { ka: 'პროფესიული სტატუსი / სათაური *', en: 'Professional Headline / Specialization *', ru: 'Профессиональный статус / Специализация *' },
    bioLabel: { ka: 'ბიოგრაფია / გამოცდილება', en: 'Biography / Experience', ru: 'Биография / Опыт работы' },
    avatarSelectLabel: { ka: 'აირჩიეთ ფოტო', en: 'Select Photo', ru: 'Выберите фото' },
    saveChangesBtn: { ka: 'ცვლილებების შენახვა', en: 'Save Changes', ru: 'Сохранить изменения' },
    profileSavedSuccess: { ka: 'პროფილი წარმატებით განახლდა!', en: 'Profile updated successfully!', ru: 'Профиль успешно обновлен!' },
    classroomLabel: { ka: 'ოთახი / აუდიტორია *', en: 'Classroom / Auditorium *', ru: 'Аудитория *' }
  };

  return (
    <div id="teacher-dashboard" className="space-y-8 py-4 text-left">
      {/* Welcome banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-950 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden border border-slate-950/20">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10 relative">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{localT.teacherCabinet[lang]}</span>
            <h2 id="welcome-teacher-title" className="text-2xl font-black tracking-tight sm:text-3xl font-display">
              {helloTexts[lang]}
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {localT.teacherWelcomeText[lang]}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveSubTab('courses');
              setShowAddForm(!showAddForm);
            }}
            id="btn-teacher-toggle-create"
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition active:scale-[0.98] shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            {localT.newCourse[lang]}
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-6 pb-0.5">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`pb-3 text-sm font-extrabold transition relative ${
            activeSubTab === 'courses' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {localT.coursesTab[lang]}
          {activeSubTab === 'courses' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 text-sm font-extrabold transition relative ${
            activeSubTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {localT.profileTab[lang]}
          {activeSubTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === 'profile' ? (
        /* LECTURER PROFILE EDITOR */
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fade-in text-left">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-black text-slate-950 tracking-tight">{localT.profEditTitle[lang]}</h3>
            <p className="text-xs text-slate-400 mt-1">{localT.profEditSub[lang]}</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Preset Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">{localT.avatarSelectLabel[lang]}</label>
              <div className="flex flex-wrap items-center gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <div className="relative group shrink-0">
                  <img 
                    src={profAvatar} 
                    alt="Lecturer Avatar" 
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-600/30 shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{lang === 'ka' ? 'აირჩიეთ მზა ავატარი' : lang === 'ru' ? 'Выберите готовый аватар' : 'Choose ready avatar'}</span>
                  <div className="flex gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfAvatar(preset)}
                        className={`h-10 w-10 rounded-full overflow-hidden border-2 transition ${
                          profAvatar === preset ? 'border-indigo-600 scale-105 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{lang === 'ka' ? 'ან ატვირთეთ საკუთარი ფოტო' : lang === 'ru' ? 'Или загрузите свое фото' : 'Or upload your own'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    id="teacher-custom-avatar"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setProfAvatar(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="teacher-custom-avatar"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-sm active:scale-[0.98]"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-500" />
                    <span>{lang === 'ka' ? 'ფოტოს არჩევა' : lang === 'ru' ? 'Выбрать файл' : 'Select Photo'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{localT.fullNameLabel[lang]}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">ელ-ფოსტა *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{localT.phoneLabel[lang]}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{localT.headlineLabel[lang]}</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={profHeadline}
                    onChange={(e) => setProfHeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{localT.bioLabel[lang]}</label>
              <textarea
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Success Feedback */}
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                {localT.profileSavedSuccess[lang]}
              </div>
            )}

            {/* Submit btn */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 transition active:scale-[0.98] shadow-md cursor-pointer"
              >
                {localT.saveChangesBtn[lang]}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MY COURSES TAB */
        <>
          {/* Stats metrics */}
          <div id="teacher-stats-row" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{localT.createdCourses[lang]}</span>
                <span id="stat-created-courses" className="block text-xl font-black text-slate-900 font-display">{localT.coursesCount[lang](totalCreated)}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{localT.totalStudents[lang]}</span>
                <span id="stat-total-enrolled" className="block text-xl font-black text-slate-900 font-display">{localT.studentsCount[lang](totalStudents)}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 font-bold">
                <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{localT.avgRating[lang]}</span>
                <span id="stat-avg-rating" className="block text-xl font-black text-slate-900 font-display">{avgRating} / 5</span>
              </div>
            </div>
          </div>

          {/* Dynamic Course Builder Form */}
          {showAddForm && (
            <div id="course-builder-form-container" className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-950 font-sans tracking-tight">{localT.courseBuilderTitle[lang]}</h3>
                <p className="text-xs text-slate-500 mt-1">{localT.courseBuilderSub[lang]}</p>
              </div>

              {formSuccess ? (
                <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700">
                  <Award className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
                  <p className="font-bold">{localT.courseAddedSuccess[lang]}</p>
                  <p className="text-xs">{localT.panelClosingSoon[lang]}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course Title */}
                    <div className="space-y-1">
                      <label htmlFor="course-title" className="text-xs font-bold text-slate-700">{localT.courseTitleLabel[lang]}</label>
                      <input
                        type="text"
                        id="course-title"
                        placeholder={localT.courseTitlePlaceholder[lang]}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label htmlFor="course-category" className="text-xs font-bold text-slate-700">{localT.categoryLabel[lang]}</label>
                      <select
                        id="course-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                      >
                        <option value="პროგრამირება">{lang === 'ka' ? 'პროგრამირება' : lang === 'ru' ? 'Программирование' : 'Programming'}</option>
                        <option value="დიზაინი">{lang === 'ka' ? 'დიზაინი' : lang === 'ru' ? 'Дизайн' : 'Design'}</option>
                        <option value="ბიზნესი და მარკეტინგი">{lang === 'ka' ? 'ბიზნესი და მარკეტინგი' : lang === 'ru' ? 'Бизнес и Маркетинг' : 'Business & Marketing'}</option>
                      </select>
                    </div>

                    {/* Level */}
                    <div className="space-y-1">
                      <label htmlFor="course-level" className="text-xs font-bold text-slate-700">{localT.difficultyLabel[lang]}</label>
                      <select
                        id="course-level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                      >
                        <option value="დამწყები">{lang === 'ka' ? 'დამწყები' : lang === 'ru' ? 'Новичок' : 'Beginner'}</option>
                        <option value="საშუალო">{lang === 'ka' ? 'საშუალო' : lang === 'ru' ? 'Средний' : 'Intermediate'}</option>
                        <option value="პროფესიონალი">{lang === 'ka' ? 'პროფესიონალი' : lang === 'ru' ? 'Профессионал' : 'Professional'}</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                      <label htmlFor="course-duration" className="text-xs font-bold text-slate-700">{localT.durationLabel[lang]}</label>
                      <input
                        type="text"
                        id="course-duration"
                        placeholder={localT.durationPlaceholder[lang]}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                      />
                    </div>

                    {/* Price Picker */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">{localT.priceLabel[lang]}</label>
                      <div className="flex gap-4 items-center pt-1.5">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            checked={priceType === 'free'}
                            onChange={() => setPriceType('free')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          {localT.freeOpt[lang]}
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            checked={priceType === 'paid'}
                            onChange={() => setPriceType('paid')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          {localT.paidOpt[lang]}
                        </label>

                        {priceType === 'paid' && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={priceValue}
                              onChange={(e) => setPriceValue(e.target.value)}
                              className="w-16 rounded-lg border border-slate-200 p-1 text-xs text-center"
                            />
                            <span className="text-xs font-bold">₾</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image URL / Upload Course Cover */}
                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label htmlFor="course-image" className="text-xs font-bold text-slate-700 block">
                        {lang === 'ka' ? 'კურსის გარეკანი (ატვირთეთ ფოტო ან მიუთითეთ ბმული)' : lang === 'ru' ? 'Обложка курса (загрузите фото или укажите ссылку)' : 'Course Cover (upload photo or enter URL)'}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input
                          type="text"
                          id="course-image"
                          placeholder={lang === 'ka' ? 'მაგ: https://images.unsplash.com/... ან ატვირთეთ' : 'e.g. URL or upload custom cover'}
                          value={image.startsWith('data:') ? 'ფაილი ატვირთულია 📁' : image}
                          onChange={(e) => setImage(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                          disabled={image.startsWith('data:')}
                        />
                        {image.startsWith('data:') && (
                          <button
                            type="button"
                            onClick={() => setImage('')}
                            className="text-xs font-bold text-red-500 hover:text-red-700 px-2 transition"
                          >
                            {lang === 'ka' ? 'წაშლა' : 'Clear'}
                          </button>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          id="course-cover-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setImage(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="course-cover-upload"
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition shadow-sm whitespace-nowrap shrink-0"
                        >
                          <Camera className="h-4 w-4 text-slate-500" />
                          <span>{lang === 'ka' ? 'ატვირთვა' : lang === 'ru' ? 'Загрузить' : 'Upload Cover'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="space-y-1">
                    <label htmlFor="course-desc" className="text-xs font-bold text-slate-700">{localT.courseDescLabel[lang]}</label>
                    <textarea
                      id="course-desc"
                      rows={3}
                      placeholder={localT.courseDescPlaceholder[lang]}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                      required
                    />
                  </div>

                  {/* Syllabus input (comma separated) */}
                  <div className="space-y-1">
                    <label htmlFor="course-syllabus" className="text-xs font-bold text-slate-700">{localT.syllabusLabel[lang]}</label>
                    <input
                      type="text"
                      id="course-syllabus"
                      placeholder={localT.syllabusPlaceholder[lang]}
                      value={syllabusInput}
                      onChange={(e) => setSyllabusInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
                    />
                  </div>

                  {/* Lessons Builder Sub-Module */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                      <h4 className="text-xs font-extrabold text-slate-800">{localT.courseLessonsTitle[lang]} ({lessons.length})</h4>
                      <button
                        type="button"
                        onClick={handleAddLessonField}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        {localT.addLessonBtn[lang]}
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {lessons.map((lesson, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-150 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-indigo-600 uppercase">
                              {lang === 'ka' ? `ლექცია #${idx + 1}` : lang === 'ru' ? `Лекция #${idx + 1}` : `Lecture #${idx + 1}`}
                            </span>
                            {lessons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLessonField(idx)}
                                className="text-red-500 hover:text-red-700 rounded-md p-0.5 cursor-pointer"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Title */}
                            <div className="sm:col-span-2 space-y-0.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{localT.lessonTitlePlaceholder[lang]}</label>
                              <input
                                type="text"
                                placeholder="მაგ: React-ის შესავალი"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(idx, 'title', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                              />
                            </div>

                            {/* Duration */}
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{localT.lessonDurationPlaceholder[lang]}</label>
                              <input
                                type="text"
                                placeholder="მაგ: 2 საათი"
                                value={lesson.duration}
                                onChange={(e) => handleLessonChange(idx, 'duration', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            {/* Classroom */}
                            <div className="sm:col-span-1 space-y-0.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{localT.classroomLabel[lang]}</label>
                              <input
                                type="text"
                                placeholder="მაგ: აუდიტორია #204"
                                value={lesson.room}
                                onChange={(e) => handleLessonChange(idx, 'room', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                              />
                            </div>

                            {/* Content or physical notes */}
                            <div className="sm:col-span-2 space-y-0.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">{localT.lessonContentPlaceholder[lang]}</label>
                              <textarea
                                placeholder="მაგ: მოიტანეთ საკუთარი ლეპტოპები, შევასრულებთ პრაქტიკულ სამუშაოს..."
                                value={lesson.content}
                                onChange={(e) => handleLessonChange(idx, 'content', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action submission buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {localT.cancelBtn[lang]}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                    >
                      {localT.publishBtn[lang]}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Teacher's Created Courses list */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-bold text-slate-950">{localT.myCreatedCoursesTitle[lang]}</h3>
            
            {teacherCourses.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">{localT.noCoursesYet[lang]}</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    {localT.createFirstCourseBtn[lang]}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {teacherCourses.map((rawCourse) => {
                  const course = getTranslatedCourse(rawCourse, lang);
                  const courseStudents = enrollments.filter((e) => e.courseId === course.id).length;

                  return (
                    <div
                      key={course.id}
                      className="rounded-[2rem] border border-slate-200 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left leading-none">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 block mb-0.5">{course.category}</span>
                            <h4 className="text-sm font-bold text-slate-950 line-clamp-1">{course.title}</h4>
                          </div>
                        </div>
                        <span className="rounded-lg bg-slate-50 border border-slate-150 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {course.level}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-50 py-3 text-center">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">{localT.studentsTableLabel[lang]}</span>
                          <span className="block text-sm font-black text-slate-800">{courseStudents}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">{localT.lessonsTableLabel[lang]}</span>
                          <span className="block text-sm font-black text-slate-800">{course.lessons.length}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">{localT.ratingTableLabel[lang]}</span>
                          <span className="block text-sm font-black text-slate-800">{course.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Display Lecture schedules list */}
                      {course.lessons && course.lessons.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                          <strong className="text-slate-800 text-[10px] uppercase tracking-wider block">📅 {lang === 'ka' ? 'სალექციო ოთახების განრიგი:' : lang === 'ru' ? 'Расписание аудиторий:' : 'Whiteboard Rooms Timetable:'}</strong>
                          <div className="max-h-[80px] overflow-y-auto space-y-1 font-mono">
                            {course.lessons.map((meeting, mIdx) => (
                              <div key={mIdx} className="flex justify-between border-b border-slate-200/50 pb-0.5">
                                <span className="truncate pr-2">{meeting.title}</span>
                                <span className="shrink-0 text-indigo-600 font-bold font-sans">{(meeting as any).room || 'Auditorium 204'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{localT.pricePrefix[lang]} <strong className="text-slate-700">{course.price === 'უფასო' ? (lang === 'ka' ? 'უფასო' : lang === 'ru' ? 'Бесплатно' : 'Free') : course.price}</strong></span>
                        <span className="font-medium">{localT.durationPrefix[lang]} {course.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
