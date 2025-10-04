import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureDocumentOwnership } from '../utils/access';

const createDocumentSchema = z.object({
  text: z.string().min(1),
  sourceUrl: z.string().url().optional(),
});

const updateDocumentSchema = createDocumentSchema.partial();

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('documents')
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
    const payload = createDocumentSchema.parse(req.body);

    const newDocument: Database['public']['Tables']['documents']['Insert'] = {
      user_id: userId,
      text: payload.text,
      source_url: payload.sourceUrl ?? null,
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(newDocument)
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

    await ensureDocumentOwnership(id, userId);

    const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();

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
    const payload = updateDocumentSchema.parse(req.body);

    await ensureDocumentOwnership(id, userId);

    const fields: Database['public']['Tables']['documents']['Update'] = {};
    if (payload.text !== undefined) {
      fields.text = payload.text;
    }
    if (payload.sourceUrl !== undefined) {
      fields.source_url = payload.sourceUrl ?? null;
    }

    if (Object.keys(fields).length === 0) {
      return res.json({});
    }

    const { data, error } = await supabase
      .from('documents')
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

    await ensureDocumentOwnership(id, userId);

    const { error } = await supabase.from('documents').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
