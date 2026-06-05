'use client';

/**
 * components/AttributionTracker.tsx
 * ランディング時に UTM / gclid 等の流入属性を sessionStorage へ捕捉する常駐コンポーネント。
 * app/layout.tsx の <body> 直下にマウントし、全ページの初回表示で1回だけ実行する。
 * UI を描画しない（return null）。本番・dev とも動作（保持のみで副作用なし）。
 */

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/analytics';

export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
