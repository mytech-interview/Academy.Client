import { Course, User } from '../types';

// ─── MOCK TEACHERS ────────────────────────────────────────────────────────────
export const mockTeachers: User[] = [
  {
    id: 'teacher-1',
    email: 'm.beridze@academy.ge',
    name: 'მარიამ ბერიძე',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    headline: 'Senior Full-Stack დეველოპმენტი',
    bio: '10-წლიანი გამოცდილება ვებ-დეველოპმენტში.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'teacher-2',
    email: 'g.kalandadze@academy.ge',
    name: 'გიორგი კალანდაძე',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    headline: 'UX/UI & პროდუქტის დიზაინერი',
    bio: 'პროდუქტის წამყვანი დიზაინერი.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'teacher-3',
    email: 'n.shengelia@academy.ge',
    name: 'ნინო შენგელია',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    headline: 'ციფრული მარკეტინგის ექსპერტი',
    bio: 'სერტიფიცირებული SEO და Google Ads სპეციალისტი.',
    createdAt: new Date().toISOString(),
  },
];

// ─── MOCK STUDENTS ────────────────────────────────────────────────────────────
// Use these to log in — any password works in mock mode.
export const mockStudents: User[] = [
  {
    id: 'student-1',
    email: 'demo.student@academy.ge',
    name: 'გიორგი მამულაშვილი',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    headline: 'Front-End სტუდენტი',
    bio: 'მოტივირებული სტუდენტი, ვსწავლობ React-ს.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-2',
    email: 'ana.k@academy.ge',
    name: 'ანა კვარაცხელია',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    headline: 'UX Design სტუდენტი',
    bio: 'Figma-ში ვმუშაობ და UI სწავლობ.',
    createdAt: new Date().toISOString(),
  },
];

// ─── MOCK OTP ─────────────────────────────────────────────────────────────────
// When the real backend is offline, this code is accepted as valid.
export const MOCK_OTP_CODE = '123456';

// ─── COURSES (keep existing) ──────────────────────────────────────────────────
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'ვებ დეველოპმენტის სრული კურსი (React & Node.js)',
    description: 'შეისწავლეთ თანამედროვე ვებ დეველოპმენტი ნულიდან.',
    category: 'პროგრამირება',
    level: 'დამწყები',
    duration: '32 საათი',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    teacherId: 'teacher-1',
    teacherName: 'მარიამ ბერიძე',
    enrolledCount: 142,
    rating: 4.8,
    price: 'უფასო',
    syllabus: ['HTML/CSS', 'JavaScript ES6+', 'React Hooks', 'Node.js & Express', 'MongoDB'],
    lessons: [
      { id: 'c1-l1', title: 'კურსის შესავალი', duration: '10 წთ', type: 'video', content: 'VS Code, Node.js setup.' },
      { id: 'c1-l2', title: 'HTML სტრუქტურა', duration: '15 წთ', type: 'article', content: 'Basic HTML tags.' },
      { id: 'c1-l3', title: 'HTML/CSS ტესტი', duration: '8 წთ', type: 'quiz', content: '5 questions.' },
    ],
  },
  {
    id: 'course-2',
    title: 'UX/UI დიზაინის საფუძვლები Figma-ში',
    description: 'ისწავლეთ UI/UX დიზაინი და შექმენით პროტოტიპები Figma-ში.',
    category: 'დიზაინი',
    level: 'დამწყები',
    duration: '24 საათი',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800',
    teacherId: 'teacher-2',
    teacherName: 'გიორგი კალანდაძე',
    enrolledCount: 98,
    rating: 4.9,
    price: '79 ₾',
    syllabus: ['UX vs UI', 'Figma Basics', 'Wireframes', 'Color Theory', 'Prototyping'],
    lessons: [
      { id: 'c2-l1', title: 'შესავალი ციფრულ დიზაინში', duration: '12 წთ', type: 'video', content: 'UX vs UI.' },
    ],
  },
  {
    id: 'course-3',
    title: 'ციფრული მარკეტინგი და SEO',
    description: 'SEO, Google Ads, SMM სრული კურსი.',
    category: 'ბიზნესი და მარკეტინგი',
    level: 'საშუალო',
    duration: '20 საათი',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    teacherId: 'teacher-3',
    teacherName: 'ნინო შენგელია',
    enrolledCount: 76,
    rating: 4.7,
    price: '59 ₾',
    syllabus: ['SEO Basics', 'Keywords', 'Google Analytics', 'SMM', 'Email Marketing'],
    lessons: [
      { id: 'c3-l1', title: 'როგორ მუშაობს Google?', duration: '14 წთ', type: 'video', content: 'Crawlers & indexing.' },
    ],
  },
];

export const mockCategories = ['ყველა', 'პროგრამირება', 'დიზაინი', 'ბიზნესი და მარკეტინგი'];
