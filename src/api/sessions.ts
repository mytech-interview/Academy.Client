import { ActiveSession } from '../types';
import { API_BASE_URL } from '../services/baseApi';

interface HomeActiveSessionsResponse {
  activeSessions: ActiveSession[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getHomeActiveSessions(
  courseCategoryId: number
): Promise<ActiveSession[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/home/getHomeActiveSessions`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
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

  return data.activeSessions || [];
}

// --- Student sessions ("My courses" in the student dashboard) --------------
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

export async function getStudentSessions(studentGuid: string): Promise<StudentSession[]> {
  const token = localStorage.getItem("academy_token");

  if (!token) {

    throw new Error('Сессия истекла, войдите заново');
  }

  const response = await fetch(`${API_BASE_URL}/sessions/getStudentSessions`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ studentGuid }),
  });

  if (response.status === 401) {
    localStorage.removeItem('academy_token');
    localStorage.removeItem('academy_active_user');
    throw new Error('Сессия истекла, войдите заново');
  }

  if (!response.ok) {
    throw new Error('Не удалось загрузить курсы студента');
  }

  const text = await response.text();
  const data: GetStudentSessionsResponse = text
    ? JSON.parse(text)
    : { studentSessions: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? 'Не удалось загрузить курсы студента');
  }

  return data.studentSessions || [];
}

// --- Course session details for student -------------------------------
// Mirrors Academy.CoreApi.Entities.Sessions.GetCourseSessionDetailsForStudentResponse.
export interface CourseSessionDetailsForStudent {
  sessionId: number;
  title: string;
  startDate: string;
  endDate: string;
  courseId: number;
  teacherName: string;
  lessonDaysDescription: string;
  cityId: number;
  cityName: string;
   teacherAvatarUrl?: string | null;
}

interface GetCourseSessionDetailsForStudentResponse {
  sessionId: number;
  title: string;
  startDate: string;
  endDate: string;
  courseId: number;
  teacherName: string;
  lessonDaysDescription: string;
  cityId: number;
  cityName: string;
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getCourseSessionDetailsForStudent(
  sessionId: number,
  studentGuid: string
): Promise<CourseSessionDetailsForStudent> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/sessions/getCourseSessionDetailsForStudent`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
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

// --- Course library materials --------------------------------------------
export interface CourseLibraryItem {
  courseLibraryId: number;
  title: string;
  filePath: string;
}

interface GetCourseLibrarySessionIdResponse {
  courseLibrarySessions: CourseLibraryItem[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getCourseLibrarySessionId(
  sessionId: number,
  userGuid: string
): Promise<CourseLibraryItem[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/sessions/getCourseLibrarySessionId`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ sessionId, userGuid }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetCourseLibrarySessionIdResponse = text
    ? JSON.parse(text)
    : { courseLibrarySessions: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  return data.courseLibrarySessions || [];
}

// --- Course details by session id (public, no login required) -------------
export interface CourseDetailsBySessionId {
  lessonDaysDescription: string;
  categoryName: string;
  levelName: string;
  title: string;
  courseDescription: string;
  amountOfLessons: number;
  maxStudents: number;
  price: number;
  picture: string;
  enrolledCount: number;
  teacherName: string;
  averageRating: number;
  reviewCount: number;
  cityId: number;
  cityName: string;
  weeks: number;
  startDate: string;
  endDate: string;
  lessonCount: number;
   teacherAvatarUrl?: string | null;
}

interface GetCourseDetailsBySessionIdResponse extends CourseDetailsBySessionId {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getCourseDetailsBySessionId(
  sessionId: number
): Promise<CourseDetailsBySessionId> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/Home/getCourseDetailsBySessionId`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetCourseDetailsBySessionIdResponse | null = text ? JSON.parse(text) : null;

  if (!data || data.err !== 0) {
    throw new Error(data?.errMsg ?? '');
  }

  const { errMsg, errorCode, err, ...details } = data;
  return details;
}

// --- Lessons for a session --------------------------------------------
// Mirrors Academy.CoreApi.Entities.Sessions.GetLessonsForSessionResponseList.
// Backend fields: CourseLessonId, Title, Description, LessonNumber.
// NOTE: backend has no duration/videoUrl field yet — duration is fixed
// on the frontend (~2 hours per lesson) until that's added server-side.
export interface SessionLesson {
  lessonId: number;
  orderIndex: number;
  title: string;
  content: string;
}

interface GetLessonsForSessionApiItem {
  courseLessonId: number;
  title: string;
  description: string;
  lessonNumber: number;
}

interface GetLessonsForSessionResponse {
  lessons: GetLessonsForSessionApiItem[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getLessonsForSession(sessionId: number): Promise<SessionLesson[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/sessions/getLessonsForSession`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetLessonsForSessionResponse = text
    ? JSON.parse(text)
    : { lessons: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  return (data.lessons || []).map((l) => ({
    lessonId: l.courseLessonId,
    orderIndex: l.lessonNumber,
    title: l.title,
    content: l.description,
  }));
}
// --- Homeworks for student -------------------------------------------
// Mirrors Academy.CoreApi.Entities.HomeWorks.GetHomeWorksForStudentResponseList.
// NOTE: backend response has NO SessionId/CourseId — these are ALL of the
// student's homeworks, not scoped to one course. Until the backend adds
// that link, this can't be reliably filtered per-course/session.
export interface StudentHomeWork {
  homeWorkId: number;
  title: string;
  description: string;
  dueDate: string;
  teacherGuid: string;
  teacherName: string;
   teacherAvatarUrl?: string | null;
}

interface GetHomeWorksForStudentResponse {
  homeWorks: StudentHomeWork[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getHomeWorksForStudent(studentGuid: string, sessionId: number): Promise<StudentHomeWork[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/homeWorks/getHomeWorksForStudent`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ studentGuid, sessionId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetHomeWorksForStudentResponse = text
    ? JSON.parse(text)
    : { homeWorks: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  return data.homeWorks || [];
}

// --- Submission ---------------------------------------------------------
export interface AddHomeWorkSubmissionPayload {
  homeworkId: number;
  studentGuid: string;
  filePath?: string;
  studentAnswer?: string;
}

interface AddHomeWorkSubmissionResponse {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function submitHomeWork(payload: AddHomeWorkSubmissionPayload): Promise<void> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/homeWorks/addHomeWorkSubmission`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: AddHomeWorkSubmissionResponse = text
    ? JSON.parse(text)
    : { errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }
}
// --- Attendance (student, per session) ---------------------------------
// Mirrors Academy.CoreApi.Entities.Sessions.GetStudentAttendanceResponseList
export interface StudentLessonAttendance {
  lessonTitle: string;
  lessonNumber: number;
  wasAttended: boolean;
  message: string;
}

interface GetStudentAttendanceResponse {
  studentAttendances: StudentLessonAttendance[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getStudentAttendanceForSession(
  studentGuid: string,
  sessionId: number
): Promise<StudentLessonAttendance[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/sessions/getStudentAttendance`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ studentGuid, sessionId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: GetStudentAttendanceResponse = text
    ? JSON.parse(text)
    : { studentAttendances: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  return data.studentAttendances || [];
}