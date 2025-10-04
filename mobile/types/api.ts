export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string | null;
  grade: string | null;
  subjects: string[] | null;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  text: string;
  source_url: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  document_id: string;
  title: string;
  summary: string | null;
  bullets: string[] | null;
  key_terms: string[] | null;
  created_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  questions: Json;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Json;
  score: number | null;
  created_at: string;
}

export interface Flashcard {
  id: string;
  lesson_id: string;
  user_id: string;
  front: string;
  back: string;
  hint: string | null;
  created_at: string;
  next_review_date: string | null;
  review_count: number;
}

export interface Review {
  id: string;
  flashcard_id: string;
  user_id: string;
  review_date: string;
  quality: number;
  new_interval: number | null;
  new_ef: number | null;
}

export interface Progress {
  id: string;
  user_id: string;
  lessons_completed: number;
  quizzes_taken: number;
  avg_score: number | null;
  flashcards_created: number;
  streak_days: number;
  updated_at: string;
}
