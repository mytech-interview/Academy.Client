export type UserRole = 'student' | 'teacher' | 'admin';
export type Language = 'ka' | 'en' | 'ru';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  bio?: string;
  createdAt: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  content?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'დამწყები' | 'საშუალო' | 'პროფესიონალი';
  duration: string;
  image: string;
  teacherId: string;
  teacherName: string;
  lessons: Lesson[];
  enrolledCount: number;
  rating: number;
  price: 'უფასო' | string;
  syllabus: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // percentage, e.g. 0 to 100
  completedLessons: string[]; // array of Lesson IDs
  isCompleted: boolean;
  enrolledAt: string;
  completedAt?: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Session {
  id: string;
  courseId: string;
  title: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  schedule: string;
  room?: string;
  maxStudents: number;
  enrolledStudentIds: string[];
}

export interface HomeWork {
  id: string;
  sessionId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedByTeacherId: string;
}

export interface HomeWorkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
}

export interface ActiveSession {
  sessionId: number;
  courseId: number;
  courseCategoryId: number;
  categoryName: string;
  courseEntryLevelId: number;
  levelName: string;
  title: string;
  courseDescription: string;
  amountOfLessons: number;
  maxStudents: number;
  enrolledCount: number;
  teacherName: string;
  averageRating: string | null; 
  reviewCount: number;
  price: number;
  cityId: number;
  cityName: string;
  startDate: string;
  endDate: string;
  attendanceModeId: number;
  attendanceModeName: string;
  lessonCount: number;
  teacherAvatarUrl?: string | null;
}
export interface StudentSession {
  sessionId: number;
  courseId: number;
  courseTitle: string;
  category: string;     
  coverImage: string;
  sessionLabel: string;    
  schedule: string;       
  location: string;
  progress: number;        
  startDate: string;       
  endDate: string;
  isCompleted: boolean;
  canSubmitReview: boolean;
}

export interface EditStudentRequest {
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  picture: string;
  studentId: number | string;
  telephone: string;
  userGuid: string;
}
// ─────────────────────────────────────────────────────────────────────────
// Mappers: API DTO → UI view-model
//
// NOTE: several UI fields have no source in the current backend DTOs
// (lecturer role/bio, "pinned" flag, session capacity/location, any data
// for courses/projects/videos/media/site-settings, and a combined
// teacher+student+admin "users" endpoint). Those fields are filled with
// safe placeholders below and flagged with `// TODO(api)` — see the
// chat message for the full list of what's still missing.
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// UI VIEW-MODELS
// These are the shapes the components render. They stay stable even if the
// underlying API DTOs change — only the mapper functions below need updates.
// ─────────────────────────────────────────────────────────────────────────

export type AdminTab =
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

