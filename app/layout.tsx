import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI雨漏りドクター | 写真で雨漏りの危険度と次の一手を整理',
  description: '関西エリア対応。写真からAIと職人目線で雨漏りの危険度を一次判定し、次の一手（現地確認の要否・費用の目安）を整理します。原因の断定には現地確認が必要です。',
  keywords: '雨漏り,雨漏り診断,一次判定,関西,大阪,京都,兵庫,サーモグラフィ,屋根修理',
  openGraph: {
    title: 'AI雨漏りドクター | 写真で雨漏りの危険度と次の一手を整理',
    description: '写真からAIと職人目線で雨漏りの危険度を一次判定。原因の断定には現地確認が必要です。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProd = process.env.VERCEL_ENV === 'production';

  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        {isProd && (
          <>
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wnu3wz8k1n");`}
            </Script>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1653968809192362');
              fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1653968809192362&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
      {isProd && <GoogleAnalytics gaId="G-W1EK1ERQJW" />}
    </html>
  );
}
