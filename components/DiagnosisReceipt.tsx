'use client';

import { useState } from 'react';
import { ArrowRight, Check, Copy, MessageCircle } from 'lucide-react';
import { trackLineClick } from '@/lib/analytics';
import styles from '@/app/diagnosis/Diagnosis.module.css';

export function DiagnosisReceipt({ code, source, pdfFailed = false }: { code: string; source: string; pdfFailed?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className={styles.resultCard}>
      <p className={styles.stepLabel}>1. 合言葉をコピー</p>
      <p className={styles.secretCode}>{code}</p>
      <button type="button" onClick={copyCode} className={styles.copyButton}>
        {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'コピーしました' : '4桁の番号をコピー'}</span>
      </button>
      {copyError && <p role="status" className={styles.delivery}>コピーできませんでした。上の番号をLINEに入力してください。</p>}
      <div className={styles.lineStep}>
        <p className={styles.stepLabel}>2. LINEで番号を送る</p>
        <a href="https://lin.ee/LTMUhxy" target="_blank" rel="noopener noreferrer" onClick={() => trackLineClick(source)} className={styles.lineButton}>
          <MessageCircle size={21} aria-hidden="true" /> LINEを開く <ArrowRight size={18} aria-hidden="true" />
        </a>
        <p className={styles.delivery}>{pdfFailed ? 'PDFの準備を確認できません。番号を添えてLINEでご相談ください。' : '番号を送ると、準備できた診断レポートが届きます。'}</p>
      </div>
    </div>
  );
}
