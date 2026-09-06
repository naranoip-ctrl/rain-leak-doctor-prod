import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import { TrackedLineLink } from '@/components/TrackedLineLink';

/**
 * ブログ配下（/blog, /blog/[slug]）共通のヘッダ／フッタ。
 * トップと同じトンマナ（primary/cta）で、雨漏り点検・12条点検・トップへ回遊させる。
 * サーバコンポーネント（SSG）。CTAのみ TrackedLineLink（client）を挿す。
 */
export function BlogHeader() {
  return (
    <header className="public-header sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="container flex min-h-[72px] items-center justify-between gap-3 py-3">
        <BrandMark />
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link href="/#services" className="hover:text-primary transition-colors">雨漏り点検</Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">料金</Link>
          <Link href="/blog" className="hover:text-primary transition-colors">お役立ち情報</Link>
        </nav>
        <TrackedLineLink
          location="blog_header"
          className="inline-flex shrink-0 items-center justify-center gap-0 whitespace-nowrap px-3 py-2 rounded-sm text-xs sm:text-sm font-medium bg-line text-white hover:bg-line-dark transition-colors"
        />
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="public-footer bg-primary-dark text-white mt-16">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold mb-3">雨漏りドクター</h3>
            <p className="text-sm text-white/80">
              大阪・関西で「診断力で選ばれる」雨漏り修理店。現地点検で原因を突き止め、必要な修理だけをご提案します。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-3">サービス</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/#services" className="hover:text-white transition-colors">雨漏り点検・修理</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">料金・点検の流れ</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">お役立ち情報</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-3">運営</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>株式会社ドローン工務店</li>
              <li>〒535-0031 大阪府大阪市旭区高殿2-12-6</li>
              <li>大阪府知事許可（般-6）161998号</li>
              <li><a href="https://loki-drone.com/company/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">会社概要</a></li>
            </ul>
            <ul className="space-y-2 text-sm text-white/80 mt-4 pt-4 border-t border-white/10">
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="/tokushoho" className="hover:text-white transition-colors">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-white/50 mt-8 pt-6 border-t border-white/10">
          &copy; {new Date().getFullYear()} 株式会社ドローン工務店. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
