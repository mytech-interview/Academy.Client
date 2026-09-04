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

// --- Submission -------------------------------------------------------
// Mirrors Academy.CoreApi.Entities.HomeWorks.AddHomeWorkSubmissionRequest/Response.
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
  const response = await fetch(`${API_BASE_URL}/homeworks/addHomeWorkSubmisson`, {
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