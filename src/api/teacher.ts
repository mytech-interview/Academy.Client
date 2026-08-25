// src/api/teacher.ts

const API_BASE_URL = "https://localhost:5188/api";
async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const token = localStorage.getItem("academy_token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
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

// ---------- General ----------
export function updateTeacher(payload: {
  teacherGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
  isActive?: boolean;
  description?: string;
}) {
  return apiPost<{ success: boolean }>('/general/updateTeacher', payload);
}

// ---------- Submissions ----------
export interface HomeWorkSubmissionDto {
  submissionId: number;
  studentGuid: string;
  studentFirstName: string;
  studentLastName: string;
  // NOTE(backend): бэк в getHomeworkSubmissionByHomework НЕ возвращает
  // текст ответа ученика (StudentAnswer нигде не приходит в этом DTO,
  // только FilePath). Поэтому content всегда пустой — это ограничение
  // бэка, не баг маппинга. UI ниже это учитывает и не считает пустую
  // строку "ученик ничего не написал".
  content: string;
  hasTextContent: boolean; // false = бэк не отдаёт текст, а не "ученик не писал"
  filePath?: string;
  submittedAt: string;
  grade?: string;
  // NOTE(backend): комментарий учителя (TeacherAnswer) отправляется
  // ЧЕРЕЗ setTeacherHomeWorkGrade, но обратно в списке submissions НЕ
  // возвращается бэком. Поэтому после сохранения оценки мы держим
  // feedback локально в стейте компонента (optimistic), а после
  // перезагрузки страницы/повторного открытия карточки он снова
  // пропадёт, т.к. бэк его не хранит в этом ответе.
  feedback?: string;
}

// Реальная форма ответа бэкенда для getHomeworkSubmissionByHomework.
// Метод называется по-другому (не getSubmissionsForHomeWork), корневое
// поле называется "homeWorks" (а не "submissions"), Grade — number,
// а имена студента разбиты как firstName/lastName вместо
// studentFirstName/studentLastName.
interface RawSubmissionDto {
  submissionId: number;
  filePath?: string;
  submittedAt: string;
  grade?: number | null;
  studentGuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface RawGetSubmissionsResponse {
  homeWorks: RawSubmissionDto[];
  errMsg?: string | null;
  errorCode?: string | null;
  err?: number;
}

function mapRawSubmission(raw: RawSubmissionDto): HomeWorkSubmissionDto {
  return {
    submissionId: raw.submissionId,
    studentGuid: raw.studentGuid,
    studentFirstName: raw.firstName,
    studentLastName: raw.lastName,
    content: '',
    hasTextContent: false,
    filePath: raw.filePath,
    submittedAt: raw.submittedAt,
    grade: raw.grade != null ? String(raw.grade) : undefined,
    feedback: undefined,
  };
}

export function getSubmissionsForHomeWork(teacherGuid: string, homeworkId: number) {
  return apiPost<RawGetSubmissionsResponse>(
    '/homeWorks/getHomeworkSubmissionByHomework',
    { teacherGuid, homeWorkId: homeworkId }
  ).then((res) => ({
    submissions: (res.homeWorks ?? []).map(mapRawSubmission),
  }));
}

// Реальная ручка называется setTeacherHomeWorkGrade, а не
// gradeHomeWorkSubmission, и Grade там int, а не строка вида "100/100".
// Формат "100/100" на фронте больше не подходит под int-поле бэка —
// приводим к числу (parseInt отрежет всё после "/", т.е. "85/100" -> 85).
// Если нужен именно дробный вид оценки — это уже требует менять тип
// Grade на бэке, а бэк трогать нельзя, так что пока только целое число.
export function gradeHomeWorkSubmission(payload: {
  submissionId: number;
  teacherGuid: string;
  grade: string;
  feedback: string;
}) {
  const numericGrade = parseInt(payload.grade, 10);
  return apiPost<{ success: boolean }>('/homeWorks/setTeacherHomeWorkGrade', {
    teacherGuid: payload.teacherGuid,
    submissionId: payload.submissionId,
    grade: Number.isNaN(numericGrade) ? 0 : numericGrade,
    teacherAnswer: payload.feedback,
  });
}