// src/api/teacher.ts

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

// Реальная форма ответа бэкенда для getTeacherSessions.
// Отличается от TeacherSessionDto: другое имя корневого поля
// ("teacherSessions" вместо "sessions"), другие имена полей
// (enrolledCount вместо enrolledStudents), и часть полей (city,
// lessonDaysDescription, courseId) в ответе просто отсутствует.
interface RawTeacherSessionDto {
  sessionId: number;
  courseCategoryId?: number;
  categoryName?: string;
  courseEntryLevelId?: number;
  levelName?: string;
  title: string;
  price?: number;
  maxStudents: number;
  startDate: string;
  endDate?: string;
  enrolledCount: number;
  errMsg?: string | null;
  errorCode?: string | null;
  err?: number;
}

interface RawGetTeacherSessionsResponse {
  teacherSessions: RawTeacherSessionDto[];
  errMsg?: string | null;
  errorCode?: string | null;
  err?: number;
}

function mapRawSession(raw: RawTeacherSessionDto): TeacherSessionDto {
  return {
    sessionId: raw.sessionId,
    courseId: raw.courseCategoryId ?? 0,
    title: raw.title,
    startDate: raw.startDate,
    lessonDaysDescription: '',
    city: '',
    maxStudents: raw.maxStudents,
    enrolledStudents: raw.enrolledCount,
  };
}

export function getTeacherSessions(teacherGuid: string) {
  return apiPost<RawGetTeacherSessionsResponse>('/sessions/getTeacherSessions', {
    teacherGuid,
  }).then((res) => ({
    sessions: (res.teacherSessions ?? []).map(mapRawSession),
  }));
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
  }).then((res) => ({
    // Когда у учителя нет домашних заданий, бэкенд вместо пустого
    // массива присылает один "пустой" объект с дефолтными значениями
    // (homeworkId: 0, title: "", dueDate: "0001-01-01..." — это
    // default(DateTime) в .NET). Отфильтровываем такие записи, иначе
    // на UI появляется фантомная карточка ДЗ с пустым названием.
    homeWorks: (res.homeWorks ?? []).filter(
      (hw) => hw.homeworkId !== 0 && hw.title.trim() !== ''
    ),
  }));
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



export interface HomeWorkSubmissionDto {
  submissionId: number;
  studentGuid: string;
  studentFirstName: string;
  studentLastName: string;
  content: string;
  filePath?: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
}

export function getSubmissionsForHomeWork(teacherGuid: string, homeworkId: number) {
  return apiPost<{ submissions: HomeWorkSubmissionDto[] }>(
    '/homeWorks/getSubmissionsForHomeWork',
    { teacherGuid, homeworkId }
  );
}