import type { User, Lesson, EvaluationResult, LevelTestQuestion } from '../types';

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

  if (!res.ok) {
    let errorMessage = 'REQUEST_FAILED';
    try {
      const errData = await res.json();
      errorMessage = errData.error || errorMessage;
    } catch {
      // response body wasn't JSON; keep default message
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getLevelTest: () => request<{ questions: LevelTestQuestion[] }>('/onboarding/level-test'),
  completeOnboarding: (profession: string, answerIndexes: number[], goal: string, targetLevel: string) =>
    request<{ user: User; levelTestScore: number }>('/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify({ profession, answerIndexes, goal, targetLevel }),
    }),
  getCurrentLesson: () => request<{ lesson: Lesson }>('/lesson/current'),
  sendChatMessage: (cacheKey: string, history: any[], message: string) =>
    request<{ reply: string }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, history, message }),
    }),
  submitEvaluation: (cacheKey: string, finalAnswer: string) =>
    request<{ evaluation: EvaluationResult }>('/evaluation/submit', {
      method: 'POST',
      body: JSON.stringify({ cacheKey, finalAnswer }),
    }),
  getMyProgress: () =>
    request<{
      progress: Array<{
        userId: string;
        lessonKey: string;
        finalAnswer: string;
        evaluation: EvaluationResult;
        completedAt: string;
      }>;
    }>('/evaluation/my-progress'),
  updateProfile: (fields: Partial<Pick<User, 'firstName' | 'lastName' | 'gender' | 'birthDate'>>) =>
    request<{ user: User }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(fields),
    }),
};
