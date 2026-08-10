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