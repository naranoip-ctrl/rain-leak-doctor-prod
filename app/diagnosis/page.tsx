/**
 * app/diagnosis/page.tsx
 * 診断フォームページ
 * 
 * 写真選択を先に表示し、詳しい状況と連絡先は任意入力にする。
 * 受付後は合言葉を案内し、診断APIの状態を確認する。
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { DiagnosisReceipt } from '@/components/DiagnosisReceipt';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import styles from './Diagnosis.module.css';
import { ImageUpload } from '@/components/ImageUpload';
import { trackFormStart, trackFormSubmit, trackInspectionRequest } from '@/lib/analytics';
import { useScrollReveal } from '@/components/useScrollReveal';

type DiagnosisStep = 'form' | 'uploading' | 'result';

// 関西6府県（現地点検案内の対象）。関西外はオンライン完結を案内する。
const KANSAI_PREFECTURES = ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県'];

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

// third-place-ai.jp（他社見積チェック）への導線。URLは確定済み。
const THIRD_PLACE_QUOTE_URL = 'https://third-place-ai.jp/';

export default function DiagnosisPage() {
  const [step, setStep] = useState<DiagnosisStep>('form');

  // フォーム入力
  // 雨漏りの状況・希望（一次判定の文脈／導線分岐に使用。写真以外は任意）
  const [leakSituation, setLeakSituation] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [hasQuote, setHasQuote] = useState(''); // 他社見積の有無
  const [requestType, setRequestType] = useState('無料一次判定'); // 希望
  // 連絡先（任意・匿名可）
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerBuildingAge, setCustomerBuildingAge] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // 関西判定（現地点検案内 / 関西外はオンライン完結）
  const isKansai = KANSAI_PREFECTURES.includes(prefecture);

  // 結果
  const [secretCode, setSecretCode] = useState('');
  const [sessionId, setSessionId] = useState('');

  // エラー・ローディング
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const [analysisStatus, setAnalysisStatus] = useState('processing');

  useScrollReveal('.diagnosis-refresh header, .diagnosis-refresh main > *');

  // 計測: フォーム初回操作（form_start）をセッション内で1回だけ発火させるためのフラグ
  const formStarted = useRef(false);
  const handleFirstInteraction = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackFormStart();
  };

  // Report the actual asynchronous state; elapsed time is not proof of completion.
  useEffect(() => {
    if (step !== 'result' || !sessionId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function checkStatus() {
      try {
        const response = await fetch(`/api/diagnosis/status/${sessionId}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Status unavailable');
        const data = await response.json();
        if (controller.signal.aborted) return;
        setAnalysisStatus(data.status === 'completed' && !data.hasPdf ? 'pdf_failed' : data.status || 'unknown');
        if (['completed', 'pdf_failed', 'error'].includes(data.status)) return;
      } catch {
        if (controller.signal.aborted) return;
        setAnalysisStatus('unknown');
      }
      timer = setTimeout(checkStatus, 5000);
    }
    checkStatus();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [step, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingImages) return;
    setError('');

    // バリデーション（写真1枚以上で送信可・最大3枚。連絡先・属性は任意・匿名可）
    // 「ちょうど3枚」必須は離脱要因(GA: form_start 11→submit 0)のため1〜3枚に緩和。
    if (images.length < 1) {
      setError('写真を1枚以上アップロードしてください。');
      return;
    }

    setStep('uploading');
    setUploadProgress('画像をアップロードしています...');

    try {
      // 1. 画像をアップロード（既に圧縮済み）
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        setUploadProgress(`画像をアップロードしています... (${i + 1}/${images.length})`);

        const formData = new FormData();
        formData.append('file', images[i]);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'アップロードに失敗しました。');
        }

        const uploadResult = await uploadResponse.json();
        imageUrls.push(uploadResult.url);
      }

      // 2. 診断APIを呼び出し（即座にレスポンスが返る）
      setUploadProgress('AI診断を開始しています...');

      const diagnosisResponse = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          customerAddress,
          customerBuildingAge,
          imageUrls,
          // 新規項目（一次判定の文脈・導線分岐・管理通知用）
          leakSituation,
          prefecture,
          hasQuote,
          requestType,
        }),
      });

      if (!diagnosisResponse.ok) {
        const diagError = await diagnosisResponse.json();
        throw new Error(diagError.error || '診断の開始に失敗しました。');
      }

      const diagResult = await diagnosisResponse.json();

      // 3. 即座に結果画面を表示
      setSecretCode(diagResult.secretCode);
      setSessionId(diagResult.sessionId);
      setAnalysisStatus('processing');
      setStep('result');

      // 計測: 診断送信成功（form_submit）。UTM/gclid は trackEvent 側で自動付与。
      trackFormSubmit({
        building_age: customerBuildingAge,
        prefecture,
        request_type: requestType,
        has_quote: hasQuote,
        is_kansai: isKansai,
      });
      // 希望が「現地点検」の送信は inspection_request も発火（現地点検リードの計測）。
      if (requestType === '現地点検') {
        trackInspectionRequest({ prefecture, is_kansai: isKansai });
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(err.message || 'エラーが発生しました。もう一度お試しください。');
      setStep('form');
    }
  };


  // ============================================================
  // 結果画面（4桁番号表示 + AI解析中アニメーション + LINE誘導）
  // ============================================================
  if (step === 'result') {
    return (
      <div className="diagnosis-refresh min-h-screen">
        <PageHeader />
        <main className={`container max-w-lg ${styles.main}`}>
          <div className={styles.intro}>
            <div className={styles.accepted}>{analysisStatus === 'error' ? <CircleAlert size={24} aria-hidden="true" /> : <Check size={24} aria-hidden="true" />}</div>
            <h1 className={styles.resultHeading}>{analysisStatus === 'error' ? '診断を完了できませんでした' : '写真を受け付けました'}</h1>
            <p className={styles.description}>{analysisStatus === 'error' ? '写真を選び直して、もう一度お試しください。' : 'あとは、この番号をLINEで送るだけ。'}</p>
          </div>
          {analysisStatus === 'error' ? <button type="button" className={styles.submit} onClick={() => setStep('form')}>写真を選び直す</button> : <DiagnosisReceipt code={secretCode} source="diagnosis_result" pdfFailed={analysisStatus === 'pdf_failed'} />}
          <p role="status" className={styles.note}>{analysisStatus === 'completed' ? '診断結果の準備ができました。LINEで番号を送ってください。' : analysisStatus === 'pdf_failed' ? '診断の概要は、下のリンクから確認できます。' : analysisStatus === 'processing' ? 'AIが写真を確認しています。' : analysisStatus === 'error' ? '診断は無料でやり直せます。' : '診断の準備状況を確認しています。'}</p>
          {sessionId && <Link href={`/result/${sessionId}`} className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">診断状況・結果を見る</Link>}
          <details className={styles.help}>
            <summary>結果が届かないとき</summary>
            <p>「生成中」と届いたら、少し待ってから番号をもう一度送ってください。合言葉は受付から24時間有効です。レポートはLINEで受け取れます。</p>
          </details>
        </main>
      </div>
    );
  }

  // ============================================================
  // アップロード中の画面
  // ============================================================
  if (step === 'uploading') {
    return (
      <div className="diagnosis-refresh min-h-screen">
        <PageHeader />
        <main className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center p-8" role="status">
          <div className="relative mx-auto mb-6" style={{ width: 80, height: 80 }}>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-100"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-accent-dark border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-lg font-bold text-primary mb-2">{uploadProgress}</p>
          <p className="text-sm text-slate-500">しばらくお待ちください</p>
        </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // フォーム画面
  // ============================================================
  return (
    <div className="diagnosis-refresh min-h-screen">
      <PageHeader />
      <main className={`container max-w-xl ${styles.main}`}>
        <div className={styles.intro}>
          <h1 className={styles.heading}>雨漏りの不安を、<br />写真で相談。</h1>
          <p className={styles.description}>写真1枚から。<br className="sm:hidden" />結果はLINEで受け取れます。</p>
          <div className={styles.badges}>
            <span><Check size={14} aria-hidden="true" /> 診断0円</span>
            <span><Check size={14} aria-hidden="true" /> 名前入力不要</span>
          </div>
        </div>

        {error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} onFocus={handleFirstInteraction} onChangeCapture={handleFirstInteraction} className={`form-panel ${styles.form}`}>
          <ImageUpload maxImages={3} images={images} onImagesChange={setImages} onBusyChange={setIsProcessingImages} />
          <button
            type="submit"
            disabled={images.length < 1 || isProcessingImages}
            className={styles.submit}
          >
            <span>{isProcessingImages ? '写真を準備しています…' : images.length > 0 ? 'この写真で無料診断を頼む' : '写真を選ぶと診断できます'}</span>
            {images.length > 0 && !isProcessingImages && <ArrowRight size={19} aria-hidden="true" />}
          </button>
          <p role={isProcessingImages ? 'status' : undefined} className={styles.delivery}>
            {isProcessingImages ? '準備ができるまで、そのままお待ちください。' : '診断は無料。結果はLINEでお届けします。'}
          </p>
          <details className={styles.optional} onInvalid={(event) => { event.currentTarget.open = true; }}>
            <summary>状況・連絡先も伝える<span>任意</span></summary>
            <div className="space-y-6 pt-5">
                {/* ① 雨漏りの状況（任意） */}
                <div>
                  <label htmlFor="leak-situation" className="block text-sm font-medium text-slate-700 mb-2">
                    気になっている症状・状況（任意）
                  </label>
                  <textarea
                    id="leak-situation"
                    value={leakSituation}
                    onChange={(e) => setLeakSituation(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control"
                    placeholder="例：先週の大雨のあと、2階の天井にシミが出てきた"
                  />
                </div>

                {/* ③ 物件所在地（都道府県・任意）＋関西分岐 */}
                <div>
                  <label htmlFor="prefecture" className="block text-sm font-medium text-slate-700 mb-2">
                    物件の所在地（都道府県・任意）
                  </label>
                  <select
                    id="prefecture"
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control bg-white"
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {prefecture && (
                    isKansai ? (
                      <p className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        {prefecture}は現地点検の対応エリアです。一次判定のあと、ご希望に応じて現地点検をご案内します。
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-primary bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-2">
                        関西エリア外のため、まずは写真からのオンライン一次判定で対応します（現地点検は対象外の場合があります）。
                      </p>
                    )
                  )}
                </div>

                {/* ④ 他社見積の有無（「高い気がする」→ third-place 導線） */}
                <div>
                  <p id="has-quote-label" className="block text-sm font-medium text-slate-700 mb-2">
                    他社の見積もりはありますか？（任意）
                  </p>
                  <div role="radiogroup" aria-labelledby="has-quote-label" className="space-y-2">
                    {[
                      { value: '高い気がする', label: '見積もりがある（高い気がする）' },
                      { value: '適正か不明', label: '見積もりがある（適正か分からない）' },
                      { value: 'ない', label: 'まだ見積もりはない' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 px-4 py-3 border border-cyan-200 rounded-lg cursor-pointer hover:bg-cyan-50 bg-white/80 transition-colors">
                        <input
                          type="radio"
                          name="hasQuote"
                          value={opt.value}
                          checked={hasQuote === opt.value}
                          onChange={(e) => setHasQuote(e.target.value)}
                          className="h-4 w-4 shrink-0 text-accent-dark"
                        />
                        <span className="text-sm text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {hasQuote === '高い気がする' && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                      <p className="font-bold mb-1">見積もりが適正か、先に確認できます</p>
                      <p className="mb-3">他社の見積書を一次チェックし、必要工事と任意工事の分け方などを整理できます。当社施工を前提としない確認です。</p>
                      <a
                        href={THIRD_PLACE_QUOTE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                      >
                        見積もりチェックを見る
                      </a>
                    </div>
                  )}
                </div>

                {/* ⑤ 希望 */}
                <div>
                  <p id="request-type-label" className="block text-sm font-medium text-slate-700 mb-2">
                    ご希望（任意）
                  </p>
                  <div role="radiogroup" aria-labelledby="request-type-label" className="space-y-2">
                    {[
                      { value: '無料一次判定', label: 'まずは無料の一次判定だけ' },
                      { value: '現地点検', label: '現地点検を希望（関西エリア）' },
                      { value: '見積確認', label: '他社見積の確認をしたい' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 px-4 py-3 border border-cyan-200 rounded-lg cursor-pointer hover:bg-cyan-50 bg-white/80 transition-colors">
                        <input
                          type="radio"
                          name="requestType"
                          value={opt.value}
                          checked={requestType === opt.value}
                          onChange={(e) => setRequestType(e.target.value)}
                          className="h-4 w-4 shrink-0 text-accent-dark"
                        />
                        <span className="text-sm text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ⑥ 連絡先（任意・匿名可） */}
                <div className="border-t border-cyan-100 pt-6">
                  <p className="text-sm font-medium text-slate-700 mb-1">連絡先（任意・匿名でもOK）</p>
                  <p className="text-xs text-slate-500 mb-4">
                    結果はこのあと表示する4桁の合言葉でLINEから受け取れます。連絡先の入力は任意です。
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="customer-name" className="block text-sm text-slate-700 mb-2">お名前（任意）</label>
                      <input
                        id="customer-name"
                        autoComplete="name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control"
                        placeholder="お名前（任意）"
                      />
                    </div>
                    <div>
                      <label htmlFor="customer-phone" className="block text-sm text-slate-700 mb-2">電話番号（任意）</label>
                      <input
                        id="customer-phone"
                        autoComplete="tel"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control"
                        placeholder="電話番号（任意）"
                      />
                    </div>
                    <div>
                      <label htmlFor="customer-email" className="block text-sm text-slate-700 mb-2">メールアドレス（任意）</label>
                      <input
                        id="customer-email"
                        autoComplete="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control"
                        placeholder="メールアドレス（任意）"
                      />
                    </div>
                    <div>
                      <label htmlFor="building-age" className="block text-sm text-slate-700 mb-2">築年数（任意）</label>
                      <select
                        id="building-age"
                        value={customerBuildingAge}
                        onChange={(e) => setCustomerBuildingAge(e.target.value)}
                        className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control bg-white"
                      >
                        <option value="">築年数（任意）</option>
                        <option value="5年未満">5年未満</option>
                        <option value="5〜10年">5〜10年</option>
                        <option value="10〜20年">10〜20年</option>
                        <option value="20〜30年">20〜30年</option>
                        <option value="30年以上">30年以上</option>
                        <option value="不明">不明</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="customer-address" className="block text-sm text-slate-700 mb-2">住所（任意・現地点検をご希望の場合）</label>
                      <input
                        id="customer-address"
                        autoComplete="street-address"
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-cyan-200 rounded-lg field-control"
                        placeholder="住所（任意・現地点検をご希望の場合）"
                      />
                    </div>
                  </div>
                </div>


            </div>
            <button type="submit" disabled={images.length < 1 || isProcessingImages} className={styles.submit}>
              {isProcessingImages ? '写真を準備しています…' : 'この内容で無料診断を頼む'}
            </button>
          </details>
        </form>

        <p className={styles.note}>写真からの一次判定です。原因の確定には現地確認が必要です。</p>
        <div className={styles.policyLinks}>
          <Link href="/privacy">プライバシー</Link>
          <Link href="/terms">利用規約</Link>
        </div>
      </main>
    </div>
  );
}
