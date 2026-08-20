'use client';

export default function HeroDiagnosisDemo() {
  return (
    <div
      className="hd-root relative mx-auto w-full max-w-[340px] select-none px-2"
      aria-label="AI診断のデモ"
    >
      <style>{`
        .hd-root{
          --hd-cycle: 8.6s;
          --hd-teal: 45, 212, 191;
          --hd-cyan: 103, 232, 249;
          --hd-amber: 251, 191, 36;
          color: white;
        }
        .hd-cycle{animation-duration:var(--hd-cycle);animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.2,.8,.2,1);animation-fill-mode:both}
        .hd-phone{animation:hdPhoneFloat 6.8s ease-in-out infinite}
        @keyframes hdPhoneFloat{0%,100%{transform:translateY(0) rotate(-.7deg)}50%{transform:translateY(-9px) rotate(.65deg)}}
        .hd-reflection{animation:hdReflection var(--hd-cycle) ease-in-out infinite}
        @keyframes hdReflection{0%,12%{transform:translateX(-130%) rotate(18deg);opacity:0}18%,37%{opacity:.42}48%,100%{transform:translateX(150%) rotate(18deg);opacity:0}}
        .hd-photo{animation-name:hdPhoto}
        @keyframes hdPhoto{0%,8%{filter:saturate(.9) contrast(.95);transform:scale(1.025)}27%{filter:saturate(.95) contrast(1.02)}44%,100%{filter:saturate(.82) contrast(.92) brightness(.78);transform:scale(1)}}
        .hd-grid{animation-name:hdGrid}
        @keyframes hdGrid{0%,9%{opacity:0;transform:scale(1.04)}15%,43%{opacity:.52;transform:scale(1)}52%,100%{opacity:.16;transform:scale(1)}}
        .hd-beam{animation-name:hdBeam}
        @keyframes hdBeam{0%,9%{transform:translateY(-135%);opacity:0}12%{opacity:1}36%{transform:translateY(455%);opacity:1}42%,100%{transform:translateY(455%);opacity:0}}
        .hd-afterglow{animation-name:hdAfterglow}
        @keyframes hdAfterglow{0%,11%{opacity:0;clip-path:inset(0 0 100% 0)}18%,36%{opacity:.48;clip-path:inset(0 0 12% 0)}45%,100%{opacity:0;clip-path:inset(0 0 0 0)}}
        .hd-scan-chip{animation-name:hdScanChip}
        @keyframes hdScanChip{0%,8%{opacity:0;transform:translateY(-5px) scale(.96);filter:blur(3px)}13%,39%{opacity:1;transform:none;filter:blur(0)}45%,100%{opacity:0;transform:translateY(-4px) scale(.98);filter:blur(2px)}}
        .hd-thinking-dot{animation:hdThinkingDot 1s ease-in-out infinite}
        @keyframes hdThinkingDot{0%,100%{opacity:.35;transform:scale(.78)}45%{opacity:1;transform:scale(1.1)}}
        .hd-lock-a{animation-name:hdLockA}
        @keyframes hdLockA{0%,30%{opacity:0;transform:scale(1.28);filter:blur(3px)}36%{opacity:1;transform:scale(.95);filter:blur(0)}41%,77%{opacity:1;transform:scale(1)}90%,100%{opacity:.45;transform:scale(.985)}}
        .hd-lock-b{animation-name:hdLockB}
        @keyframes hdLockB{0%,36%{opacity:0;transform:scale(1.28);filter:blur(3px)}42%{opacity:1;transform:scale(.95);filter:blur(0)}47%,77%{opacity:1;transform:scale(1)}90%,100%{opacity:.45;transform:scale(.985)}}
        .hd-lock-ping{animation:hdLockPing var(--hd-cycle) cubic-bezier(.2,.8,.2,1) infinite}
        @keyframes hdLockPing{0%,31%{opacity:0;transform:scale(.78)}36%{opacity:.85;transform:scale(1.05)}43%,100%{opacity:0;transform:scale(1.38)}}
        .hd-result-panel{animation-name:hdResultPanel}
        @keyframes hdResultPanel{0%,42%{opacity:.42;transform:translateY(12px);filter:blur(8px)}52%{opacity:1;transform:translateY(0);filter:blur(0)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
        .hd-result-glow{animation-name:hdResultGlow}
        @keyframes hdResultGlow{0%,46%{opacity:0;transform:scaleX(.28)}55%{opacity:1;transform:scaleX(1)}74%,100%{opacity:.25;transform:scaleX(1)}}
        .hd-line-1{animation-name:hdLine1}.hd-line-2{animation-name:hdLine2}.hd-line-3{animation-name:hdLine3}.hd-note{animation-name:hdNote}
        @keyframes hdLine1{0%,47%{opacity:0;transform:translateY(10px);filter:blur(7px)}55%,100%{opacity:1;transform:none;filter:blur(0)}}
        @keyframes hdLine2{0%,52%{opacity:0;transform:translateY(10px);filter:blur(7px)}60%,100%{opacity:1;transform:none;filter:blur(0)}}
        @keyframes hdLine3{0%,57%{opacity:0;transform:translateY(10px);filter:blur(7px)}65%,100%{opacity:1;transform:none;filter:blur(0)}}
        @keyframes hdNote{0%,63%{opacity:0;transform:translateY(5px)}70%,100%{opacity:1;transform:none}}
        .hd-complete{animation-name:hdComplete}
        @keyframes hdComplete{0%,61%{opacity:0;transform:translateY(8px) scale(.96);filter:blur(6px)}69%,100%{opacity:1;transform:none;filter:blur(0)}}
        .hd-check-ring{stroke-dasharray:112;stroke-dashoffset:112;animation:hdRing var(--hd-cycle) ease-out infinite}
        @keyframes hdRing{0%,62%{stroke-dashoffset:112}71%,100%{stroke-dashoffset:0}}
        .hd-check-mark{stroke-dasharray:34;stroke-dashoffset:34;animation:hdMark var(--hd-cycle) cubic-bezier(.2,.8,.2,1) infinite}
        @keyframes hdMark{0%,68%{stroke-dashoffset:34}75%,100%{stroke-dashoffset:0}}
        .hd-progress{animation-name:hdProgress}
        @keyframes hdProgress{0%,8%{width:5%;opacity:.55}35%{width:64%;opacity:1}49%{width:74%}62%{width:92%}72%,100%{width:100%;opacity:1}}
        .hd-tick{animation:hdTick 1.35s ease-in-out infinite}
        @keyframes hdTick{0%,100%{opacity:.45}50%{opacity:1}}
        @media (prefers-reduced-motion: reduce){
          .hd-cycle,.hd-phone,.hd-reflection,.hd-thinking-dot,.hd-lock-ping,.hd-check-ring,.hd-check-mark,.hd-tick{animation:none!important}
          .hd-phone,.hd-photo,.hd-grid,.hd-lock-a,.hd-lock-b,.hd-result-panel,.hd-line-1,.hd-line-2,.hd-line-3,.hd-note,.hd-complete{transform:none!important;filter:none!important}
          .hd-phone{transform:none!important}
          .hd-photo{filter:saturate(.82) contrast(.92) brightness(.78)!important}
          .hd-grid{opacity:.16!important}
          .hd-beam,.hd-afterglow,.hd-scan-chip,.hd-reflection,.hd-lock-ping{display:none!important}
          .hd-lock-a,.hd-lock-b{opacity:.45!important}
          .hd-result-panel,.hd-line-1,.hd-line-2,.hd-line-3,.hd-note,.hd-complete{opacity:1!important}
          .hd-progress{width:100%!important;opacity:1!important}
          .hd-check-ring,.hd-check-mark{stroke-dashoffset:0!important}
        }
      `}</style>

      <div className="hd-shell relative">
        <div className="absolute inset-x-4 top-8 h-[84%] rounded-[2rem] bg-teal-300/20 blur-3xl" />
        <div className="hd-phone relative rounded-[2.15rem] border border-white/18 bg-[linear-gradient(145deg,rgba(9,25,31,.98),rgba(5,16,23,.94))] p-2.5 shadow-[0_28px_80px_rgba(0,0,0,.42),0_0_0_1px_rgba(255,255,255,.05)_inset]">
          <div className="absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/18" />
          <div className="relative overflow-hidden rounded-[1.62rem] border border-white/10 bg-[#07141a]">
            <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.62rem] shadow-[0_0_0_1px_rgba(255,255,255,.06)_inset,0_0_42px_rgba(45,212,191,.08)_inset]" />
            <div className="hd-reflection pointer-events-none absolute -left-24 top-0 z-20 h-full w-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)]" />

            <section className="relative h-[212px] overflow-hidden">
              <div className="hd-photo hd-cycle absolute inset-0 bg-[linear-gradient(154deg,#f1eadc_0%,#e4dccd_32%,#cdc4b2_63%,#afa48f_100%)]">
                <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(96deg,transparent_0,transparent_42px,rgba(78,66,46,.32)_43px,transparent_45px)]" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_28%_26%,rgba(255,255,255,.52),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(80,62,38,.18),transparent_30%)]" />
                <div className="absolute left-[13%] top-[18%] h-[118px] w-[158px] rounded-[58%_42%_54%_46%/50%_62%_38%_50%] bg-[radial-gradient(ellipse_at_42%_38%,rgba(79,55,30,.58)_0%,rgba(118,86,48,.42)_38%,rgba(148,116,75,.2)_68%,transparent_100%)]" />
                <div className="absolute left-[22%] top-[31%] h-[56px] w-[88px] rounded-full bg-[radial-gradient(ellipse,rgba(64,44,24,.42)_0%,rgba(91,65,36,.24)_48%,transparent_73%)]" />
                <div className="absolute left-[38%] top-[24%] h-[84px] w-[92px] rounded-full bg-[radial-gradient(ellipse,rgba(143,109,66,.18)_0%,transparent_72%)]" />
                <svg className="absolute left-[58%] top-[26%] h-[72px] w-[116px] overflow-visible" viewBox="0 0 116 72" aria-hidden="true">
                  <path d="M4 18 C20 20 27 12 40 18 S60 32 73 27 S93 17 112 26" fill="none" stroke="rgba(43,47,46,.58)" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M51 24 C57 31 57 39 66 47" fill="none" stroke="rgba(43,47,46,.42)" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M76 26 C84 32 90 31 98 40" fill="none" stroke="rgba(43,47,46,.34)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="hd-afterglow hd-cycle absolute inset-0 bg-[linear-gradient(180deg,rgba(45,212,191,.18),rgba(103,232,249,.08),transparent_70%)]" />
              <div className="hd-grid hd-cycle absolute inset-0 bg-[linear-gradient(rgba(var(--hd-teal),.28)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--hd-teal),.24)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="hd-grid hd-cycle absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_54%,rgba(6,18,24,.44)_100%)]" />
              <div className="hd-beam hd-cycle absolute left-0 top-0 h-[52px] w-full border-b border-cyan-100/90 bg-[linear-gradient(180deg,transparent_0%,rgba(45,212,191,.2)_28%,rgba(103,232,249,.52)_74%,rgba(255,255,255,.82)_100%)] shadow-[0_0_30px_rgba(45,212,191,.7),0_14px_46px_rgba(45,212,191,.5)]" />

              <div className="hd-scan-chip hd-cycle absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-teal-200/25 bg-[#06171d]/82 px-2.5 py-1.5 text-[11px] font-black text-teal-100 shadow-[0_10px_28px_rgba(0,0,0,.28)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="hd-thinking-dot absolute inline-flex h-full w-full rounded-full bg-teal-200" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-300" />
                </span>
                AIスキャン中…
              </div>

              <div className="hd-lock-a hd-cycle absolute left-[10%] top-[13%] z-10 h-[128px] w-[174px]">
                <div className="hd-lock-ping absolute inset-2 rounded-[18px] border border-amber-300/45" />
                <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-amber-300" />
                <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-amber-300" />
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-amber-300" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-amber-300" />
                <span className="absolute -top-4 left-3 rounded-md bg-amber-300 px-1.5 py-0.5 text-[10px] font-black leading-none text-slate-950 shadow-[0_5px_16px_rgba(0,0,0,.24)]">雨染み</span>
              </div>

              <div className="hd-lock-b hd-cycle absolute left-[56%] top-[23%] z-10 h-[76px] w-[118px]">
                <div className="hd-lock-ping absolute inset-2 rounded-[14px] border border-cyan-200/45" />
                <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-200" />
                <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-200" />
                <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-200" />
                <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-200" />
                <span className="absolute -top-4 left-3 rounded-md bg-cyan-200 px-1.5 py-0.5 text-[10px] font-black leading-none text-slate-950 shadow-[0_5px_16px_rgba(0,0,0,.24)]">ひび</span>
              </div>
            </section>

            <section className="relative bg-[linear-gradient(180deg,#07141a_0%,#051014_100%)] p-3.5 pt-3">
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="hd-progress hd-cycle h-full rounded-full bg-[linear-gradient(90deg,rgb(45,212,191),rgb(103,232,249),rgb(251,191,36))] shadow-[0_0_16px_rgba(45,212,191,.55)]" />
              </div>

              <div className="hd-result-panel hd-cycle relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.075] p-3 shadow-[0_18px_42px_rgba(0,0,0,.28)]">
                <div className="hd-result-glow hd-cycle absolute left-4 right-4 top-0 h-px origin-center bg-[linear-gradient(90deg,transparent,rgb(103,232,249),transparent)]" />
                <div className="space-y-2.5">
                  <div className="hd-line-1 hd-cycle rounded-xl border border-amber-300/18 bg-amber-300/[.08] px-3 py-2 text-[12px] font-black leading-tight text-amber-100">
                    危険度: 中(1ヶ月以内推奨)
                  </div>
                  <div className="hd-line-2 hd-cycle rounded-xl border border-white/10 bg-white/[.07] px-3 py-2 text-[13px] font-black leading-tight text-white">
                    推定修理費 ¥58,000〜
                  </div>
                  <div className="hd-line-3 hd-cycle rounded-xl border border-teal-200/18 bg-teal-300/[.08] px-3 py-2 text-[12px] font-black leading-tight text-teal-100">
                    火災保険 ✓ 確認の余地あり
                  </div>
                </div>
              </div>

              <div className="hd-complete hd-cycle mt-3 flex items-center justify-center gap-2 rounded-full border border-teal-200/20 bg-teal-300/[.11] px-3 py-2 text-[12px] font-black text-teal-50 shadow-[0_0_26px_rgba(45,212,191,.15)_inset]">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 44 44" aria-hidden="true">
                  <circle className="hd-check-ring" cx="22" cy="22" r="17.5" fill="none" stroke="rgb(94,234,212)" strokeWidth="3" />
                  <path className="hd-check-mark" d="M14 22.5 L19.6 28 L31 16.5" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>✓ 診断完了(約3分)</span>
              </div>

              <p className="hd-note hd-cycle pt-2 text-center text-[10px] font-medium leading-none text-slate-400">
                ※ 実際の診断結果の一例です
              </p>
            </section>
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 h-6 w-[72%] -translate-x-1/2 rounded-full bg-black/35 blur-xl" />
      </div>
    </div>
  );
}
