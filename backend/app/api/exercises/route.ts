import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreateExerciseSchema } from '@/lib/validations';
import { ExerciseInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateExerciseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    // Verify concept exists and belongs to user
    const { data: concept, error: conceptError } = await supabase
      .from('concepts')
      .select('id')
      .eq('id', validationResult.data.concept_id)
      .eq('user_id', userId)
      .single();

    if (conceptError || !concept) {
      return createErrorResponse('Concept not found or access denied', 404);
    }

    // Insert exercise into database
    const exerciseData: ExerciseInsert = {
      user_id: userId,
      concept_id: validationResult.data.concept_id,
      exercise_type: validationResult.data.exercise_type,
      question: validationResult.data.question,
      answer: validationResult.data.answer,
      ai_feedback: validationResult.data.ai_feedback,
      completed: validationResult.data.completed || false,
    };

    const { data, error } = await supabase
      .from('exercises')
      .insert(exerciseData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to create exercise', 500);
    }

    return createSuccessResponse(data, 201);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get query parameters
    const url = new URL(request.url);
    const conceptId = url.searchParams.get('concept_id');
    const exerciseType = url.searchParams.get('exercise_type');
    const completed = url.searchParams.get('completed');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query with joins to get concept information
    let query = supabase
      .from('exercises')
      .select(`
        *,
        concepts (
          id,
          concept_name,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Add filters if provided
    if (conceptId) {
      query = query.eq('concept_id', conceptId);
    }

    if (exerciseType && ['flashcard', 'code', 'quiz'].includes(exerciseType)) {
      query = query.eq('exercise_type', exerciseType);
    }

    if (completed !== null && ['true', 'false'].includes(completed || '')) {
      query = query.eq('completed', completed === 'true');
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to fetch exercises', 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
