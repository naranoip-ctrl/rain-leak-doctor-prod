import Link from 'next/link';
import styles from './BrandMark.module.css';

/** Shared public-site identity. Kept compact so navigation fits on narrow screens. */
export function BrandMark() {
  return (
    <Link href="/" aria-label="雨漏りドクター トップページ" className={styles.brand}>
      <svg className={styles.symbol} width="34" height="38" viewBox="0 0 36 40" fill="none" aria-hidden="true">
        <path d="M3 15 18 3 33 15M7 16v20h22V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 15c-1.4 2.3-5 6.3-5 9.2a5 5 0 0 0 10 0c0-2.9-3.6-6.9-5-9.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M16 25a2.3 2.3 0 0 0 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className={styles.wordmark}>
        <strong className={styles.name}>雨漏りドクター</strong>
        <small className={styles.english} aria-hidden="true">AMAMORI DOCTOR</small>
      </span>
    </Link>
  );
}
