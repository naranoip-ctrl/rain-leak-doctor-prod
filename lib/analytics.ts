/**
 * lib/analytics.ts
 * 計測ヘルパ（aiamamori Pass 2）
 *
 * 役割:
 *  - 6カスタムイベントを GA4 / Meta Pixel / dataLayer へ送出する単一窓口。
 *  - UTM / gclid 等の流入属性をランディングで捕捉し、フォーム送信まで保持。
 *
 * 配線前提:
 *  - GA(gtag) と Meta Pixel(fbq) は app/layout.tsx で本番(VERCEL_ENV==='production')のみ読み込まれる。
 *    そのため dev では gtag/fbq は存在しないが、本ヘルパは dataLayer への push と
 *    console 出力を常に行うため、dev でも発火を検証できる（DebugView 相当は本番）。
 *  - gclid は Google 広告の自動タグ付けを優先。本ヘルパの UTM 保持は
 *    auto-tagging 無効時のフォールバック兼、CRM へ属性を引き継ぐための保険。
 */

type Primitive = string | number | boolean | undefined | null;
export type EventParams = Record<string, Primitive>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ATTRIBUTION_KEY = 'aiamamori_attribution';

/** 保持する流入属性キー。utm_content の urgent/quote_check/old_property 3群もここで捕捉される。 */
const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
] as const;

export type Attribution = Partial<
  Record<(typeof ATTRIBUTION_FIELDS)[number], string>
> & {
  landing_page?: string;
  referrer?: string;
};

const isBrowser = (): boolean => typeof window !== 'undefined';
const isDev = process.env.NODE_ENV !== 'production';

/**
 * ランディング時に URL の UTM / gclid 等を捕捉し sessionStorage に first-touch 保持する。
 * 既に保持済みの値は上書きしない（最初の流入を保持）。layout 経由で全ページ初回に実行。
 */
export function captureAttribution(): void {
  if (!isBrowser()) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const current = getAttribution();
    const next: Attribution = { ...current };
    let changed = false;

    for (const field of ATTRIBUTION_FIELDS) {
      const value = params.get(field);
      if (value && !next[field]) {
        next[field] = value;
        changed = true;
      }
    }
    if (!next.landing_page) {
      next.landing_page = window.location.pathname;
      changed = true;
    }
    if (!next.referrer && document.referrer) {
      next.referrer = document.referrer;
      changed = true;
    }

    if (changed) {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    }
  } catch {
    // sessionStorage 不可（プライベートモード等）の場合は無視。計測の失敗で UX を壊さない。
  }
}

/** 保持済みの流入属性を取得する。 */
export function getAttribution(): Attribution {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** イベント送出の中核。dataLayer / gtag へ送り、dev では console に出す。 */
export function trackEvent(name: string, params: EventParams = {}): void {
  if (!isBrowser()) return;

  // 流入属性を全イベントに付与（イベント側 params が優先）。空値は落とす。
  const merged: EventParams = { ...getAttribution(), ...params };
  const clean: Record<string, Primitive> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== null && value !== '') {
      clean[key] = value;
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...clean });

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, clean);
  }

  if (isDev) {
    // dev 検証用（本番では出さない）。DebugView/console での発火確認に使う。
    // eslint-disable-next-line no-console
    console.log('[analytics]', name, clean);
  }
}

/** Meta Pixel への送出（fbq 未ロード時は何もしない）。 */
function trackPixel(event: string, params: EventParams = {}): void {
  if (!isBrowser() || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

// ───────────────────────── 6 カスタムイベント ─────────────────────────

/** 診断フォームの初回操作。セッション内で重複発火しないよう呼び出し側で1回に制御する。 */
export function trackFormStart(params: EventParams = {}): void {
  trackEvent('form_start', params);
}

/** 診断送信成功時。Pixel は Lead にマッピング。 */
export function trackFormSubmit(params: EventParams = {}): void {
  trackEvent('form_submit', params);
  trackPixel('Lead', params);
}

/** LINE リンククリック。location でどの導線かを識別する。 */
export function trackLineClick(location: string): void {
  trackEvent('line_click', { location });
  trackPixel('Contact', { location });
}

/** 電話(tel:)リンククリック。location でどの導線かを識別する。 */
export function trackCallClick(location: string): void {
  trackEvent('call_click', { location });
  trackPixel('Contact', { location });
}

/**
 * 現地点検希望の選択/送信。
 * 注意: 「希望（一次判定/現地点検/見積確認）」の選択フィールドは Pass 3 でフォームに新設する。
 * 本イベントはそのフィールド追加時に diagnosis フォームから発火させる（Pass 2 で窓口だけ用意）。
 */
export function trackInspectionRequest(params: EventParams = {}): void {
  trackEvent('inspection_request', params);
}

/** 有料レポート/現地プラン導線クリック。plan でどのプランかを識別する。 */
export function trackReportPurchaseClick(plan: string, params: EventParams = {}): void {
  trackEvent('report_purchase_click', { plan, ...params });
  trackPixel('InitiateCheckout', { plan, ...params });
}
