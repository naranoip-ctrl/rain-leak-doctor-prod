import Link from 'next/link';

export function Footer() {
  return (
    <footer className="public-footer bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white/60">
          © 2024 雨漏りドクター. All rights reserved.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/privacy" className="text-white/60 hover:text-white">
            プライバシーポリシー
          </Link>
          <Link href="/terms" className="text-white/60 hover:text-white">
            特定商取引法に基づく表記
          </Link>
        </div>
      </div>
    </footer>
  );
}
