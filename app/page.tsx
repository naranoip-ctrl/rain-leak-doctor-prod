import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { HomeFaq } from '@/components/HomeFaq';
import { JsonLd } from '@/components/JsonLd';
import { getAllPosts } from '@/lib/blog';
import { homeFaqs } from '@/lib/home-faq';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, organization, photoDiagnosisService, onsiteDiagnosisService, website } from '@/lib/site';

const title = 'AI雨漏りドクター | 写真で雨漏りの危険度と次の一手を整理';
const description = '写真1枚から無料・匿名で雨漏りの一次判定。危険度や費用の目安を整理し、結果はLINEで受け取れます。原因の断定には現地確認が必要です。現地対応は大阪・関西エリア。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: SITE_URL, siteName: SITE_NAME, locale: 'ja_JP', type: 'website', images: [DEFAULT_OG_IMAGE] },
  twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3).map(({ slug, title, date }) => ({ slug, title, date }));
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [organization, website, photoDiagnosisService, onsiteDiagnosisService, {
          '@type': 'FAQPage',
          '@id': `${SITE_URL}/#faq`,
          url: `${SITE_URL}/#faq`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: homeFaqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        }],
      }} />
      <HomePage latestPosts={latestPosts} faq={<HomeFaq />} />
    </>
  );
}
