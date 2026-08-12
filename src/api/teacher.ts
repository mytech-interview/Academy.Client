// src/lib/api.ts

export const API_BASE_URL = 'https://localhost:7197/api';

async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json() as Promise<TResponse>;
}

// ---------- Sessions ----------
export interface TeacherSessionDto {
  sessionId: number;
  courseId: number;
  title: string;
  startDate: string;
  lessonDaysDescription: string;
  city: string;
  maxStudents: number;
  enrolledStudents: number;
}

export function getTeacherSessions(teacherGuid: string) {
  return apiPost<{ sessions: TeacherSessionDto[] }>('/sessions/getTeacherSessions', {
    teacherGuid,
  });
}

export function getCourseSessionDetailsForTeacher(teacherGuid: string, sessionId: number) {
  return apiPost<{
    sessionId: number;
    city: string;
    courseName: string;
    startDate: string;
    enrolledStudents: number;
    maxAmountOfStudents: number;
    lessonDaysDescription: string;
  }>('/sessions/getCourseSessionDetailsForTeacher', { teacherGuid, sessionId });
}

export interface SessionStudentDto {
  studentGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export function getAllStudentsOfSpecificSession(teacherGuid: string, sessionId: number) {
  return apiPost<{ students: SessionStudentDto[] }>(
    '/sessions/getAllStudentsOfSpecificSession',
    { teacherGuid, sessionId }
  );
}

export interface SessionLessonDto {
  courseLessonId: number;
  title: string;
  description: string;
  lessonNumber: number;
}

export function getLessonsForSession(sessionId: number) {
  return apiPost<{ lessons: SessionLessonDto[] }>('/sessions/getLessonsForSession', {
    sessionId,
  });
}

export interface StudentAttendanceRowDto {
  studentGuid: string;
  firstName: string;
  lastName: string;
  picture: string;
  studentAttendanceId: number;
  wasAttended: boolean;
  message: string;
}

export function getStudentAttendancesPerLesson(
  teacherGuid: string,
  sessionId: number,
  lessonId: number
) {
  return apiPost<{ students: StudentAttendanceRowDto[] }>(
    '/sessions/getStudentAttendancesPerLesson',
    { teacherGuid, sessionId, lessonId }
  );
}

export function addStudentAttendance(payload: {
  teacherGuid: string;
  studentGuid: string;
  sessionId: number;
  lessonId: number;
  wasAttended: boolean;
  message?: string;
}) {
  return apiPost<{ success: boolean }>('/sessions/addStudentAttendance', payload);
}

// ---------- HomeWorks ----------
export interface TeacherHomeWorkDto {
  homeworkId: number;
  title: string;
  description: string;
  dueDate: string;
  submittedCount: number;
  totalEnrolledStudents: number;
  submissionPercentage: number;
}

export function getHomeWorksForTeacher(teacherGuid: string, sessionId = 0) {
  return apiPost<{ homeWorks: TeacherHomeWorkDto[] }>('/homeWorks/getHomeWorksForTeacher', {
    teacherGuid,
    sessionId,
  });
}

export function addHomeWork(payload: {
  sessionId: number;
  teacherGuid: string;
  title: string;
  description: string;
  lessonDate: string;
  dueDate: string;
  filePath?: string;
}) {
  return apiPost<{ homeworkId: number }>('/homeWorks/addHomeWork', payload);
}

// ⚠️ На бэке пока нет ручки оценки — добавь HomeWorksController.gradeHomeWorkSubmission
export function gradeHomeWorkSubmission(payload: {
  submissionId: number;
  teacherGuid: string;
  grade: string;
  feedback: string;
}) {
  return apiPost<{ success: boolean }>('/homeWorks/gradeHomeWorkSubmission', payload);
}

// ---------- General ----------
export function updateTeacher(payload: {
  teacherGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  isActive?: boolean;
}) {
  return apiPost<{ success: boolean }>('/general/updateTeacher', payload);
}