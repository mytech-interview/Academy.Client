const API_BASE_URL = 'https://localhost:7197';

export interface AddEnrollmentRequest {
  studentGuid: string;
  sessionId: number;
}

interface AddEnrollmentResponse {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
  [key: string]: any;
}

export async function addEnrollment(
  request: AddEnrollmentRequest
): Promise<AddEnrollmentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/enrollments/addEnrollment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const text = await response.text();
  const data: AddEnrollmentResponse = text
    ? JSON.parse(text)
    : { errMsg: null, errorCode: null, err: 0 };

  if (!response.ok) {
    throw new Error(data?.errMsg || data?.message || 'AddEnrollment Failed.');
  }

  if (data.err && data.err !== 0) {
    throw new Error(data.errMsg ?? 'AddEnrollment Failed.');
  }

  return data;
}