import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreatePromptSchema } from '@/lib/validations';
import { CursorPromptInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreatePromptSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    // Insert prompt into database
    const promptData: CursorPromptInsert = {
      user_id: userId,
      prompt_text: validationResult.data.prompt_text,
    };

    const { data, error } = await supabase
      .from('cursor_prompts')
      .insert(promptData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to create prompt', 500);
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
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Fetch prompts from database
    const { data, error } = await supabase
      .from('cursor_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to fetch prompts', 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
