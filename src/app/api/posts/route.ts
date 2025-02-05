import { NextResponse } from 'next/server';
import { supabase, withRetry, handleSupabaseError, SupabaseQuery } from '../../../lib/supabase';
import { ApprovedPost } from '../../../types/posts';
import { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

interface CustomError extends Error {
  status?: number;
}

export async function POST(req: Request) {
  try {
    const post: ApprovedPost = await req.json();

    // Validate dates
    const publishDate = new Date(post.publish_date);
    const dueDate = new Date(post.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return NextResponse.json(
        { error: 'Due date cannot be in the past' },
        { status: 400 }
      );
    }

    if (publishDate < today) {
      return NextResponse.json(
        { error: 'Publish date cannot be in the past' },
        { status: 400 }
      );
    }

    if (dueDate > publishDate) {
      return NextResponse.json(
        { error: 'Due date must be before or equal to publish date' },
        { status: 400 }
      );
    }

    const insertData: Database['public']['Tables']['approvedposts']['Insert'] = {
      post_idea: post.post_idea,
      aims: post.aims,
      context: post.context,
      reference_materials: post.reference_materials,
      confidence_level: post.confidence_level,
      post_type: post.post_type,
      voice_over_required: post.voice_over_required,
      voice_over_type: post.voice_over_type === 'none' ? null : post.voice_over_type,
      publish_date: post.publish_date,
      due_date: post.due_date
    };

    const query = async () => {
      const result = await supabase
        .from('approvedposts')
        .insert([insertData])
        .select()
        .single();
      return result as SupabaseQuery<ApprovedPost>;
    };

    const response = await withRetry<ApprovedPost>(query);

    if (response.error) {
      console.error('Supabase error:', response.error);
      const errorMessage = handleSupabaseError(response.error);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error saving post:', error);
    const customError = error as CustomError;
    const errorMessage = handleSupabaseError(error as PostgrestError);
    return NextResponse.json(
      { error: errorMessage },
      { status: customError.status || 500 }
    );
  }
}

export async function GET() {
  try {
    const query = async () => {
      const result = await supabase
        .from('approvedposts')
        .select('*')
        .order('due_date', { ascending: true });
      return result as SupabaseQuery<ApprovedPost[]>;
    };

    const response = await withRetry<ApprovedPost[]>(query);

    if (response.error) {
      console.error('Supabase error:', response.error);
      const errorMessage = handleSupabaseError(response.error);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    const customError = error as CustomError;
    const errorMessage = handleSupabaseError(error as PostgrestError);
    return NextResponse.json(
      { error: errorMessage },
      { status: customError.status || 500 }
    );
  }
}