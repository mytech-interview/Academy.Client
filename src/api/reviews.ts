// api/reviews.ts
const API_BASE_URL = "https://localhost:5188";
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

// --- Upsert review ---
export interface ReviewUpsertRequest {
  studentGuid: string;
  sessionId: number;
  mark: number; // 1-5
  description: string;
}

export interface ReviewUpsertResponse extends ApiEnvelope {}

export async function upsertReview(request: ReviewUpsertRequest): Promise<ReviewUpsertResponse> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/api/reviews/addReview`, {
    method: 'POST',
 headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify(request),
  });
  return parseResponse<ReviewUpsertResponse>(response);
}

// --- Get reviews by session ---
export interface ReviewsBySessionRequest {
  sessionId: number;
}

// Соответствует Academy.CoreApi.Entities.Reviews.ReviewsBySessionResponse (одна запись)
export interface ReviewItem {
  reviewId: number;
  mark: number;
  description: string;
  createdAt: string; // ISO date из DateTime
  studentGuid: string;
  firstName: string;
  lastName: string;
}

// Соответствует ReviewsBySessionResponseList
export interface ReviewsBySessionResponse extends ApiEnvelope {
  reviews: ReviewItem[];
}

export async function getReviewsBySession(sessionId: number): Promise<ReviewItem[]> {
  const token = localStorage.getItem("academy_token");
  const response = await fetch(`${API_BASE_URL}/api/reviews/getReviewsBySession`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    body: JSON.stringify({ sessionId } as ReviewsBySessionRequest),
  });
  const data = await parseResponse<ReviewsBySessionResponse>(response);
  return data.reviews ?? [];
}