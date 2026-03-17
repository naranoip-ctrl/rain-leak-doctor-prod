/**
 * app/api/diagnosis/process/route.ts
 * バックグラウンドAI診断処理エンドポイント
 * 
 * /api/diagnosis から非同期で呼び出される。
 * AI診断 → PDF生成 → Storageアップロード → DB更新 → 顧客同期 → メール通知 を実行する。
 * 
 * ※ LINE Webhookの仕組みには一切触れない（既存のまま維持）
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { performAIDiagnosis } from '@/lib/openai/diagnosis';
import { generatePDF } from '@/lib/pdf/generator';
import { syncCustomer } from '@/lib/supabase/customer-sync';
import { notifyNewDiagnosis } from '@/lib/email/notification';

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
    const { sessionId, secretCode, customerName, customerPhone, customerEmail, imageUrls } = body;

    console.log(`[バックグラウンド処理開始] Session: ${sessionId}`);

    const supabaseAdmin = getSupabaseAdmin();

    try {
      // 1. AI診断を実行
      console.log('[AI診断] 開始...');
      const diagnosisResult = await performAIDiagnosis(imageUrls);
      console.log('[AI診断] 完了:', diagnosisResult.severityScore);

      // 2. PDF生成（既存のgeneratePDF関数を使用）
      console.log('[PDF生成] 開始...');
      let pdfUrl: string | null = null;
      try {
        const pdfBuffer = await generatePDF({
          customerName,
          diagnosisId: sessionId,
          ...diagnosisResult,
          imageUrls,
        });

        // 3. Supabase Storageにアップロード
        const pdfFileName = `diagnosis_${sessionId}.pdf`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from('pdfs')
          .upload(pdfFileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error('[PDF Storageアップロードエラー]', uploadError);
          // PDF失敗は致命的ではない（後でリトライ可能）
        } else {
          // PDF URLを取得
          const { data: pdfUrlData } = supabaseAdmin.storage
            .from('pdfs')
            .getPublicUrl(pdfFileName);
          pdfUrl = pdfUrlData.publicUrl;
          console.log('[PDF生成] 完了:', pdfUrl);
        }
      } catch (pdfError) {
        console.error('[PDF生成エラー (non-fatal)]', pdfError);
        // PDF生成失敗は致命的ではない
      }

      // 4. DBを更新（診断結果 + PDF URL）
      const updateData: Record<string, unknown> = {
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
        // ステータス
        status: 'completed',
      };

      // PDF URLがある場合のみ設定
      if (pdfUrl) {
        updateData.pdf_url = pdfUrl;
      }

      const { error: updateError } = await supabaseAdmin
        .from('diagnosis_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (updateError) {
        console.error('[DB更新エラー]', updateError);
        throw updateError;
      }

      console.log(`[バックグラウンド処理完了] Session: ${sessionId}`);

      // 5. 顧客情報をcustomersテーブルに自動同期（管理画面用）
      try {
        await syncCustomer(supabaseAdmin, {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || undefined,
        });
      } catch (syncError) {
        console.error('[顧客同期エラー (non-fatal)]', syncError);
        // 顧客同期失敗は致命的ではない
      }

      // 6. 管理者にメール通知を送信
      try {
        await notifyNewDiagnosis({
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          damageLocations: diagnosisResult.damageLocations,
          estimatedCostMin: diagnosisResult.estimatedCostMin,
          estimatedCostMax: diagnosisResult.estimatedCostMax,
          insuranceLikelihood: diagnosisResult.insuranceLikelihood,
          severityScore: diagnosisResult.severityScore,
          recommendedPlan: diagnosisResult.recommendedPlan,
          secretCode,
          sessionId,
        });
      } catch (emailError) {
        console.error('[メール通知エラー (non-fatal)]', emailError);
        // メール通知失敗は致命的ではない
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
