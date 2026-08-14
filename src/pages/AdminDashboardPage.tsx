import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Search,
  FolderPlus,
  Plus,
  X,
  Video,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Calendar,
  Briefcase,
  FileText,
  Settings,
  Pencil,
  Trash2,
  User,
  Star,
  Clock,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type AdminTab =
  | 'courses_categories'
  | 'sessions'
  | 'lecturers'
  | 'students'
  | 'users'
  | 'projects'
  | 'videos'
  | 'gallery'
  | 'media'
  | 'settings';

interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  image: string;
  startDate: string;
  status: 'active' | 'upcoming' | 'postponed';
  statusText: string;
  instructor: string;
  rating: number;
}

interface SessionItem {
  id: string;
  courseTitle: string;
  sessionName: string;
  currentStudents: number;
  maxStudents: number;
  instructor: string;
  schedule: string;
  location: string;
}

interface LecturerItem {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
  avatarBg: string;
  avatarIcon: string;
  isPinned?: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  author: string;
  image: string;
}

interface VideoItem {
  id: string;
  category: string;
  title: string;
  instructor: string;
  image: string;
  duration: string;
}

interface MediaItem {
  id: string;
  type: 'PDF' | 'DOC' | 'BOOK';
  size: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

interface StudentItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarBg: string;
  avatarIcon: string;
}

interface SystemUserItem {
  id: string;
  name: string;
  subText: string;
  email: string;
  phone: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  avatarBg: string;
  avatarIcon: string;
}

