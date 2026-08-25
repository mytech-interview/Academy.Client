const API_BASE_URL = "https://academyapi.tech-interview.com";
// Mirrors Academy.CoreApi.Entities.HomeWorks.GetHomeWorksForStudentResponse
export interface StudentHomeWork {
  homeWorkId: number;
  title: string;
  description: string;
  dueDate: string;
  teacherGuid: string;
  teacherName: string;
}

interface GetHomeWorksForStudentResponse {
  homeWorks: StudentHomeWork[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getHomeWorksForStudent(studentGuid: string): Promise<StudentHomeWork[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/api/homeWorks/getHomeWorksForStudent`, {
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
  const response = await fetch(`${API_BASE_URL}/api/homeWorks/addHomeWorkSubmission`, {
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