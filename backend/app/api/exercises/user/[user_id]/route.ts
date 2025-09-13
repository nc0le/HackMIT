import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { UserIdSchema } from '@/lib/validations';

interface RouteParams {
  params: {
    user_id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Validate user ID format
    const userIdValidation = UserIdSchema.safeParse(params.user_id);
    if (!userIdValidation.success) {
      return createErrorResponse('Invalid user ID format', 400);
    }

    // Ensure user can only access their own exercises
    if (userId !== params.user_id) {
      return createErrorResponse('Access denied', 403);
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
      .eq('user_id', params.user_id)
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
