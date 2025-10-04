import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureQuizAttemptOwnership, ensureQuizOwnership } from '../utils/access';

const answersSchema = z.any();

const createAttemptSchema = z.object({
  quizId: z.string().uuid(),
  answers: answersSchema,
  score: z.number().int().min(0).max(100).nullable().optional(),
});

const updateAttemptSchema = z.object({
  answers: answersSchema.optional(),
  score: z.number().int().min(0).max(100).nullable().optional(),
});

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('quiz_attempts')
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
    const payload = createAttemptSchema.parse(req.body);

    await ensureQuizOwnership(payload.quizId, userId);

    const newAttempt: Database['public']['Tables']['quiz_attempts']['Insert'] = {
      quiz_id: payload.quizId,
      user_id: userId,
      answers: payload.answers,
      score: payload.score ?? null,
    };

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert(newAttempt)
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

    await ensureQuizAttemptOwnership(id, userId);

    const { data, error } = await supabase.from('quiz_attempts').select('*').eq('id', id).single();

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
    const payload = updateAttemptSchema.parse(req.body);

    await ensureQuizAttemptOwnership(id, userId);

    const fields: Database['public']['Tables']['quiz_attempts']['Update'] = {
      answers: payload.answers,
      score:
        payload.score === undefined
          ? undefined
          : payload.score === null
            ? null
            : payload.score,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('quiz_attempts').select('*').eq('id', id).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('quiz_attempts')
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

    await ensureQuizAttemptOwnership(id, userId);

    const { error } = await supabase.from('quiz_attempts').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
