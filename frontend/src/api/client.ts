const TOKEN_KEY = 'profenglish_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'REQUEST_FAILED');
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getLevelTest: () => request<{ questions: any[] }>('/onboarding/level-test'),
  completeOnboarding: (profession: string, answerIndexes: number[], goal: string) =>
    request<{ user: any; levelTestScore: number }>('/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify({ profession, answerIndexes, goal }),
    }),
  getCurrentLesson: () => request<{ lesson: any }>('/lesson/current'),
  sendChatMessage: (cacheKey: string, history: any[], message: string) =>
    request<{ reply: string }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, history, message }),
    }),
  submitEvaluation: (cacheKey: string, finalAnswer: string) =>
    request<{ evaluation: any }>('/evaluation/submit', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, finalAnswer }),
    }),
};
