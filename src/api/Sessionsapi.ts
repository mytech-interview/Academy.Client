import {
  AddSessionRequestDto,
  BaseResponseDto,
  DeleteSessionRequestDto,
  GetAllStudentsOfSpecificSessionRequestDto,
  GetAllStudentsOfSpecificSessionResponseDto,
  UpdateSessionRequestDto,
} from '../types';

// Same host/convention as adminApi.ts — these entities live in
// Academy.Api.Entities.Sessions and extend the same BaseResponse
// (errorCode/errMsg), so this follows adminApi.ts, not the numeric
// `err`-based convention used by the separate CoreApi sessions.ts file.
const API_BASE_URL = 'https://academyapi.tech-interview.com/api';

async function apiFetch<T extends BaseResponseDto>(path: string, body: unknown): Promise<T> {
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
  const data = (text ? JSON.parse(text) : null) as T;

  // Body can be 200 OK but still carry a backend error via errorCode/errMsg
  // (that's what BaseResponseDto is for), so HTTP success alone doesn't mean
  // the operation actually succeeded. This is very likely why "session
  // не добавляются" showed no visible error before — the promise resolved
  // fine, fetchSessions() ran, but the row was never actually created.
  if (data && data.errorCode) {
    throw new Error(data.errMsg || `Request to ${path} returned errorCode ${data.errorCode}`);
  }

  return data;
}

export function addSession(payload: AddSessionRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/sessions/addSession', payload);
}

export function updateSession(payload: UpdateSessionRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/sessions/updateSession', payload);
}

// ASSUMPTION: request shape not confirmed by backend yet — see the
// TODO next to DeleteSessionRequestDto in types.ts.
export function deleteSession(payload: DeleteSessionRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/sessions/deleteSession', payload);
}

export function getAllStudentsOfSpecificSession(
  payload: GetAllStudentsOfSpecificSessionRequestDto
): Promise<{ students: GetAllStudentsOfSpecificSessionResponseDto[] } & BaseResponseDto> {
  return apiFetch('/sessions/getAllStudentsOfSpecificSession', payload);
}

// Not wired into the admin panel yet — listed here for when the teacher
// dashboard needs it. Left unused/unexported-from-UI intentionally.
export interface GetTeacherSessionsRequestDto {
  teacherGuid: string;
}

export function getTeacherSessions(payload: GetTeacherSessionsRequestDto): Promise<unknown> {
  return apiFetch('/sessions/getTeacherSessions', payload);
}