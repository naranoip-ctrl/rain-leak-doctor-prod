// 本物の generatePDF を呼び出して動作確認するテスト
// node --experimental-strip-types scripts/test-real-pdf.mjs
// もしくは Node 24+ なら --experimental-strip-types がデフォルト
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const sample = {
  customerName: '山田 太郎',
  diagnosisId: 'test-' + Date.now(),
  damageLocations: '天井、外壁',
  damageDescription: '天井に水染みが見られ、外壁にも複数のクラックを確認。早期修繕を推奨します。',
  severityScore: 7,
  estimatedCostMin: 150000,
  estimatedCostMax: 300000,
  firstAidCost: 50000,
  insuranceLikelihood: 'high',
  recommendedPlan: '現地調査',
  imageUrls: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  ],
  detailedAnalysis: '築15〜20年の木造住宅。外壁・屋根に経年劣化が見られる。',
  estimatedCause: '・防水層の経年劣化\n・外壁クラックからの雨水浸入',
  repairComparison: '応急:コーキング3〜5万円/2年\n本復旧:屋根葺替15〜30万円/15年',
  neglectRisk: '半年後に構造材腐食の恐れ。1年後には費用が2〜3倍に増加。',
  insuranceTips: '風災が原因なら火災保険申請可。被害写真と修理見積書を準備。',
  imageFindings: '写真1:天井に直径30cmの水染み\n写真2:外壁に幅0.3mmのクラック\n写真3:屋根材の浮き',
};

const t0 = performance.now();
const { generatePDF } = await import('../lib/pdf/generator.ts');
console.log(`import: ${(performance.now() - t0).toFixed(0)} ms`);

const t1 = performance.now();
const pdfBuffer = await generatePDF(sample);
console.log(`generatePDF: ${(performance.now() - t1).toFixed(0)} ms`);
console.log(`PDF size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
writeFileSync('test-real-output.pdf', pdfBuffer);
console.log('Wrote test-real-output.pdf');

// 2回目を呼んで、キャッシュが効いているか確認
const t2 = performance.now();
const pdfBuffer2 = await generatePDF(sample);
console.log(`generatePDF (2nd, should be faster): ${(performance.now() - t2).toFixed(0)} ms`);
console.log(`PDF size (2nd): ${(pdfBuffer2.length / 1024).toFixed(1)} KB`);