export interface CourseItem {
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

export interface SessionItem {
  id: string;
  courseId: number;
  courseTitle: string;
  sessionName: string;
  currentStudents: number;
  maxStudents: number;
  instructor: string;
  teacherGuid: string;
  teacherId: number;
  lessonDaysDescription: string | null;
  schedule: string;
  location: string;
  isActive: boolean;
  weeks: number;
  startDate: string;
  endDate: string;
}

export interface LecturerItem {
  id: string;
  userId: number;
  userGuid: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  picture: string;
  avatarBg: string;
  avatarIcon: string;
  isActive: boolean;
  isPinned?: boolean;
}

export interface StudentItem {
  id: string;
  userId: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  picture: string;
  avatarBg: string;
  avatarIcon: string;
  isActive: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  author: string;
  image: string;
}

export interface VideoItem {
  id: string;
  category: string;
  title: string;
  instructor: string;
  image: string;
  duration: string;
}

export interface MediaItem {
  id: string;
  type: 'PDF' | 'DOC' | 'BOOK';
  size: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export interface SystemUserItem {
  id: string;
  name: string;
  subText: string;
  email: string;
  phone: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  avatarBg: string;
  avatarIcon: string;
}

export interface SiteSettings {
  studentsCount: string;
  lecturersCount: string;
  branchesCount: string;
  countriesCount: string;
  graduatesCount: string;
  promoTitle: string;
  promoPrice: string;
  phone: string;
  email: string;
  address: string;
  workHours: string;
  aboutTitle: string;
  aboutDescription: string;
  videoUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────
// API DTOs — mirror the C# entities in Academy.Api.Entities.Admin exactly.
// ─────────────────────────────────────────────────────────────────────────

export interface BaseResponseDto {
  errorCode?: string | null;
  errMsg?: string | null;
}


export interface GetAllTeachersResponseDto {
  userId: number;
  teacherId: number;
  userGuid: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  description: string;
  picture: string;
}

export interface GetAllStudentsResponseDto {
  userId: number;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
}

export interface GetAllSessionsResponseDto {
  sessionId: number;
  courseId: number;
  courseTitle: string;
  teacherGuid: string;
  teacherId: number;
  teacherFirstName: string;
  teacherLastName: string;
  weeks: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  cityId: number;
  attendanceModeId: number;
  lessonDaysDescription: string;
}

export interface AddTeacherRequestDto {
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  password: string;
}

export interface EditTeacherRequestDto {
  teacherId: number;
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  isActive: boolean;
}

export interface EditStudentRequestDto {
  studentId: number;
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  isActive: boolean;
}

export interface AddSessionRequestDto {
  courseId: number;
  teacherGuid: string;
  weeks: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  lessonDaysDescription: string | null;
  cityId: number;
  attendanceModeId: number;
}

export interface UpdateSessionRequestDto {
  sessionId: number;
  courseId: number;
  teacherGuid: string;
  weeks: number; // backend type is byte — keep 0-255
  startDate: string; // ISO date
  endDate: string; // ISO date
  cityId?: number | null;
  isActive: boolean;
  userGuid?: string;
  attendanceModeId: number;
   lessonDaysDescription: string | null;
}

// ASSUMPTION: DeleteSessionRequest wasn't provided — mirrors the
// DeleteTeacherRequest/DeleteStudentRequest shape already confirmed on the
// backend. Confirm against the real entity and adjust if it differs.
export interface DeleteSessionRequestDto {
  sessionId: number;
  userGuid: string;
}

export interface GetAllStudentsOfSpecificSessionRequestDto {
  teacherGuid: string;
  sessionId: number;
}

export interface GetAllStudentsOfSpecificSessionResponseDto {
  userGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  enrollmentId: number;
  enrolledAt: string;
}

export interface EnrolledStudent {
  userGuid: string;
  name: string;
  email: string;
  phone: string;
  enrollmentId: number;
  enrolledAt: string;
}

export function mapEnrolledStudentDto(dto: GetAllStudentsOfSpecificSessionResponseDto): EnrolledStudent {
  return {
    userGuid: dto.userGuid,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    email: dto.email,
    phone: dto.telephone,
    enrollmentId: dto.enrollmentId,
    enrolledAt: dto.enrolledAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Mappers: API DTO → UI view-model
//
// NOTE: several UI fields have no source in the current backend DTOs
// (lecturer role/bio, "pinned" flag, session capacity/location, any data
// for courses/projects/videos/media/site-settings, and a combined
// teacher+student+admin "users" endpoint). Those fields are filled with
// safe placeholders below and flagged with `// TODO(api)` — see the
// chat message for the full list of what's still missing.
// ─────────────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-indigo-500',
];

export function avatarColorFor(seed: number | string): string {
  const n = typeof seed === 'number' ? seed : seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export function mapTeacherToLecturer(dto: GetAllTeachersResponseDto): LecturerItem {
  return {
    id: String(dto.teacherId),
    userId: dto.teacherId,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    role: '',
    email: dto.email,
    phone: dto.telephone,
    bio: dto.description ?? '',
    description: dto.description ?? '',
    picture: dto.picture,
    avatarBg: avatarColorFor(dto.teacherId),
    avatarIcon: dto.picture || '🎓',
    isActive: dto.isActive,
    isPinned: false,
  };
}

export function mapStudentToStudentItem(dto: GetAllStudentsResponseDto): StudentItem {
  return {
    id: String(dto.studentId),
    userId: dto.studentId,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    role: '',
    email: dto.email,
    phone: dto.telephone,
    picture: dto.picture,
    avatarBg: avatarColorFor(dto.studentId),
    avatarIcon: dto.picture || '🎓',
    isActive: dto.isActive,
  };
}

export function mapSessionDtoToSessionItem(dto: GetAllSessionsResponseDto): SessionItem {
  return {
    id: String(dto.sessionId),
    courseId: dto.courseId,
    courseTitle: dto.courseTitle,
    sessionName: dto.lessonDaysDescription, // было: сюда мог попасть lessonDaysDescription
    currentStudents: 0, // TODO(api)
    maxStudents: 0, // TODO(api)
    instructor: `${dto.teacherFirstName} ${dto.teacherLastName}`.trim(),
    teacherId: dto.teacherId,  
    teacherGuid: dto.teacherGuid,
    schedule: dto.lessonDaysDescription || '',
    lessonDaysDescription: dto.lessonDaysDescription,
    weeks: dto.weeks,
    location: dto.cityName
      ? `${dto.cityName}${dto.attendanceModeName ? ' · ' + dto.attendanceModeName : ''}`
      : '',
    isActive: dto.isActive,
    startDate: dto.startDate,
    endDate: dto.endDate,
  };
}

export function lecturerToSystemUser(l: LecturerItem): SystemUserItem {
  return {
    id: `teacher-${l.id}`,
    name: l.name,
    subText: l.role || 'ლექტორი',
    email: l.email,
    phone: l.phone || 'N/A',
    role: 'TEACHER',
    avatarBg: l.avatarBg,
    avatarIcon: l.avatarIcon,
  };
}

export function studentToSystemUser(s: StudentItem): SystemUserItem {
  return {
    id: `student-${s.id}`,
    name: s.name,
    subText: s.role || 'სტუდენტი',
    email: s.email,
    phone: s.phone || 'N/A',
    role: 'STUDENT',
    avatarBg: s.avatarBg,
    avatarIcon: s.avatarIcon,
  };
}
// ─────────────────────────────────────────────────────────────────────────
// PATCH FOR your existing types.ts
//
// 1) Find your current `CourseItem` interface (it probably has
//    category/image/instructor/status/rating fields left over from the
//    original mock data) and REPLACE it entirely with the interface below —
//    GetAllCoursesResponse doesn't return those fields, so keeping them
//    would just stay permanently empty.
//
// 2) Add `mapCourseDtoToCourseItem` below it (used by AdminDashboardPage).
// ─────────────────────────────────────────────────────────────────────────

export interface CourseItem {
  id: string;
  courseId: number;
  title: string;
  description: string;
  startDate: string;
  price: number;
  isActive: boolean;
  averageReviewMark: number;
  lessonsAmount: number;
  enrolledStudentsAmount: number;
}

// Matches Academy.Api.Entities.Courses.GetAllCoursesResponse.
// (Duplicated here rather than imported from coursesapi.ts on purpose —
// keeps types.ts self-contained, same as the rest of this file.)
export interface GetAllCoursesResponseDto {
  courseId: number;
  title: string;
  description: string;
  startDate: string;
  averageReviewMark: number;
  lessonsAmount: number;
  enrolledStudentsAmount: number;
  price: number;
  isActive: boolean;
}

export function mapCourseDtoToCourseItem(dto: GetAllCoursesResponseDto): CourseItem {
  return {
    id: String(dto.courseId),
    courseId: dto.courseId,
    title: dto.title,
    description: dto.description,
    startDate: dto.startDate,
    price: dto.price,
    isActive: dto.isActive,
    averageReviewMark: dto.averageReviewMark,
    lessonsAmount: dto.lessonsAmount,
    enrolledStudentsAmount: dto.enrolledStudentsAmount,
  };
}