'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  Phone, Mail, MessageCircle, CheckCircle, Clock, Shield, Camera,
  Thermometer, Anchor, Menu, X, ArrowRight, MapPin, Facebook,
  Twitter, Instagram, Youtube, QrCode, AlertTriangle, TrendingDown,
  FileText, Umbrella, Award, ChevronRight
} from 'lucide-react';
import { trackLineClick, trackCallClick, trackReportPurchaseClick } from '@/lib/analytics';
import { useScrollReveal } from '@/components/useScrollReveal';
import HeroDiagnosisDemo from '@/components/HeroDiagnosisDemo';

/* ─── ローカル画像パス ─── */
const DROCO_ICON_URL = "/images/droco-icon.jpg";
const LIXIL_BADGE_URL = "/images/lixil-badge.jpg";
const APP_SCREEN_URL = "/images/app-screen.png";
const LINE_QR_URL = "/images/line-qr.png";
const LINE_URL = "https://lin.ee/ioKJtwL";
const REPRESENTATIVE_IMG = "/images/representative.png";

/* 事例画像 */
const CASE1_IMG = "/images/case1.jpg";
const CASE2_IMG = "/images/case2-sealing.jpg";

/* 技術画像 */
const TECH1_IMG = "/images/tech1.jpg";
const TECH2_IMG = "/images/tech2.jpg";
const TECH3_IMG = "/images/tech3.jpg";

