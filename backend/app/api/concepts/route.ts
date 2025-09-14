import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreateConceptSchema } from '@/lib/validations';
import { ConceptInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = CreateConceptSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
        400
      );
    }

    // Insert concept into database
    const conceptData: ConceptInsert = {
      user_id: userId,
      concept_name: validationResult.data.concept_name,
      source_prompt_id: validationResult.data.source_prompt_id,
      status: validationResult.data.status || 'unlearned',
    };

    const { data, error } = await supabase
      .from('concepts')
      .insert(conceptData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to create concept', 500);
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
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('concepts')
      .select('*')
      .eq('user_id', userId)
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
