import { ActiveSession } from '../types';

const API_BASE_URL = 'https://localhost:7197';

interface HomeActiveSessionsResponse {
  activeSessions: ActiveSession[];
  errMsg: string | null;
  errorCode: string | null;
  err: number;
}

export async function getHomeActiveSessions(
  courseCategoryId: number
): Promise<ActiveSession[]> {
  const response = await fetch(`${API_BASE_URL}/Home/getHomeActiveSessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseCategoryId }),
  });

  if (!response.ok) {
    throw new Error('');
  }

  const text = await response.text();
  const data: HomeActiveSessionsResponse = text
    ? JSON.parse(text)
    : { activeSessions: [], errMsg: null, errorCode: null, err: 0 };

  if (data.err !== 0) {
    throw new Error(data.errMsg ?? '');
  }

  // Safely fallback to an empty array if activeSessions is null/undefined
  return data.activeSessions || [];
}