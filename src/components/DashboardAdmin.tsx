import React, { useState } from 'react';
import { 
  ShieldAlert, 
  BookOpen, 
  Calendar, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Search, 
  CheckCircle, 
  XCircle,
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  X,
  AlertTriangle,
  Camera,
  Upload,
  Image as ImageIcon,
  Video,
  Settings,
  Star,
  Award,
  Globe,
  Tag,
  FolderPlus,
  Sparkles,
  ExternalLink,
  Github,
  FileText,
  Download,
  Book,
  Folder,
  Layers,
  Eye,
  Link as LinkIcon,
  Unlink,
  ListChecks
} from 'lucide-react';
import { Course, CourseStatus, CourseFormat, Session, User, ProjectItem, VideoLectureItem, GalleryPhotoItem, SiteSettings, MediaMaterial, Lesson, Enrollment, HomeWork, AttendanceRecord } from '../types';
import { Language } from '../lib/translations';
import { ABSTRACT_AVATARS, AVATAR_PRESETS } from '../data/avatars';

interface DashboardAdminProps {
  adminUser: User;
  courses: Course[];
  sessions: Session[];
  registeredUsers: User[];
  categories: string[];
  projects: ProjectItem[];
  videoLectures: VideoLectureItem[];
  galleryPhotos: GalleryPhotoItem[];
  siteSettings: SiteSettings;
  materials?: MediaMaterial[];
  enrollments?: Enrollment[];
  homeworks?: HomeWork[];
  attendanceRecords?: AttendanceRecord[];

  onAddCourse: (newCourse: Course) => void;
  onUpdateCourse: (updatedCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;

  onAddSession: (newSession: Session) => void;
  onUpdateSession: (updatedSession: Session) => void;
  onDeleteSession: (sessionId: string) => void;

  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;

  onAddCategory: (newCategory: string) => void;
  onDeleteCategory: (category: string) => void;

  onAddProject: (project: ProjectItem) => void;
  onUpdateProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;

  onAddVideoLecture: (lecture: VideoLectureItem) => void;
  onUpdateVideoLecture: (lecture: VideoLectureItem) => void;
  onDeleteVideoLecture: (id: string) => void;

  onAddGalleryPhoto: (photo: GalleryPhotoItem) => void;
  onUpdateGalleryPhoto: (photo: GalleryPhotoItem) => void;
  onDeleteGalleryPhoto: (id: string) => void;

  onUpdateSiteSettings: (settings: SiteSettings) => void;

  onAddMaterial?: (mat: MediaMaterial) => void;
  onUpdateMaterial?: (mat: MediaMaterial) => void;
  onDeleteMaterial?: (id: string) => void;

  onEnrollStudent?: (studentId: string, courseId: string, sessionId?: string) => void;
  onUnenrollStudent?: (studentId: string, courseId: string) => void;

  lang: Language;
}



const adminTranslations = {
  ka: {
    panelBadge: 'ადმინისტრაციის პანელი',
    title: 'ადმინისტრატორის მართვის ცენტრი',
    subtitle: 'მართეთ კურსები, სესიები, ლექტორები, სტუდენტები, პროექტები, ვიდეოები და საიტის ტექსტები ცენტრალიზებულად',
    tabCourses: '1. კურსები',
    tabSessions: '2. სესიები / ნაკადები',
    tabTeachers: '3. ლექტორების მართვა',
    tabStudents: '4. სტუდენტების მართვა',
    tabAllUsers: '5. მომხმარებელთა ბაზა',
    tabSettings: '6. საიტის ტექსტები & სტატისტიკა',
    tabProjects: '7. გამორჩეული პროექტები',
    tabVideos: '8. უფასო ვიდეოები',
    tabGallery: '9. გალერეის ფოტოები',
    tabMaterials: '10. მედია ბიბლიოთეკა (წიგნები & PDF)',
    
    addCourse: 'ახალი კურსის დამატება',
    editCourse: 'კურსის რედაქტირება',
    deleteCourse: 'კურსის წაშლა',
    
    addSession: 'ახალი სესიის დამატება',
    editSession: 'სესიის რედაქტირება',
    deleteSession: 'სესიის წაშლა',

    addTeacher: 'ახალი ლექტორის დამატება',
    editTeacher: 'ლექტორის რედაქტირება',
    deleteTeacher: 'ლექტორის წაშლა',

    addStudent: 'ახალი სტუდენტის დამატება',
    editStudent: 'სტუდენტის რედაქტირება',
    deleteStudent: 'სტუდენტის წაშლა',

    addCategory: 'კატეგორიის დამატება',
    deleteCategory: 'წაშლა',

    addProject: 'პროექტის დამატება',
    editProject: 'პროექტის რედაქტირება',
    deleteProject: 'პროექტის წაშლა',

    addVideo: 'ვიდეოს დამატება',
    editVideo: 'ვიდეოს რედაქტირება',
    deleteVideo: 'ვიდეოს წაშლა',

    addPhoto: 'ფოტოს დამატება',
    editPhoto: 'ფოტოს რედაქტირება',
    deletePhoto: 'ფოტოს წაშლა',

    allUsersTitle: 'მომხმარებელთა საერთო ბაზა',
    userDirectorySub: 'სისტემის ყველა რეგისტრირებული მომხმარებელი შესაბამისი როლებითა და მოქმედებებით',
    actions: 'მოქმედება',
    confirmDeleteTitle: 'წაშლის დადასტურება',
    confirmDeleteMsg: 'დარწმუნებული ხართ რომ გსურთ წაშალოთ',
    confirmDeleteWarning: 'ეს მოქმედება შეუქცევადია.',
    cancel: 'გაუქმება',
    delete: 'წაშლა',
    save: 'შენახვა',
    role: 'როლი',
    phone: 'ტელეფონის ნომერი',
    email: 'ელ-ფოსტა',
    name: 'სახელი და გვარი',
    headline: 'სათაური / პროფესია',
    category: 'კატეგორია',
    level: 'დონე',
    duration: 'ხანგრძლივობა',
    price: 'ფასი',
    assignedTeacher: 'მიჩენილი ლექტორი',
    coverImage: 'გარეკანის ფოტო (URL)',
    syllabus: 'სილაბუსი (თითო თემა ახალ ხაზზე)',
    schedule: 'განრიგი',
    room: 'ლოკაცია',
    maxStudents: 'მაქს. სტუდენტები',
    startDate: 'დაწყების თარიღი',
    courseSelect: 'აირჩიეთ კურსი',
    sessionTitle: 'სესიის დასახელება',
    avatarSelect: 'ავატარის არჩევა',
    userHeader: 'მომხმარებელი',
    coursesHeader: 'კურსების სრული სია',
    coursesSub: 'დაამატეთ, ჩაასწორეთ ან წაშალეთ აკადემიის კურსები',
    sessionsHeader: 'აკადემიური სესიები / ნაკადები',
    sessionsSub: 'მართეთ აქტიური და დაგეგმილი ნაკადები',
    teachersHeader: 'ლექტორების მართვა',
    teachersSub: 'აკადემიის მასწავლებელთა სია, წამყვანი მენტორების მონიშვნა და პროფილების რედაქტირება',
    studentsHeader: 'სტუდენტების მართვა',
    studentsSub: 'სტუდენტთა სია, პროფილების განახლება და პირდაპირი რეგისტრაცია',
    searchPlaceholder: 'ძებნა სახელით, ელ-ფოსტით ან დასახელებით...',
    leadMentorBadge: '⭐ წამყვანი მენტორი',
    makeLeadMentor: 'წამყვან მენტორად მონიშვნა'
  },
  en: {
    panelBadge: 'Administration Panel',
    title: 'Admin Control Center',
    subtitle: 'Manage courses, sessions, teachers, students, projects, videos, and site settings centrally',
    tabCourses: '1. Courses',
    tabSessions: '2. Sessions & Batches',
    tabTeachers: '3. Lecturer Management',
    tabStudents: '4. Student Management',
    tabAllUsers: '5. Global User Directory',
    tabSettings: '6. Site Content & Stats',
    tabProjects: '7. Featured Projects',
    tabVideos: '8. Free Video Lectures',
    tabGallery: '9. Gallery Photos',
    tabMaterials: '10. Media Library (Books & PDF)',
    
    addCourse: 'Add New Course',
    editCourse: 'Update Course',
    deleteCourse: 'Delete Course',

    addSession: 'Add New Session',
    editSession: 'Update Session',
    deleteSession: 'Delete Session',

    addTeacher: 'Add New Lecturer',
    editTeacher: 'Update Lecturer',
    deleteTeacher: 'Delete Lecturer',

    addStudent: 'Add New Student',
    editStudent: 'Update Student',
    deleteStudent: 'Delete Student',

    addCategory: 'Add Category',
    deleteCategory: 'Delete',

    addProject: 'Add Project',
    editProject: 'Edit Project',
    deleteProject: 'Delete Project',

    addVideo: 'Add Video Lecture',
    editVideo: 'Edit Video',
    deleteVideo: 'Delete Video',

    addPhoto: 'Add Gallery Photo',
    editPhoto: 'Edit Photo',
    deletePhoto: 'Delete Photo',

    allUsersTitle: 'Global User Directory',
    userDirectorySub: 'Full database of registered users across system roles',
    actions: 'Actions',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteMsg: 'Are you sure you want to delete',
    confirmDeleteWarning: 'This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save Changes',
    role: 'Role',
    phone: 'Phone Number',
    email: 'Email Address',
    name: 'Full Name',
    headline: 'Headline / Profession',
    category: 'Category',
    level: 'Level',
    duration: 'Duration',
    price: 'Price',
    assignedTeacher: 'Assigned Lecturer',
    coverImage: 'Cover Image URL',
    syllabus: 'Syllabus (One topic per line)',
    schedule: 'Schedule',
    room: 'Room / Location',
    maxStudents: 'Max Students',
    startDate: 'Start Date',
    courseSelect: 'Select Course',
    sessionTitle: 'Session Title',
    avatarSelect: 'Select Avatar',
    userHeader: 'User',
    coursesHeader: 'Course Catalog Management',
    coursesSub: 'Add, update or delete academy courses',
    sessionsHeader: 'Academic Sessions & Batches',
    sessionsSub: 'Manage active schedules, rooms, and assigned lecturers',
    teachersHeader: 'Lecturer Directory & Management',
    teachersSub: 'Update lecturer profiles, set lead mentor status, and register new teachers',
    studentsHeader: 'Student Database & Profiles',
    studentsSub: 'Manage student records and direct student registrations',
    searchPlaceholder: 'Search by name, email or title...',
    leadMentorBadge: '⭐ Lead Mentor',
    makeLeadMentor: 'Set as Lead Mentor'
  }
};

export default function DashboardAdmin({
  adminUser,
  courses,
  sessions,
  registeredUsers,
  categories,
  projects,
  videoLectures,
  galleryPhotos,
  siteSettings,
  materials = [],
  enrollments = [],
  homeworks = [],
  attendanceRecords = [],
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddCategory,
  onDeleteCategory,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddVideoLecture,
  onUpdateVideoLecture,
  onDeleteVideoLecture,
  onAddGalleryPhoto,
  onUpdateGalleryPhoto,
  onDeleteGalleryPhoto,
  onUpdateSiteSettings,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onEnrollStudent,
  onUnenrollStudent,
  lang
}: DashboardAdminProps) {
  const at = adminTranslations[lang === 'ka' ? 'ka' : 'en'];

  type AdminTabType = 
    | 'courses' 
    | 'lessons'
    | 'sessions' 
    | 'teachers' 
    | 'students' 
    | 'all-users' 
    | 'settings' 
    | 'projects' 
    | 'videos' 
    | 'gallery'
    | 'materials';

  const [adminTab, setAdminTab] = useState<AdminTabType>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deactivatedStudentIds, setDeactivatedStudentIds] = useState<string[]>([]);
  const [studentPage, setStudentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // --- Independent Lessons Bank State ---
  const [standaloneLessons, setStandaloneLessons] = useState<Lesson[]>([
    { id: 'l-std-1', title: 'HTML5 & CSS3 სემანტიკა და Flexbox', duration: '45 წთ', type: 'video', content: 'სემანტიკური ტეგები, flexbox განლაგება და responsive დიზაინი.' },
    { id: 'l-std-2', title: 'JavaScript ES6+ Async/Await და API Calls', duration: '60 წთ', type: 'video', content: 'Promises, Async/Await, Fetch API და მონაცემების დამუშავება.' },
    { id: 'l-std-3', title: 'React.js Component Architecture & Hooks', duration: '50 წთ', type: 'video', content: 'useState, useEffect, custom hooks და კომპონენტების ოპტიმიზაცია.' },
    { id: 'l-std-4', title: 'State Management & Context API', duration: '40 წთ', type: 'article', content: 'გლობალური მდგომარეობის მართვა პროექტში.' }
  ]);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lesTitle, setLesTitle] = useState('');
  const [lesDuration, setLesDuration] = useState('45 წთ');
  const [lesType, setLesType] = useState<'video' | 'article' | 'quiz'>('video');
  const [lesContent, setLesContent] = useState('');
  const [attachCourseId, setAttachCourseId] = useState('');
  const [modalAttachCourseId, setModalAttachCourseId] = useState('');

