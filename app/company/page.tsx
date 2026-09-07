import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { JsonLd } from '@/components/JsonLd';
import { TrackedCallLink } from '@/components/TrackedCallLink';
import { BUSINESS_INFO, COMPANY_PROFILE_URL, DEFAULT_OG_IMAGE, GOOGLE_MAPS_URL, ONSITE_AREAS, ORGANIZATION_ID, PRIMARY_CITIES, SITE_NAME, SITE_URL, organization, onsiteDiagnosisService } from '@/lib/site';

const title = '運営会社・対応エリア | AI雨漏りドクター';
const description = 'AI雨漏りドクターは大阪市旭区の株式会社ドローン工務店が運営。会社所在地・電話窓口と、大阪・京都・兵庫・奈良・滋賀・和歌山での現地診断のご案内です。';

export const metadata: Metadata = {
  title, description, alternates: { canonical: '/company' },
  openGraph: { title, description, url: `${SITE_URL}/company`, siteName: SITE_NAME, locale: 'ja_JP', type: 'website', images: [DEFAULT_OG_IMAGE] },
  twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE.url] },
};

export default function CompanyPage() {
  return (
    <div className="legal-page min-h-screen bg-slate-50">
      <PageHeader />
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [organization, onsiteDiagnosisService, {
        '@type': 'AboutPage', '@id': `${SITE_URL}/company`, url: `${SITE_URL}/company`, name: title,
        about: { '@id': ORGANIZATION_ID }, inLanguage: 'ja',
      }, {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: '運営会社・対応エリア', item: `${SITE_URL}/company` },
        ],
      }] }} />
      <main className="container max-w-3xl py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">運営会社・対応エリア</h1>
        <p className="mt-5 text-slate-700 leading-relaxed">AI雨漏りドクターは、大阪市旭区の{BUSINESS_INFO.name}が運営する、雨漏りの写真診断・現地診断のサービスです。</p>

        <section aria-labelledby="company-info-heading" className="mt-8 bg-white border border-slate-200 rounded-lg p-5 md:p-8">
          <h2 id="company-info-heading" className="text-xl font-bold text-primary">運営会社</h2>
          <dl className="mt-5 grid gap-5 text-sm leading-relaxed">
            <div><dt className="font-medium text-slate-500">会社名</dt><dd className="mt-1">{BUSINESS_INFO.name}</dd></div>
            <div><dt className="font-medium text-slate-500">代表者</dt><dd className="mt-1">代表取締役 {BUSINESS_INFO.representative}</dd></div>
            <div><dt className="font-medium text-slate-500">所在地</dt><dd className="mt-1">〒{BUSINESS_INFO.postalCode}<br />{BUSINESS_INFO.address}</dd></div>
            <div><dt className="font-medium text-slate-500">通常営業時間</dt><dd className="mt-1">{BUSINESS_INFO.businessHours}</dd></div>
            <div><dt className="font-medium text-slate-500">雨漏り相談窓口</dt><dd><TrackedCallLink phone={BUSINESS_INFO.consultationTelephone} location="company_consultation" className="inline-flex min-h-11 items-center text-lg font-medium text-primary underline underline-offset-4">{BUSINESS_INFO.consultationTelephone}</TrackedCallLink></dd></div>
            <div><dt className="font-medium text-slate-500">会社代表電話</dt><dd><TrackedCallLink phone={BUSINESS_INFO.telephone} location="company_office" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{BUSINESS_INFO.telephone}</TrackedCallLink></dd></div>
            <div><dt className="font-medium text-slate-500">建設業許可</dt><dd className="mt-1">{BUSINESS_INFO.license}</dd></div>
          </dl>
          <div className="mt-6 pt-5 border-t border-slate-200">
            <h3 className="font-medium text-primary">アクセス</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{BUSINESS_INFO.access}</p>
            <a href={GOOGLE_MAPS_URL} className="flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Googleマップで所在地を見る</a>
            <a href={COMPANY_PROFILE_URL} className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">法人公式サイトの会社概要・アクセスを見る</a>
          </div>
        </section>

        <section aria-labelledby="service-area-heading" className="mt-8 bg-white border border-slate-200 rounded-lg p-5 md:p-8">
          <h2 id="service-area-heading" className="text-xl font-bold text-primary">現地診断の対応エリア</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">{ONSITE_AREAS.join('・')}</p>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">主な現場エリア：{PRIMARY_CITIES.join('・')}</p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">建物や場所に応じて対応内容をご相談いただけます。関西エリア外の方は、写真からのオンライン一次判定をご利用いただけます。</p>
          <Link href="/#pricing" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">現地診断の料金・条件を見る</Link>
        </section>
        <div className="mt-8 text-center">
          <Link href="/diagnosis" className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-5 py-3 text-white font-medium">写真から無料で相談する</Link>
          <p className="mt-3 text-xs text-slate-600">写真からの一次判定です。原因の断定には現地確認が必要です。</p>
        </div>
      </main>
    </div>
  );
}
