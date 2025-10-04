import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureFlashcardOwnership, ensureReviewOwnership } from '../utils/access';

const createReviewSchema = z.object({
  flashcardId: z.string().uuid(),
  reviewDate: z.string().trim().optional(),
  quality: z.number().int().min(0).max(5),
  newInterval: z.number().nonnegative().nullable().optional(),
  newEf: z.number().nullable().optional(),
});

const updateReviewSchema = z.object({
  reviewDate: z.string().trim().optional(),
  quality: z.number().int().min(0).max(5).optional(),
  newInterval: z.number().nonnegative().nullable().optional(),
  newEf: z.number().nullable().optional(),
});

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('review_date', { ascending: false });

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
    const payload = createReviewSchema.parse(req.body);

    await ensureFlashcardOwnership(payload.flashcardId, userId);

    const newReview: Database['public']['Tables']['reviews']['Insert'] = {
      flashcard_id: payload.flashcardId,
      user_id: userId,
      review_date: payload.reviewDate ?? undefined,
      quality: payload.quality,
      new_interval: payload.newInterval ?? null,
      new_ef: payload.newEf ?? null,
    };

    const { data, error } = await supabase.from('reviews').insert(newReview).select('*').single();

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

    await ensureReviewOwnership(id, userId);

    const { data, error } = await supabase.from('reviews').select('*').eq('id', id).single();

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
    const payload = updateReviewSchema.parse(req.body);

    await ensureReviewOwnership(id, userId);

    const fields: Database['public']['Tables']['reviews']['Update'] = {
      review_date: payload.reviewDate,
      quality: payload.quality,
      new_interval:
        payload.newInterval === undefined
          ? undefined
          : payload.newInterval === null
            ? null
            : payload.newInterval,
      new_ef:
        payload.newEf === undefined ? undefined : payload.newEf === null ? null : payload.newEf,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('reviews').select('*').eq('id', id).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('reviews')
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

    await ensureReviewOwnership(id, userId);

    const { error } = await supabase.from('reviews').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
