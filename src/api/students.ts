// api/students.ts
const API_BASE_URL = 'https://localhost:7197';

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

// --- Enrollment (как вы прислали) ---
export interface AddEnrollmentRequest {
  studentGuid: string;
  sessionId: number;
}

export async function addEnrollment(request: AddEnrollmentRequest) {
  const response = await fetch(`${API_BASE_URL}/api/enrollments/addEnrollment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseResponse(response);
}

// --- Edit student profile ---
export async function editStudent(request: EditStudentRequest) {
  const response = await fetch(`${API_BASE_URL}/api/students/editStudent`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return parseResponse(response);
}

// --- Sessions for a student (подставьте реальный путь, если отличается) ---
export async function getStudentSessions(userGuid: string): Promise<StudentSession[]> {
  const response = await fetch(`${API_BASE_URL}/api/students/${userGuid}/sessions`, {
    method: 'GET',
  });
  const data = await parseResponse<{ sessions: StudentSession[] } & ApiEnvelope>(response);
  return data.sessions ?? [];
}