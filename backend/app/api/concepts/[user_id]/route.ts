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

    // Ensure user can only access their own concepts
    if (userId !== params.user_id) {
      return createErrorResponse('Access denied', 403);
    }

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('concepts')
      .select(`
        *,
        cursor_prompts (
          id,
          prompt_text,
          timestamp
        )
      `)
      .eq('user_id', params.user_id)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status && ['unlearned', 'learning', 'mastered'].includes(status)) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to fetch concepts', 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