export default function AdminDashboardPage() {
  const { activeUser } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Categories State ──
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'პროგრამირება',
    'დიზაინი',
    'ბიზნესი და მარკეტინგი',
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ყველა');

  // ── Courses List State ──
  const [coursesList, setCoursesList] = useState<CourseItem[]>([
    {
      id: '1',
      title: 'ვებ დეველოპმენტის სრული კურსი (React & Node.js)',
      description: 'შეისწავლეთ თანამედროვე ვებ დეველოპმენტი ნულიდან. კურსი...',
      category: 'პროგრამირება',
      price: 'უფასო',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      startDate: '15 სექტემბერი, ...',
      status: 'active',
      statusText: 'მიმდინარე',
      instructor: 'მარიამ ბერიძე',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'UX/UI დიზაინის საფუძვლები Figma-ში',
      description: 'ისწავლეთ მომხმარებლის ინტერფეისის (UI) და გამოცდილებ...',
      category: 'დიზაინი',
      price: '79 ₾',
      image:
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
      startDate: '01 ოქტომბე...',
      status: 'upcoming',
      statusText: 'მალე დაიწყება',
      instructor: 'გიორგი კალანდაძე',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'ციფრული მარკეტინგი და SEO ოპტიმიზაცია',
      description: 'გახადეთ თქვენი ვებსაიტი ხილვადი Google-ში. შეისწავლეთ სოციალუ...',
      category: 'ბიზნესი და მარკეტინგი',
      price: '59 ₾',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      startDate: '10 ნოემბერი, ...',
      status: 'postponed',
      statusText: 'გადადებული',
      instructor: 'ნინო შენგელია',
      rating: 4.7,
    },
  ]);

  // ── Sessions State ──
  const [sessionsList, setSessionsList] = useState<SessionItem[]>([
    {
      id: 's1',
      courseTitle: 'ვებ დეველოპმენტის სრული კურსი (React & Node.js)',
      sessionName: 'სესია #1 (შემოდგომის ნაკადი 2026)',
      currentStudents: 2,
      maxStudents: 30,
      instructor: 'მარიამ ბერიძე',
      schedule: 'ორშაბათი, ოთხშაბათი 19:00',
      location: 'აუდიტორია #204 / ონლაინ',
    },
    {
      id: 's2',
      courseTitle: 'UX/UI დიზაინის საფუძვლები Figma-ში',
      sessionName: 'სესია #1 (დიზაინის ინტენსივი)',
      currentStudents: 1,
      maxStudents: 25,
      instructor: 'გიორგი კალანდაძე',
      schedule: 'სამშაბათი, ხუთშაბათი 18:30',
      location: 'აუდიტორია #102',
    },
    {
      id: 's3',
      courseTitle: 'ციფრული მარკეტინგი და SEO ოპტიმიზაცია',
      sessionName: 'სესია #1 (SEO & SMM ნაკადი)',
      currentStudents: 0,
      maxStudents: 20,
      instructor: 'ნინო შენგელია',
      schedule: 'შაბათი, კვირა 14:00',
      location: 'აუდიტორია #301',
    },
  ]);

  // ── Lecturers State ──
  const [lecturersList, setLecturersList] = useState<LecturerItem[]>([
    {
      id: 'l1',
      name: 'მარიამ ბერიძე',
      role: 'Senior Full-Stack დეველოპმენტი',
      email: 'm.beridze@academy.ge',
      bio: '"10-წლიანი გამოცდილება ვებ-დეველოპმენტში. მუშაობდა წამყვან...',
      avatarBg: 'bg-emerald-500',
      avatarIcon: '🤖',
      isPinned: false,
    },
    {
      id: 'l2',
      name: 'გიორგი კალანდაძე',
      role: 'UX/UI & პროდუქტის დიზაინერი',
      email: 'g.kalandadze@academy.ge',
      bio: '"პროდუქტის წამყვანი დიზაინერი. ეხმარება სტუდენტებს პრაქტიკული...',
      avatarBg: 'bg-purple-500',
      avatarIcon: '👾',
      isPinned: false,
    },
    {
      id: 'l3',
      name: 'ნინო შენგელია',
      role: 'ციფრული მარკეტინგის ექსპერტი',
      email: 'n.shengelia@academy.ge',
      bio: '"სერტიფიცირებული SEO და Google Ads სპეციალისტი. აქვს 50-ზე მეტი...',
      avatarBg: 'bg-rose-500',
      avatarIcon: '🤖',
      isPinned: false,
    },
  ]);

  // ── Students State ──
  const [studentsList, setStudentsList] = useState<StudentItem[]>([
    {
      id: 'st1',
      name: 'დავით კაპანაძე',
      role: 'სტუდენტი - Frontend & Mobile',
      email: 'student@geoalpha.ge',
      phone: '+995 555 12 34 56',
      avatarBg: 'bg-emerald-500',
      avatarIcon: '🤖',
    },
    {
      id: 'st2',
      name: 'ანა წიკლაური',
      role: 'სტუდენტი - UI/UX Design',
      email: 'ana.tsiklauri@geoalpha.ge',
      phone: '+995 599 88 77 66',
      avatarBg: 'bg-purple-500',
      avatarIcon: '🤖',
    },
  ]);

  // ── Featured Projects State ──
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: 'p1',
      title: 'Water Pollution – ჩვენი ქალაქი',
      author: 'ანო ბერიძე',
      image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      title: 'The War – ომის გავლენა',
      author: 'შოთა მამულაშვილი',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      title: 'Shattered Silence – გატეხილი დუმილი',
      author: 'ნათია თოდუა',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p4',
      title: 'EduTrack Mobile – გზა განათლებისკენ',
      author: 'ლუკა ხარატიშვილი',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  // ── Free Videos State ──
  const [videosList, setVideosList] = useState<VideoItem[]>([
    {
      id: 'v1',
      category: 'ვებ დეველოპმენტი',
      title: 'JavaScript / React საფუძვლები – გიორგი არაბაძე',
      instructor: 'გიორგი არაბაძე',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
      duration: '45 წუთი',
    },
    {
      id: 'v2',
      category: 'პროგრამირება',
      title: 'Python-ის გამოგონება კოდირებაში',
      instructor: 'მარიანა ბერიძე',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      duration: '35 წუთი',
    },
    {
      id: 'v3',
      category: 'დიზაინი',
      title: 'Figma-ს უტილიტები სწორად მუშაობისთვის',
      instructor: 'გიორგი კალანდაძე',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      duration: '30 წუთი',
    },
  ]);

  // ── Media Library State ──
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    { id: 'm1', type: 'PDF', size: '4.8 MB', title: 'React & Redux Toolkit საფუძვლიანი 2026 (PDF)', description: 'სრული სასწავლო მასალა React-ისა და Redux-ის შესასწავლად.', category: 'ვებ დეველოპმენტის სრული კურსი (React & Node.js)', date: '2026-08-01' },
    { id: 'm2', type: 'DOC', size: '2.3 MB', title: 'Figma UI Design System & Component Guidelines (DOCX)', description: 'UI/UX დიზაინის სასწავლო დოკუმენტი Figma-ს კომპონენტებისა და სისტემების შესასწავლად.', category: 'UX/UI დიზაინის საფუძვლები Figma-ში', date: '2026-08-02' },
    { id: 'm3', type: 'BOOK', size: '1.5 MB', title: 'LMS პლატფორმის სტუდენტის გზამკვლევი და წესები (PDF)', description: 'აკადემიის პლატფორმის გამოყენებისა და დავალებების ჩაბარების ჩაშლილი ინსტრუქცია.', category: 'ყველა კურსი', date: '2026-08-03' },
  ]);

  // ── Users Database State (Matching Image) ──
  const [usersList, setUsersList] = useState<SystemUserItem[]>([
    {
      id: 'u1',
      name: 'ნინო შენგელია',
      subText: 'ციფრული მარკეტინგის ექსპერტი',
      email: 'n.shengelia@academy.ge',
      phone: 'N/A',
      role: 'TEACHER',
      avatarBg: 'bg-rose-500',
      avatarIcon: '🤖',
    },
    {
      id: 'u2',
      name: 'დავით კაპანაძე',
      subText: 'სტუდენტი - Frontend & Mobile',
      email: 'student@geoalpha.ge',
      phone: '+995 555 12 34 56',
      role: 'STUDENT',
      avatarBg: 'bg-emerald-500',
      avatarIcon: '🤖',
    },
    {
      id: 'u3',
      name: 'ანა წიკლაური',
      subText: 'სტუდენტი - UI/UX Design',
      email: 'ana.tsiklauri@geoalpha.ge',
      phone: '+995 599 88 77 66',
      role: 'STUDENT',
      avatarBg: 'bg-purple-500',
      avatarIcon: '🤖',
    },
  ]);

  // ── Settings State ──
  const [siteSettings, setSiteSettings] = useState({
    studentsCount: '68,000+',
    lecturersCount: '2,900+',
    branchesCount: '116',
    countriesCount: '25',
    graduatesCount: '267,000+',
    promoTitle: 'საშემოდგომო ფასდაკლების აქცია - 30%',
    promoPrice: '79 ₾',
    phone: '+995 555 12 34 56',
    email: 'info@geoalpha.ge',
    address: 'თბილისი, ჭავჭავაძის გამ',
    workHours: 'ორშ-შაბ: 09:00 - 20:00',
    aboutTitle: 'GeoAlpha აკადემიის შესახებ',
    aboutDescription:
      'GeoAlpha არის წამყვანი ტექნოლოგიური და ციფრული ინდუსტრიების აკადემია...',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });

  const handleInputChange = (field: string, value: string) => {
    setSiteSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    alert('პარამეტრები წარმატებით შენახულია!');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const handleDeleteCourse = (id: string) => setCoursesList(coursesList.filter((c) => c.id !== id));
  const handleDeleteSession = (id: string) => setSessionsList(sessionsList.filter((s) => s.id !== id));
  const handleDeleteLecturer = (id: string) => setLecturersList(lecturersList.filter((l) => l.id !== id));
  const handleDeleteStudent = (id: string) => setStudentsList(studentsList.filter((st) => st.id !== id));
  const handleDeleteUser = (id: string) => setUsersList(usersList.filter((u) => u.id !== id));
  const handleDeleteProject = (id: string) => setProjectsList(projectsList.filter((p) => p.id !== id));
  const handleDeleteVideo = (id: string) => setVideosList(videosList.filter((v) => v.id !== id));
  const handleDeleteMedia = (id: string) => setMediaList(mediaList.filter((m) => m.id !== id));

  const handleTogglePinLecturer = (id: string) => {
    setLecturersList(
      lecturersList.map((l) => (l.id === id ? { ...l, isPinned: !l.isPinned } : l))
    );
  };

  // ── Filters for Universal Search Bar ──
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'ყველა' || course.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [coursesList, searchQuery, selectedCategory]);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessionsList;
    const query = searchQuery.toLowerCase();
    return sessionsList.filter(
      (s) =>
        s.sessionName.toLowerCase().includes(query) ||
        s.courseTitle.toLowerCase().includes(query) ||
        s.instructor.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query)
    );
  }, [sessionsList, searchQuery]);

  const filteredLecturers = useMemo(() => {
    if (!searchQuery.trim()) return lecturersList;
    const query = searchQuery.toLowerCase();
    return lecturersList.filter(
      (l) =>
        l.name.toLowerCase().includes(query) ||
        l.role.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.bio.toLowerCase().includes(query)
    );
  }, [lecturersList, searchQuery]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentsList;
    const query = searchQuery.toLowerCase();
    return studentsList.filter(
      (st) =>
        st.name.toLowerCase().includes(query) ||
        st.role.toLowerCase().includes(query) ||
        st.email.toLowerCase().includes(query) ||
        st.phone.toLowerCase().includes(query)
    );
  }, [studentsList, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videosList;
    const query = searchQuery.toLowerCase();
    return videosList.filter(
      (v) =>
        v.category.toLowerCase().includes(query) ||
        v.title.toLowerCase().includes(query) ||
        v.instructor.toLowerCase().includes(query)
    );
  }, [videosList, searchQuery]);

  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const query = searchQuery.toLowerCase();
    return mediaList.filter((m) =>
      m.title.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    );
  }, [mediaList, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const query = searchQuery.toLowerCase();
    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.subText.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
    );
  }, [usersList, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Dark Banner Header */}
      <div className="bg-[#111328] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase bg-purple-900/80 text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-700/50 inline-block mb-1">
                👑 ადმინისტრაციის პანელი
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                ადმინისტრატორის მართვის ცენტრი
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                მართეთ კურსები, სესიები, ლექტორები, სტუდენტები, მომხმარებელთა ბაზა და საიტის ტექსტები
              </p>
            </div>
          </div>

          <div className="bg-[#1a1d36] border border-slate-700/50 rounded-2xl p-3 flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xl">
              🤖
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-200">
                {activeUser?.name || 'ალექსანდრე'}{' '}
                <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1 font-normal">
                  Admin
                </span>
              </p>
              <p className="text-slate-400 text-[11px]">{activeUser?.email || 'alexiganjs@gmail.com'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 -mt-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-[2rem] p-5 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-purple-600 tracking-wide">
                  მართვის მენიუ
                </span>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                  9 სექცია
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 mb-4">ადმინისტრაცია</h3>

              {/* Real-Time Universal Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ძებნა სახელით, ელ-ფოსტით..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Nav Group 1 */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">🎓 აკადემია & სწავლება</p>
              <SidebarItem
                label="კურსები & კატეგორიები"
                count={coursesList.length}
                active={activeTab === 'courses_categories'}
                onClick={() => setActiveTab('courses_categories')}
                icon={<BookOpen className="w-4 h-4" />}
              />
              <SidebarItem
                label="სესიები / ნაკადები"
                count={sessionsList.length}
                active={activeTab === 'sessions'}
                onClick={() => setActiveTab('sessions')}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>

            {/* Nav Group 2 */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">👥 მომხმარებლები</p>
              <SidebarItem
                label="ლექტორების მართვა"
                count={lecturersList.length}
                active={activeTab === 'lecturers'}
                onClick={() => setActiveTab('lecturers')}
                icon={<Briefcase className="w-4 h-4" />}
              />
              <SidebarItem
                label="სტუდენტების მართვა"
                count={studentsList.length}
                active={activeTab === 'students'}
                onClick={() => setActiveTab('students')}
                icon={<GraduationCap className="w-4 h-4" />}
              />
              <SidebarItem
                label="მომხმარებელთა ბაზა"
                count={usersList.length}
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                icon={<Users className="w-4 h-4" />}
              />
            </div>

            {/* Nav Group 3 */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">✨ მედია & კონტენტი</p>
              <SidebarItem
                label="გამოჩენილი პროექტები"
                count={4}
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                icon={<Sparkles className="w-4 h-4" />}
              />
              <SidebarItem
                label="უფასო ვიდეოები"
                count={3}
                active={activeTab === 'videos'}
                onClick={() => setActiveTab('videos')}
                icon={<Video className="w-4 h-4" />}
              />
              <SidebarItem
                label="გალერეის ფოტოები"
                count={4}
                active={activeTab === 'gallery'}
                onClick={() => setActiveTab('gallery')}
                icon={<ImageIcon className="w-4 h-4" />}
              />
              <SidebarItem
                label="მედია ბიბლიოთეკა..."
                count={3}
                active={activeTab === 'media'}
                onClick={() => setActiveTab('media')}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>

            {/* Nav Group 4 */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">⚙️ პარამეტრები</p>
              <SidebarItem
                label="საიტის ტექსტები & სტ..."
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                icon={<Settings className="w-4 h-4" />}
              />
            </div>

            {/* Status Card */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3.5 mt-4">
              <p className="text-[11px] font-bold text-slate-500">სისტემის სტატუსი</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-purple-900">ონლაინ მართვა</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* ── TAB: USERS DATABASE VIEW (MATCHING IMAGE) ── */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  მომხმარებელთა საერთო ბაზა
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  სისტემის ყველა რეგისტრირებული მომხმარებელი შესაბამისი როლებითა და მოქმედებებით
                </p>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">მომხმარებელი</th>
                      <th className="py-3 px-4">ელ-ფოსტა</th>
                      <th className="py-3 px-4">ტელეფონის ნომერი</th>
                      <th className="py-3 px-4">როლი</th>
                      <th className="py-3 px-4 text-center">მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                          {/* User Avatar + Name & Subtext */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-2xl ${u.avatarBg} text-white text-xl flex items-center justify-center shrink-0 shadow-sm`}
                              >
                                {u.avatarIcon}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-800 truncate">
                                  {u.name}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                  {u.subText}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                            {u.email}
                          </td>

                          {/* Phone */}
                          <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                            {u.phone}
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-4">
                            {u.role === 'TEACHER' && (
                              <span className="bg-purple-100/70 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                TEACHER
                              </span>
                            )}
                            {u.role === 'STUDENT' && (
                              <span className="bg-emerald-100/70 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                STUDENT
                              </span>
                            )}
                            {u.role === 'ADMIN' && (
                              <span className="bg-amber-100/70 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                ADMIN
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition flex items-center justify-center"
                                title="რედაქტირება"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center"
                                title="წაშლა"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                          მომხმარებელი ვერ მოიძებნა ძებნის კრიტერიუმით: "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: COURSES & CATEGORIES ── */}
          {activeTab === 'courses_categories' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <FolderPlus className="w-5 h-5 text-purple-600" />
                      კურსების კატეგორიების მართვა
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      დაამატეთ ან წაშალეთ კატეგორიები
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="ახალი კატეგორია..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-200 transition shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      კატეგორიის დამატება
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('ყველა')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCategory === 'ყველა'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ყველა
                  </button>
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        selectedCategory === cat
                          ? 'bg-purple-50 text-purple-700 border-purple-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span onClick={() => setSelectedCategory(cat)} className="cursor-pointer">
                        {cat}
                      </span>
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">კურსების სრული სია</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    დაამატეთ, ჩაასწორეთ ან წაშალეთ აკადემიის კურსები
                  </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> ახალი კურსის დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-md">
                        {c.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-white/90 text-slate-800 text-[11px] font-black px-2.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                        {c.price}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span className="truncate max-w-[100px]">{c.startDate}</span>
                        </div>
                        {c.status === 'active' && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-2.5 py-1 rounded-xl text-[10px]">
                            {c.statusText}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-semibold text-slate-700">{c.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{c.rating}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
                          <Pencil className="w-3.5 h-3.5" />
                          კურსის რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                          title="წაშლა"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: SESSIONS VIEW ── */}
          {activeTab === 'sessions' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">აკადემიური სესიები / ნაკადები</h2>
                  <p className="text-xs text-slate-400 mt-0.5">მართეთ აქტიური და დაგეგმილი ნაკადები</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> ახალი სესიის დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSessions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="bg-purple-50/70 border border-purple-100 px-3 py-1.5 rounded-xl flex-1">
                        <p className="text-xs font-extrabold text-purple-800 line-clamp-1">{s.courseTitle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400 inline" />
                          {s.currentStudents} / {s.maxStudents}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold">სტუდენტი</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{s.sessionName}</h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>
                          მიჩენილი ლექტორი: <strong className="text-slate-800">{s.instructor}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>
                          განრიგი: <strong className="text-slate-800">{s.schedule}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
                        <Pencil className="w-3.5 h-3.5" /> სესიის რედაქტირება
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                        title="წაშლა"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: LECTURERS VIEW ── */}
          {activeTab === 'lecturers' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">ლექტორების მართვა</h2>
                  <p className="text-xs text-slate-400 mt-0.5">აკადემიის მასწავლებელთა სია</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> ახალი ლექტორის დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLecturers.map((lec) => (
                  <div
                    key={lec.id}
                    className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${lec.avatarBg} text-white text-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                        {lec.avatarIcon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md uppercase">
                          LECTURER
                        </span>
                        <h3 className="font-extrabold text-slate-800 text-base mt-0.5 truncate">{lec.name}</h3>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{lec.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100/80">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{lec.email}</span>
                      </div>
                      <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">{lec.bio}</p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleTogglePinLecturer(lec.id)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                          lec.isPinned
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${lec.isPinned ? 'fill-white' : 'fill-amber-400'}`} />
                        {lec.isPinned ? 'მონიშნულია' : 'მონიშვნა'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
                          <Pencil className="w-3.5 h-3.5" /> ლექტორის რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDeleteLecturer(lec.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                          title="წაშლა"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: STUDENTS VIEW ── */}
          {activeTab === 'students' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">სტუდენტების მართვა</h2>
                  <p className="text-xs text-slate-400 mt-0.5">სტუდენტთა სია, პროფილების განახლება</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> ახალი სტუდენტის დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStudents.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${st.avatarBg} text-white text-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                        {st.avatarIcon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                          STUDENT
                        </span>
                        <h3 className="font-extrabold text-slate-800 text-base mt-0.5 truncate">{st.name}</h3>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{st.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100/80 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{st.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{st.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
                        <Pencil className="w-3.5 h-3.5" /> სტუდენტის რედაქტირება
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(st.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center"
                        title="წაშლა"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: SETTINGS VIEW ── */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    საიტის ტექსტების, სტატისტიკის & კონტაქტების მართვა
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    განაახლეთ სტუდენტების რაოდენობა, ფილიალები, აქციის ფასები, საკონტაქტო ინფო და ტექსტები
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
                >
                  შენახვა
                </button>
              </div>

              {/* 1. Statistics */}
              <div className="py-5 border-b border-slate-100 space-y-3">
                <h3 className="text-xs font-black text-slate-800">
                  1. მთავარი გვერდის სტატისტიკა (STATS COUNTER)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <InputField label="სტუდენტების რაოდენობა" value={siteSettings.studentsCount} onChange={(v) => handleInputChange('studentsCount', v)} />
                  <InputField label="ლექტორების რაოდენობა" value={siteSettings.lecturersCount} onChange={(v) => handleInputChange('lecturersCount', v)} />
                  <InputField label="ფილიალების რაოდენობა" value={siteSettings.branchesCount} onChange={(v) => handleInputChange('branchesCount', v)} />
                  <InputField label="ქვეყნების რაოდენობა" value={siteSettings.countriesCount} onChange={(v) => handleInputChange('countriesCount', v)} />
                  <InputField label="კურსდამთავრებულები" value={siteSettings.graduatesCount} onChange={(v) => handleInputChange('graduatesCount', v)} />
                </div>
              </div>

              {/* 2. Promo */}
              <div className="py-5 border-b border-slate-100 space-y-3">
                <h3 className="text-xs font-black text-slate-800">
                  2. აქციის ფასები და შეთავაზების სათაური
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField label="აქციის დასახელება" value={siteSettings.promoTitle} onChange={(v) => handleInputChange('promoTitle', v)} />
                  <InputField label="აქციის ფასი" value={siteSettings.promoPrice} onChange={(v) => handleInputChange('promoPrice', v)} />
                </div>
              </div>

              {/* 3. Contact */}
              <div className="py-5 border-b border-slate-100 space-y-3">
                <h3 className="text-xs font-black text-slate-800">
                  3. საკონტაქტო ინფორმაცია (CONTACT INFO)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <InputField label="ტელეფონის ნომერი" value={siteSettings.phone} onChange={(v) => handleInputChange('phone', v)} />
                  <InputField label="ელ-ფოსტის მისამართი" value={siteSettings.email} onChange={(v) => handleInputChange('email', v)} />
                  <InputField label="სათაო ოფისის მისამართი" value={siteSettings.address} onChange={(v) => handleInputChange('address', v)} />
                  <InputField label="სამუშაო საათები" value={siteSettings.workHours} onChange={(v) => handleInputChange('workHours', v)} />
                </div>
              </div>

              {/* 4. About */}
              <div className="pt-5 space-y-3">
                <h3 className="text-xs font-black text-slate-800">
                  4. "ჩვენ შესახებ" გვერდის ტექსტი & ვიდეო ტურის ბმული
                </h3>
                <div className="space-y-3">
                  <InputField label="სათაური" value={siteSettings.aboutTitle} onChange={(v) => handleInputChange('aboutTitle', v)} />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">აღწერა / ისტორიის ტექსტი</label>
                    <textarea
                      value={siteSettings.aboutDescription}
                      onChange={(e) => handleInputChange('aboutDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-800 resize-y"
                    />
                  </div>

                  <InputField label="ვიდეო ტურის YouTube URL" value={siteSettings.videoUrl} onChange={(v) => handleInputChange('videoUrl', v)} />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
                  >
                    შენახვა
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: FEATURED PROJECTS VIEW ── */}
          {activeTab === 'projects' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">მთავარ გვერდზე გამორჩეული პროექტები</h2>
                  <p className="text-xs text-slate-400 mt-0.5">დაამატეთ და მართეთ 4 გამორჩეული პროექტი</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> პროექტის დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2">ავტორი: {project.author}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button className="flex-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200">
                          <Pencil className="w-3.5 h-3.5 text-purple-600" />
                          პროექტის რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center border border-rose-100"
                          title="წაშლა"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: FREE VIDEOS VIEW ── */}
          {activeTab === 'videos' && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-800">უფასო ვიდეო ლექციების მართვა</h2>
                  <p className="text-xs text-slate-400 mt-0.5">მართეთ და დაამატეთ ვიდეო ლექციები კურსების გვერდისთვის</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
                  <Plus className="w-4 h-4" /> ვიდეოს დამატება
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-md backdrop-blur-sm">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-purple-600 mb-1">{video.category}</p>
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">ლექტორი: {video.instructor}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button className="flex-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200">
                          <Pencil className="w-3.5 h-3.5 text-purple-600" />
                          ვიდეოს რედაქტირება
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center border border-rose-100"
                          title="წაშლა"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── TAB: MEDIA LIBRARY VIEW ── */}
          {activeTab === 'media' && (
            <>
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <span className="text-lg">📚</span> მედია ბიბლიოთეკა & სასწავლო მასალები
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">ატვირთეთ სასწავლო მასალა (PDF, Word დოკუმენტები, წიგნები (ZIP)) და დააკავშირეთ კურსებთან</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition shrink-0">
                  <Plus className="w-4 h-4" /> ახალი მასალის ატვირთვა
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMedia.map((media) => (
                  <div key={media.id} className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm p-5 flex flex-col min-h-[245px] hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-md">{media.type} • {media.size}</span>
                    </div>
                    <div className="mt-4 flex-1">
                      <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">{media.title}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">{media.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <div className="flex items-start justify-between gap-3 text-[10px] text-slate-500 font-semibold min-h-[42px]">
                        <span className="flex items-start gap-1.5 min-w-0"><Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /><span className="line-clamp-2">{media.category}</span></span>
                        <span className="flex items-center gap-1 shrink-0"><Calendar className="w-3 h-3 text-purple-500" />{media.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition">⇩ გადმოწერა</button>
                        <button onClick={() => handleDeleteMedia(media.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2 rounded-xl transition flex items-center justify-center border border-rose-100" title="წაშლა"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Placeholders for remaining tabs */}
          {activeTab !== 'courses_categories' &&
            activeTab !== 'sessions' &&
            activeTab !== 'lecturers' &&
            activeTab !== 'students' &&
            activeTab !== 'users' &&
            activeTab !== 'projects' &&
            activeTab !== 'videos' &&
            activeTab !== 'media' &&
            activeTab !== 'settings' && (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-700 text-base">სექცია მუშავდება</h3>
                <p className="text-xs text-slate-400 mt-1">
                  არჩეული მენიუ ({activeTab}) მალე დაემატება სრულად.asadads
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

// Helper Input Component
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-800"
      />
    </div>
  );
}

// Helper Sidebar Component
function SidebarItem({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}