  // Attached Lessons Modal State
  const [showAttachLessonsModal, setShowAttachLessonsModal] = useState(false);
  const [attachModalCourse, setAttachModalCourse] = useState<Course | null>(null);
  const [attachLessonSearch, setAttachLessonSearch] = useState('');

  // Course & Session Enrolled Students Modal State
  const [showCourseStudentsModal, setShowCourseStudentsModal] = useState(false);
  const [courseStudentsTargetCourse, setCourseStudentsTargetCourse] = useState<Course | null>(null);
  const [courseStudentsTargetSession, setCourseStudentsTargetSession] = useState<Session | null>(null);
  const [studentToEnrollId, setStudentToEnrollId] = useState('');
  const [sessionToEnrollId, setSessionToEnrollId] = useState('');

  // New Category state
  const [newCatInput, setNewCatInput] = useState('');

  // Course Add/Edit Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cCategory, setCCategory] = useState(categories[0] || 'პროგრამირება');
  const [cLevel, setCLevel] = useState<'დამწყები' | 'საშუალო' | 'პროფესიონალი'>('დამწყები');
  const [cDuration, setCDuration] = useState('32 საათი');
  const [cPrice, setCPrice] = useState('უფასო');
  const [cTeacherId, setCTeacherId] = useState('');
  const [cImage, setCImage] = useState('');
  const [cSyllabus, setCSyllabus] = useState('');
  const [cStartDate, setCStartDate] = useState('');
  const [cEndDate, setCEndDate] = useState('');
  const [cIsOngoing, setCIsOngoing] = useState(true);
  const [cStatus, setCStatus] = useState<CourseStatus>('ongoing');
  const [cFormat, setCFormat] = useState<CourseFormat>('ჰიბრიდული');
  const [cLocation, setCLocation] = useState('თბილისი');
  const [cProcessGuideText, setCProcessGuideText] = useState('');

