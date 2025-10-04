import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureLessonOwnership, ensureQuizOwnership } from '../utils/access';

const questionsSchema = z.any();

const createQuizSchema = z.object({
  lessonId: z.string().uuid(),
  questions: questionsSchema,
});

const updateQuizSchema = z.object({
  lessonId: z.string().uuid().optional(),
  questions: questionsSchema.optional(),
});

const router = Router();

const listUserLessonIds = async (userId: string) => {
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('id')
    .eq('user_id', userId);

  if (documentsError) {
    throw createHttpError(500, documentsError.message);
  }

  const documentIds = (documents ?? []).map((doc) => doc.id);

  if (documentIds.length === 0) {
    return [] as string[];
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .in('document_id', documentIds);

  if (lessonsError) {
    throw createHttpError(500, lessonsError.message);
  }

  return (lessons ?? []).map((lesson) => lesson.id);
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const lessonIds = await listUserLessonIds(userId);

    if (lessonIds.length === 0) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .in('lesson_id', lessonIds)
      .order('created_at', { ascending: false });

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.json(data ?? []);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const payload = createQuizSchema.parse(req.body);

    await ensureLessonOwnership(payload.lessonId, userId);

    const newQuiz: Database['public']['Tables']['quizzes']['Insert'] = {
      lesson_id: payload.lessonId,
      questions: payload.questions,
    };

    const { data, error } = await supabase.from('quizzes').insert(newQuiz).select('*').single();

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(201).json(data);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const { id } = req.params;

    await ensureQuizOwnership(id, userId);

    const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.json(data);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const { id } = req.params;
    const payload = updateQuizSchema.parse(req.body);

    const existing = await ensureQuizOwnership(id, userId);

    if (payload.lessonId && payload.lessonId !== existing.lesson_id) {
      await ensureLessonOwnership(payload.lessonId, userId);
    }

    const fields: Database['public']['Tables']['quizzes']['Update'] = {
      lesson_id: payload.lessonId,
      questions: payload.questions,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('quizzes').select('*').eq('id', id).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('quizzes')
      .update(fields)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.json(data);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const { id } = req.params;

    await ensureQuizOwnership(id, userId);

    const { error } = await supabase.from('quizzes').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
