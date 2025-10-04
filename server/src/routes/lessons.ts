import { Router } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserId } from '../middleware/auth';
import { ensureDocumentOwnership, ensureLessonOwnership } from '../utils/access';

const createLessonSchema = z.object({
  documentId: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1).nullable().optional(),
  bullets: z.array(z.string()).nullable().optional(),
  keyTerms: z.array(z.string()).nullable().optional(),
});

const updateLessonSchema = z.object({
  documentId: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).nullable().optional(),
  bullets: z.array(z.string()).nullable().optional(),
  keyTerms: z.array(z.string()).nullable().optional(),
});

const router = Router();

const listLessonsForUser = async (userId: string) => {
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('id')
    .eq('user_id', userId);

  if (documentsError) {
    throw createHttpError(500, documentsError.message);
  }

  const documentIds = (documents ?? []).map((doc) => doc.id);

  if (documentIds.length === 0) {
    return [] as Database['public']['Tables']['lessons']['Row'][];
  }

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .in('document_id', documentIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw createHttpError(500, error.message);
  }

  return (data ?? []) as Database['public']['Tables']['lessons']['Row'][];
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const lessons = await listLessonsForUser(userId);
    res.json(lessons);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const payload = createLessonSchema.parse(req.body);

    await ensureDocumentOwnership(payload.documentId, userId);

    const newLesson: Database['public']['Tables']['lessons']['Insert'] = {
      document_id: payload.documentId,
      title: payload.title,
      summary: payload.summary ?? null,
      bullets: payload.bullets ?? null,
      key_terms: payload.keyTerms ?? null,
    };

    const { data, error } = await supabase.from('lessons').insert(newLesson).select('*').single();

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

    await ensureLessonOwnership(id, userId);

    const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();

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
    const payload = updateLessonSchema.parse(req.body);

    await ensureLessonOwnership(id, userId);

    if (payload.documentId) {
      await ensureDocumentOwnership(payload.documentId, userId);
    }

    const fields: Database['public']['Tables']['lessons']['Update'] = {
      document_id: payload.documentId,
      title: payload.title,
      summary:
        payload.summary === undefined
          ? undefined
          : payload.summary === null
            ? null
            : payload.summary,
      bullets:
        payload.bullets === undefined
          ? undefined
          : payload.bullets === null
            ? null
            : payload.bullets,
      key_terms:
        payload.keyTerms === undefined
          ? undefined
          : payload.keyTerms === null
            ? null
            : payload.keyTerms,
    };

    const hasUpdates = Object.values(fields).some((value) => value !== undefined);

    if (!hasUpdates) {
      const { data } = await supabase.from('lessons').select('*').eq('id', id).single();
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('lessons')
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

    await ensureLessonOwnership(id, userId);

    const { error } = await supabase.from('lessons').delete().eq('id', id);

    if (error) {
      throw createHttpError(500, error.message);
    }

    res.status(204).send();
  })
);

export default router;
