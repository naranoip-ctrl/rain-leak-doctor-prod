/**
 * app/api/diagnosis/route.ts
 * AI雨漏り診断APIエンドポイント
 * 
 * 【修正版】即時レスポンス＋バックグラウンド処理
 * 
 * フロー:
 * 1. 4桁の合言葉を即座に生成
 * 2. DBにstatus='processing'で仮保存
 * 3. セッションIDと合言葉を即座に返却（1-2秒以内）
 * 4. バックグラウンドでAI診断→PDF生成→DB更新を実行
 * 
 * ※ Vercel Serverless Functionsでは waitUntil が使えないため、
 *    別のAPIエンドポイント（/api/diagnosis/process）を非同期で呼び出す方式を採用
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generateUniqueSecretCode } from '@/lib/supabase/secret-code';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, imageUrls } = body;

    // バリデーション
    if (!customerName || !customerPhone || !imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
        { status: 400 }
      );
    }

    if (imageUrls.length !== 3) {
      return NextResponse.json(
        { error: '画像は3枚アップロードしてください。' },
        { status: 400 }
      );
    }

    // 1. 4桁の合言葉を即座に生成
    const secretCode = await generateUniqueSecretCode();

    // 2. 有効期限を設定（24時間後）
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 3. DBにstatus='processing'で仮保存
    const supabaseAdmin = getSupabaseAdmin();
    const { data: session, error: insertError } = await supabaseAdmin
      .from('diagnosis_sessions')
      .insert({
        secret_code: secretCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        image_urls: imageUrls,
        expires_at: expiresAt.toISOString(),
        // 仮の値（バックグラウンド処理で更新される）
        damage_locations: '診断中...',
        damage_description: '診断中...',
        severity_score: 0,
        estimated_cost_min: 0,
        estimated_cost_max: 0,
        first_aid_cost: 0,
        insurance_likelihood: 'low',
        recommended_plan: '診断中...',
        status: 'processing',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting diagnosis session:', insertError);
      return NextResponse.json(
        { error: '診断結果の保存に失敗しました。' },
        { status: 500 }
      );
    }

    // 4. バックグラウンド処理を非同期で開始
    //    自分自身のサーバーの /api/diagnosis/process を呼び出す
    //    レスポンスを待たずに即座にクライアントに返す
    const baseUrl = request.nextUrl.origin;
    fetch(`${baseUrl}/api/diagnosis/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 内部呼び出し用のシークレットキー
        'x-internal-secret': process.env.INTERNAL_API_SECRET || 'internal-secret-key',
      },
      body: JSON.stringify({
        sessionId: session.id,
        customerName,
        customerPhone,
        customerEmail,
        imageUrls,
      }),
    }).catch((err) => {
      // fetch自体のエラーはログに記録するが、クライアントには影響しない
      console.error('Failed to trigger background processing:', err);
    });

    // 5. 即座にレスポンスを返す（1-2秒以内）
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      secretCode,
      status: 'processing',
      message: 'AI診断を開始しました。バックグラウンドで処理中です。',
    });
  } catch (error) {
    console.error('Error in diagnosis API:', error);
    return NextResponse.json(
      { error: '診断中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
