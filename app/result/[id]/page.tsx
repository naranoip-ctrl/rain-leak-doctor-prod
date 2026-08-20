/**
 * app/result/[id]/page.tsx
 * 診断結果表示ページ
 * 
 * 【修正版】
 * - status='processing'の場合はポーリングで完了を待つ
 * - PDFダウンロードボタンは削除（LINEで自動送信するため）
 * - LINE誘導の案内を強化
 * - サーバーサイドAPIルート経由でデータを取得（RLS問題を回避）
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { trackLineClick } from '@/lib/analytics';
import { useScrollReveal } from '@/components/useScrollReveal';

interface DiagnosisSession {
  id: string;
  secret_code: string;
  customer_name: string;
  damage_locations: string;
  damage_description: string;
  severity_score: number;
  estimated_cost_min: number;
  estimated_cost_max: number;
  first_aid_cost: number;
  insurance_likelihood: string;
  recommended_plan: string;
  image_urls: string[];
  created_at: string;
  status?: string;
  pdf_url?: string;
}

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<DiagnosisSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useScrollReveal('.result-refresh header, .result-refresh main > *');

  const fetchSession = useCallback(async () => {
    if (!id) {
      setErrorMsg('セッションIDが指定されていません。');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/diagnosis/result/${id}`);
      const json = await response.json();

      if (!response.ok) {
        console.error('API Error:', json.error);
        setErrorMsg(json.error || 'データの取得に失敗しました。');
        return;
      }

      const data = json.data as DiagnosisSession;
      setSession(data);

      if (data.status === 'processing') {
        setIsProcessing(true);
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setErrorMsg('予期せぬエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // ポーリング: processing中は5秒ごとに再取得
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => { fetchSession(); }, 5000);
    return () => clearInterval(interval);
  }, [isProcessing, fetchSession]);

  const copySecretCode = () => {
    if (session) {
      navigator.clipboard.writeText(session.secret_code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error('コピーに失敗:', err);
      });
    }
  };

  const getInsuranceLikelihoodText = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return '高い';
      case 'medium': return '中程度';
      case 'low': return '低い';
      case 'none': return '該当なし';
      default: return '不明';
    }
  };

  const getInsuranceLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      case 'none': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="result-refresh min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-dark mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">診断結果を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !session) {
    return (
      <div className="result-refresh min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-6 form-panel max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-2">エラー</h1>
          <p className="text-slate-700 mb-4">{errorMsg || 'データが見つかりませんでした。'}</p>
          <Link href="/" className="text-primary underline hover:text-accent-dark font-bold">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const isNotApplicable = session.insurance_likelihood === 'none';
  const isStillProcessing = session.status === 'processing';

  return (
    <div className="result-refresh min-h-screen">
      <header className="bg-white/90 backdrop-blur-md border-b border-cyan-100 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-dark rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/10">
              <span className="text-white font-bold text-xl">雨</span>
            </div>
            <span className="text-2xl font-black text-primary">雨漏りドクター</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* 合言葉カード */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-cyan-100/20">
          <h2 className="text-2xl md:text-3xl font-black mb-4 text-center">
            {isStillProcessing ? 'AIが解析中です' : '診断が完了しました！'}
          </h2>
          <p className="text-center mb-6">
            詳細なPDFレポートを受け取るには、以下の合言葉をLINE公式アカウントに送信してください。
          </p>
          <div className="bg-white text-slate-900 rounded-lg p-6 text-center">
            <p className="text-sm text-slate-600 mb-2 font-bold">合言葉（4桁）</p>
            <p className="text-5xl md:text-6xl font-black tracking-wider mb-4 text-primary">
              {session.secret_code}
            </p>
            <button
              onClick={copySecretCode}
              className="bg-cta text-white px-6 py-2 rounded-lg hover:bg-cta-dark transition-colors font-bold"
            >
              {copied ? 'コピーしました！' : '合言葉をコピー'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://lin.ee/LTMUhxy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLineClick('result_page')}
              className="inline-block bg-line text-white px-8 py-3 rounded-lg font-bold hover:bg-line-dark transition-colors shadow-lg shadow-green-900/10"
            >
              LINE公式アカウントを開く
            </a>
          </div>
        </div>

        {/* 解析中の場合のローディング表示 */}
        {isStillProcessing && (
          <div className="form-panel p-8 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-100"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-dark border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">
              AIが写真を解析しています...
            </h3>
            <p className="text-sm text-slate-600">
              解析完了まで約15〜30秒です。このままLINEを開いて合言葉を送信してください。
            </p>
          </div>
        )}

        {/* 診断結果カード（完了時のみ表示） */}
        {!isStillProcessing && (
          <div className="form-panel p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-primary border-b border-cyan-100 pb-4">一次判定の概要</h2>

            {/* 一次判定であることの明示（断定を避ける注記） */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
              これは<strong>写真からの一次判定</strong>です。原因の特定・最終的な費用・保険の適用可否は、
              <strong>現地確認が必要</strong>です（本ページの内容は確定診断ではありません）。
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">緊急度の目安</h3>
              <div className="flex items-center space-x-4">
                <div className="text-5xl font-black text-accent-dark">{session.severity_score}</div>
                <div className="text-slate-600 font-bold">/ 10（写真からの目安）</div>
              </div>
            </div>

            {!isNotApplicable && (
              <>
                <div>
                  <h3 className="font-bold text-lg mb-2">注目したい箇所（要現地確認）</h3>
                  <p className="text-slate-700 leading-relaxed">{session.damage_locations}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">写真から見られる状態</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{session.damage_description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">概算費用レンジ（目安）</h3>
                  <p className="text-2xl md:text-3xl font-black text-primary">
                    &yen;{Number(session.estimated_cost_min).toLocaleString()} 〜 &yen;{Number(session.estimated_cost_max).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">現地確認で変わる場合があります。</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">応急処置の目安費用</h3>
                  <p className="text-2xl md:text-3xl font-black text-primary">
                    &yen;{Number(session.first_aid_cost).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">火災保険の確認余地</h3>
                  <p className={`text-2xl font-bold ${getInsuranceLikelihoodColor(session.insurance_likelihood)}`}>
                    {getInsuranceLikelihoodText(session.insurance_likelihood)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">適用可否は保険会社が判断します。当社は保険適用を保証しません。</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">次の一手の目安</h3>
                  <p className="text-slate-700 leading-relaxed">{session.recommended_plan}</p>
                </div>
              </>
            )}

            {isNotApplicable && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-yellow-800">該当なし</h3>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{session.damage_description}</p>
              </div>
            )}

            <div>
              <h3 className="font-bold text-lg mb-4">アップロードされた画像</h3>
              <div className="grid grid-cols-3 gap-4">
                {(Array.isArray(session.image_urls) ? session.image_urls : []).map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`診断画像 ${index + 1}`}
                    className="w-full h-32 md:h-48 object-cover rounded-lg shadow-md border border-slate-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <h3 className="font-black text-lg mb-2 text-primary">次のステップ</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>上記の合言葉をLINE公式アカウントに送信してください。</li>
            <li>詳細なPDFレポートが自動的に送信されます。</li>
            <li>PDFレポートを確認後、現地調査のご依頼をお待ちしております。</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary underline hover:text-accent-dark font-bold">
            ← ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
