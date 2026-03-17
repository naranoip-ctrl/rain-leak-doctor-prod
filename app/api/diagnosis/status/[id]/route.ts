/**
 * app/api/diagnosis/status/[id]/route.ts
 * 診断ステータス確認APIエンドポイント
 * 
 * フロントエンドのポーリングで使用。
 * 診断が完了したかどうかを確認する。
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'セッションIDが指定されていません。' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('diagnosis_sessions')
      .select('id, status, pdf_url')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'セッションが見つかりませんでした。' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      hasPdf: !!data.pdf_url,
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    );
  }
}
