export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: never[];
      };
      flashcards: {
        Row: {
          id: string;
          lesson_id: string;
          user_id: string;
          front: string;
          back: string;
          hint: string | null;
          created_at: string;
          next_review_date: string | null;
          review_count: number;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          user_id: string;
          front: string;
          back: string;
          hint?: string | null;
          created_at?: string;
          next_review_date?: string | null;
          review_count?: number;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          user_id?: string;
          front?: string;
          back?: string;
          hint?: string | null;
          created_at?: string;
          next_review_date?: string | null;
          review_count?: number;
        };
        Relationships: never[];
      };
      lessons: {
        Row: {
          id: string;
          document_id: string;
          title: string;
          summary: string | null;
          bullets: string[] | null;
          key_terms: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          title: string;
          summary?: string | null;
          bullets?: string[] | null;
          key_terms?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          title?: string;
          summary?: string | null;
          bullets?: string[] | null;
          key_terms?: string[] | null;
          created_at?: string;
        };
        Relationships: never[];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          grade: string | null;
          subjects: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          grade?: string | null;
          subjects?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          grade?: string | null;
          subjects?: string[] | null;
          created_at?: string;
        };
        Relationships: never[];
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          lessons_completed: number;
          quizzes_taken: number;
          avg_score: number | null;
          flashcards_created: number;
          streak_days: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lessons_completed?: number;
          quizzes_taken?: number;
          avg_score?: number | null;
          flashcards_created?: number;
          streak_days?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lessons_completed?: number;
          quizzes_taken?: number;
          avg_score?: number | null;
          flashcards_created?: number;
          streak_days?: number;
          updated_at?: string;
        };
        Relationships: never[];
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          user_id: string;
          answers: Json;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          user_id: string;
          answers: Json;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          user_id?: string;
          answers?: Json;
          score?: number | null;
          created_at?: string;
        };
        Relationships: never[];
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          questions: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          questions: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          questions?: Json;
          created_at?: string;
        };
        Relationships: never[];
      };
      reviews: {
        Row: {
          id: string;
          flashcard_id: string;
          user_id: string;
          review_date: string;
          quality: number;
          new_interval: number | null;
          new_ef: number | null;
        };
        Insert: {
          id?: string;
          flashcard_id: string;
          user_id: string;
          review_date?: string;
          quality: number;
          new_interval?: number | null;
          new_ef?: number | null;
        };
        Update: {
          id?: string;
          flashcard_id?: string;
          user_id?: string;
          review_date?: string;
          quality?: number;
          new_interval?: number | null;
          new_ef?: number | null;
        };
        Relationships: never[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
