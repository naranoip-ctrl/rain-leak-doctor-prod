import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '診断状況・結果 | AI雨漏りドクター',
  description: 'お送りいただいた写真の診断状況と結果を確認できます。',
  robots: { index: false, follow: false },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
