import {
  AddTeacherRequestDto,
  EditStudentRequestDto,
  EditTeacherRequestDto,
  GetAllSessionsResponseDto,
  GetAllStudentsResponseDto,
  GetAllTeachersResponseDto,
} from '../components/admin/types';

// Same host/convention as sessions.ts — includes /api, so call sites below
// only add the controller-relative path (e.g. "/admin/getAllTeachers").
const API_BASE_URL = 'https://localhost:5188/api';

export interface BaseResponseDto {
  errorCode?: string | null;
  errMsg?: string | null;
}

async function apiFetch<T>(path: string, body: unknown): Promise<T> {
  // Same auth pattern as sessions.ts / homeWorks.ts — the admin endpoints
  // need this too, it was just missing before, which is why every admin
  // call was coming back 400 (empty/invalid UserGuid) instead of even
  // reaching an auth check.
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
  return (text ? JSON.parse(text) : null) as T;
}

// ── Teachers / Lecturers ────────────────────────────────────────────────

export interface GetAllTeachersRequest {
  userGuid: string;
}

export function getAllTeachers(
  payload: GetAllTeachersRequest
): Promise<{ lessons: GetAllTeachersResponseDto[] } & BaseResponseDto> {
  return apiFetch('/admin/getAllTeachers', payload);
}

export function addTeacher(payload: AddTeacherRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/admin/addTeacher', payload);
}

export function editTeacher(payload: EditTeacherRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/admin/editTeacher', payload);
}

export interface DeleteTeacherRequest {
  teacherId: number;
  userGuid: string;
}

export function deleteTeacher(payload: DeleteTeacherRequest): Promise<BaseResponseDto> {
  return apiFetch('/admin/deleteTeacher', payload);
}

// ── Students ─────────────────────────────────────────────────────────────

export interface GetAllStudentsRequest {
  userGuid: string;
}

export function getAllStudents(
  payload: GetAllStudentsRequest
): Promise<{ students: GetAllStudentsResponseDto[] } & BaseResponseDto> {
  return apiFetch('/admin/getAllStudents', payload);
}

export function editStudent(payload: EditStudentRequestDto): Promise<BaseResponseDto> {
  return apiFetch('/admin/editStudent', payload);
}

export interface DeleteStudentRequest {
  studentId: number;
  userGuid: string;
}

export function deleteStudent(payload: DeleteStudentRequest): Promise<BaseResponseDto> {
  return apiFetch('/admin/deleteStudent', payload);
}

// TODO(api): there's no addStudent endpoint on AdminController yet —
// "ახალი სტუდენტის დამატება" can't be wired up until one exists.

// ── Sessions ─────────────────────────────────────────────────────────────

export interface GetAllSessionsRequest {
  userGuid: string;
}

export function getAllSessions(
  payload: GetAllSessionsRequest
): Promise<{ sessions: GetAllSessionsResponseDto[] } & BaseResponseDto> {
  return apiFetch('/admin/getAllSessions', payload);
}

// TODO(api): no addSession / editSession / deleteSession endpoints exist yet —
// the sessions tab is currently read-only until those are added.