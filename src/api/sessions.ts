import { ActiveSession } from '../types';

const API_BASE_URL = 'https://localhost:7197';

interface HomeActiveSessionsResponse {
  activeSessions: ActiveSession[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getHomeActiveSessions(
  courseCategoryId: number
): Promise<ActiveSession[]> {
  const response = await fetch(`${API_BASE_URL}/Home/getHomeActiveSessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseCategoryId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: HomeActiveSessionsResponse = text
    ? JSON.parse(text)
    : { activeSessions: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  // Safely fallback to an empty array if activeSessions is null/undefined
  return data.activeSessions || [];
}

// --- Student sessions ("My courses" in the student dashboard) --------------
// Mirrors Academy.CoreApi.Entities.Sessions.GetStudentSessionsResponse.
// NOTE: this DTO only contains session/course metadata — it does NOT include
// per-lesson progress, completed lessons, or attendance data. Those fields
// don't exist on the backend yet, so the UI layer stubs them until a
// dedicated endpoint (e.g. getStudentProgress) is added.
export interface StudentSession {
  sessionId: number;
  courseCategoryId: number;
  categoryName: string;
  courseEntryLevelId: number;
  levelName: string;
  title: string;
  startDate: string;
  endDate: string;
  lessonDaysDescription: string;
  cityName: string;
  cityId: number;
}

interface GetStudentSessionsResponse {
  studentSessions: StudentSession[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}
// --- Course session details for student -------------------------------
// Mirrors Academy.CoreApi.Entities.Sessions.GetCourseSessionDetailsForStudentResponse.
// NOTE: SessionId/CourseId/CityId come back as GUIDs from the backend,
// even though the request SessionId is an int (matches Sessions/StudentSession list id).
export interface CourseSessionDetailsForStudent {
  sessionId: string;
  title: string;
  startDate: string;
  endDate: string;
  courseId: string;
  teacherName: string;
  lessonDaysDescription: string;
  cityId: string;
  cityName: string;
}

interface GetCourseSessionDetailsForStudentResponse extends CourseSessionDetailsForStudent {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getCourseSessionDetailsForStudent(
  sessionId: number,
  studentGuid: string
): Promise<CourseSessionDetailsForStudent> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/getCourseSessionDetailsForStudent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, studentGuid }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetCourseSessionDetailsForStudentResponse | null = text ? JSON.parse(text) : null;

  if (!data || data.err !== 0) {
    throw new Error(data?.errMsg ?? '');
  }

  const { errMsg, errorCode, err, ...details } = data;
  return details;
}

export async function getStudentSessions(studentGuid: string): Promise<StudentSession[]> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/getStudentSessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentGuid }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetStudentSessionsResponse = text
    ? JSON.parse(text)
    : { studentSessions: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  return data.studentSessions || [];
}