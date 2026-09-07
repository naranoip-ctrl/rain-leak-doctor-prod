'use client';

import Link from 'next/link';
import { Check, Clock3, CircleAlert, LoaderCircle } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { DiagnosisReceipt } from './DiagnosisReceipt';
import styles from './DiagnosisResult.module.css';

export interface DiagnosisSession {
  id: string;
  secret_code: string;
  damage_locations: string;
  damage_description: string;
  severity_score: number | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  first_aid_cost: number | null;
  insurance_likelihood: string;
  recommended_plan: string;
  image_urls: string[];
  created_at: string;
  expires_at?: string;
  status?: string | null;
  pdf_url?: string;
}

const amount = (value: number | null) => value == null ? '未算出' : `¥${Number(value).toLocaleString()}`;
const insuranceLabels: Record<string, string> = { high: '高い', medium: '中程度', low: '低い', none: '該当なし' };

export function DiagnosisResult({ session, loading = false, error = '', onRetry }: { session: DiagnosisSession | null; loading?: boolean; error?: string; onRetry?: () => void }) {
  const processing = session?.status === 'processing';
  const failed = session?.status === 'error';
  const pdfFailed = session?.status === 'pdf_failed' || (!!session && (!session.status || session.status === 'completed') && !session.pdf_url);
  const legacyComplete = !!session && !session.status && (!!session.pdf_url || !!session.damage_description);
  const complete = session && (legacyComplete || session.status === 'completed' || session.status === 'pdf_failed');
  const unavailable = !loading && (error || !session);
  const expiresAt = session && (session.expires_at ? Date.parse(session.expires_at) : Date.parse(session.created_at) + 24 * 60 * 60 * 1000);
  const expired = !!expiresAt && expiresAt < Date.now();

  return (
    <div className="result-refresh min-h-screen">
      <PageHeader />
      <main className={`container ${styles.main}`}>
        <div className={styles.intro}>
          <div className={styles.statusIcon} aria-hidden="true">
            {loading ? <LoaderCircle className="animate-spin" size={23} /> : unavailable || failed ? <CircleAlert size={23} /> : processing ? <Clock3 size={23} /> : <Check size={23} />}
          </div>
          <h1 className={styles.title}>{loading ? '診断結果を読み込み中' : unavailable ? '結果を表示できませんでした' : failed ? '診断を完了できませんでした' : processing ? '写真を確認しています' : complete ? '写真診断の結果です' : '診断状況を確認しています'}</h1>
          <p className={styles.lead} role="status">{loading ? 'そのままお待ちください。' : unavailable ? '通信状況を確認して、もう一度お試しください。' : failed ? '写真を選び直して、もう一度無料診断をお試しください。' : processing ? '結果の準備中です。先にLINEへ合言葉を送れます。' : '写真から分かる範囲の目安をお伝えします。'}</p>
        </div>

        {unavailable && <button className={styles.action} onClick={onRetry} type="button">もう一度読み込む</button>}
        {failed && <Link href="/diagnosis" className={styles.action}>写真を選び直す</Link>}

        {complete && session && !unavailable && !loading && (
          <section className={styles.panel} aria-labelledby="result-summary">
            <h2 id="result-summary">まず確認したいこと</h2>
            <p className={styles.note}>写真からの一次判定です。原因・費用は現地確認で変わります。保険の適用可否は保険会社が判断します。</p>
            <div className={styles.metrics}>
              <div><h3>緊急度の目安</h3><p className={styles.severity}><strong>{session.severity_score ?? '—'}</strong><span>/ 10</span></p></div>
              {session.insurance_likelihood !== 'none' && <div><h3>修理費の目安</h3><p className={styles.cost}><span>{amount(session.estimated_cost_min)}</span><span>〜</span><span>{amount(session.estimated_cost_max)}</span></p></div>}
            </div>
            <h3>{session.insurance_likelihood === 'none' ? '写真から確認できたこと' : '次にすること'}</h3>
            <p className={styles.body}>{session.insurance_likelihood === 'none' ? session.damage_description : session.recommended_plan || '気になる場所の現地確認をご相談ください。'}</p>
            <details className={styles.details}>
              <summary>判定の詳しい内容を見る</summary>
              {session.insurance_likelihood !== 'none' && <>
                <section><h3>確認したい箇所</h3><p className={styles.body}>{session.damage_locations || '現地での確認が必要です。'}</p></section>
                <section><h3>写真から見られる状態</h3><p className={styles.body}>{session.damage_description}</p></section>
                <section><h3>応急処置の目安費用</h3><p className={styles.cost}>{amount(session.first_aid_cost)}</p></section>
              </>}
              <section><h3>火災保険の確認余地</h3><p className={styles.body}>{insuranceLabels[session.insurance_likelihood] || '不明'}</p></section>
              <section><h3>お送りいただいた写真</h3><div className={styles.photos}>{(Array.isArray(session.image_urls) ? session.image_urls : []).map((url, index) => <img key={`${url}-${index}`} src={url} alt={`診断に使用した写真 ${index + 1}`} />)}</div></section>
            </details>
          </section>
        )}

        {session && !failed && !loading && !unavailable && (
          expired ? <div className={styles.panel}><h2>合言葉の有効期限が切れました</h2><p className={styles.body}>合言葉は受付から24時間有効です。新しい番号を取得するには、もう一度写真をお送りください。</p><Link href="/diagnosis" className={styles.action}>無料診断をやり直す</Link></div> : <>
            <DiagnosisReceipt code={session.secret_code} source="result_page" pdfFailed={pdfFailed} />
            <details className={styles.details}>
              <summary>結果が届かないとき</summary>
              <p className={styles.body}>「生成中」と届いたら、少し待ってから番号をもう一度送ってください。合言葉は受付から24時間有効です。PDFが届かない場合は、LINEで番号を添えてご相談ください。</p>
            </details>
            <p className={`${styles.lead} my-6`}>結果を見てから、必要に応じて現地調査をご相談いただけます。</p>
          </>
        )}
        <div className={styles.footer}>
          <Link href="/">トップへ</Link><Link href="/privacy">プライバシー</Link><Link href="/terms">利用規約</Link>
        </div>
      </main>
    </div>
  );
}
