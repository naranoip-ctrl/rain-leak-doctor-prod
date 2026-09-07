export const SITE_URL = 'https://aiamamori.com';
export const SITE_NAME = 'AI雨漏りドクター';
export const COMPANY_URL = 'https://loki-drone.com/';
export const ORGANIZATION_ID = `${COMPANY_URL}#organization`;
export const COMPANY_PROFILE_URL = `${COMPANY_URL}company/`;
// 法人の既存Googleビジネスプロフィールで観測した所在地リンク（2026-09-07）。
export const GOOGLE_MAPS_URL = encodeURI('https://www.google.com/maps/place/株式会社ドローン工務店/data=!4m2!3m1!1s0x0:0x51a2bca6de56901c');
// 会社情報は法人公式の会社概要と共有記録を照合。雨漏りサービスの別拠点は作らない。
export const BUSINESS_INFO = {
  name: '株式会社ドローン工務店',
  representative: '坂井 友哉',
  postalCode: '535-0031',
  addressRegion: '大阪府',
  addressLocality: '大阪市旭区',
  streetAddress: '高殿2-12-6',
  address: '大阪府大阪市旭区高殿2-12-6',
  telephone: '06-6927-1065',
  consultationTelephone: '0120-410-654',
  license: '大阪府知事許可（般-6）161998号',
  access: '大阪メトロ谷町線「関目高殿駅」より徒歩圏内',
  businessHours: '平日 9:00〜18:00',
} as const;
export const PRIMARY_CITIES = ['大阪市', '守口市', '門真市', '東大阪市', '吹田市', '豊中市'] as const;
export const ONSITE_AREAS = ['大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県'] as const;
export const DEFAULT_OG_IMAGE = {
  url: '/images/case2.jpg',
  width: 1376,
  height: 768,
  alt: 'AI雨漏りドクター',
};

export const organization = {
  '@type': 'HomeAndConstructionBusiness',
  '@id': ORGANIZATION_ID,
  name: BUSINESS_INFO.name,
  url: COMPANY_URL,
  logo: `${SITE_URL}/images/droco-icon.jpg`,
  telephone: '+81-6-6927-1065',
  hasMap: GOOGLE_MAPS_URL,
  // 2026-09-07に会長が通常営業時間・主力エリアを確認。現地診断の対応府県とは区別。
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00', closes: '18:00',
  }],
  areaServed: PRIMARY_CITIES.map((name) => ({ '@type': 'City', name })),
  address: {
    '@type': 'PostalAddress',
    postalCode: BUSINESS_INFO.postalCode,
    addressCountry: 'JP',
    addressRegion: BUSINESS_INFO.addressRegion,
    addressLocality: BUSINESS_INFO.addressLocality,
    streetAddress: BUSINESS_INFO.streetAddress,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: '雨漏りの相談',
    telephone: BUSINESS_INFO.consultationTelephone,
    availableLanguage: 'ja',
    url: `${SITE_URL}/company`,
  },
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'ja',
  publisher: { '@id': ORGANIZATION_ID },
};

export const photoDiagnosisService = {
  '@type': 'Service',
  '@id': `${SITE_URL}/#photo-diagnosis`,
  name: 'AI雨漏り写真診断',
  serviceType: '写真による雨漏りの一次判定',
  description: '写真1枚から危険度の目安・費用レンジ・確認すべき点を整理します。原因の断定には現地確認が必要です。',
  url: `${SITE_URL}/diagnosis`,
  provider: { '@id': ORGANIZATION_ID },
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
};

export const onsiteDiagnosisService = {
  '@type': 'Service',
  '@id': `${SITE_URL}/#onsite-diagnosis`,
  name: '雨漏りの現地診断',
  serviceType: '雨漏りの現地診断',
  url: `${SITE_URL}/#pricing`,
  provider: { '@id': ORGANIZATION_ID },
  areaServed: ONSITE_AREAS.map((name) => ({ '@type': 'AdministrativeArea', name })),
};
