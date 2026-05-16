// PDF生成の独立テスト用スクリプト
// node scripts/test-pdf.mjs で実行
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const start = performance.now();

// generator.ts は TS なのでビルド済みではない。
// ここでは TS を直接実行できないので、generator のロジックを
// 最小再現してフォント取得と PDF 生成を試す。
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const FONT_REG = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bizudpgothic/BIZUDPGothic-Regular.ttf';
const FONT_BOLD = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bizudpgothic/BIZUDPGothic-Bold.ttf';

async function timed(label, fn) {
  const t0 = performance.now();
  const r = await fn();
  console.log(`[${label}] ${(performance.now() - t0).toFixed(0)} ms`);
  return r;
}

try {
  console.log('Node:', process.version);
  console.log('PDF生成テスト開始...');

  const [regularBuf, boldBuf] = await timed('fonts download (regular + bold parallel)', async () => {
    const [r, b] = await Promise.all([fetch(FONT_REG), fetch(FONT_BOLD)]);
    if (!r.ok) throw new Error(`regular HTTP ${r.status}`);
    if (!b.ok) throw new Error(`bold HTTP ${b.status}`);
    return Promise.all([r.arrayBuffer(), b.arrayBuffer()]);
  });

  console.log(`  Regular: ${(regularBuf.byteLength / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Bold:    ${(boldBuf.byteLength / 1024 / 1024).toFixed(2)} MB`);

  let jpFont, jpBold;
  const pdf = await timed('PDFDocument.create + embedFont', async () => {
    const d = await PDFDocument.create();
    d.registerFontkit(fontkit);
    jpFont = await d.embedFont(regularBuf);
    jpBold = await d.embedFont(boldBuf);
    return d;
  });

  await timed('add page + draw', async () => {
    const page = pdf.addPage([595, 842]);
    page.drawText('テスト：日本語が描画できるか', { x: 50, y: 800, size: 14, font: jpFont, color: rgb(0, 0, 0) });
    page.drawText('Bold: 太字テスト', { x: 50, y: 770, size: 14, font: jpBold, color: rgb(0, 0, 0) });
    // 実レポートで使われそうな文字を一通り入れて、subset でも崩れないか確認
    page.drawText('損傷箇所: 天井、外壁、屋根。重症度7/10。', { x: 50, y: 740, size: 11, font: jpFont, color: rgb(0, 0, 0) });
    page.drawText('応急処置目安: ¥50,000 〜 本復旧: ¥150,000〜¥300,000', { x: 50, y: 720, size: 11, font: jpFont, color: rgb(0, 0, 0) });
    page.drawText('火災保険申請の可能性: 高い（申請推奨）', { x: 50, y: 700, size: 11, font: jpFont, color: rgb(0, 0, 0) });
  });

  const bytes = await timed('save', () => pdf.save());
  writeFileSync('test-output.pdf', bytes);

  console.log(`Total: ${(performance.now() - start).toFixed(0)} ms`);
  console.log(`Output: test-output.pdf (${(bytes.length / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('FAILED:', e);
  process.exit(1);
}
