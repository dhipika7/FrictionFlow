import {
  User, StudentProfile, Activity, FrictionResponse, ProgressiveHintResponse,
  ErrorExplainResponse, Recommendation, RoadmapNode, StudentAnalytics, TeacherAnalytics
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('frictionflow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(err.detail || 'API Error');
  }
  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_V1}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async signup(email: string, full_name: string, password: string, role: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_V1}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name, password, role })
    });
    return handleResponse(res);
  },

  // Student Profile
  async getStudentProfile(): Promise<StudentProfile> {
    const res = await fetch(`${API_V1}/student/profile`, { headers: getAuthHeader() });
    return handleResponse(res);
  },

  // Friction Detection
  async calculateFriction(data: {
    problem_difficulty: string;
    time_spent_seconds: number;
    attempt_number: number;
    failed_attempts: number;
    topic?: string;
    error_message?: string;
  }): Promise<FrictionResponse> {
    const res = await fetch(`${API_V1}/friction/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Activity Ingestion
  async recordActivity(activity: {
    platform: string;
    problem_name?: string;
    topic?: string;
    difficulty?: string;
    activity_type: string;
    time_spent_seconds: number;
    attempt_number: number;
    error_message?: string;
  }): Promise<Activity> {
    const res = await fetch(`${API_V1}/activity/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(activity)
    });
    return handleResponse(res);
  },

  // AI Mentor Chat & Progressive Hints
  async getProgressiveHint(data: {
    problem_title: string;
    topic: string;
    difficulty: string;
    hint_level: number;
    student_attempt_code?: string;
  }): Promise<ProgressiveHintResponse> {
    const res = await fetch(`${API_V1}/mentor/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async mentorChat(data: {
    user_message: string;
    problem_title?: string;
    topic?: string;
    difficulty?: string;
    code_snippet?: string;
    error_message?: string;
    current_hint_level?: number;
  }): Promise<{ reply: string; suggested_followups: string[] }> {
    const res = await fetch(`${API_V1}/mentor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Error Translator
  async explainError(data: {
    raw_error: string;
    programming_language?: string;
    code_context?: string;
  }): Promise<ErrorExplainResponse> {
    const res = await fetch(`${API_V1}/errors/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Recommendations & Roadmap
  async getRecommendations(): Promise<Recommendation[]> {
    const res = await fetch(`${API_V1}/recommendations/`, { headers: getAuthHeader() });
    return handleResponse(res);
  },

  async getRoadmap(): Promise<RoadmapNode[]> {
    const res = await fetch(`${API_V1}/recommendations/roadmap`, { headers: getAuthHeader() });
    return handleResponse(res);
  },

  // Analytics
  async getStudentAnalytics(): Promise<StudentAnalytics> {
    const res = await fetch(`${API_V1}/analytics/student`, { headers: getAuthHeader() });
    return handleResponse(res);
  },

  async getTeacherAnalytics(): Promise<TeacherAnalytics> {
    const res = await fetch(`${API_V1}/teacher/dashboard`, { headers: getAuthHeader() });
    return handleResponse(res);
  },

  // Platform Sync
  async connectPlatform(platform_name: string, handle_or_username: string) {
    const res = await fetch(`${API_V1}/platform/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ platform_name, handle_or_username })
    });
    return handleResponse(res);
  },

  // Reset Demo Data
  async resetDemoData() {
    const res = await fetch(`${API_V1}/demo/reset-data`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  }
};
