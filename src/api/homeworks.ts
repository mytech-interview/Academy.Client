import { API_BASE_URL } from "../services/baseApi";

// Mirrors Academy.CoreApi.Entities.HomeWorks.GetHomeWorksForStudentResponse
export interface StudentHomeWork {
  homeWorkId: number;
  title: string;
  description: string;
  dueDate: string;
  teacherGuid: string;
  teacherName: string;
  homeworkOriginalFileName?: string;
  homeworkFileName?: string;
}

interface GetHomeWorksForStudentResponse {
  homeWorks: StudentHomeWork[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
  homeworkOriginalFileName?: string;
  homeworkFileName?: string;
}

// Small helper: tries to pull a human-readable message out of an error
// response body, whatever shape it comes in (BadRequest({message}) from
// the submission endpoint, or {errMsg} from the list endpoint).
async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return fallback;
    const data = JSON.parse(text);
    return data?.message || data?.errMsg || fallback;
  } catch {
    return fallback;
  }
}

export async function getHomeWorksForStudent(studentGuid: string): Promise<StudentHomeWork[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/homeWorks/getHomeWorksForStudent`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ studentGuid }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'დავალებების ჩატვირთვა ვერ მოხერხდა'));
  }

  const text = await response.text();
  const data: GetHomeWorksForStudentResponse = text
    ? JSON.parse(text)
    : { homeWorks: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? 'დავალებების ჩატვირთვა ვერ მოხერხდა');
  }

  return data.homeWorks || [];
}

// --- Submission -------------------------------------------------------
// Mirrors Academy.Api.Entities.HomeWorks.AddHomeWorkSubmissionClientRequest,
// which is a multipart/form-data endpoint (it carries an IFormFile).
export interface AddHomeWorkSubmissionPayload {
  homeworkId: number;
  studentGuid: string;
  file?: File;
  studentAnswer?: string;
}

// The controller returns either Ok(auth) on success or
// BadRequest({ message: string }) on failure — it does NOT return the
// {errMsg, errorCode, err} shape used by getHomeWorksForStudent.
interface AddHomeWorkSubmissionResponse {
  errMsg?: string | null;
  errorCode?: string | null;
  err?: number;
}

export async function submitHomeWork(payload: AddHomeWorkSubmissionPayload): Promise<void> {
  const token = localStorage.getItem("academy_token");

  const formData = new FormData();
  formData.append('HomeworkId', String(payload.homeworkId));
  formData.append('StudentGuid', payload.studentGuid);
  if (payload.studentAnswer) formData.append('StudentAnswer', payload.studentAnswer);
  if (payload.file) formData.append('File', payload.file);

  const response = await fetch(`${API_BASE_URL}/homeworks/addHomeWorkSubmisson`, {
    method: 'POST',
    headers: {
      // Do NOT set Content-Type here — the browser sets
      // multipart/form-data with the correct boundary automatically.
      // Setting it manually breaks the boundary and the ASP.NET model
      // binder will silently fail to populate request.File.
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'დავალების გაგზავნა ვერ მოხერხდა'));
  }

  const text = await response.text();
  const data: AddHomeWorkSubmissionResponse = text
    ? JSON.parse(text)
    : { errMsg: null, errorCode: null, err: 0 };

  if (data.err && data.err !== 0) {
    throw new Error(data.errMsg ?? 'დავალების გაგზავნა ვერ მოხერხდა');
  }
}