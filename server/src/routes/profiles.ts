import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(200).optional(),
  grade: z.string().trim().min(1).max(100).nullable().optional(),
  subjects: z.array(z.string().trim()).nullable().optional(),
});

const router = Router();

const ensureProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, error.message);
  }

  if (data) {
    return data;
  }

  const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
    id: userId,
  };

  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert(newProfile)
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
    const profile = await ensureProfile(userId);
    res.json(profile);
  })
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const payload = updateProfileSchema.parse(req.body);

    await ensureProfile(userId);

    const fields: Database['public']['Tables']['profiles']['Update'] = {
      full_name: payload.fullName,
      grade:
        payload.grade === undefined
          ? undefined
          : payload.grade === null
            ? null
            : payload.grade,
      subjects:
        payload.subjects === undefined
          ? undefined
          : payload.subjects === null
            ? null
            : payload.subjects,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', userId)
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

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