/* ─── 中間CTAコンポーネント ─── */
function MidCTA({ text, subtext }: { text: string; subtext?: string }) {
  return (
    <div className="py-8 text-center">
      <Link
        href="/diagnosis"
        className="group inline-flex items-center gap-3 px-8 py-4 bg-cta hover:bg-cta-dark text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-pulse-cta-glow"
      >
        <Camera className="h-5 w-5" />
        {text}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
      {subtext && (
        <p className="mt-3 text-sm text-slate-500">{subtext}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktopViewport = window.matchMedia('(min-width: 1024px)');
    const closeMenuOnDesktop = () => {
      if (desktopViewport.matches) setMobileMenuOpen(false);
    };
    desktopViewport.addEventListener('change', closeMenuOnDesktop);
    closeMenuOnDesktop();
    const controls = menuRef.current?.querySelectorAll<HTMLElement>('a, button');
    controls?.[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
      if (event.key !== 'Tab' || !controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktopViewport.removeEventListener('change', closeMenuOnDesktop);
      document.removeEventListener('keydown', handleKeyDown);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [mobileMenuOpen]);

  useScrollReveal('.site-refresh section, .site-refresh footer, .site-refresh .reveal-item');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowFloatingCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerHeight = isScrolled ? 64 : 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="site-refresh min-h-screen font-sans">
      {/* ═══════════ Header ═══════════ */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled ? 'h-16 bg-white/90 backdrop-blur-md shadow-sm border-slate-200' : 'h-20 bg-white/80 backdrop-blur-md border-white/50'}`}>
        <div className="container flex h-full items-center justify-between">
          <BrandMark />

          <nav className="hidden lg:flex items-center gap-8">
            {['サービス', '料金', '事例', 'FAQ'].map((item, i) => {
              const hrefs = ['#services', '#pricing', '#cases', '#faq'];
              return (
                <a key={i} href={hrefs[i]} onClick={(e) => smoothScroll(e, hrefs[i])} className={`text-sm font-bold transition-colors relative group ${isScrolled ? 'text-slate-600 hover:text-primary' : 'text-slate-700 hover:text-primary'}`}>
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cta transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="メニューを開く"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className={`lg:hidden p-2 rounded-md ${!isScrolled ? 'text-primary hover:bg-white/60' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex gap-3">
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackLineClick('header')} className="inline-flex items-center px-5 py-2 rounded-md text-sm font-bold bg-line text-white hover:bg-line-dark shadow-lg shadow-line/30 border-none transition-all">
                <MessageCircle className="h-4 w-4 mr-2" />
                LINEで相談
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ Mobile Menu ═══════════ */}
      {mobileMenuOpen && (
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="メニュー" className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-dvh w-full max-w-sm overflow-y-auto overscroll-contain bg-white shadow-2xl">
            <div className="flex min-h-full flex-col gap-6 p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className="flex shrink-0 justify-end">
                <button type="button" aria-label="メニューを閉じる" className="p-2 rounded-md hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <nav className="flex shrink-0 flex-col space-y-3 text-center">
                {['サービス', '料金', '事例', 'FAQ'].map((item, i) => {
                  const hrefs = ['#services', '#pricing', '#cases', '#faq'];
                  return (
                    <a key={i} href={hrefs[i]} onClick={(e) => smoothScroll(e, hrefs[i])} className="text-xl font-bold text-slate-700 hover:text-primary">
                      {item}
                    </a>
                  );
                })}
              </nav>
              <div className="mt-auto shrink-0 space-y-4">
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackLineClick('mobile_menu')} className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-line text-white font-bold text-lg hover:bg-line-dark transition-colors">
                  <MessageCircle className="h-5 w-5 mr-2" /> LINEで匿名相談・名前不要
                </a>
                <Link href="/diagnosis" className="flex items-center justify-center w-full px-6 py-3 rounded-md border-2 border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-colors">
                  <Camera className="h-5 w-5 mr-2 shrink-0" /> 写真1枚からAI診断を試す
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="hero-editorial relative">
        <div className="hero-backdrop" aria-hidden="true" />

        <div className="container relative z-10">
          <div className="hero-grid">
            <div className="hero-copy space-y-6">
              {/* 季節バッジ */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-cyan-100 shadow-sm backdrop-blur-md">
                <Camera className="h-4 w-4 text-cta" />
                <span className="text-primary text-xs md:text-sm font-medium tracking-wide">無料の写真診断</span>
              </div>

              {/* 見出し：AIを主役から降格し「雨漏りの次の一手」を約束 */}
              <h1 className="text-[1.72rem] md:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.25] md:leading-[1.2] tracking-normal">
                雨漏りの不安を、<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-accent-light">写真で相談。</span>
              </h1>

              {/* スマホは説明文なし(デモが語る)・md以上でのみ表示 */}
              <p className="hidden md:block text-slate-100 md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                危険度と修理費の目安を、写真から確認。<br />
                結果はLINEで受け取れます。
              </p>

              {/* メインCTA（単一）：写真で雨漏りの危険度を見る */}
              <div className="flex flex-col gap-3 pt-2 items-center lg:items-start">
                <Link
                  href="/diagnosis"
                  className="relative inline-flex items-center justify-center min-h-14 px-4 py-4 md:px-6 bg-cta text-white hover:bg-cta-dark text-base md:text-xl font-black rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 whitespace-normal text-center w-full max-w-sm md:max-w-full"
                >
                  <Camera className="h-5 w-5 md:h-6 md:w-6 mr-2 flex-shrink-0" />
                  <span>写真を選んで無料診断</span>
                </Link>
                <p className="text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  無料・登録不要・写真1枚からOK
                </p>
                {/* 補助導線：お急ぎの方（LINE・匿名OK） */}
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLineClick('hero_aux')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white/90 border border-white/30 hover:border-white/70 hover:bg-white/5 rounded-full transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  写真がない方はLINEで相談
                </a>
              </div>

              {/* 信頼バッジ強化(スマホではカードの下に別途表示) */}
              <div className="pt-4 hidden lg:flex flex-wrap gap-4 justify-center lg:justify-start text-sm font-medium text-slate-200">
                {[
                  { icon: <CheckCircle className="h-4 w-4 text-accent" />, txt: '見積だけOK' },
                  { icon: <Shield className="h-4 w-4 text-accent" />, txt: '無理な勧誘なし' },
                  { icon: <Award className="h-4 w-4 text-accent" />, txt: '建設業許可取得済' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/70 lg:bg-white/10 px-3 py-1.5 rounded-full border border-cyan-100 lg:border-white/10">
                    {item.icon} {item.txt}
                  </div>
                ))}
              </div>

              {/* 実証できる加盟情報のみ掲載（Google評価4.8は実証不可のため撤去） */}
              <div className="hidden lg:flex items-center gap-3 justify-center lg:justify-start">
                <img src={LIXIL_BADGE_URL} alt="LIXILリフォームネット" className="w-5 h-5 rounded-sm object-contain opacity-70" />
                <span className="text-xs text-slate-600 lg:text-slate-300">LIXILリフォームネット加盟店</span>
              </div>
            </div>

            {/* AI診断アニメーションデモ(写真→スキャン→検出→結果が自動再生) */}
            <div className="hero-visual hidden md:block">
              <Image src="/images/case2.jpg" alt="" fill priority sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 550px" className="object-cover object-[center_42%]" />
              <div className="hero-demo"><HeroDiagnosisDemo /></div>
            </div>

            {/* スマホ専用: カードの下に信頼チップを1行で(左カラムではlg以上のみ表示) */}
            <div className="lg:hidden flex flex-wrap gap-2 justify-center text-xs font-medium text-slate-200">
              {[
                { icon: <CheckCircle className="h-3.5 w-3.5 text-accent" />, txt: '見積だけOK' },
                { icon: <Shield className="h-3.5 w-3.5 text-accent" />, txt: '無理な勧誘なし' },
                { icon: <Award className="h-3.5 w-3.5 text-accent" />, txt: '建設業許可取得済' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  {item.icon} {item.txt}
                </div>
              ))}
              <div className="w-full flex items-center gap-2 justify-center pt-1">
                <img src={LIXIL_BADGE_URL} alt="LIXILリフォームネット" className="w-4 h-4 rounded-sm object-contain opacity-70" />
                <span className="text-[11px] text-slate-300">LIXILリフォームネット加盟店</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Stats Section ═══════════ */}
      <StatsSection />

      {/* ═══════════ Cases Section（実例：信頼を先に） ═══════════ */}
      <section id="cases" className="py-24 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">実際にAI診断から<span className="text-cta">修理された事例</span></h2>
              <p className="text-slate-600">証拠に基づく診断と、再発を防ぐ根本修繕</p>
            </div>
          </div>

          <div className="case-grid grid">
            {/* Case 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-slate-100">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src={CASE1_IMG} alt="スレート屋根の割れを屋根葺き替えで修繕（施工前後）" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold mb-2">火災保険の申請をサポートした事例</span>
                  <h3 className="text-xl font-bold">スレート屋根の割れ・屋根葺き替え</h3>
                  <p className="text-sm opacity-90">大阪狭山市 / 費用 ¥1,280,000</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="block text-slate-400 text-xs">症状</span>
                    <span className="font-medium text-slate-700">天井のシミ、カビ臭</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">処置</span>
                    <span className="font-medium text-slate-700">ガルバリウム鋼板へ葺き替え</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100 mb-3">
                  <p className="text-sm text-green-700 font-bold flex items-center gap-2">
                    <Umbrella className="h-4 w-4" /> 火災保険（風災補償）の申請をサポート
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 p-3 rounded-lg">
                  <Camera className="h-4 w-4" /> 証拠資料：サーモグラフィ、散水動画
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-slate-100">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src={CASE2_IMG} alt="外壁シーリング打替え" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold mb-2">火災保険の申請をサポートした事例</span>
                  <h3 className="text-xl font-bold">外壁シーリング打替え</h3>
                  <p className="text-sm opacity-90">尼崎市 / 費用 ¥20,000</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="block text-slate-400 text-xs">症状</span>
                    <span className="font-medium text-slate-700">サッシ周りの黒カビ</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">処置</span>
                    <span className="font-medium text-slate-700">ロープ作業＋打替え</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100 mb-3">
                  <p className="text-sm text-green-700 font-bold flex items-center gap-2">
                    <Umbrella className="h-4 w-4" /> 火災保険（風災補償）の申請をサポート
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 p-3 rounded-lg">
                  <Camera className="h-4 w-4" /> 証拠資料：ロープ撮影動画、劣化写真
                </div>
                <p className="text-[10px] text-slate-400 mt-3">※写真は当社施工のシーリング打替え作業の記録です。</p>
              </div>
            </div>
          </div>

          {/* 中間CTA */}
          <MidCTA text="写真を選んで無料診断" subtext="写真1枚から、費用の目安と確認すべき点を整理します" />
        </div>
      </section>

      {/* ═══════════ Services (3つの約束) ═══════════ */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-6">
              <span className="text-cta">「損をさせない」</span>が<br className="md:hidden" />私たちの約束です
            </h2>
            <p className="text-slate-600 text-lg">
              透明性と技術力で、お客様に損をさせない修繕を実現します。<br />
              AIと職人の技術を組み合わせた新しい修理の形です。
            </p>
          </div>

          <div className="promise-grid grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
                    <rect x="6" y="4" width="20" height="26" rx="2" stroke="white" strokeWidth="2.5" fill="none" />
                    <rect x="11" y="2" width="10" height="4" rx="1" stroke="white" strokeWidth="2" fill="white" />
                    <path d="M11 17l3.5 3.5L21 13" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "必要な工事だけ", desc: "過剰な提案は一切しません。AI診断と現地調査で根拠を明示し、本当に必要な箇所だけを修繕します。"
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
                    <path d="M8 24l10-10" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
                    <path d="M5.5 26.5a2 2 0 002.8 0l1.4-1.4-2.8-2.8-1.4 1.4a2 2 0 000 2.8z" fill="white" />
                    <path d="M22 4a6 6 0 00-5.5 8.3L10 19l2.7 2.7 6.5-6.5A6 6 0 1022 4z" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                    <circle cx="22" cy="10" r="2" fill="white" />
                  </svg>
                ),
                title: "最適な手法だけ", desc: "ドローンは必要時のみ。サーモカメラ、散水試験など、建物に応じた最適な調査手法を選択します。"
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
                    <path d="M6 4h14l6 6v18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="white" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
                    <path d="M20 4v6h6" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                    <circle cx="15" cy="20" r="4" stroke="white" strokeWidth="2.2" fill="none" />
                    <circle cx="15" cy="20" r="1.5" fill="white" />
                    <rect x="10" y="15" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.8" fill="none" />
                    <path d="M13 15l1-2h4l1 2" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                ),
                title: "証拠が残る", desc: "赤外線画像・散水動画・報告書で全て記録。保険申請にも使える詳細な証拠を提供します。"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 中間CTA */}
          <MidCTA text="写真から無料で相談する" subtext="AI診断は完全無料。見積だけでもOKです。" />
        </div>
      </section>

      <section className="photo-flow">
        <div className="container">
          <h2 className="text-primary mb-8">診断は、かんたん3ステップ。</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Camera, title: '写真を選ぶ', text: '雨染みや気になる場所を1〜3枚。' },
              { icon: FileText, title: '無料診断を頼む', text: '名前や住所の入力は任意です。' },
              { icon: MessageCircle, title: 'LINEで結果を見る', text: '表示された4桁の合言葉を送信。' },
            ].map((step,i)=><li key={step.title} className="flex items-start gap-4 border-t border-slate-200 pt-5"><step.icon className="h-6 w-6 shrink-0 text-cta"/><div><p className="text-xs text-slate-500">0{i+1}</p><h3 className="font-bold text-lg">{step.title}</h3><p className="text-sm text-slate-600">{step.text}</p></div></li>)}
          </ol>
          <p className="mt-6 text-sm text-slate-600">結果を見てから、必要に応じて現地調査をご相談いただけます。</p>
        </div>
      </section>

      {/* ═══════════ Tech Section ═══════════ */}
      <section className="py-24 bg-white">
        <details className="container service-details">
          <summary>詳しい調査方法を見る</summary>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">技術と安全への取り組み</h2>
            <p className="text-slate-600">必要なツールだけを選択。事実ベースの報告書で確実にサポートします。</p>
          </div>
          <div className="tech-grid grid">
            {[
              { img: TECH1_IMG, Icon: Thermometer, title: "赤外線サーモグラフィ", desc: "温度差で水の侵入経路を可視化。壁を壊さずに原因を特定します。" },
              { img: TECH2_IMG, Icon: Clock, title: "散水試験", desc: "実際に水をかけて漏水を再現。確実な原因特定が可能です。" },
              { img: TECH3_IMG, Icon: Anchor, title: "ロープアクセス", desc: "足場不要で安全に高所調査。住宅街でも近隣に迷惑をかけません。" }
            ].map((item, i) => (
              <div key={i} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-md aspect-video">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                  <item.Icon className="h-5 w-5 text-cta" /> {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Testimonials（お客様の声）は実証不可のため撤去。実証可能な声が確定したら、
          掲載許諾の取れた実名/イニシャルで再掲する（TODO実績数値と統一）。 */}

      {/* ═══════════ Representative Message（代表者メッセージ） ═══════════ */}
      <section className="representative-section py-24 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">代表メッセージ</h2>
            </div>
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <img
                    src={REPRESENTATIVE_IMG}
                    alt="代表 坂井友哉"
                    className="w-64 h-64 md:w-72 md:h-72 rounded-2xl object-cover shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-xs">株式会社ドローン工務店</p>
                    <p className="font-bold">代表 坂井友哉</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative">
                  <div className="absolute -top-3 left-8 text-6xl text-primary/10 font-serif">&ldquo;</div>
                  <p className="text-slate-700 leading-loose text-sm md:text-base relative z-10">
                    私自身、以前から雨漏り修理業界の不透明な見積もりに疑問を感じていました。
                    お客様が「本当にこの金額が適正なのか」と不安を抱えたまま契約するのは、あってはならないことです。
                  </p>
                  <p className="text-slate-700 leading-loose text-sm md:text-base mt-4 relative z-10">
                    だからこそ、写真からの一次判定で<strong className="text-primary">費用の目安と確認すべき点を整理</strong>し、
                    お客様が損をしない仕組みを作りました。ドローンやサーモグラフィなどの技術と
                    職人の経験を組み合わせ、<strong className="text-primary">根拠の残る現地診断</strong>につなげます
                    （原因の断定は現地確認で行います）。
                  </p>
                  <p className="text-slate-700 leading-loose text-sm md:text-base mt-4 relative z-10">
                    「必要な工事だけ、適正価格で」。これが私たちの信念です。
                    まずはAI診断で、お気軽にご相談ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Pricing Section ═══════════ */}
      <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-carbon-fibre.png')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-cta text-white px-3 py-1 rounded-full text-sm font-bold mb-4">明朗会計</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">修理費の目安、<span className="text-cta">先に</span>知っておきませんか？</h2>
            <p className="text-slate-400">無料点検は、工事の売り込みが前提になりがちです。当社は診断を仕事としてお引き受けし、「工事はしない」という結論もそのまま報告します。<br className="hidden md:block" />事前承認なしの追加費用は一切ありません。</p>
          </div>

          {/* AI診断を別格扱い */}
          <div className="max-w-lg mx-auto mb-10">
            <div className="relative bg-gradient-to-br from-cta to-cta-dark rounded-2xl p-8 text-center shadow-2xl border-2 border-cta-light/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-cta px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                まずはここから
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">AI写真診断</h3>
              <div className="text-5xl font-black mt-2 mb-4 text-white">¥0</div>
              <ul className="space-y-2 text-sm text-white/90 mb-6 text-left max-w-xs mx-auto">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 写真の一次判定をLINEで受け取り</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 火災保険の確認の余地を整理</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 概算費用レンジを提示</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 登録不要・完全無料</li>
              </ul>
              <Link href="/diagnosis" className="inline-flex items-center justify-center w-full max-w-xs h-14 bg-white text-cta hover:bg-slate-100 text-lg font-black rounded-full shadow-lg transition-all">
                <Camera className="h-5 w-5 mr-2" /> 今すぐ無料AI診断
              </Link>
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mb-8">AI診断の結果を見てから、以下のプランをお選びいただけます ↓</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 現地診断（有償・成約時は工事代から全額充当）会長決裁2026-08-24 */}
            <div className="relative bg-primary rounded-xl p-6 text-white border-2 border-accent shadow-2xl md:scale-105 z-10 md:col-span-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                原因を特定したい方へ
              </div>
              <h3 className="text-accent font-bold text-lg mb-2">現地診断（報告書付き）</h3>
              <div className="text-3xl font-bold mt-2 mb-1">¥55,000<span className="text-base font-normal opacity-70">（税込）</span></div>
              <p className="text-accent font-bold text-sm mb-5">工事をご依頼の場合、診断費は工事代から全額差し引きます</p>
              <div className="grid sm:grid-cols-2 gap-x-6">
                <ul className="space-y-3 text-sm text-slate-100 mb-6">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 足場を組まずに高所を確認（ドローン／ロープ）</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 赤外線サーモグラフィ・散水試験（必要時）</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 原因と工事範囲を書いた診断レポート（PDF）</li>
                </ul>
                <ul className="space-y-3 text-sm text-slate-100 mb-6">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 「工事は不要」という結論もそのまま報告</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 他社見積があれば妥当性コメントを添付</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 訪問当日の工事契約はお受けしません</li>
                </ul>
              </div>
              <a href="tel:0120-410-654" onClick={() => { trackReportPurchaseClick('genchi_55000'); trackCallClick('pricing_genchi'); }} className="block w-full text-center py-3 rounded-md bg-accent text-primary hover:bg-accent/90 font-bold h-12 leading-6 transition-colors">
                日程を相談する
              </a>
              <p className="text-xs text-white/60 mt-3">大阪府内・戸建て〜3階建の目安。集合住宅は別途お見積り。足場は組みません。</p>
            </div>
            {/* Repair Plan */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-accent font-bold text-lg mb-2">一次止水</h3>
              <div className="text-3xl font-bold mt-2 mb-6">¥22,000<span className="text-lg font-normal opacity-70">〜</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 応急処置（72h以内）</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> シール打ち替え/防水</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 応急処置のため保証対象外（本修繕で再漏水1年保証）</li>
              </ul>
              <a href="tel:0120-410-654" onClick={() => { trackReportPurchaseClick('ichiji_shisui'); trackCallClick('pricing_repair'); }} className="block w-full text-center py-3 rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                今すぐ電話
              </a>
            </div>
          </div>

          {/* 保証区分（応急=対象外 / 本修繕=再漏水1年 / 原因未特定=対象外） */}
          <div className="max-w-2xl mx-auto mt-10 text-center">
            <p className="text-slate-400 text-xs leading-relaxed">
              <span className="font-bold text-slate-300">保証について：</span>
              応急処置（一次止水）は保証対象外です。本修繕（根本修繕）は再漏水について<strong className="text-slate-300">1年保証</strong>。
              現地確認で原因が特定できない場合は保証対象外となります。
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ Section ═══════════ */}
      <FAQSection />

      {/* ═══════════ Final CTA（単一・ページ最後尾） ═══════════ */}
      <section className="final-section py-24 text-center relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cta/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-sm font-bold text-white/80">「高すぎる見積もり」に、もう悩まない。</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            気になる雨漏り、<br />まずは写真で。
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 font-medium">
            写真を選んで送るだけ。<br className="md:hidden" />診断結果はLINEで受け取れます。
          </p>

          {/* 社会的証明：実証できる数字のみ掲載。未確定の実績件数・評価は出さない。
              TODO(実績数値): 実証可能な「累計件数」「Google評価」が確定したら、ここに正確な値で掲載する（盛らない・撤去優先）。 */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-accent" />
              <span>建設業許可 取得済</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4 text-accent" />
              <span>関西エリア対応</span>
            </div>
          </div>

          <Link
            href="/diagnosis"
            className="relative inline-flex items-center justify-center h-16 px-12 text-xl font-black bg-cta text-white hover:bg-cta-dark shadow-xl hover:shadow-2xl rounded-full transition-all transform hover:-translate-y-1"
          >
            <Camera className="h-6 w-6 mr-2" />
            <span>写真を選んで無料診断</span>
          </Link>
          <p className="mt-4 text-sm text-white/60">無料・登録不要・写真1枚からOK</p>

          <div className="mt-6 flex justify-center">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackLineClick('final_cta_aux')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white/90 border border-white/30 hover:border-white/70 hover:bg-white/5 rounded-full transition-colors">
              <MessageCircle className="h-4 w-4" /> お急ぎの方はLINEで相談（匿名OK）
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ Footer ═══════════ */}
      <footer className="bg-primary-dark text-white">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h3 className="text-lg font-bold mb-4">AI雨漏りドクター</h3>
              <p className="text-sm text-white/80 mb-4">
                AI技術と職人の経験を融合し、適正価格で確実な雨漏り修繕を提供します。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">サービス</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/diagnosis" className="text-white/80 hover:text-white transition-colors">AI診断</Link></li>
                <li><a href="#services" className="text-white/80 hover:text-white transition-colors">現地診断</a></li>
                <li><a href="#pricing" className="text-white/80 hover:text-white transition-colors">料金プラン</a></li>
                <li><a href="#cases" className="text-white/80 hover:text-white transition-colors">施工事例</a></li>
              </ul>
              <h3 className="text-lg font-bold mt-6 mb-4">関連サービス</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://third-place-ai.jp/" className="text-white/80 hover:text-white transition-colors">見積もりチェックAI（他社見積の無料診断）</a></li>
                <li><a href="https://third-place-ai.jp/soba/amamori-shuri" className="text-white/80 hover:text-white transition-colors">雨漏り修理の費用相場</a></li>
                <li><a href="https://third-place-ai.jp/soba/yane-shuri" className="text-white/80 hover:text-white transition-colors">屋根修理の費用相場</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">会社概要</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>〒535-0031<br />大阪府大阪市旭区高殿2-12-6</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>営業時間：9:00〜18:00<br />（土日祝も対応可）</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href="tel:0120-410-654" onClick={() => trackCallClick('footer')} className="hover:text-white transition-colors">0120-410-654</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:info@loki-drone.com" className="hover:text-white transition-colors">info@loki-drone.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">法的情報</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-white/80 hover:text-white transition-colors">雨漏り・点検の読み物</Link></li>
                <li><Link href="/privacy" className="text-white/80 hover:text-white transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/terms" className="text-white/80 hover:text-white transition-colors">利用規約</Link></li>
                {/* 特商法は loki-drone.com の正規ページへ統一（外部リンク） */}
                <li><a href="https://loki-drone.com/tokushoho/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
                <li><a href="https://loki-drone.com/company/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">会社概要</a></li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-white/60 mb-2">建設業許可</p>
                <p className="text-sm text-white/80">大阪府知事許可（般-6）161998号</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center gap-2">
                <img src={DROCO_ICON_URL} alt="株式会社ドローン工務店" className="w-6 h-6 rounded-sm object-contain" />
                <span className="text-xs text-white/50">運営：株式会社ドローン工務店</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={LIXIL_BADGE_URL} alt="LIXILリフォームネット" className="w-6 h-6 rounded-sm object-contain" />
                <span className="text-xs text-white/50">LIXILリフォームネット加盟店</span>
              </div>
            </div>
            <p className="text-center text-sm text-white/60">
              &copy; {new Date().getFullYear()} 株式会社ドローン工務店. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════ Floating CTA Bar (Mobile) ═══════════ */}
      <div className={`floating-cta-bar md:hidden ${showFloatingCTA && !mobileMenuOpen ? 'visible' : ''}`}>
        <div className="flex gap-2">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLineClick('floating_mobile')}
            className="flex-[4] flex items-center justify-center gap-1.5 min-h-12 px-2 py-2 bg-white text-primary border border-slate-300 font-medium rounded-lg text-xs"
          >
            <MessageCircle className="h-4 w-4" />
            LINEで匿名相談
          </a>
          <Link
            href="/diagnosis"
            className="flex-[6] flex items-center justify-center gap-1.5 min-h-12 px-2 py-2 bg-cta text-white font-bold rounded-lg text-sm"
          >
            <Camera className="h-3.5 w-3.5" />
            無料で写真診断
          </Link>
        </div>
      </div>

      {/* ═══════════ Floating CTA (Desktop) ═══════════ */}
      {showFloatingCTA && !mobileMenuOpen && (
        <div className="hidden md:block fixed bottom-8 right-8 z-50">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLineClick('floating_desktop')}
            className="flex items-center gap-2 px-6 py-3 bg-line text-white font-bold rounded-full shadow-xl hover:bg-line-dark transition-all hover:-translate-y-1"
          >
            <MessageCircle className="h-5 w-5" />
            LINEで匿名相談
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Stats Sub-component ───
   実証できない数値（実績件数・満足度・評価・提携社数）は出さない方針（撤去優先）。
   TODO(実績数値): 実証可能な「累計件数」「Google評価」等が確定したら、ここに正確な値で掲載する。 */
function StatsSection() {
  const items = [
    { val: "関西エリア", label: "対応（大阪・京都・兵庫ほか）" },
    { val: "写真1〜3枚", label: "1枚から一次判定できます" },
    { val: "建設業許可", label: "取得済（株式会社ドローン工務店）" },
    { val: "現地確認", label: "原因の断定は現地で実施" },
  ];

  return (
    <section className="trust-strip relative z-20 container px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {items.map((item, i) => (
            <div key={i} className="text-center px-2">
              <div className="text-2xl md:text-3xl font-black text-primary">{item.val}</div>
              <div className="text-xs md:text-sm font-bold text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Sub-component ───
   サイトの実ポリシーに基づくFAQ（断定回避・保証3区分・匿名可・関西分岐・火災保険の確認余地を反映）。 */
function FAQSection() {
  const faqs = [
    { q: "AI診断は本当に無料ですか？", a: "写真1枚からの一次判定は無料・登録不要です。異なる角度から3枚あると、より詳しく確認できます。現地診断は¥55,000（税込）で、工事をご依頼いただく場合は工事代から全額差し引きます。" },
    { q: "現地診断だけで、工事を頼まなくてもいいですか？", a: "はい。「工事は不要」という結論もそのまま報告します。診断レポートをお持ちになって他社で相見積もりを取っていただいて構いません。無料点検は工事の売り込みが前提になりがちなため、当社は診断を仕事としてお引き受けしています。" },
    { q: "AIで雨漏りの原因を断定してもらえますか？", a: "写真からの一次判定のため、原因の断定はできません。原因の特定・確定診断には現地確認が必要です。一次判定では、危険度の目安・費用レンジ・確認すべき点を整理します。" },
    { q: "火災保険は使えますか？", a: "台風・強風・雹（ひょう）・飛来物などの自然災害が原因の場合、火災保険の風災補償などを確認する余地があります。確認用の整理資料の作成までサポートしますが、適用可否は保険会社の判断であり、当社は保険適用を保証しません。" },
    { q: "保証はありますか？", a: "本修繕（根本修繕）は再漏水について1年保証です。応急処置（一次止水）と、現地確認で原因が特定できない場合は保証対象外となります。" },
    { q: "対応エリアはどこですか？", a: "関西（大阪・京都・兵庫ほか）を中心に現地対応しています。関西エリア外の方は、写真からのオンライン一次判定で対応します。" },
    { q: "匿名でも相談できますか？", a: "はい。診断フォームの連絡先は任意で、匿名のままでも一次判定を受けられます。お急ぎの方はLINEからも匿名でご相談いただけます。" },
    { q: "他社の見積もりが高い気がします。", a: "他社見積の妥当性を一次チェックすることもできます（当社施工を前提としない確認です）。必要な工事と任意の工事を分けて整理するのにご活用ください。" },
  ];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">よくあるご質問</h2>
          <p className="text-slate-600">ご相談前に多いご質問をまとめました。</p>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 font-bold text-primary hover:bg-slate-50 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronRight className={`h-5 w-5 flex-shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
