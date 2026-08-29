// Mirrors Academy.Api.Entities.Courses. Same convention as adminapi.ts /
// sessionsapi.ts: BaseResponse (errorCode/errMsg), Bearer token from
// localStorage, POST-only.

import { API_BASE_URL } from "../services/baseApi";

export interface BaseResponseDto {
  errorCode?: string | null;
  errMsg?: string | null;
}

async function apiFetch<T>(path: string, body: unknown): Promise<T> {
  const token = localStorage.getItem('academy_token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request to ${path} failed (${response.status})`;
    try {
      const data = await response.json();
      message = data?.message || data?.title || message;
    } catch {
      // ignore parse failure, keep default message
    }
    throw new Error(message);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

// ── Courses ──────────────────────────────────────────────────────────────

export interface GetAllCoursesRequest {
  userGuid: string;
}

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
  picture?: string | null;
}

export function getAllCourses(
  payload: GetAllCoursesRequest
): Promise<{ courses: GetAllCoursesResponseDto[] } & BaseResponseDto> {
  return apiFetch('/courses/getAllCourses', payload);
}

export interface AddCourseRequestDto {
  courseCategoryId: number;
  courseEntryLevelId: number;
  title: string;
  description: string;
  price: number;
  maxStudents: number;
  userGuid: string;
}

export function addCourse(payload: AddCourseRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/courses/addCourse', payload);
}

export interface UpdateCourseRequestDto {
  courseId: number;
  courseCategoryId: number;
  courseEntryLevelId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  maxStudents: number;
  userGuid: string;
  picture: string;
  isActive: boolean;
}

export function updateCourse(payload: UpdateCourseRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/courses/updateCourse', payload);
}

// TODO(api): no deleteCourse endpoint exists yet — the delete button in the
// UI is disabled until one is added.



export interface AddCourseLessonRequestDto {
  courseId: number;
  lessonTitle: string;
  lessonNumber: number;
  userGuid: string;
  description: string;
}

export function addCourseLesson(payload: AddCourseLessonRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/courses/addCourseLesson', payload);
}

export interface UpdateCourseLessonRequestDto {
  courseLessonId: number;
  description: string;
  userGuid: string;
  title: string;
  lessonNumber: number;
}// ── Course lessons: fetch ───────────────────────────────────────────────

export interface GetAllCourseLessonsRequest {
  userGuid: string;
  courseId: number;
}

export interface GetAllCourseLessonsResponseDto {
  courseLessonId: number;
  lessonNumber: number;
  lessonTitle: string;
  description: string;
}

export function getAllCourseLessons(
  payload: GetAllCourseLessonsRequest
): Promise<{ courseLessons: GetAllCourseLessonsResponseDto[] } & BaseResponseDto> {
  return apiFetch('/courses/getAllCourseLessons', payload);
}

export function updateCourseLesson(payload: UpdateCourseLessonRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/courses/updateCourseLesson', payload);
}

// ── Course library (materials) ──────────────────────────────────────────
// Also wired but no admin form built yet.

export interface AddCourseLibraryRequestDto {
  courseId: number;
  userGuid: string;
  title: string;
  fileName: string;
}

export function addCourseLibrary(payload: AddCourseLibraryRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/courses/addCourseLibrary', payload);
}