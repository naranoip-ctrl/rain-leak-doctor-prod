'use client';

/**
 * ヒーロー用: AI診断の流れ(写真→スキャン→検出→結果)が自動再生されるデモ。
 * 動画ファイルを使わずCSSアニメーションで実装(軽量・シャープ・通信ゼロ)。
 * prefers-reduced-motion では静止した「診断完了」状態を表示する。
 */
export default function HeroDiagnosisDemo() {
  return (
    <div className="hd-root relative w-full max-w-[330px] md:max-w-[350px] mx-auto select-none" aria-label="AI診断のデモ: 写真を送るとAIがスキャンし、約3分で危険度と概算が届きます">
      <style>{`
        .hd-cycle{animation-duration:8s;animation-iteration-count:infinite;}
        /* 1) スキャンビーム: 0-2.2s で上→下 */
        .hd-beam{animation-name:hdBeam;}
        @keyframes hdBeam{0%{top:-8%;opacity:0}4%{opacity:1}26%{top:96%;opacity:1}30%{opacity:0}100%{top:96%;opacity:0}}
        /* 2) 検出ボックス: 2.2s/2.8sに出現 */
        .hd-box1{animation-name:hdBox1;}
        @keyframes hdBox1{0%,27%{opacity:0;transform:scale(1.25)}31%{opacity:1;transform:scale(1)}93%{opacity:1}100%{opacity:0}}
        .hd-box2{animation-name:hdBox2;}
        @keyframes hdBox2{0%,34%{opacity:0;transform:scale(1.25)}38%{opacity:1;transform:scale(1)}93%{opacity:1}100%{opacity:0}}
        /* 3) ステータス: スキャン中→完了 */
        .hd-scanning{animation-name:hdScanning;}
        @keyframes hdScanning{0%{opacity:1}44%{opacity:1}48%,100%{opacity:0}}
        .hd-done{animation-name:hdDone;}
        @keyframes hdDone{0%,44%{opacity:0}48%{opacity:1}100%{opacity:1}}
        /* 4) 結果行: 3.8sから順に下からスライドイン */
        .hd-r1{animation-name:hdR1}.hd-r2{animation-name:hdR2}.hd-r3{animation-name:hdR3}
        @keyframes hdR1{0%,46%{opacity:.22;filter:blur(3px);transform:translateY(6px)}52%{opacity:1;filter:blur(0);transform:none}100%{opacity:1}}
        @keyframes hdR2{0%,52%{opacity:.22;filter:blur(3px);transform:translateY(6px)}58%{opacity:1;filter:blur(0);transform:none}100%{opacity:1}}
        @keyframes hdR3{0%,58%{opacity:.22;filter:blur(3px);transform:translateY(6px)}64%{opacity:1;filter:blur(0);transform:none}100%{opacity:1}}
        /* 5) 進捗バー */
        .hd-prog{animation-name:hdProg}
        @keyframes hdProg{0%{width:6%}44%{width:62%}52%{width:100%}100%{width:100%}}
        .hd-pulse{animation:hdPulse 1.6s ease-out infinite}
        @keyframes hdPulse{0%{box-shadow:0 0 0 0 rgba(45,212,191,.55)}100%{box-shadow:0 0 0 12px rgba(45,212,191,0)}}
        @media (prefers-reduced-motion: reduce){
          .hd-cycle,.hd-pulse{animation:none!important}
          .hd-beam{display:none}
          .hd-box1,.hd-box2,.hd-done,.hd-r1,.hd-r2,.hd-r3{opacity:1!important;transform:none!important}
          .hd-scanning{opacity:0!important}
          .hd-prog{width:100%!important}
        }
      `}</style>

      {/* スマホ枠 */}
      <div className="relative rounded-[2rem] border border-white/15 bg-slate-900/80 p-2.5 shadow-2xl backdrop-blur">
        <div className="relative overflow-hidden rounded-[1.55rem] bg-slate-950">

          {/* 撮影写真エリア(天井の雨染みをグラデで描画) */}
          <div className="relative h-44 md:h-48 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(165deg,#e8e4da_0%,#ddd8cc_38%,#cfc9bb_62%,#b9b2a2_100%)]" />
            {/* 天井の板目 */}
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(98deg,transparent_0px,transparent_46px,rgba(90,80,60,.35)_47px)]" />
            {/* 雨染み */}
            <div className="absolute left-[16%] top-[22%] h-24 w-36 rounded-[60%_40%_55%_45%/55%_60%_40%_45%] bg-[radial-gradient(ellipse_at_40%_40%,rgba(120,94,60,.55)_0%,rgba(130,105,70,.35)_45%,rgba(140,115,80,.12)_75%,transparent_100%)]" />
            <div className="absolute left-[24%] top-[34%] h-12 w-20 rounded-full bg-[radial-gradient(ellipse,rgba(96,74,46,.5)_0%,transparent_70%)]" />
            {/* ひび */}
            <div className="absolute left-[62%] top-[30%] h-[2px] w-24 rotate-[24deg] bg-slate-600/50 rounded-full" />
            <div className="absolute left-[70%] top-[38%] h-[2px] w-12 rotate-[-12deg] bg-slate-600/40 rounded-full" />

            {/* スキャングリッド */}
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(45,212,191,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,.25)_1px,transparent_1px)] bg-[size:26px_26px]" />

            {/* スキャンビーム */}
            <div className="hd-beam hd-cycle absolute left-0 right-0 h-10 -translate-y-full bg-[linear-gradient(180deg,transparent,rgba(45,212,191,.28)_55%,rgba(45,212,191,.75))] border-b-2 border-teal-300 shadow-[0_6px_24px_rgba(45,212,191,.5)]" />

            {/* 検出ボックス */}
            <div className="hd-box1 hd-cycle absolute left-[13%] top-[16%] h-28 w-40 rounded-lg border-2 border-amber-400/90 shadow-[0_0_18px_rgba(251,191,36,.35)]">
              <span className="absolute -top-3 left-1.5 rounded bg-amber-400 px-1.5 text-[10px] font-black text-slate-900">雨染み</span>
            </div>
            <div className="hd-box2 hd-cycle absolute left-[58%] top-[22%] h-16 w-32 rounded-lg border-2 border-teal-300/90 shadow-[0_0_18px_rgba(45,212,191,.35)]">
              <span className="absolute -top-3 left-1.5 rounded bg-teal-300 px-1.5 text-[10px] font-black text-slate-900">ひび</span>
            </div>

            {/* ステータスチップ */}
            <div className="absolute left-3 top-3">
              <span className="hd-scanning hd-cycle inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-teal-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 hd-pulse" />AIスキャン中…
              </span>
              <span className="hd-done hd-cycle absolute left-0 top-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-teal-400/95 px-2.5 py-1 text-[11px] font-black text-slate-900">✓ 診断完了(約3分)</span>
            </div>
          </div>

          {/* 結果パネル */}
          <div className="space-y-2 p-3.5 pt-3 bg-slate-950">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="hd-prog hd-cycle h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300" />
            </div>
            <div className="hd-r1 hd-cycle flex items-center justify-between rounded-lg bg-white/[.07] px-3 py-2">
              <span className="text-[11px] font-bold text-slate-300">危険度</span>
              <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[12px] font-black text-amber-300">中(1ヶ月以内推奨)</span>
            </div>
            <div className="hd-r2 hd-cycle flex items-center justify-between rounded-lg bg-white/[.07] px-3 py-2">
              <span className="text-[11px] font-bold text-slate-300">推定修理費</span>
              <span className="text-[15px] font-black text-white">¥58,000<span className="text-[11px] font-bold text-slate-400">〜</span></span>
            </div>
            <div className="hd-r3 hd-cycle flex items-center justify-between rounded-lg bg-white/[.07] px-3 py-2">
              <span className="text-[11px] font-bold text-slate-300">火災保険</span>
              <span className="text-[12px] font-black text-teal-300">✓ 確認の余地あり</span>
            </div>
            <p className="pt-0.5 text-center text-[10px] text-slate-500">※ 実際の診断結果の一例です</p>
          </div>
        </div>
      </div>

      {/* 背景グロー */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[85%] bg-cta/15 rounded-full blur-[80px] -z-10" />
    </div>
  );
}
