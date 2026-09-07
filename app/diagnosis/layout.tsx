import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, organization, photoDiagnosisService } from '@/lib/site';

const title = '写真で無料の雨漏り診断を頼む | AI雨漏りドクター';
const description = '雨漏りが気になる写真を1枚から送れます。名前・連絡先の入力は任意。AIによる一次判定の結果をLINEで受け取り、必要に応じて現地確認をご相談いただけます。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/diagnosis' },
  openGraph: { title, description, url: `${SITE_URL}/diagnosis`, siteName: SITE_NAME, locale: 'ja_JP', type: 'website', images: [DEFAULT_OG_IMAGE] },
  twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function DiagnosisLayout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={{ '@context': 'https://schema.org', '@graph': [organization, photoDiagnosisService] }} />{children}</>;
}
