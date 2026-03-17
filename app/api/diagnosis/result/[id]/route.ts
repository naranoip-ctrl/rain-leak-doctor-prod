/**
 * app/api/diagnosis/result/[id]/route.ts
 * 診断結果取得APIエンドポイント
 * 
 * クライアントサイドからのRLS問題を回避するため、
 * サーバーサイドでsupabaseAdminを使用してデータを取得する。
 * 
 * ※ 結果ページ（app/result/[id]/page.tsx）から呼び出される
 * ※ Next.js App Routerでは同じパスにpage.tsxとroute.tsを共存できないため、
 *    /api/diagnosis/result/[id] に配置
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
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: 'データの取得に失敗しました。' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: '診断データが見つかりませんでした。' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Result API Error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    );
  }
}