  // Session Add/Edit Modal
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sCourseId, setSCourseId] = useState('');
  const [sTitle, setSTitle] = useState('');
  const [sTeacherId, setSTeacherId] = useState('');
  const [sStartDate, setSStartDate] = useState('');
  const [sSchedule, setSSchedule] = useState('');
  const [sRoom, setSRoom] = useState('');
  const [sMaxStudents, setSMaxStudents] = useState(25);

  // Media Material Modal State
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mType, setMType] = useState<'pdf' | 'doc' | 'book' | 'zip' | 'link'>('pdf');
  const [mCourseId, setMCourseId] = useState('all');
  const [mFileUrl, setMFileUrl] = useState('');
  const [mFileSize, setMFileSize] = useState('4.2 MB');
  const [mDesc, setMDesc] = useState('');

  const handleOpenMaterialModal = () => {
    setMTitle('');
    setMType('pdf');
    setMCourseId('all');
    setMFileUrl('');
    setMFileSize('3.5 MB');
    setMDesc('');
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle) return;
    const newMat: MediaMaterial = {
      id: `mat-${Date.now()}`,
      title: mTitle,
      type: mType,
      fileUrl: mFileUrl || 'https://example.com/document.pdf',
      fileSize: mFileSize,
      uploadedAt: new Date().toLocaleDateString('ka-GE'),
      uploadedBy: adminUser.name,
      courseId: mCourseId === 'all' ? undefined : mCourseId,
      description: mDesc
    };
    if (onAddMaterial) {
      onAddMaterial(newMat);
      showSuccess('მედია მასალა წარმატებით დაემატა!');
    }
    setShowMaterialModal(false);
  };

  // User Add/Edit Modal (Teachers & Students)
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uRole, setURole] = useState<'student' | 'teacher' | 'admin'>('teacher');
  const [uHeadline, setUHeadline] = useState('');
  const [uBio, setUBio] = useState('');
  const [uAvatar, setUAvatar] = useState(AVATAR_PRESETS[0]);
  const [uIsLeadMentor, setUIsLeadMentor] = useState(false);
  const [uPassword, setUPassword] = useState('123456');

  // Project Add/Edit Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pStudentName, setPStudentName] = useState('');
  const [pRole, setPRole] = useState('');
  const [pImage, setPImage] = useState('');
  const [pDemoUrl, setPDemoUrl] = useState('');
  const [pGithubUrl, setPGithubUrl] = useState('');
  const [pTags, setPTags] = useState('');

  // Video Lecture Add/Edit Modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLectureItem | null>(null);
  const [vTitle, setVTitle] = useState('');
  const [vLecturer, setVLecturer] = useState('');
  const [vDuration, setVDuration] = useState('30 წუთი');
  const [vCategory, setVCategory] = useState('პროგრამირება');
  const [vThumbnail, setVThumbnail] = useState('');
  const [vYoutubeId, setVYoutubeId] = useState('');
  const [vDescription, setVDescription] = useState('');

  // Gallery Photo Add/Edit Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(null);
  const [gTitle, setGTitle] = useState('');
  const [gImage, setGImage] = useState('');
  const [gDescription, setGDescription] = useState('');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'course' | 'session' | 'user' | 'project' | 'video' | 'gallery';
    id: string;
    title: string;
  } | null>(null);

  const teachersList = registeredUsers.filter((u) => u.role === 'teacher');
  const studentsList = registeredUsers.filter((u) => u.role === 'student');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  // Filtered Lists for Admin Tabs
  const q = searchQuery.toLowerCase().trim();

  const filteredCourses = courses.filter((c) => 
    !q ||
    c.title.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    (c.teacherName && c.teacherName.toLowerCase().includes(q))
  );

  const filteredLessons = standaloneLessons.filter((l) =>
    !q ||
    l.title.toLowerCase().includes(q) ||
    (l.content && l.content.toLowerCase().includes(q)) ||
    (l.type && l.type.toLowerCase().includes(q))
  );

  const filteredSessions = sessions.filter((s) => 
    !q ||
    s.title.toLowerCase().includes(q) ||
    (s.teacherName && s.teacherName.toLowerCase().includes(q)) ||
    (s.room && s.room.toLowerCase().includes(q)) ||
    (s.schedule && s.schedule.toLowerCase().includes(q))
  );

  const filteredTeachers = teachersList.filter((t) => 
    !q ||
    t.name.toLowerCase().includes(q) ||
    t.email.toLowerCase().includes(q) ||
    (t.headline && t.headline.toLowerCase().includes(q))
  );

  const filteredStudents = studentsList.filter((s) => 
    !q ||
    s.name.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q) ||
    (s.phone && s.phone.toLowerCase().includes(q))
  );

  const filteredAllUsers = registeredUsers.filter((u) => 
    !q ||
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q)
  );

  const filteredProjects = projects.filter((p) =>
    !q ||
    p.title.toLowerCase().includes(q) ||
    p.studentName.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  const filteredVideos = videoLectures.filter((v) =>
    !q ||
    v.title.toLowerCase().includes(q) ||
    (v.lecturer && v.lecturer.toLowerCase().includes(q)) ||
    (v.category && v.category.toLowerCase().includes(q))
  );

  const filteredGallery = galleryPhotos.filter((g) =>
    !q ||
    g.title.toLowerCase().includes(q) ||
    (g.description && g.description.toLowerCase().includes(q))
  );

  const filteredMaterials = (materials || []).filter((m) =>
    !q ||
    m.title.toLowerCase().includes(q) ||
    (m.courseTitle && m.courseTitle.toLowerCase().includes(q)) ||
    (m.type && m.type.toLowerCase().includes(q))
  );

  // --- Handlers: Course ---
  const handleOpenCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCTitle(course.title);
      setCDesc(course.description);
      setCCategory(course.category);
      setCLevel(course.level);
      setCDuration(course.duration);
      setCPrice(course.price);
      setCTeacherId(course.teacherId);
      setCImage(course.image);
      setCSyllabus(course.syllabus ? course.syllabus.join('\n') : '');
      setCStartDate(course.startDate || '');
      setCEndDate(course.endDate || '');
      const derivedStatus = course.status || (course.isOngoing ? 'ongoing' : 'upcoming');
      setCStatus(derivedStatus);
      setCIsOngoing(derivedStatus === 'ongoing');
      setCFormat(course.format || 'ჰიბრიდული');
      setCLocation(course.location || 'თბილისი');
      setCProcessGuideText(course.processGuideText || '');
    } else {
      setEditingCourse(null);
      setCTitle('');
      setCDesc('');
      setCCategory(categories[0] || 'პროგრამირება');
      setCLevel('დამწყები');
      setCDuration('32 საათი');
      setCPrice('უფასო');
      setCTeacherId(teachersList[0]?.id || '');
      setCImage('');
      setCSyllabus('');
      setCStartDate('15 სექტემბერი, 2026');
      setCEndDate('25 დეკემბერი, 2026');
      setCStatus('ongoing');
      setCIsOngoing(true);
      setCFormat('ჰიბრიდული');
      setCLocation('თბილისი');
      setCProcessGuideText('აკადემიის LMS პლატფორმის გამოყენების ინსტრუქცია...');
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTeacher = teachersList.find((t) => t.id === cTeacherId) || teachersList[0];
    const teacherName = assignedTeacher ? assignedTeacher.name : 'GeoAlpha Lecturer';
    const syllabusArray = cSyllabus.split('\n').filter((s) => s.trim().length > 0);

    if (editingCourse) {
      const updated: Course = {
        ...editingCourse,
        title: cTitle,
        description: cDesc,
        category: cCategory,
        level: cLevel,
        duration: cDuration,
        price: cPrice,
        teacherId: cTeacherId || assignedTeacher?.id || 't1',
        teacherName,
        image: cImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        syllabus: syllabusArray.length > 0 ? syllabusArray : editingCourse.syllabus,
        startDate: cStartDate,
        endDate: cEndDate,
        status: cStatus,
        isOngoing: cStatus === 'ongoing',
        format: cFormat,
        location: cLocation,
        processGuideText: cProcessGuideText
      };
      onUpdateCourse(updated);
      showSuccess('კურსი წარმატებით განახლდა!');
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: cTitle,
        description: cDesc,
        category: cCategory,
        level: cLevel,
        duration: cDuration,
        price: cPrice,
        teacherId: cTeacherId || assignedTeacher?.id || 't1',
        teacherName,
        image: cImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        syllabus: syllabusArray.length > 0 ? syllabusArray : ['შესავალი კურსში', 'პრაქტიკული დავალებები'],
        startDate: cStartDate,
        endDate: cEndDate,
        status: cStatus,
        isOngoing: cStatus === 'ongoing',
        format: cFormat,
        location: cLocation,
        processGuideText: cProcessGuideText,
        enrolledCount: 0,
        rating: 5.0,
        lessons: [
          {
            id: `l-${Date.now()}-1`,
            title: 'შესავალი და გარემოს მომზადება',
            duration: '15 წთ',
            type: 'video',
            content: 'გაცნობითი ლექცია და პროგრამების ინსტალაცია.'
          }
        ]
      };
      onAddCourse(newCourse);
      showSuccess('ახალი კურსი წარმატებით დაემატა!');
    }
    setShowCourseModal(false);
  };

  // --- Handlers: Category ---
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    onAddCategory(newCatInput.trim());
    setNewCatInput('');
    showSuccess('ახალი კატეგორია დაემატა!');
  };

  // --- Handlers: Session ---
  const handleOpenSessionModal = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setSCourseId(session.courseId);
      setSTitle(session.title);
      setSTeacherId(session.teacherId);
      setSStartDate(session.startDate);
      setSSchedule(session.schedule);
      setSRoom(session.room || '');
      setSMaxStudents(session.maxStudents || 25);
    } else {
      setEditingSession(null);
      setSCourseId(courses[0]?.id || '');
      setSTitle('სესია #1 (შემოდგომის ნაკადი)');
      setSTeacherId(teachersList[0]?.id || '');
      setSStartDate(new Date().toISOString().split('T')[0]);
      setSSchedule('ორშაბათი, ოთხშაბათი 19:00');
      setSRoom('თბილისი, ცენტრალური ფილიალი');
      setSMaxStudents(25);
    }
    setShowSessionModal(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTeacher = teachersList.find((t) => t.id === sTeacherId);
    const selectedCourseObj = courses.find((c) => c.id === sCourseId);
    const autoTitle = selectedCourseObj ? selectedCourseObj.title : (sTitle || 'კურსის სესია');

    if (editingSession) {
      const updated: Session = {
        ...editingSession,
        courseId: sCourseId,
        title: autoTitle,
        teacherId: sTeacherId,
        teacherName: assignedTeacher ? assignedTeacher.name : editingSession.teacherName,
        startDate: sStartDate,
        schedule: sSchedule,
        room: sRoom,
        maxStudents: sMaxStudents
      };
      onUpdateSession(updated);
      showSuccess('სესია წარმატებით განახლდა!');
    } else {
      const newSession: Session = {
        id: `session-${Date.now()}`,
        courseId: sCourseId,
        title: autoTitle,
        teacherId: sTeacherId,
        teacherName: assignedTeacher ? assignedTeacher.name : 'GeoAlpha Lecturer',
        startDate: sStartDate,
        schedule: sSchedule,
        room: sRoom,
        maxStudents: sMaxStudents,
        enrolledStudentIds: []
      };
      onAddSession(newSession);
      showSuccess('ახალი სესია წარმატებით დაემატა!');
    }
    setShowSessionModal(false);
  };

  // --- Handlers: User ---
  const handleOpenUserModal = (targetRole: 'teacher' | 'student', user?: User) => {
    setURole(targetRole);
    if (user) {
      setEditingUser(user);
      setUName(user.name);
      setUEmail(user.email);
      setUPhone(user.phone || '');
      setUHeadline(user.headline || '');
      setUBio(user.bio || '');
      setUAvatar(user.avatar || AVATAR_PRESETS[0]);
      setUIsLeadMentor(user.headline?.includes('⭐') || false);
      setUPassword(user.password || '123456');
    } else {
      setEditingUser(null);
      setUName('');
      setUEmail('');
      setUPhone('');
      setUHeadline(targetRole === 'teacher' ? 'აკადემიის ლექტორი' : 'სტუდენტი');
      setUBio('');
      setUAvatar(AVATAR_PRESETS[targetRole === 'teacher' ? 3 : 0]);
      setUIsLeadMentor(false);
      setUPassword('123456');
    }
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    let finalHeadline = uHeadline;
    if (uRole === 'teacher' && uIsLeadMentor && !finalHeadline.includes('⭐')) {
      finalHeadline = `⭐ წამყვანი მენტორი - ${finalHeadline}`;
    }

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: uName,
        email: uEmail,
        phone: uPhone,
        role: uRole,
        headline: finalHeadline,
        bio: uBio,
        avatar: uAvatar,
        password: uPassword
      };
      onUpdateUser(updated);
      showSuccess(uRole === 'teacher' ? `ლექტორი „${uName}“ წარმატებით განახლდა!` : `სტუდენტი „${uName}“ წარმატებით განახლდა!`);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: uName,
        email: uEmail,
        phone: uPhone,
        role: uRole,
        headline: finalHeadline,
        bio: uBio,
        avatar: uAvatar,
        password: uPassword,
        createdAt: new Date().toISOString()
      };
      onAddUser(newUser);
      showSuccess(uRole === 'teacher' ? `ახალი ლექტორი „${uName}“ წარმატებით დაემატა!` : `ახალი სტუდენტი „${uName}“ წარმატებით დაემატა!`);
    }
    setShowUserModal(false);
  };

  const handleToggleLeadMentor = (teacher: User) => {
    const isCurrentlyLead = teacher.headline?.includes('⭐');
    let updatedHeadline = teacher.headline || 'აკადემიის ლექტორი';
    if (isCurrentlyLead) {
      updatedHeadline = updatedHeadline.replace('⭐ წამყვანი მენტორი - ', '').replace('⭐ ', '');
    } else {
      updatedHeadline = `⭐ წამყვანი მენტორი - ${updatedHeadline}`;
    }
    onUpdateUser({ ...teacher, headline: updatedHeadline });
    showSuccess(isCurrentlyLead ? 'წამყვანი მენტორის სტატუსი მოეხსნა' : 'მიენიჭა წამყვანი მენტორის სტატუსი!');
  };

  // --- Handlers: Featured Project ---
  const handleOpenProjectModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject(project);
      setPTitle(project.title);
      setPStudentName(project.studentName);
      setPRole(project.role);
      setPImage(project.image);
      setPDemoUrl(project.demoUrl || '');
      setPGithubUrl(project.githubUrl || '');
      setPTags(project.tags ? project.tags.join(', ') : '');
    } else {
      setEditingProject(null);
      setPTitle('');
      setPStudentName('');
      setPRole('UI/UX & Frontend Student');
      setPImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800');
      setPDemoUrl('https://example.com');
      setPGithubUrl('https://github.com');
      setPTags('React, Tailwind CSS, TypeScript');
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = pTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (editingProject) {
      const updated: ProjectItem = {
        ...editingProject,
        title: pTitle,
        studentName: pStudentName,
        role: pRole,
        image: pImage,
        demoUrl: pDemoUrl,
        githubUrl: pGithubUrl,
        tags: tagArray
      };
      onUpdateProject(updated);
      showSuccess('პროექტი განახლდა!');
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: pTitle,
        studentName: pStudentName,
        role: pRole,
        image: pImage,
        demoUrl: pDemoUrl,
        githubUrl: pGithubUrl,
        tags: tagArray
      };
      onAddProject(newProj);
      showSuccess('ახალი პროექტი დაემატა!');
    }
    setShowProjectModal(false);
  };

  // --- Handlers: Video Lecture ---
  const handleOpenVideoModal = (lecture?: VideoLectureItem) => {
    if (lecture) {
      setEditingVideo(lecture);
      setVTitle(lecture.title);
      setVLecturer(lecture.lecturer);
      setVDuration(lecture.duration);
      setVCategory(lecture.category);
      setVThumbnail(lecture.thumbnail);
      setVYoutubeId(lecture.youtubeId);
      setVDescription(lecture.description);
    } else {
      setEditingVideo(null);
      setVTitle('');
      setVLecturer(teachersList[0]?.name || 'აკადემიის ლექტორი');
      setVDuration('40 წუთი');
      setVCategory('პროგრამირება');
      setVThumbnail('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800');
      setVYoutubeId('dQw4w9WgXcQ');
      setVDescription('');
    }
    setShowVideoModal(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      const updated: VideoLectureItem = {
        ...editingVideo,
        title: vTitle,
        lecturer: vLecturer,
        duration: vDuration,
        category: vCategory,
        thumbnail: vThumbnail,
        youtubeId: vYoutubeId,
        description: vDescription
      };
      onUpdateVideoLecture(updated);
      showSuccess('ვიდეო ლექცია განახლდა!');
    } else {
      const newVideo: VideoLectureItem = {
        id: `lec-${Date.now()}`,
        title: vTitle,
        lecturer: vLecturer,
        duration: vDuration,
        category: vCategory,
        thumbnail: vThumbnail,
        youtubeId: vYoutubeId,
        description: vDescription
      };
      onAddVideoLecture(newVideo);
      showSuccess('ახალი ვიდეო ლექცია დაემატა!');
    }
    setShowVideoModal(false);
  };

  // --- Handlers: Gallery Photo ---
  const handleOpenGalleryModal = (photo?: GalleryPhotoItem) => {
    if (photo) {
      setEditingPhoto(photo);
      setGTitle(photo.title);
      setGImage(photo.image);
      setGDescription(photo.description);
    } else {
      setEditingPhoto(null);
      setGTitle('');
      setGImage('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800');
      setGDescription('');
    }
    setShowGalleryModal(true);
  };

  const handleSaveGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhoto) {
      const updated: GalleryPhotoItem = {
        ...editingPhoto,
        title: gTitle,
        image: gImage,
        description: gDescription
      };
      onUpdateGalleryPhoto(updated);
      showSuccess('გალერეის ფოტო განახლდა!');
    } else {
      const newPhoto: GalleryPhotoItem = {
        id: `photo-${Date.now()}`,
        title: gTitle,
        image: gImage,
        description: gDescription
      };
      onAddGalleryPhoto(newPhoto);
      showSuccess('გალერეის ფოტო დაემატა!');
    }
    setShowGalleryModal(false);
  };

  // --- Handlers: Site Settings ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    showSuccess('საიტის პარამეტრები და ტექსტები წარმატებით განახლდა!');
  };

  // --- Confirm Delete Handler ---
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'course') {
      onDeleteCourse(deleteTarget.id);
      showSuccess(`კურსი „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    } else if (deleteTarget.type === 'session') {
      onDeleteSession(deleteTarget.id);
      showSuccess(`სესია „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    } else if (deleteTarget.type === 'user') {
      onDeleteUser(deleteTarget.id);
      showSuccess(`მომხმარებელი „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    } else if (deleteTarget.type === 'project') {
      onDeleteProject(deleteTarget.id);
      showSuccess(`პროექტი „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    } else if (deleteTarget.type === 'video') {
      onDeleteVideoLecture(deleteTarget.id);
      showSuccess(`ვიდეო ლექცია „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    } else if (deleteTarget.type === 'gallery') {
      onDeleteGalleryPhoto(deleteTarget.id);
      showSuccess(`გალერეის ფოტო „${deleteTarget.title}“ წარმატებით წაიშალა!`);
    }

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Top Admin Dashboard Header Banner */}
      <div className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-lg text-purple-300">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-widest">
                  👑 {at.panelBadge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {at.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {at.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-3 shadow-md">
              <img 
                src={adminUser.avatar || AVATAR_PRESETS[0]} 
                alt={adminUser.name} 
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-purple-500/40"
              />
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{adminUser.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200">Admin</span>
                </p>
                <p className="text-[10px] font-medium text-slate-400">{adminUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">

        {/* Global Success Banner Notification */}
        {successMsg && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs font-black flex items-center justify-between gap-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Global Error Banner Notification */}
        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-900 text-xs font-black flex items-center justify-between gap-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-900 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Mobile Fast-Scroll Tab Pill Navigation (visible on small screens) */}
        <div className="lg:hidden mb-6 space-y-3">
          <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={at.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'courses', label: at.tabCourses, icon: BookOpen, count: courses.length },
                { id: 'sessions', label: at.tabSessions, icon: Calendar, count: sessions.length },
                { id: 'teachers', label: at.tabTeachers, icon: Briefcase, count: teachersList.length },
                { id: 'students', label: at.tabStudents, icon: GraduationCap, count: studentsList.length },
                { id: 'all-users', label: at.tabAllUsers, icon: Users, count: registeredUsers.length },
                { id: 'projects', label: at.tabProjects, icon: Sparkles, count: projects.length },
                { id: 'videos', label: at.tabVideos, icon: Video, count: videoLectures.length },
                { id: 'gallery', label: at.tabGallery, icon: ImageIcon, count: galleryPhotos.length },
                { id: 'materials', label: '10. მედია ბიბლიოთეკა', icon: FileText, count: materials?.length || 0 },
                { id: 'settings', label: at.tabSettings, icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as AdminTabType)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{tab.label.replace(/^[0-9]+\.\s*/, '')}</span>
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDEBAR NAVIGATION LIST (Visible on lg screens) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 z-30">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-5">
              
              {/* Sidebar Header */}
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-600">
                    {lang === 'ka' ? 'მართვის მენიუ' : 'Control Menu'}
                  </h2>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {lang === 'ka' ? 'ადმინისტრაცია' : 'Admin Sections'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-100/80">
                  9 {lang === 'ka' ? 'სექცია' : 'Tabs'}
                </span>
              </div>

              {/* Quick Search inside Sidebar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={at.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition shadow-xs"
                />
              </div>

              {/* Categorized Vertical Menu List */}
              <div className="space-y-4 pt-1">
                {[
                  {
                    category: lang === 'ka' ? '🎓 აკადემია & სასწავლო' : '🎓 Academic & Courses',
                    items: [
                      { id: 'courses', label: at.tabCourses, icon: BookOpen, count: courses.length },
                      { id: 'lessons', label: lang === 'ka' ? 'დამოუკიდებელი გაკვეთილები' : 'Independent Lessons', icon: Layers, count: standaloneLessons.length },
                      { id: 'sessions', label: at.tabSessions, icon: Calendar, count: sessions.length }
                    ]
                  },
                  {
                    category: lang === 'ka' ? '👥 მომხმარებლები' : '👥 Users & Staff',
                    items: [
                      { id: 'teachers', label: at.tabTeachers, icon: Briefcase, count: teachersList.length },
                      { id: 'students', label: at.tabStudents, icon: GraduationCap, count: studentsList.length },
                      { id: 'all-users', label: at.tabAllUsers, icon: Users, count: registeredUsers.length }
                    ]
                  },
                  {
                    category: lang === 'ka' ? '✨ მედია & კონტენტი' : '✨ Media & Content',
                    items: [
                      { id: 'projects', label: at.tabProjects, icon: Sparkles, count: projects.length },
                      { id: 'videos', label: at.tabVideos, icon: Video, count: videoLectures.length },
                      { id: 'gallery', label: at.tabGallery, icon: ImageIcon, count: galleryPhotos.length },
                      { id: 'materials', label: at.tabMaterials, icon: FileText, count: materials?.length || 0 }
                    ]
                  },
                  {
                    category: lang === 'ka' ? '⚙️ პარამეტრები' : '⚙️ System',
                    items: [
                      { id: 'settings', label: at.tabSettings, icon: Settings }
                    ]
                  }
                ].map((group) => (
                  <div key={group.category} className="space-y-1.5">
                    <p className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {group.category}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = adminTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setAdminTab(tab.id as AdminTabType)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left group relative ${
                              isActive
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                                : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <IconComponent className={`h-4 w-4 shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'
                              }`} />
                              <span className="truncate">{tab.label.replace(/^[0-9]+\.\s*/, '')}</span>
                            </div>

                            {tab.count !== undefined && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 font-extrabold ${
                                isActive 
                                  ? 'bg-purple-700/90 text-purple-100' 
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* System Active Banner Pill */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">{lang === 'ka' ? 'სისტემის სტატუსი' : 'System Status'}</p>
                    <p className="text-xs font-black text-purple-900 flex items-center gap-1.5 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{lang === 'ka' ? 'ონლაინ მართვა' : 'Online Admin'}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT MAIN CONTENT PANEL */}
          <div className="lg:col-span-9 space-y-6">

        {/* --- TAB 1: COURSES & CATEGORIES --- */}
        {adminTab === 'courses' && (
          <div className="space-y-8">
            {/* Category Management Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FolderPlus className="h-5 w-5 text-purple-600" />
                    <span>კურსების კატეგორიები</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    აკადემიის არსებული კატეგორიების ჩამონათვალი და ახლის დამატება
                  </p>
                </div>

                <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="ახალი კატეგორია..."
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{at.addCategory}</span>
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
                    <span>{cat}</span>
                    {cat !== 'ყველა' && (
                      <button
                        onClick={() => onDeleteCategory(cat)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title={at.deleteCategory}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Header & Grid */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600 shrink-0" />
                      <span>{at.coursesHeader}</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {at.coursesSub}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenCourseModal()}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{at.addCourse}</span>
                  </button>
                </div>

                {/* Tab Search Bar */}
                <div className="relative pt-2 border-t border-slate-100">
                  <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 ძიება კურსებში (ჩაწერეთ სათაური, კატეგორია, აღწერა)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-100">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {course.category}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-slate-100">
                          {course.price}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-sm font-black text-slate-900 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {(course.startDate || course.endDate) && (
                          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-slate-700 bg-purple-50/50 border border-purple-100 rounded-xl px-2.5 py-1.5">
                            <div className="flex items-center gap-1.5 truncate">
                              <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">
                                {course.startDate && course.endDate
                                  ? `${course.startDate} - ${course.endDate}`
                                  : course.startDate || course.endDate}
                              </span>
                            </div>
                            {(() => {
                              const st = course.status || (course.isOngoing ? 'ongoing' : 'upcoming');
                              if (st === 'ongoing' || course.isOngoing) {
                                return <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 border border-emerald-300">მიმდინარე</span>;
                              }
                              if (st === 'upcoming') {
                                return <span className="text-[10px] font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md shrink-0 border border-indigo-200">მალე დაიწყება</span>;
                              }
                              if (st === 'completed') {
                                return <span className="text-[10px] font-black text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md shrink-0 border border-slate-300">დასრულებული</span>;
                              }
                              if (st === 'postponed') {
                                return <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md shrink-0 border border-rose-200">გადადებული</span>;
                              }
                              return null;
                            })()}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                            <span>{course.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            ★ {course.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      {(() => {
                        const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
                        const enrolledCount = Math.max(course.enrolledCount || 0, courseEnrollments.length);
                        return (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setAttachModalCourse(course);
                                setShowAttachLessonsModal(true);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold transition cursor-pointer"
                              title="მიბმული გაკვეთილების არჩევა / მართვა"
                            >
                              <Layers className="h-3.5 w-3.5 text-purple-600" />
                              <span>გაკვეთილები ({course.lessons?.length || 0})</span>
                            </button>

                            <button
                              onClick={() => {
                                setCourseStudentsTargetCourse(course);
                                setCourseStudentsTargetSession(null);
                                setShowCourseStudentsModal(true);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition cursor-pointer"
                              title="რეგისტრირებული სტუდენტების ნახვა და მართვა"
                            >
                              <Users className="h-3.5 w-3.5 text-emerald-600" />
                              <span>სტუდენტები ({enrolledCount})</span>
                            </button>

                            <button
                              onClick={() => {
                                setMCourseId(course.id);
                                handleOpenMaterialModal();
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold transition cursor-pointer"
                              title="ამ კურსზე სასწავლო მასალების (წიგნები, PDF) დამატება"
                            >
                              <FileText className="h-3.5 w-3.5 text-indigo-600" />
                              <span>მასალები ({(materials || []).filter((m) => m.courseId === course.id).length})</span>
                            </button>
                          </div>
                        );
                      })()}

                      <div className="flex items-center gap-1.5">
                        {/* 3rd Button next to pencil: Select attached lessons */}
                        <button
                          onClick={() => {
                            setAttachModalCourse(course);
                            setShowAttachLessonsModal(true);
                          }}
                          className="p-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                          title="მიმაგრებული გაკვეთილების არჩევა"
                        >
                          <ListChecks className="h-3.5 w-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleOpenCourseModal(course)}
                          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title={at.editCourse}
                        >
                          <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'course', id: course.id, title: course.title })}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title={at.deleteCourse}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: INDEPENDENT LESSONS BANK --- */}
        {adminTab === 'lessons' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <span>დამოუკიდებელი გაკვეთილების ბანკი (Lesson Management)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    შექმენით დამოუკიდებელი გაკვეთილები და მიაბით ისინი ნებისმიერ კურსს შეუზღუდავი რაოდენობით
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingLesson(null);
                    setLesTitle('');
                    setLesDuration('45 წთ');
                    setLesType('video');
                    setLesContent('');
                    setModalAttachCourseId('');
                    setShowAddLessonModal(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>ახალი გაკვეთილის დამატება</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება დამოუკიდებელ გაკვეთილებში (ჩაწერეთ სათაური, შინაარსი)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((les, idx) => {
                const attachedCourses = courses.filter((c) => c.lessons?.some((l) => l.title === les.title || l.id === les.id));

                return (
                  <div key={les.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-black uppercase tracking-wider">
                          ⏱ {les.duration} | {les.type.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingLesson(les);
                              setLesTitle(les.title);
                              setLesDuration(les.duration);
                              setLesType(les.type);
                              setLesContent(les.content || '');
                              setModalAttachCourseId('');
                              setShowAddLessonModal(true);
                            }}
                            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            title="რედაქტირება"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                          </button>
                          <button
                            onClick={() => {
                              setStandaloneLessons((prev) => prev.filter((l) => l.id !== les.id));
                              showSuccess('გაკვეთილი წაიშალა!');
                            }}
                            className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="წაშლა"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 leading-snug">გაკვეთილი #{idx + 1}: {les.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {les.content || 'გაკვეთილის დეტალური აღწერა და სასწავლო მასალები.'}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">
                          📌 მიბმული კურსი ({attachedCourses.length}):
                        </span>
                        {attachedCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {attachedCourses.map((ac) => {
                              const cIndex = courses.findIndex((c) => c.id === ac.id) + 1;
                              return (
                                <span key={ac.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-[11px] font-bold">
                                  <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
                                    {cIndex}-ლი კურსი
                                  </span>
                                  <span>{ac.title}</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">არცერთ კურსს არ არის მიბმული</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Edit Lesson Modal */}
            {showAddLessonModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900">
                      {editingLesson ? 'გაკვეთილის რედაქტირება' : 'ახალი დამოუკიდებელი გაკვეთილის შექმნა'}
                    </h3>
                    <button onClick={() => setShowAddLessonModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!lesTitle.trim()) return;

                      let newLes: Lesson;

                      if (editingLesson) {
                        newLes = { ...editingLesson, title: lesTitle, duration: lesDuration, type: lesType, content: lesContent };
                        setStandaloneLessons((prev) =>
                          prev.map((l) => l.id === editingLesson.id ? newLes : l)
                        );
                        showSuccess('გაკვეთილი განახლდა!');
                      } else {
                        newLes = {
                          id: `l-std-${Date.now()}`,
                          title: lesTitle,
                          duration: lesDuration,
                          type: lesType,
                          content: lesContent
                        };
                        setStandaloneLessons((prev) => [newLes, ...prev]);
                      }

                      // Auto Attach to Course if Selected
                      if (modalAttachCourseId) {
                        const targetC = courses.find((c) => c.id === modalAttachCourseId);
                        if (targetC) {
                          const cIndex = courses.findIndex((c) => c.id === targetC.id) + 1;
                          const exists = targetC.lessons?.some((l) => l.id === newLes.id || l.title === newLes.title);
                          if (!exists) {
                            const updatedC = {
                              ...targetC,
                              lessons: [...(targetC.lessons || []), newLes]
                            };
                            onUpdateCourse(updatedC);
                            showSuccess(`გაკვეთილი დაემატა და წარმატებით მიება ${cIndex}-ლ კურსს („${targetC.title}“)!`);
                          }
                        }
                      } else if (!editingLesson) {
                        showSuccess('ახალი გაკვეთილი დაემატა ბანკში!');
                      }

                      setShowAddLessonModal(false);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">გაკვეთილის სათაური</label>
                      <input
                        type="text"
                        value={lesTitle}
                        onChange={(e) => setLesTitle(e.target.value)}
                        placeholder="მაგ: Node.js Express Server Setup"
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ხანგრძლივობა</label>
                        <input
                          type="text"
                          value={lesDuration}
                          onChange={(e) => setLesDuration(e.target.value)}
                          placeholder="45 წთ"
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">ტიპი</label>
                        <select
                          value={lesType}
                          onChange={(e) => setLesType(e.target.value as any)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                        >
                          <option value="video">📹 ვიდეო (Video)</option>
                          <option value="article">📄 სტატია / ტექსტი</option>
                          <option value="quiz">❓ ქვიზი / ტესტი</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        🎓 ავტომატური მიბმა კურსზე (აირჩიეთ კურსი)
                      </label>
                      <select
                        value={modalAttachCourseId}
                        onChange={(e) => setModalAttachCourseId(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                      >
                        <option value="">-- არცერთი (დარჩეს მხოლოდ დამოუკიდებელ ბანკში) --</option>
                        {courses.map((c, idx) => (
                          <option key={c.id} value={c.id}>
                            კურსი #{idx + 1}: {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">აღწერა / შინაარსი</label>
                      <textarea
                        rows={3}
                        value={lesContent}
                        onChange={(e) => setLesContent(e.target.value)}
                        placeholder="გაკვეთილის მოკლე შინაარსი..."
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddLessonModal(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        გაუქმება
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        შენახვა
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: SESSIONS MANAGEMENT --- */}
        {adminTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>{at.sessionsHeader}</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {at.sessionsSub}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenSessionModal()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addSession}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება სესიებში (ჩაწერეთ სესია, ლექტორი, ლოკაცია, განრიგი)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSessions.map((session) => {
                const targetCourse = courses.find((c) => c.id === session.courseId);
                const sessionEnrollments = enrollments.filter(
                  (e) => e.sessionId === session.id || (e.courseId === session.courseId && session.enrolledStudentIds?.includes(e.studentId))
                );
                const enrolledCount = Math.max(session.enrolledStudentIds?.length || 0, sessionEnrollments.length);
                const displayTitle = targetCourse ? targetCourse.title : session.title;

                return (
                  <div key={session.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-xs font-black truncate max-w-[60%]" title={displayTitle}>
                          {displayTitle}
                        </span>
                        <button
                          onClick={() => {
                            setCourseStudentsTargetCourse(targetCourse || null);
                            setCourseStudentsTargetSession(session);
                            setShowCourseStudentsModal(true);
                          }}
                          className="text-xs text-emerald-800 font-extrabold flex items-center gap-1.5 shrink-0 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
                          title="სესიაზე დარეგისტრირებული სტუდენტების ნახვა"
                        >
                          <Users className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{enrolledCount} / {session.maxStudents} {lang === 'ka' ? 'სტუდენტი' : 'Students'}</span>
                        </button>
                      </div>

                      <h3 className="text-base font-black text-slate-900 mb-2">
                        {displayTitle}
                      </h3>

                      <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span>{at.assignedTeacher}: <strong>{session.teacherName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{at.schedule}: {session.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{at.room}: {session.room || 'Online / Campus'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setCourseStudentsTargetCourse(targetCourse || null);
                          setCourseStudentsTargetSession(session);
                          setShowCourseStudentsModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5 text-emerald-600" />
                        <span>სტუდენტების სია ({enrolledCount})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenSessionModal(session)}
                          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title={at.editSession}
                        >
                          <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'session', id: session.id, title: displayTitle })}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title={at.deleteSession}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 3: TEACHERS MANAGEMENT & LEAD MENTORS --- */}
        {adminTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>{at.teachersHeader}</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {at.teachersSub}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenUserModal('teacher')}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addTeacher}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება ლექტორებში (ჩაწერეთ სახელი, ელფოსტა, მიმართულება)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => {
                const isLead = teacher.headline?.includes('⭐');
                return (
                  <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start gap-4">
                        <img 
                          src={teacher.avatar || AVATAR_PRESETS[3]} 
                          alt={teacher.name} 
                          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-600/20 shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          {isLead ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                              ⭐ {at.leadMentorBadge}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider">
                              Lecturer
                            </span>
                          )}
                          <h3 className="text-base font-black text-slate-900">
                            {teacher.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {teacher.headline || 'აკადემიის ლექტორი'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{teacher.phone}</span>
                          </div>
                        )}
                        {teacher.bio && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-light italic">
                            "{teacher.bio}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleLeadMentor(teacher)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          isLead 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isLead ? '⭐ წამყვანია' : '⭐ მონიშვნა'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenUserModal('teacher', teacher)}
                          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title={at.editTeacher}
                        >
                          <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'user', id: teacher.id, title: teacher.name })}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title={at.deleteTeacher}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB 4: STUDENTS MANAGEMENT --- */}
        {adminTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600 shrink-0" />
                      <span>{at.studentsHeader}</span>
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black">
                      {filteredStudents.length} სტუდენტი
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {at.studentsSub}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenUserModal('student')}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addStudent}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setStudentPage(1);
                  }}
                  placeholder="🔍 ძიება სტუდენტებში (ჩაწერეთ სახელი, ელფოსტა, ტელეფონი)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStudentPage(1);
                    }}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Students Grid with Pagination */}
            {(() => {
              const startIndex = (studentPage - 1) * ITEMS_PER_PAGE;
              const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
              const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedStudents.map((student) => {
                      const isDeactivated = deactivatedStudentIds.includes(student.id);

                      return (
                        <div key={student.id} className={`bg-white rounded-2xl border transition-all p-6 shadow-sm flex flex-col justify-between space-y-4 ${
                          isDeactivated ? 'border-rose-200 bg-rose-50/30 opacity-75' : 'border-slate-200/80'
                        }`}>
                          <div className="flex items-start gap-4">
                            <img 
                              src={student.avatar || AVATAR_PRESETS[0]} 
                              alt={student.name} 
                              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-600/20 shadow-sm shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  isDeactivated ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {isDeactivated ? '🚫 დეაქტივირებული' : 'Student'}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-900">
                                {student.name}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium">
                                {student.headline || 'სტუდენტი'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <a href={`mailto:${student.email}`} className="hover:underline text-indigo-600 font-medium">
                                {student.email}
                              </a>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <a href={`tel:${student.phone}`} className="hover:underline text-slate-700">
                                  {student.phone}
                                </a>
                              </div>
                            )}

                            {/* Enrolled Courses */}
                            {(() => {
                              const studentEnrollments = enrollments.filter((e) => e.studentId === student.id);
                              const enrolledCourses = courses.filter((c) => studentEnrollments.some((e) => e.courseId === c.id));

                              return (
                                <div className="pt-2 border-t border-slate-100 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    კურსები ({enrolledCourses.length}):
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {enrolledCourses.length > 0 ? (
                                      enrolledCourses.map((c) => (
                                        <span key={c.id} className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">
                                          {c.title}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[11px] text-slate-400 italic">არ არის რეგისტრირებული</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  if (isDeactivated) {
                                    setDeactivatedStudentIds(prev => prev.filter(id => id !== student.id));
                                    showSuccess(`სტუდენტი ${student.name} წარმატებით გააქტიურდა!`);
                                  } else {
                                    setDeactivatedStudentIds(prev => [...prev, student.id]);
                                    showSuccess(`სტუდენტს ${student.name} შეეზღუდა წვდომა (დეაქტივირებულია).`);
                                  }
                                }}
                                className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                  isDeactivated 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                {isDeactivated ? '✅ გააქტიურება' : '🚫 დეაქტივაცია'}
                              </button>

                              <button
                                onClick={() => {
                                  setStudentToEnrollId(student.id);
                                  setCourseStudentsTargetCourse(courses[0] || null);
                                  setCourseStudentsTargetSession(null);
                                  setShowCourseStudentsModal(true);
                                }}
                                className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer flex items-center gap-1"
                                title="სტუდენტის კურსზე დარეგისტრირება"
                              >
                                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                                <span>კურსზე მიბმა</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenUserModal('student', student)}
                                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                title={at.editStudent}
                              >
                                <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'user', id: student.id, title: student.name })}
                                className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                title={at.deleteStudent}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Bar */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-600">
                      <span>გვერდი {studentPage} / {totalPages} (სულ {filteredStudents.length})</span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={studentPage === 1}
                          onClick={() => setStudentPage(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                        >
                          წინა
                        </button>
                        <button
                          disabled={studentPage === totalPages}
                          onClick={() => setStudentPage(prev => Math.min(totalPages, prev + 1))}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                        >
                          შემდეგი
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* --- TAB 5: ALL USERS DIRECTORY --- */}
        {adminTab === 'all-users' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600 shrink-0" />
                  <span>{at.allUsersTitle}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{at.userDirectorySub}</p>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება მომხმარებელთა ბაზაში (სახელი, ელფოსტა, ტელეფონი, როლი)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{at.userHeader}</th>
                    <th className="py-3 px-4">{at.email}</th>
                    <th className="py-3 px-4">{at.phone}</th>
                    <th className="py-3 px-4">{at.role}</th>
                    <th className="py-3 px-4 text-right">{at.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAllUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || AVATAR_PRESETS[0]} alt="" className="h-9 w-9 rounded-xl object-cover border" />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400">{u.headline || u.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : u.role === 'teacher' 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenUserModal(u.role === 'teacher' ? 'teacher' : 'student', u)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                          </button>
                          {u.id !== adminUser.id && (
                            <button
                              onClick={() => setDeleteTarget({ type: 'user', id: u.id, title: u.name })}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 6: SITE SETTINGS, STATS, PRICES & CONTACTS --- */}
        {adminTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span>საიტის ტექსტების, სტატისტიკის & კონტაქტების მართვა</span>
                </h2>
                <p className="text-xs text-slate-500">
                  განაახლეთ სტუდენტების რაოდენობა, ფილიალები, აქციის ფასები, საკონტაქტო ინფო და ტექსტები
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
              >
                {at.save}
              </button>
            </div>

            {/* Statistics Section Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-purple-600">
                1. მთავარი გვერდის სტატისტიკა (Stats Counter)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">სტუდენტების რაოდენობა</label>
                  <input
                    type="text"
                    value={settingsForm.studentsCount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studentsCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ლექტორების რაოდენობა</label>
                  <input
                    type="text"
                    value={settingsForm.lecturersCount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, lecturersCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ფილიალების რაოდენობა</label>
                  <input
                    type="text"
                    value={settingsForm.branchesCount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, branchesCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ქვეყნების რაოდენობა</label>
                  <input
                    type="text"
                    value={settingsForm.countriesCount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, countriesCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">კურსდამთავრებულები</label>
                  <input
                    type="text"
                    value={settingsForm.alumniCount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, alumniCount: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Promo & Offer Price Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-purple-600">
                2. აქციის ფასები და შეთავაზების სათაური
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">აქციის დასახელება</label>
                  <input
                    type="text"
                    value={settingsForm.promoSaleTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoSaleTitle: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">აქციის სპეც-ფასი</label>
                  <input
                    type="text"
                    value={settingsForm.promoSalePrice}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoSalePrice: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-purple-600">
                3. საკონტაქტო ინფორმაცია (Contact Info)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ტელეფონის ნომერი</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ელ-ფოსტის მისამართი</label>
                  <input
                    type="text"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">სათაო ოფისის მისამართი</label>
                  <input
                    type="text"
                    value={settingsForm.contactAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">სამუშაო საათები</label>
                  <input
                    type="text"
                    value={settingsForm.workingHours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* About Us & Video Tour Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-purple-600">
                4. "ჩვენ შესახებ" გვერდის ტექსტი & ვიდეო ტურის ბმული
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">სათაური</label>
                  <input
                    type="text"
                    value={settingsForm.aboutTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutTitle: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">აღწერა / ისტორიის ტექსტი</label>
                  <textarea
                    rows={3}
                    value={settingsForm.aboutDesc}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutDesc: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ვიდეო ტურის YouTube URL</label>
                  <input
                    type="text"
                    value={settingsForm.videoTourUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, videoTourUrl: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-md transition cursor-pointer"
              >
                {at.save}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB 7: FEATURED PROJECTS --- */}
        {adminTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Folder className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>მთავარ გვერდზე გამორჩეული პროექტები</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    დაამატეთ ან ჩაასწორეთ სტუდენტების მიერ შექმნილი საუკეთესო პროექტები
                  </p>
                </div>

                <button
                  onClick={() => handleOpenProjectModal()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addProject}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება პროექტებში (ჩაწერეთ სათაური, სტუდენტი, ტეგები)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <img src={proj.image} alt={proj.title} className="w-full h-44 object-cover" />
                    <div className="p-5 space-y-2">
                      <h3 className="text-sm font-black text-slate-900">{proj.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">ავტორი: <strong>{proj.studentName}</strong> ({proj.role})</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.tags?.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenProjectModal(proj)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title={at.editProject}
                    >
                      <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'project', id: proj.id, title: proj.title })}
                      className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 8: FREE VIDEO LECTURES --- */}
        {adminTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>უფასო ვიდეო ლექციების მართვა</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    მართეთ ღია გაკვეთილები და ვიდეო მასალები კურსების გვერდზე
                  </p>
                </div>

                <button
                  onClick={() => handleOpenVideoModal()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addVideo}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება ვიდეოებში (ჩაწერეთ სათაური, ლექტორი, კატეგორია)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((lec) => (
                <div key={lec.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-100">
                      <img src={lec.thumbnail} alt={lec.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {lec.duration}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-indigo-600">{lec.category}</span>
                      <h3 className="text-sm font-black text-slate-900">{lec.title}</h3>
                      <p className="text-xs text-slate-500">ლექტორი: <strong>{lec.lecturer}</strong></p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenVideoModal(lec)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title={at.editVideo}
                    >
                      <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'video', id: lec.id, title: lec.title })}
                      className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 9: GALLERY PHOTOS --- */}
        {adminTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>გალერეის ფოტოების მართვა</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    დაამატეთ ან ჩაასწორეთ აკადემიის ფოტოები
                  </p>
                </div>

                <button
                  onClick={() => handleOpenGalleryModal()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>{at.addPhoto}</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება ფოტოებში (ჩაწერეთ სათაური, აღწერა)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((photo) => (
                <div key={photo.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-100">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-purple-600">{photo.description}</span>
                      <h3 className="text-sm font-black text-slate-900">{photo.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenGalleryModal(photo)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title={at.editPhoto}
                    >
                      <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'gallery', id: photo.id, title: photo.title })}
                      className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                      title={at.deletePhoto}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 10: MEDIA LIBRARY & MATERIALS --- */}
        {adminTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>📚 მედია ბიბლიოთეკა & სასწავლო მასალები</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ატვირთეთ წიგნები (PDF), Word დოკუმენტები, არქივები (ZIP) და დააკავშირეთ კურსებთან
                  </p>
                </div>

                <button
                  onClick={handleOpenMaterialModal}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>ახალი მასალის ატვირთვა</span>
                </button>
              </div>

              {/* Tab Search Bar */}
              <div className="relative pt-2 border-t border-slate-100">
                <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება მასალებში (ჩაწერეთ დასახელება, ტიპი)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((mat) => {
                const boundCourse = courses.find((c) => c.id === mat.courseId);
                return (
                  <div key={mat.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-200 transition">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 font-bold">
                          {mat.type === 'pdf' ? <FileText className="h-5 w-5" /> : mat.type === 'book' ? <Book className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                          {mat.type.toUpperCase()} • {mat.fileSize}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-900 line-clamp-2">{mat.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description || 'სასწავლო მასალა სტუდენტებისთვის'}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>📌 {boundCourse ? boundCourse.title : 'ყველა კურსი'}</span>
                        <span>📅 {mat.uploadedAt}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={mat.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>გადმოწერა</span>
                      </a>
                      {onDeleteMaterial && (
                        <button
                          onClick={() => onDeleteMaterial(mat.id)}
                          className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          title="წაშლა"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          </div>
        </div>

      </div>

      {/* --- MODAL 1: ADD / EDIT COURSE --- */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 my-auto max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingCourse ? at.editCourse : at.addCourse}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {editingCourse ? 'კურსის მონაცემების, თარიღების და სილაბუსის განახლება' : 'ახალი კურსის ძირითადი ინფორაციის შევსება'}
                </p>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">კურსის დასახელება</label>
                <input 
                  type="text" 
                  value={cTitle} 
                  onChange={(e) => setCTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="მაგ: Full-Stack Web Development"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">აღწერა</label>
                <textarea 
                  rows={3}
                  value={cDesc} 
                  onChange={(e) => setCDesc(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="კურსის მოკლე აღწერა..."
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{at.category}</label>
                  <select 
                    value={cCategory} 
                    onChange={(e) => setCCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                  >
                    {categories.filter(c => c !== 'ყველა').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{at.level}</label>
                  <select 
                    value={cLevel} 
                    onChange={(e) => setCLevel(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                  >
                    <option value="დამწყები">დამწყები / Beginner</option>
                    <option value="საშუალო">საშუალო / Intermediate</option>
                    <option value="პროფესიონალი">პროფესიონალი / Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{at.assignedTeacher}</label>
                  <select 
                    value={cTeacherId} 
                    onChange={(e) => setCTeacherId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                  >
                    {teachersList.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{at.price}</label>
                  <input 
                    type="text" 
                    value={cPrice} 
                    onChange={(e) => setCPrice(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                    placeholder="Free / 150 ₾"
                  />
                </div>
              </div>

              {/* Start Date & End Date - Visible ONLY in Edit Mode */}
              {editingCourse ? (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                    📅 თარიღების მართვა (რედაქტირების რეჟიმი)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">დაწყების თარიღი (Start Date)</label>
                      <input 
                        type="text" 
                        value={cStartDate} 
                        onChange={(e) => setCStartDate(e.target.value)} 
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                        placeholder="მაგ: 15 სექტემბერი, 2026"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">დასრულების თარიღი (End Date)</label>
                      <input 
                        type="text" 
                        value={cEndDate} 
                        onChange={(e) => setCEndDate(e.target.value)} 
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                        placeholder="მაგ: 25 დეკემბერი, 2026"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">კურსის ფორმატი</label>
                  <select 
                    value={cFormat} 
                    onChange={(e) => setCFormat(e.target.value as CourseFormat)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-extrabold focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="ჰიბრიდული">🏢/🌐 ჰიბრიდული (Hybrid)</option>
                    <option value="ადგილზე">🏢 ადგილზე (On-site)</option>
                    <option value="ონლაინ">🌐 ონლაინ (Online)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">მდებარეობა / ქალაქი</label>
                  <input 
                    type="text" 
                    value={cLocation} 
                    onChange={(e) => setCLocation(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                    placeholder="მაგ: თბილისი, ჭავჭავაძის #37 / ბათუმი"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">კურსის სტატუსი (დინამიური)</label>
                <select 
                  value={cStatus} 
                  onChange={(e) => {
                    const st = e.target.value as CourseStatus;
                    setCStatus(st);
                    setCIsOngoing(st === 'ongoing');
                  }} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-extrabold focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="ongoing">🟢 მიმდინარე (Ongoing)</option>
                  <option value="upcoming">🟣 მალე დაიწყება (Upcoming)</option>
                  <option value="completed">⚪ დასრულებული (Completed)</option>
                  <option value="postponed">🔴 გადადებული (Postponed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">სტუდენტის გზამკვლევი (Process Guide)</label>
                <textarea 
                  rows={2}
                  value={cProcessGuideText} 
                  onChange={(e) => setCProcessGuideText(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="ინსტრუქცია სტუდენტებისთვის დავალების ატვირთვაზე, დასწრებაზე და ა.შ."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.coverImage}</label>
                <input 
                  type="text" 
                  value={cImage} 
                  onChange={(e) => setCImage(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Syllabus - Visible ONLY in Edit Mode */}
              {editingCourse ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    📚 კურსის სილაბუსი (Syllabus - რედაქტირების რეჟიმი)
                  </label>
                  <textarea 
                    rows={4}
                    value={cSyllabus} 
                    onChange={(e) => setCSyllabus(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                    placeholder={'HTML/CSS Basics\nJavaScript ES6+\nReact.js State Management'}
                  />
                </div>
              ) : null}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10 py-2">
                <button 
                  type="button" 
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT SESSION --- */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingSession ? at.editSession : at.addSession}
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.courseSelect}</label>
                <select 
                  value={sCourseId} 
                  onChange={(e) => setSCourseId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <p className="text-[11px] text-purple-600 font-medium mt-1">
                  💡 სესიის სახელი ავტომატურად განისაზღვრება არჩეული კურსის მიხედვით.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.assignedTeacher}</label>
                <select 
                  value={sTeacherId} 
                  onChange={(e) => setSTeacherId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                >
                  {teachersList.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.maxStudents}</label>
                <input 
                  type="number" 
                  value={sMaxStudents} 
                  onChange={(e) => setSMaxStudents(Number(e.target.value))} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.schedule}</label>
                <input 
                  type="text" 
                  value={sSchedule} 
                  onChange={(e) => setSSchedule(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="ორშაბათი, ოთხშაბათი 19:00"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🏢 ქალაქი / ლოკაცია (City)
                </label>
                <input 
                  type="text" 
                  value={sRoom} 
                  onChange={(e) => setSRoom(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="მაგ: თბილისი, ქუთაისი, ბათუმი"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD / EDIT USER --- */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 my-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-black text-slate-900">
                {editingUser 
                  ? (uRole === 'teacher' ? at.editTeacher : at.editStudent)
                  : (uRole === 'teacher' ? at.addTeacher : at.addStudent)}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto pr-1.5 space-y-4 scrollbar-thin">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.name}</label>
                <input 
                  type="text" 
                  value={uName} 
                  onChange={(e) => setUName(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="Giorgi Beridze"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.email}</label>
                <input 
                  type="email" 
                  value={uEmail} 
                  onChange={(e) => setUEmail(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="email@example.com"
                  required 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    🔑 პაროლი (Password) {editingUser && '(შეცვლა / რესეტი)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setUPassword(Math.random().toString(36).slice(-8) + 'A1!')}
                    className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    🎲 შემთხვევითი პაროლი
                  </button>
                </div>
                <input 
                  type="text" 
                  value={uPassword} 
                  onChange={(e) => setUPassword(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-purple-900 bg-purple-50/50 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="შეიყვანეთ პაროლი..."
                  required 
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  ლექტორს/სტუდენტს შეეძლება ამ პაროლით სისტემაში ავტორიზაცია.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.phone}</label>
                <input 
                  type="text" 
                  value={uPhone} 
                  onChange={(e) => setUPhone(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="+995 599 12 34 56"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.role}</label>
                <select 
                  value={uRole} 
                  onChange={(e) => setURole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none bg-white"
                >
                  <option value="teacher">Teacher / Lecturer</option>
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {uRole === 'teacher' && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="leadMentorCheck"
                    checked={uIsLeadMentor}
                    onChange={(e) => setUIsLeadMentor(e.target.checked)}
                    className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="leadMentorCheck" className="text-xs font-bold text-amber-900 cursor-pointer">
                    ⭐ წამყვანი მენტორის (Lead Mentor) სტატუსი
                  </label>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{at.headline}</label>
                <input 
                  type="text" 
                  value={uHeadline} 
                  onChange={(e) => setUHeadline(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="Senior Developer / UI Designer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ბიოგრაფია / გამოცდილება</label>
                <textarea 
                  rows={2}
                  value={uBio} 
                  onChange={(e) => setUBio(e.target.value)} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  placeholder="მოკლე ბიო..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ka' ? 'ფოტოს ატვირთვა ან ავატარის არჩევა' : 'Upload Photo or Select Avatar'}
                  </label>
                  <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {ABSTRACT_AVATARS.find(a => a.url === uAvatar)?.name || 'Custom Photo'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
                  {/* Local Image File Upload Button */}
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
                    <img src={uAvatar} alt="Preview" className="h-10 w-10 rounded-xl object-cover ring-2 ring-purple-500/20 shrink-0" />
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs">
                        <Camera className="h-3.5 w-3.5" />
                        <span>{lang === 'ka' ? 'ფოტოს ატვირთვა კომპიუტერიდან' : 'Upload Photo from Computer'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setUAvatar(ev.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP (მაქს 5MB)</p>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-slate-500 pt-0.5">ან აირჩიეთ აბსტრაქტული ავატარი:</p>

                  <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin">
                    {ABSTRACT_AVATARS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUAvatar(item.url)}
                        title={item.name}
                        className={`relative group h-10 w-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          uAvatar === item.url 
                            ? 'border-purple-600 ring-2 ring-purple-300 scale-105 shadow-md bg-white' 
                            : 'border-slate-200 hover:border-purple-300 hover:scale-105 bg-white'
                        }`}
                      >
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover p-1" />
                        {uAvatar === item.url && (
                          <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-[1px] flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={uAvatar} 
                      onChange={(e) => setUAvatar(e.target.value)} 
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="ან ჩასვით ავატარის URL..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD / EDIT FEATURED PROJECT --- */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingProject ? 'პროექტის რედაქტირება' : 'ახალი პროექტის დამატება'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">პროექტის დასახელება</label>
                <input 
                  type="text" 
                  value={pTitle} 
                  onChange={(e) => setPTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">სტუდენტის სახელი</label>
                  <input 
                    type="text" 
                    value={pStudentName} 
                    onChange={(e) => setPStudentName(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">როლი / მიმართულება</label>
                  <input 
                    type="text" 
                    value={pRole} 
                    onChange={(e) => setPRole(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">სურათის URL</label>
                <input 
                  type="text" 
                  value={pImage} 
                  onChange={(e) => setPImage(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Live Demo URL</label>
                  <input 
                    type="text" 
                    value={pDemoUrl} 
                    onChange={(e) => setPDemoUrl(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GitHub Repository URL</label>
                  <input 
                    type="text" 
                    value={pGithubUrl} 
                    onChange={(e) => setPGithubUrl(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ტეგები (მძიმით გამოყოფილი)</label>
                <input 
                  type="text" 
                  value={pTags} 
                  onChange={(e) => setPTags(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  placeholder="React, Tailwind, Node.js"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: ADD / EDIT VIDEO LECTURE --- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingVideo ? 'ვიდეოს რედაქტირება' : 'ახალი ვიდეო ლექცია'}
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ვიდეო ლექციის სათაური</label>
                <input 
                  type="text" 
                  value={vTitle} 
                  onChange={(e) => setVTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ლექტორი</label>
                  <input 
                    type="text" 
                    value={vLecturer} 
                    onChange={(e) => setVLecturer(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ხანგრძლივობა</label>
                  <input 
                    type="text" 
                    value={vDuration} 
                    onChange={(e) => setVDuration(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">კატეგორია</label>
                  <input 
                    type="text" 
                    value={vCategory} 
                    onChange={(e) => setVCategory(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">YouTube ID</label>
                  <input 
                    type="text" 
                    value={vYoutubeId} 
                    onChange={(e) => setVYoutubeId(e.target.value)} 
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                    placeholder="dQw4w9WgXcQ"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Thumbnail სურათის URL</label>
                <input 
                  type="text" 
                  value={vThumbnail} 
                  onChange={(e) => setVThumbnail(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">აღწერა</label>
                <textarea 
                  rows={3}
                  value={vDescription} 
                  onChange={(e) => setVDescription(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: ADD / EDIT GALLERY PHOTO --- */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingPhoto ? 'ფოტოს რედაქტირება' : 'ახალი ფოტო გალერეაში'}
              </h3>
              <button onClick={() => setShowGalleryModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryPhoto} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ფოტოს სათაური</label>
                <input 
                  type="text" 
                  value={gTitle} 
                  onChange={(e) => setGTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">სურათის URL</label>
                <input 
                  type="text" 
                  value={gImage} 
                  onChange={(e) => setGImage(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">აღწერა</label>
                <textarea 
                  rows={3}
                  value={gDescription} 
                  onChange={(e) => setGDescription(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6.5: ADD MEDIA MATERIAL --- */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                📚 ახალი მედია მასალის ატვირთვა
              </h3>
              <button onClick={() => setShowMaterialModal(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">მასალის დასახელება</label>
                <input 
                  type="text" 
                  value={mTitle} 
                  onChange={(e) => setMTitle(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  placeholder="მაგ: React & TypeScript ელ-წიგნი (2026 Edition)"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ტიპი</label>
                  <select
                    value={mType}
                    onChange={(e) => setMType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-extrabold bg-white cursor-pointer"
                  >
                    <option value="pdf">PDF დოკუმენტი</option>
                    <option value="doc">Word დოკუმენტი (.docx)</option>
                    <option value="book">ელექტრონული წიგნი</option>
                    <option value="zip">არქივი (.zip)</option>
                    <option value="link">გარე ბმული</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">კურსთან დაკავშირება</label>
                  <select
                    value={mCourseId}
                    onChange={(e) => setMCourseId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-extrabold bg-white cursor-pointer"
                  >
                    <option value="all">ყველა კურსი (საერთო)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ფაილის URL / ბმული</label>
                <input 
                  type="text" 
                  value={mFileUrl} 
                  onChange={(e) => setMFileUrl(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">მოკლე აღწერა</label>
                <textarea 
                  rows={2}
                  value={mDesc} 
                  onChange={(e) => setMDesc(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  placeholder="დამატებითი განმარტება..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {at.cancel}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
                >
                  {at.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 7: DELETE CONFIRMATION DIALOG --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center gap-4 text-rose-600">
              <div className="h-12 w-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {at.confirmDeleteTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {at.confirmDeleteWarning}
                </p>
              </div>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-xs font-semibold text-slate-700">
              {at.confirmDeleteMsg}: <strong className="text-rose-700">"{deleteTarget.title}"</strong>?
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {at.cancel}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>{at.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 8: ATTACH / SELECT LESSONS FOR COURSE --- */}
      {showAttachLessonsModal && attachModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  მიმაგრებული გაკვეთილების არჩევა
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {attachModalCourse.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  მონიშნეთ გაკვეთილები, რომლებიც უნდა შედიოდეს ამ კურსის პროგრამაში
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAttachLessonsModal(false);
                  setAttachModalCourse(null);
                }} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search and Quick Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
                <input
                  type="text"
                  value={attachLessonSearch}
                  onChange={(e) => setAttachLessonSearch(e.target.value)}
                  placeholder="🔍 ძიება გაკვეთილების ბანკში..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/90 text-xs font-semibold focus:ring-2 focus:ring-purple-200 focus:outline-none"
                />
                {attachLessonSearch && (
                  <button onClick={() => setAttachLessonSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                <span>არჩეულია <strong>{attachModalCourse.lessons?.length || 0}</strong> გაკვეთილი</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLesson(null);
                    setLesTitle('');
                    setLesDuration('45 წთ');
                    setLesType('video');
                    setLesContent('');
                    setShowAddLessonModal(true);
                  }}
                  className="flex items-center gap-1 text-purple-600 font-bold hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>ახალი გაკვეთილის შექმნა</span>
                </button>
              </div>
            </div>

            {/* List of lessons with checkboxes */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {(() => {
                const allAvailableLessons = [...standaloneLessons];
                (attachModalCourse.lessons || []).forEach((l) => {
                  if (!allAvailableLessons.some((std) => std.id === l.id)) {
                    allAvailableLessons.push(l);
                  }
                });

                const q = attachLessonSearch.toLowerCase().trim();
                const filtered = allAvailableLessons.filter((l) =>
                  !q || l.title.toLowerCase().includes(q) || (l.content && l.content.toLowerCase().includes(q))
                );

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
                      გაკვეთილი ვერ მოიძებნა
                    </div>
                  );
                }

                return filtered.map((les, idx) => {
                  const isChecked = (attachModalCourse.lessons || []).some((l) => l.id === les.id);
                  return (
                    <div
                      key={les.id}
                      onClick={() => {
                        let updated: Lesson[];
                        if (isChecked) {
                          updated = (attachModalCourse.lessons || []).filter((l) => l.id !== les.id);
                        } else {
                          updated = [...(attachModalCourse.lessons || []), les];
                        }
                        const updatedCourse = { ...attachModalCourse, lessons: updated };
                        setAttachModalCourse(updatedCourse);
                        onUpdateCourse(updatedCourse);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked 
                          ? 'bg-purple-50/80 border-purple-300 text-purple-950 shadow-sm' 
                          : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded text-purple-600 focus:ring-purple-400 border-slate-300 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">გაკვეთილი #{idx + 1}: {les.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{les.content}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {les.type === 'video' ? '🎥 ვიდეო' : les.type === 'quiz' ? '❓ ქვიზი' : '📄 სტატია'} ({les.duration})
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAttachLessonsModal(false);
                  setAttachModalCourse(null);
                  showSuccess('კურსის გაკვეთილები წარმატებით განახლდა!');
                }}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-sm cursor-pointer"
              >
                დასრულება / შენახვა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 9: COURSE / SESSION ENROLLED STUDENTS --- */}
      {showCourseStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  👥 რეგისტრირებული სტუდენტები
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {courseStudentsTargetCourse?.title || courseStudentsTargetSession?.title || 'კურსის სტუდენტები'}
                </h3>
                {courseStudentsTargetSession && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    სესია: {courseStudentsTargetSession.schedule} ({courseStudentsTargetSession.room})
                  </p>
                )}
              </div>
              <button 
                onClick={() => {
                  setShowCourseStudentsModal(false);
                  setCourseStudentsTargetCourse(null);
                  setCourseStudentsTargetSession(null);
                }} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Enroll New Student Section */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-emerald-600" />
                <span>ახალი სტუდენტის მიბმა / დარეგისტრირება</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <select
                    value={studentToEnrollId}
                    onChange={(e) => setStudentToEnrollId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-emerald-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">-- აირჩიეთ სტუდენტი --</option>
                    {studentsList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (!studentToEnrollId) {
                      alert('გთხოვთ აირჩიოთ სტუდენტი!');
                      return;
                    }
                    const cId = courseStudentsTargetCourse?.id || courseStudentsTargetSession?.courseId || courses[0]?.id;
                    const sId = courseStudentsTargetSession?.id;
                    if (cId && onEnrollStudent) {
                      onEnrollStudent(studentToEnrollId, cId, sId);
                      showSuccess('სტუდენტი წარმატებით დარეგისტრირდა კურსზე!');
                      setStudentToEnrollId('');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                >
                  ➕ დარეგისტრირება
                </button>
              </div>
            </div>

            {/* Enrolled Students Table / List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                მიმდინარე სტუდენტების სია
              </h4>

              <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {(() => {
                  const targetCourseId = courseStudentsTargetCourse?.id || courseStudentsTargetSession?.courseId;
                  const relevantEnrollments = enrollments.filter((e) => e.courseId === targetCourseId);
                  
                  const sessionStudentIds = courseStudentsTargetSession?.enrolledStudentIds || [];

                  const enrolledStudentObjs = registeredUsers.filter((u) => 
                    relevantEnrollments.some((e) => e.studentId === u.id) || sessionStudentIds.includes(u.id)
                  );

                  if (enrolledStudentObjs.length === 0) {
                    return (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
                        ამ კურსზე / სესიაზე რეგისტრირებული სტუდენტები ჯერ არ არიან
                      </div>
                    );
                  }

                  return enrolledStudentObjs.map((st) => {
                    const studentEnr = relevantEnrollments.find((e) => e.studentId === st.id);
                    return (
                      <div
                        key={st.id}
                        className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar || AVATAR_PRESETS[0]}
                            alt={st.name}
                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{st.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{st.email} {st.phone ? `• ${st.phone}` : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {studentEnr?.enrolledAt ? `📅 ${studentEnr.enrolledAt}` : '🟢 აქტიური'}
                          </span>

                          <button
                            onClick={() => {
                              if (confirm(`ნამდვილად გსურთ სტუდენტი ${st.name}-ის ამორიცხვა?`)) {
                                if (targetCourseId && onUnenrollStudent) {
                                  onUnenrollStudent(st.id, targetCourseId);
                                  showSuccess(`სტუდენტი ${st.name} ამოირიცხა კურსიდან`);
                                }
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                            title="კურსიდან ამორიცხვა"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                            <span className="hidden sm:inline">ამორიცხვა</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCourseStudentsModal(false);
                  setCourseStudentsTargetCourse(null);
                  setCourseStudentsTargetSession(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
