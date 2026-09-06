'use client';

import { MessageCircle } from 'lucide-react';
import { trackLineClick } from '@/lib/analytics';

const LINE_URL = 'https://lin.ee/ioKJtwL';

/**
 * 計測付きLINE相談ボタン（サーバコンポーネントのブログ配下でも使えるよう分離）。
 * location で導線を識別（line_click イベント）。
 */
export function TrackedLineLink({
  location,
  className,
  label = 'LINEで相談',
}: {
  location: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLineClick(location)}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-1.5" />
      {label}
    </a>
  );
}
