/**
 * app/api/diagnosis/process/route.ts
 * バックグラウンドAI診断処理エンドポイント
 * 
 * /api/diagnosis から非同期で呼び出される。
 * AI診断 → PDF生成 → DB更新 → メール通知 を実行する。
 * 
 * ※ LINE Webhookの仕組みには一切触れない（既存のまま維持）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { performAIDiagnosis } from '@/lib/openai/diagnosis';
import { generateDiagnosisPDF } from '@/lib/pdf/generator';

// Vercel Serverless Functionsの最大実行時間を60秒に設定
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // 内部呼び出しの認証チェック
    const internalSecret = request.headers.get('x-internal-secret');
    if (internalSecret !== (process.env.INTERNAL_API_SECRET || 'internal-secret-key')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, customerName, customerPhone, customerEmail, imageUrls } = body;

    console.log(`[バックグラウンド処理開始] Session: ${sessionId}`);

    const supabaseAdmin = getSupabaseAdmin();

    try {
      // 1. AI診断を実行
      console.log('[AI診断] 開始...');
      const diagnosisResult = await performAIDiagnosis(imageUrls);
      console.log('[AI診断] 完了:', diagnosisResult.severityScore);

      // 2. PDF生成
      console.log('[PDF生成] 開始...');
      const pdfUrl = await generateDiagnosisPDF({
        customerName,
        customerPhone,
        diagnosisResult,
        imageUrls,
      });
      console.log('[PDF生成] 完了:', pdfUrl);

      // 3. DBを更新（診断結果 + PDF URL）
      const { error: updateError } = await supabaseAdmin
        .from('diagnosis_sessions')
        .update({
          damage_locations: diagnosisResult.damageLocations,
          damage_description: diagnosisResult.damageDescription,
          severity_score: diagnosisResult.severityScore,
          estimated_cost_min: diagnosisResult.estimatedCostMin,
          estimated_cost_max: diagnosisResult.estimatedCostMax,
          first_aid_cost: diagnosisResult.firstAidCost,
          insurance_likelihood: diagnosisResult.insuranceLikelihood,
          recommended_plan: diagnosisResult.recommendedPlan,
          // PDF用の詳細フィールド
          detailed_analysis: diagnosisResult.detailedAnalysis,
          estimated_cause: diagnosisResult.estimatedCause,
          repair_comparison: diagnosisResult.repairComparison,
          neglect_risk: diagnosisResult.neglectRisk,
          insurance_tips: diagnosisResult.insuranceTips,
          image_findings: diagnosisResult.imageFindings,
          // PDF URL & ステータス
          pdf_url: pdfUrl,
          status: 'completed',
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('[DB更新エラー]', updateError);
        throw updateError;
      }

      console.log(`[バックグラウンド処理完了] Session: ${sessionId}`);

      // 4. メール通知（オプション）
      if (customerEmail) {
        try {
          // Resendでメール送信（既存のメール機能がある場合）
          // await sendDiagnosisEmail(customerEmail, customerName, diagnosisResult);
          console.log(`[メール通知] ${customerEmail} に送信予定`);
        } catch (emailError) {
          console.error('[メール通知エラー]', emailError);
          // メール送信失敗は致命的ではないのでスキップ
        }
      }

      return NextResponse.json({
        success: true,
        sessionId,
        status: 'completed',
      });
    } catch (processingError) {
      // 処理中にエラーが発生した場合、ステータスを'error'に更新
      console.error(`[バックグラウンド処理エラー] Session: ${sessionId}`, processingError);

      await supabaseAdmin
        .from('diagnosis_sessions')
        .update({
          status: 'error',
          damage_description: 'AI診断中にエラーが発生しました。再度お試しください。',
        })
        .eq('id', sessionId);

      return NextResponse.json(
        { error: 'Processing failed', sessionId },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Process API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
