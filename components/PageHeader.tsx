import Link from 'next/link';
import { BrandMark } from './BrandMark';
import styles from './BrandMark.module.css';

export function PageHeader() {
  return (
    <header className="public-header sticky top-0 z-40 border-b border-slate-200">
      <div className="container flex min-h-[72px] items-center justify-between gap-3 py-3">
        <BrandMark />
        <Link href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m8 4-6 6 6 6M2 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          トップへ
        </Link>
      </div>
    </header>
  );
}
