import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, PDFName, PDFString, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

interface PDFData {
  customerName: string;
  diagnosisId: string;
  damageLocations: string;
  damageDescription: string;
  severityScore: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  firstAidCost: number;
  insuranceLikelihood: string;
  recommendedPlan: string;
  imageUrls: string[];
  // PDF専用フィールド
  detailedAnalysis?: string;
  estimatedCause?: string;
  repairComparison?: string;
  neglectRisk?: string;
  insuranceTips?: string;
  imageFindings?: string;
}

// IBM Plex Sans JP（静的TTF・SIL OFL 1.1）。
// 本文には Medium を使い（Regular は線が細すぎて可読性が低いため）、強調には Bold を使う。
// フォントはリポジトリ同梱の lib/pdf/fonts/ を第一候補に読み、読めない場合だけ CDN から取得する。
// （外部CDNへの依存が PDF 生成失敗の単一障害点になっていたため。next.config.js の
//   outputFileTracingIncludes で同梱ファイルをサーバーレス関数に含めている。）
const FONT_DIR = path.join(process.cwd(), 'lib', 'pdf', 'fonts');
const FONT_FILE_REGULAR = 'IBMPlexSansJP-Medium.ttf';
const FONT_FILE_BOLD = 'IBMPlexSansJP-Bold.ttf';
const FONT_CDN_BASE = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/ibmplexsansjp/';
const FONT_FETCH_TIMEOUT_MS = 25_000;

let cachedRegularFont: ArrayBuffer | null = null;
let cachedBoldFont: ArrayBuffer | null = null;

async function fetchFontWithTimeout(url: string, label: string): Promise<ArrayBuffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FONT_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to load ${label} font: HTTP ${response.status}`);
    }
    return await response.arrayBuffer();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Font fetch timed out after ${FONT_FETCH_TIMEOUT_MS}ms (${label})`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function loadFont(fileName: string, label: string): Promise<ArrayBuffer> {
  const localPath = path.join(FONT_DIR, fileName);
  try {
    const bytes = await readFile(localPath);
    if (bytes.byteLength < 100_000) {
      throw new Error(`local font too small (${bytes.byteLength} bytes)`);
    }
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  } catch (localErr) {
    const reason = localErr instanceof Error ? localErr.message : String(localErr);
    console.warn(`[PDF font] local ${label} unavailable (${reason}); falling back to CDN`);
    return fetchFontWithTimeout(FONT_CDN_BASE + fileName, label);
  }
}

async function loadJapaneseFont(): Promise<ArrayBuffer> {
  if (cachedRegularFont) return cachedRegularFont;
  cachedRegularFont = await loadFont(FONT_FILE_REGULAR, 'Regular');
  return cachedRegularFont;
}

async function loadJapaneseBoldFont(): Promise<ArrayBuffer> {
  if (cachedBoldFont) return cachedBoldFont;
  cachedBoldFont = await loadFont(FONT_FILE_BOLD, 'Bold');
  return cachedBoldFont;
}

