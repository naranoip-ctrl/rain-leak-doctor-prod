import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI雨漏りドクター | AI診断で雨漏り修理を最短57分・最安58,000円から',
  description: '関西エリア対応の雨漏り修理専門サービス。AI診断で原因を即座に特定し、火災保険適用で費用を最大限削減。最短57分・最安58,000円から修理可能。',
  keywords: '雨漏り修理,AI診断,火災保険適用,関西,大阪,京都,兵庫,サーモグラフィ,屋根修理',
  openGraph: {
    title: 'AI雨漏りドクター | AI診断で雨漏り修理を最短57分',
    description: '関西エリア対応の雨漏り修理専門サービス。AI診断で原因を即座に特定。',
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
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wnu3wz8k1n");`}
          </Script>
        )}
      </body>
      {isProd && <GoogleAnalytics gaId="G-W1EK1ERQJW" />}
    </html>
  );
}
