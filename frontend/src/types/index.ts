export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  firebase_uid?: string;
  avatar_url?: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  current_streak: number;
  highest_streak: number;
  total_problems_solved: number;
  total_time_spent_minutes: number;
  overall_accuracy: number;
  preferred_difficulty: string;
  focus_topic: string;
  learning_goal: string;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  platform: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starter_code?: string;
  expected_solve_time_minutes: number;
}

export interface Activity {
  id: number;
  student_id: number;
  platform: string;
  problem_id?: number;
  problem_name?: string;
  topic?: string;
  difficulty?: string;
  activity_type: string;
  time_spent_seconds: number;
  attempt_number: number;
  error_message?: string;
  friction_score?: number;
  created_at: string;
}

export interface FrictionResponse {
  friction_score: number;
  friction_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  should_intervene: boolean;
  intervention_message?: string;
  suggested_hint_level: number;
  breakdown: {
    time_signal: number;
    attempt_signal: number;
    weakness_signal: number;
    error_signal: number;
  };
}

export interface ProgressiveHintResponse {
  problem_title: string;
  hint_level: number;
  hint_title: string;
  content: string;
  can_request_next: boolean;
}

export interface ErrorExplainResponse {
  error_type: string;
  simple_explanation: string;
  root_cause: string;
  actionable_checklist: string[];
  suggested_fix_direction: string;
}

export interface Recommendation {
  id: number;
  problem: Problem;
  reason: string;
  target_difficulty: string;
  status: string;
}

export interface RoadmapNode {
  id: number;
  topic: string;
  category: string;
  description: string;
  mastery_percent: number;
  status: 'completed' | 'in_progress' | 'locked';
  prerequisite?: string;
  recommended_problem: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  badge_icon: string;
  earned: boolean;
  earned_at?: string;
}

export interface TopicMastery {
  topic: string;
  mastery_score: number;
  total_attempts: number;
  successful_attempts: number;
}

export interface StudentAnalytics {
  streak_days: number;
  weekly_goal_completed: number;
  weekly_goal_target: number;
  overall_accuracy: number;
  total_problems_solved: number;
  total_time_spent_hours: number;
  average_solve_time_minutes: number;
  friction_status: string;
  weak_topics: string[];
  strong_topics: string[];
  topic_masteries: TopicMastery[];
  recent_activity_chart: { day: string; problems: number; accuracy: number; friction_score: number }[];
  achievements: Achievement[];
}

export interface StudentOverview {
  student_id: number;
  full_name: string;
  email: string;
  streak: number;
  problems_solved: number;
  accuracy: number;
  friction_status: string;
  weakest_topic: string;
  needs_support: boolean;
}

export interface TeacherAnalytics {
  total_students: number;
  avg_accuracy: number;
  students_needing_support: number;
  strongest_class_topic: string;
  weakest_class_topic: string;
  top_failed_concepts: { concept: string; failed_count: number; affected_students: number }[];
  at_risk_students: StudentOverview[];
  class_students: StudentOverview[];
}
