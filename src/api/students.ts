// api/students.ts
const API_BASE_URL = "https://academyapi.tech-interview.com";
interface ApiEnvelope {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
  [key: string]: any;
}

async function parseResponse<T = ApiEnvelope>(response: Response): Promise<T> {
  const text = await response.text();
  const data = (text ? JSON.parse(text) : { errMsg: null, errorCode: null, err: 0 }) as T & ApiEnvelope;

  if (!response.ok) {
    throw new Error(data?.errMsg || data?.message || 'Request failed.');
  }
  if (data.err && data.err !== 0) {
    throw new Error(data.errMsg ?? 'Request failed.');
  }
  return data;
}

// --- Enrollment ---
export interface AddEnrollmentRequest {
  studentGuid: string;
  sessionId: number;
}

export async function addEnrollment(request: AddEnrollmentRequest) {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/api/enrollments/addEnrollment`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(request),
  });
  return parseResponse(response);
}

// --- Edit student profile ---
// Соответствует Academy.CoreApi.Entities.General.UpdateStudentRequest на бэкенде
export interface EditStudentRequest {
  studentGuid: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  picture: string;
}

export interface EditStudentResponse extends ApiEnvelope {}

export async function editStudent(request: EditStudentRequest) {
  const token = localStorage.getItem("academy_token");
  // ВАЖНО: бэкенд-эндпоинт называется /api/general/updateStudent (POST),
  // а не /api/students/editStudent (PUT), как было раньше.
  const response = await fetch(`${API_BASE_URL}/api/general/updateStudent`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(request),
  });
  return parseResponse<EditStudentResponse>(response);
}

// --- Sessions for a student ---
export interface StudentSession {
  id: number;
  [key: string]: any;
}

export async function getStudentSessions(userGuid: string): Promise<StudentSession[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/api/students/${userGuid}/sessions`, {
    method: 'GET',
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    }
  });
  const data = await parseResponse<{ sessions: StudentSession[] } & ApiEnvelope>(response);
  return data.sessions ?? [];
}