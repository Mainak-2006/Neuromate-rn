import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureFlashcardOwnership, ensureLessonOwnership } from '../utils/access';

const createFlashcardSchema = z.object({
  lessonId: z.string().uuid(),
  front: z.string().min(1),
  back: z.string().min(1),
  hint: z.string().trim().nullable().optional(),
  nextReviewDate: z.string().trim().nullable().optional(),
});

const updateFlashcardSchema = createFlashcardSchema
  .partial()
  .extend({
    reviewCount: z.number().int().nonnegative().optional(),
  });

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
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
    const payload = createFlashcardSchema.parse(req.body);

    await ensureLessonOwnership(payload.lessonId, userId);

    const newFlashcard: Database['public']['Tables']['flashcards']['Insert'] = {
      lesson_id: payload.lessonId,
      user_id: userId,
      front: payload.front,
      back: payload.back,
      hint: payload.hint ?? null,
      next_review_date: payload.nextReviewDate ?? null,
    };

    const { data, error } = await supabase
      .from('flashcards')
      .insert(newFlashcard)
      .select('*')
      .single();

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

    await ensureFlashcardOwnership(id, userId);

    const { data, error } = await supabase.from('flashcards').select('*').eq('id', id).single();

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
    const payload = updateFlashcardSchema.parse(req.body);

    const existing = await ensureFlashcardOwnership(id, userId);

    if (payload.lessonId && payload.lessonId !== existing.lesson_id) {
      await ensureLessonOwnership(payload.lessonId, userId);
    }

    const fields: Database['public']['Tables']['flashcards']['Update'] = {
      lesson_id: payload.lessonId,
      front: payload.front,
      back: payload.back,
      hint:
        payload.hint === undefined
          ? undefined
          : payload.hint === null
            ? null
            : payload.hint,
      next_review_date:
        payload.nextReviewDate === undefined
          ? undefined
          : payload.nextReviewDate === null
            ? null
            : payload.nextReviewDate,
      review_count: payload.reviewCount,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('flashcards').select('*').eq('id', id).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('flashcards')
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

    await ensureFlashcardOwnership(id, userId);

    const { error } = await supabase.from('flashcards').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
