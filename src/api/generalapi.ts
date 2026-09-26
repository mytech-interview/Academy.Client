import { API_BASE_URL } from "../services/baseApi";

export interface ContactUsRequest {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  
}

export interface ContactUsResponse {
  id: string;
}

async function apiFetch(path: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data?.message || data?.title || message;
    } catch {}

    throw new Error(message);
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}

export function contactUs(
  payload: ContactUsRequest
) {
  return apiFetch("/general/contactUs", payload);
}