/** Wrap Japanese, multiline text and unbroken IDs without truncating them. */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of String(text ?? '').replace(/\r\n?/g, '\n').split('\n')) {
    if (!paragraph) {
      lines.push('');
      continue;
    }
    let line = '';
    for (const character of paragraph) {
      if (line && font.widthOfTextAtSize(line + character, fontSize) > maxWidth) {
        lines.push(line);
        line = character;
      } else {
        line += character;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

const COLORS = {
  primary: rgb(0.141, 0.282, 0.247),
  green: rgb(0.208, 0.388, 0.310),
  ink: rgb(0.180, 0.239, 0.208),
  muted: rgb(0.349, 0.412, 0.373),
  line: rgb(0.812, 0.847, 0.800),
  paper: rgb(0.984, 0.976, 0.949),
  softGreen: rgb(0.914, 0.937, 0.890),
  white: rgb(1, 1, 1),
  warning: rgb(0.565, 0.365, 0.157),
  danger: rgb(0.671, 0.247, 0.204),
};

function getSeverityColor(score: number): RGB {
  if (score <= 3) return COLORS.green;
  if (score <= 6) return COLORS.warning;
  return COLORS.danger;
}

function getSeverityLabel(score: number): string {
  if (score <= 2) return '軽微';
  if (score <= 4) return '要観察';
  if (score <= 6) return '要修繕';
  if (score <= 8) return '重度';
  return '緊急';
}

function getInsuranceLabel(likelihood: string): string {
  switch (likelihood) {
    case 'high': return '高い（申請推奨）';
    case 'medium': return '中程度（要確認）';
    case 'low': return '低い';
    default: return '該当なし';
  }
}

/**
 * A5 portrait keeps the body readable when the report is opened from LINE.
 * Normal reports use about three pages. Long input flows onto additional pages;
 * it is never shortened or painted over the footer to meet a page-count target.
 */
export async function generatePDF(data: PDFData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const [fontBytes, boldFontBytes] = await Promise.all([
    loadJapaneseFont(),
    loadJapaneseBoldFont(),
  ]);
  // Keep the existing Japanese fonts and full embedding behavior.
  const font = await pdfDoc.embedFont(fontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  const pageWidth = 419.53;
  const pageHeight = 595.28;
  const margin = 28;
  const contentWidth = pageWidth - margin * 2;
  const contentBottom = 72;
  const continuationTop = pageHeight - 74;
  const pageCapacity = continuationTop - contentBottom;
  const isNotApplicable = data.insuranceLikelihood === 'none';
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  let page: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = 0;

  function newPage(first = false) {
    if (!first) page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: COLORS.paper });
    page.drawRectangle({ x: 0, y: pageHeight - 5, width: pageWidth, height: 5, color: COLORS.primary });
    page.drawText(first ? 'AI雨漏り診断レポート' : 'AI雨漏り診断レポート ─ 詳細', {
      x: margin, y: pageHeight - (first ? 47 : 36), size: first ? 21 : 13,
      font: boldFont, color: COLORS.primary,
    });
    if (first) {
      page.drawText('株式会社ドローン工務店 ─ 雨漏りドクター', {
        x: margin, y: pageHeight - 66, size: 9, font, color: COLORS.muted,
      });
    }
    const ruleY = pageHeight - (first ? 80 : 54);
    page.drawLine({ start: { x: margin, y: ruleY }, end: { x: pageWidth - margin, y: ruleY }, thickness: 0.7, color: COLORS.line });
    y = first ? pageHeight - 97 : continuationTop;
  }

  function ensureSpace(height: number, continuationTitle?: string) {
    if (y - Math.min(height, pageCapacity) >= contentBottom) return;
    newPage();
    if (continuationTitle) heading(continuationTitle);
  }

  function heading(title: string) {
    ensureSpace(55);
    page.drawRectangle({ x: margin, y: y - 17, width: 3, height: 17, color: COLORS.green });
    page.drawText(title, { x: margin + 11, y: y - 14, size: 14, font: boldFont, color: COLORS.primary });
    y -= 29;
  }

  function paragraph(text: string, options: {
    size?: number; leading?: number; bold?: boolean; color?: RGB; continuationTitle?: string;
  } = {}) {
    const size = options.size ?? 11.5;
    const leading = options.leading ?? 18;
    const face = options.bold ? boldFont : font;
    const lines = wrapText(text, face, size, contentWidth);
    for (const line of lines) {
      const advance = line ? leading : leading * 0.55;
      ensureSpace(advance, options.continuationTitle);
      if (line) page.drawText(line, { x: margin, y: y - size, size, font: face, color: options.color ?? COLORS.ink });
      y -= advance;
    }
  }

  function section(title: string, text: string, notice?: string) {
    const textHeight = wrapText(text, font, 11.5, contentWidth).length * 18;
    const noticeHeight = notice ? wrapText(notice, boldFont, 10.5, contentWidth).length * 16 + 8 : 0;
    // Keep short sections together; longer explanations use the remaining page.
    const required = 29 + textHeight + noticeHeight + 15;
    ensureSpace(required <= pageCapacity / 2 ? required : 65);
    heading(title);
    if (notice) {
      paragraph(notice, { size: 10.5, leading: 16, bold: true, color: COLORS.warning, continuationTitle: title });
      y -= 8;
    }
    paragraph(text, { continuationTitle: title });
    y -= 15;
  }

  function recommendation() {
    const text = `推奨プラン: ${data.recommendedPlan}`;
    const lines = wrapText(text, boldFont, 12, contentWidth - 24);
    let offset = 0;
    while (offset < lines.length) {
      ensureSpace(43);
      const fit = Math.max(1, Math.floor((y - contentBottom - 22) / 18));
      const chunk = lines.slice(offset, offset + fit);
      const height = chunk.length * 18 + 22;
      page.drawRectangle({ x: margin, y: y - height, width: contentWidth, height, color: COLORS.softGreen });
      chunk.forEach((line, index) => page.drawText(line, { x: margin + 12, y: y - 12 - 12 - index * 18, size: 12, font: boldFont, color: COLORS.primary }));
      y -= height + 18;
      offset += chunk.length;
    }
  }

  newPage(true);

  // Each identifier occupies its own line, so a full UUID never overlaps the date.
  paragraph(`${data.customerName} 様`, { size: 12, leading: 18, bold: true, color: COLORS.primary });
  y -= 4;
  paragraph(`発行日: ${today}`, { size: 9.5, leading: 15, color: COLORS.muted });
  paragraph(`診断ID: ${data.diagnosisId}`, { size: 9, leading: 14, color: COLORS.muted });
  y -= 17;

  // Severity and the cost table form one summary rather than a series of cards.
  const scoreWidth = 101;
  const tableX = margin + scoreWidth + 18;
  const tableWidth = contentWidth - scoreWidth - 18;
  const costRows = isNotApplicable ? [
    { text: '建物の損傷は確認されませんでした。', size: 11, leading: 17, bold: false },
    { text: '定期的な点検をおすすめします。', size: 10.5, leading: 16, bold: false },
  ] : [
    { text: `応急処置: ¥${data.firstAidCost.toLocaleString()}〜`, size: 11, leading: 17, bold: false },
    { text: `本格修繕: ¥${data.estimatedCostMin.toLocaleString()} 〜 ¥${data.estimatedCostMax.toLocaleString()}`, size: 12, leading: 19, bold: true },
    { text: `火災保険: ${getInsuranceLabel(data.insuranceLikelihood)}`, size: 10.5, leading: 16, bold: false },
  ];
  const rows = costRows.map((row) => ({ ...row, lines: wrapText(row.text, row.bold ? boldFont : font, row.size, tableWidth) }));
  const metricsHeight = Math.max(119, 29 + rows.reduce((height, row) => height + row.lines.length * row.leading + 9, 0));
  ensureSpace(metricsHeight + 19);
  page.drawRectangle({ x: margin, y: y - metricsHeight, width: scoreWidth, height: metricsHeight, color: COLORS.softGreen });
  page.drawText('重症度', { x: margin + 12, y: y - 20, size: 10, font: boldFont, color: COLORS.primary });
  const severityText = String(data.severityScore);
  const severitySize = Math.min(40, 47 / Math.max(boldFont.widthOfTextAtSize(severityText, 1), 1));
  page.drawText(severityText, { x: margin + 12, y: y - 65, size: severitySize, font: boldFont, color: getSeverityColor(data.severityScore) });
  page.drawText('/ 10', { x: margin + 65, y: y - 59, size: 10, font, color: COLORS.muted });
  page.drawText(getSeverityLabel(data.severityScore), { x: margin + 12, y: y - 86, size: 11, font: boldFont, color: getSeverityColor(data.severityScore) });
  const gaugeWidth = scoreWidth - 24;
  page.drawRectangle({ x: margin + 12, y: y - 104, width: gaugeWidth, height: 4, color: COLORS.white });
  const fill = Math.max(0, Math.min(1, data.severityScore / 10));
  if (fill > 0) page.drawRectangle({ x: margin + 12, y: y - 104, width: gaugeWidth * fill, height: 4, color: getSeverityColor(data.severityScore) });
  page.drawText(isNotApplicable ? '診断結果' : '費用サマリー', { x: tableX, y: y - 12, size: 11, font: boldFont, color: COLORS.primary });
  let tableY = y - 30;
  rows.forEach((row, index) => {
    row.lines.forEach((line) => {
      page.drawText(line, { x: tableX, y: tableY - row.size, size: row.size, font: row.bold ? boldFont : font, color: row.bold ? COLORS.primary : COLORS.ink });
      tableY -= row.leading;
    });
    if (index < rows.length - 1) page.drawLine({ start: { x: tableX, y: tableY - 3 }, end: { x: pageWidth - margin, y: tableY - 3 }, thickness: 0.5, color: COLORS.line });
    tableY -= 9;
  });
  y -= metricsHeight + 20;

  if (!isNotApplicable) {
    heading('損傷概要');
    paragraph(`損傷箇所: ${data.damageLocations}`, { size: 10.5, leading: 17, bold: true, continuationTitle: '損傷概要' });
    y -= 6;
    paragraph(data.damageDescription, { size: 12, leading: 19, continuationTitle: '損傷概要' });
    y -= 13;
    recommendation();
  }

  // Give the submitted photos their own page at a useful size on a phone.
  const photoUrls = (data.imageUrls || []).slice(0, 3);
  if (photoUrls.length) {
    newPage();
    heading('診断写真');
    const columns = photoUrls.length === 1 ? 1 : 2;
    const gap = 12;
    const imageWidth = (contentWidth - gap * (columns - 1)) / columns;
    const imageHeight = columns === 1 ? 202 : 176;
    for (let row = 0; row < photoUrls.length; row += columns) {
      ensureSpace(imageHeight + 16, '診断写真');
      for (let column = 0; column < columns && row + column < photoUrls.length; column++) {
        const index = row + column;
        const x = margin + column * (imageWidth + gap);
        page.drawRectangle({ x, y: y - imageHeight, width: imageWidth, height: imageHeight, color: COLORS.white, borderColor: COLORS.line, borderWidth: 0.6 });
        try {
          const response = await fetch(photoUrls[index]);
          if (!response.ok) continue;
          const bytes = new Uint8Array(await response.arrayBuffer());
          // Detect the image data as well as supporting URL/data-URI sources.
          const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
          const image = png ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
          const scaled = image.scaleToFit(imageWidth - 8, imageHeight - 8);
          page.drawImage(image, { x: x + (imageWidth - scaled.width) / 2, y: y - imageHeight + (imageHeight - scaled.height) / 2, width: scaled.width, height: scaled.height });
        } catch (error) {
          console.error(`Error loading image ${index}:`, error);
        }
      }
      y -= imageHeight + 16;
    }
  }

  const present = (value?: string) => !!value && value !== '該当なし';
  const evidencePageCount = pdfDoc.getPageCount();
  if (!isNotApplicable && present(data.imageFindings)) section('写真別所見', data.imageFindings!);
  if (!isNotApplicable && present(data.estimatedCause)) section('推定原因', data.estimatedCause!);

  // Start the remaining details on a fresh page only while still on the evidence
  // page. If long findings or causes already flowed onward, continue there.
  const hasFurtherDetails = !isNotApplicable && [data.repairComparison, data.neglectRisk, data.insuranceTips, data.detailedAnalysis].some(present);
  if (hasFurtherDetails && pdfDoc.getPageCount() === evidencePageCount) newPage();
  if (!isNotApplicable && present(data.repairComparison)) section('修繕工法の比較', data.repairComparison!);
  if (!isNotApplicable && present(data.neglectRisk)) {
    section('放置した場合のリスク', data.neglectRisk!, '修繕を先延ばしにすると、被害が拡大し費用が増加します');
  }
  if (!isNotApplicable && present(data.insuranceTips)) {
    section('火災保険申請のポイント', data.insuranceTips!, '風災・雪災・雹災による被害は火災保険が適用できる場合があります');
  }
  if (!isNotApplicable && present(data.detailedAnalysis)) section('建物の状態評価', data.detailedAnalysis!);

  const ctaLines = [
    { text: '現地診断のご相談はLINEから', size: 12.5, leading: 20, bold: true },
    { text: '現地診断（報告書付き）55,000円（税込）', size: 11, leading: 19, bold: false },
    { text: 'LINE: https://lin.ee/LTMUhxy', size: 11, leading: 19, bold: false },
    { text: 'お電話でもお気軽にご相談ください', size: 10, leading: 17, bold: false },
  ].map((run) => ({ ...run, lines: wrapText(run.text, run.bold ? boldFont : font, run.size, contentWidth - 28) }));
  const ctaHeight = 26 + ctaLines.reduce((height, run) => height + run.lines.length * run.leading, 0);
  ensureSpace(ctaHeight + 12);
  y -= 5;
  page.drawRectangle({ x: margin, y: y - ctaHeight, width: contentWidth, height: ctaHeight, color: COLORS.primary });
  let ctaY = y - 13;
  ctaLines.forEach((run) => run.lines.forEach((line) => {
    page.drawText(line, { x: margin + 14, y: ctaY - run.size, size: run.size, font: run.bold ? boldFont : font, color: COLORS.white });
    ctaY -= run.leading;
  }));
  const lineLink = pdfDoc.context.register(pdfDoc.context.obj({
    Type: PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: [margin, y - ctaHeight, pageWidth - margin, y],
    Border: [0, 0, 0],
    A: { S: PDFName.of('URI'), URI: PDFString.of('https://lin.ee/LTMUhxy') },
  }));
  page.node.addAnnot(lineLink);

  const pages = pdfDoc.getPages();
  pages.forEach((reportPage, index) => {
    reportPage.drawLine({ start: { x: margin, y: 60 }, end: { x: pageWidth - margin, y: 60 }, thickness: 0.6, color: COLORS.line });
    reportPage.drawText('株式会社ドローン工務店 ─ 雨漏りドクター', { x: margin, y: 44, size: 7.5, font, color: COLORS.muted });
    const pageNumber = `${index + 1} / ${pages.length}`;
    reportPage.drawText(pageNumber, { x: pageWidth - margin - font.widthOfTextAtSize(pageNumber, 8), y: 44, size: 8, font, color: COLORS.muted });
    if (index === pages.length - 1) {
      const disclaimer = '※本レポートはAIによる画像分析に基づく参考情報です。正確な診断には現地調査が必要です。';
      wrapText(disclaimer, font, 7.5, contentWidth).forEach((line, lineIndex) => {
        reportPage.drawText(line, { x: margin, y: 26 - lineIndex * 10, size: 7.5, font, color: COLORS.muted });
      });
    }
  });

  return Buffer.from(await pdfDoc.save());
}
