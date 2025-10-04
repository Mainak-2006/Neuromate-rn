import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';

const updateProgressSchema = z.object({
  lessonsCompleted: z.number().int().nonnegative().optional(),
  quizzesTaken: z.number().int().nonnegative().optional(),
  avgScore: z.number().nonnegative().max(100).nullable().optional(),
  flashcardsCreated: z.number().int().nonnegative().optional(),
  streakDays: z.number().int().nonnegative().optional(),
});

const router = Router();

const ensureProgressRecord = async (userId: string) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (data) {
    return data;
  }

  const newProgress: Database['public']['Tables']['progress']['Insert'] = {
    user_id: userId,
  };

  const { data: inserted, error: insertError } = await supabase
    .from('progress')
    .insert(newProgress)
    .select('*')
    .single();

  if (insertError) {
    throw createHttpError(500, insertError.message);
  }

  return inserted;
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const progress = await ensureProgressRecord(userId);
    res.json(progress);
  })
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const payload = updateProgressSchema.parse(req.body);

    await ensureProgressRecord(userId);

    const fields: Database['public']['Tables']['progress']['Update'] = {
      lessons_completed: payload.lessonsCompleted,
      quizzes_taken: payload.quizzesTaken,
      avg_score:
        payload.avgScore === undefined
          ? undefined
          : payload.avgScore === null
            ? null
            : payload.avgScore,
      flashcards_created: payload.flashcardsCreated,
      streak_days: payload.streakDays,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('progress').select('*').eq('user_id', userId).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('progress')
      .update(fields)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.json(data);
  })
);

router.delete(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const { error } = await supabase.from('progress').delete().eq('user_id', userId);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
