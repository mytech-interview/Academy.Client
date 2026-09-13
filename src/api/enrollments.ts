import { API_BASE_URL } from "../services/baseApi";

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
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/enrollments/addEnrollment`, {
    method: 'POST',
     headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
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



// ---- updatePaymentStatus ----

export interface UpdatePaymentStatusRequest {
  userGuid: string;
  enrollmentId: number;
  status: boolean;
}

interface UpdatePaymentStatusResponse {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
  [key: string]: any;
}

export async function updatePaymentStatus(
  request: UpdatePaymentStatusRequest
): Promise<UpdatePaymentStatusResponse> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/enrollments/updatePaymentStatus`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(request),
  });

  const text = await response.text();
  const data: UpdatePaymentStatusResponse = text
    ? JSON.parse(text)
    : { errMsg: null, errorCode: null, err: 0 };

  if (!response.ok) {
    throw new Error(data?.errMsg || data?.message || 'UpdatePaymentStatus Failed.');
  }

  if (data.err && data.err !== 0) {
    throw new Error(data.errMsg ?? 'UpdatePaymentStatus Failed.');
  }

  return data;
}

// ---- updateEnrollmentStatus ----

export interface UpdateEnrollmentStatusRequest {
  userGuid: string;
  enrollmentId: number;
  isActive: boolean;
}

interface UpdateEnrollmentStatusResponse {
  errMsg: string | null;
  errorCode: string | null;
  err: number;
  [key: string]: any;
}

export async function updateEnrollmentStatus(
  request: UpdateEnrollmentStatusRequest
): Promise<UpdateEnrollmentStatusResponse> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/enrollments/updateEnrollmentStatus`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(request),
  });

  const text = await response.text();
  const data: UpdateEnrollmentStatusResponse = text
    ? JSON.parse(text)
    : { errMsg: null, errorCode: null, err: 0 };

  if (!response.ok) {
    throw new Error(data?.errMsg || data?.message || 'UpdateEnrollmentStatus Failed.');
  }

  if (data.err && data.err !== 0) {
    throw new Error(data.errMsg ?? 'UpdateEnrollmentStatus Failed.');
  }

  return data;
}