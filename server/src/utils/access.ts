import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';

export const ensureDocumentOwnership = async (documentId: string, userId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('id, user_id')
    .eq('id', documentId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data || data.user_id !== userId) {
    throw createHttpError(404, 'Document not found');
  }

  return data;
};

export const ensureLessonOwnership = async (lessonId: string, userId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, document_id')
    .eq('id', lessonId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data) {
    throw createHttpError(404, 'Lesson not found');
  }

  await ensureDocumentOwnership(data.document_id, userId);
  return data;
};

export const ensureQuizOwnership = async (quizId: string, userId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, lesson_id')
    .eq('id', quizId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data) {
    throw createHttpError(404, 'Quiz not found');
  }

  await ensureLessonOwnership(data.lesson_id, userId);
  return data;
};

export const ensureFlashcardOwnership = async (flashcardId: string, userId: string) => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('id, lesson_id, user_id')
    .eq('id', flashcardId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data || data.user_id !== userId) {
    throw createHttpError(404, 'Flashcard not found');
  }

  await ensureLessonOwnership(data.lesson_id, userId);
  return data;
};

export const ensureQuizAttemptOwnership = async (attemptId: string, userId: string) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, quiz_id, user_id')
    .eq('id', attemptId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data || data.user_id !== userId) {
    throw createHttpError(404, 'Quiz attempt not found');
  }

  await ensureQuizOwnership(data.quiz_id, userId);
  return data;
};

export const ensureReviewOwnership = async (reviewId: string, userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, flashcard_id, user_id')
    .eq('id', reviewId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (!data || data.user_id !== userId) {
    throw createHttpError(404, 'Review not found');
  }

  await ensureFlashcardOwnership(data.flashcard_id, userId);
  return data;
};
