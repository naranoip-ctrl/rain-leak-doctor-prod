'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Phone, Mail, MessageCircle, CheckCircle, Clock, Shield, Camera,
  Thermometer, Anchor, Menu, X, ArrowRight, Star, MapPin, Facebook,
  Twitter, Instagram, Youtube, QrCode, AlertTriangle, TrendingDown,
  FileText, Umbrella, Users, Award, ChevronRight
} from 'lucide-react';

/* ─── ローカル画像パス ─── */
const DROCO_ICON_URL = "/images/droco-icon.jpg";
const LIXIL_BADGE_URL = "/images/lixil-badge.jpg";
const APP_SCREEN_URL = "/images/app-screen.png";
const LINE_QR_URL = "/images/line-qr.png";
const LINE_URL = "https://lin.ee/ioKJtwL";
const REPRESENTATIVE_IMG = "/images/representative.png";

/* 事例画像 */
const CASE1_IMG = "/images/case1.jpg";
const CASE2_IMG = "/images/case2.jpg";

/* 技術画像 */
const TECH1_IMG = "/images/tech1.jpg";
const TECH2_IMG = "/images/tech2.jpg";
const TECH3_IMG = "/images/tech3.jpg";

/* ─── カウントアップフック ─── */
function useCountUp({ end, duration = 2000, decimals = 0 }: { end: number; duration?: number; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((eased * end).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return { ref, displayValue: decimals > 0 ? value.toFixed(decimals) : value };
}

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

/* ─── 季節メッセージ ─── */
function getSeasonalMessage(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 5 && month <= 7) return "梅雨シーズン到来。雨漏りが増える前に、今すぐ診断を。";
  if (month >= 8 && month <= 10) return "台風シーズンに備えて、今のうちに診断しておきませんか？";
  if (month >= 11 || month <= 2) return "冬の結露・凍結による雨漏りが増える時期です。早めの診断を。";
  return "春の長雨シーズン前に、屋根の状態を確認しませんか？";
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

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
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ═══════════ Header ═══════════ */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled ? 'h-16 bg-white/90 backdrop-blur-md shadow-sm border-slate-200' : 'h-20 bg-transparent border-transparent'}`}>
        <div className="container flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isScrolled ? 'w-5 h-5' : 'w-6 h-6'}`}>
                <path d="M20 4L3 18h5v14h24V18h5L20 4z" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M20 14c-5 0-9 3.5-9 8h3c0-1.5 1-3 3-3s3 1.5 3 3v6" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 14c5 0 9 3.5 9 8h-3c0-1.5-1-3-3-3" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 28c-1.5 0-2.5-1-2.5-2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className={`font-bold tracking-tight ${isScrolled ? 'text-lg text-primary' : 'text-xl text-white'}`}>
              雨漏りドクター
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {['サービス', '料金', '事例', 'お客様の声'].map((item, i) => {
              const hrefs = ['#services', '#pricing', '#cases', '#testimonials'];
              return (
                <a key={i} href={hrefs[i]} onClick={(e) => smoothScroll(e, hrefs[i])} className={`text-sm font-bold transition-colors relative group ${isScrolled ? 'text-slate-600 hover:text-primary' : 'text-slate-100 hover:text-white'}`}>
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cta transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className={`lg:hidden p-2 rounded-md ${!isScrolled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex gap-3">
              <a href="tel:0120-410-654" className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-bold border-2 transition-colors ${!isScrolled ? 'bg-white/10 text-white border-white/30 hover:bg-white/20' : 'border-primary text-primary hover:bg-primary/5'}`}>
                <Phone className="h-4 w-4 mr-2" />
                0120-410-654
              </a>
              <Link href="/diagnosis" className="inline-flex items-center px-5 py-2 rounded-md text-sm font-bold bg-cta text-white hover:bg-cta-dark shadow-lg shadow-cta/30 border-none transition-all">
                <Camera className="h-4 w-4 mr-2" />
                無料AI診断
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ Mobile Menu ═══════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl">
            <div className="flex flex-col p-6 h-full">
              <div className="flex justify-end mb-8">
                <button className="p-2 rounded-md hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <nav className="flex flex-col space-y-6 text-center">
                {['サービス', '料金', '事例', 'お客様の声'].map((item, i) => {
                  const hrefs = ['#services', '#pricing', '#cases', '#testimonials'];
                  return (
                    <a key={i} href={hrefs[i]} onClick={(e) => smoothScroll(e, hrefs[i])} className="text-xl font-bold text-slate-700 hover:text-primary">
                      {item}
                    </a>
                  );
                })}
              </nav>
              <div className="mt-auto space-y-4">
                <Link href="/diagnosis" className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-cta text-white font-bold text-lg">
                  <Camera className="h-5 w-5 mr-2" /> 写真3枚で無料AI診断
                </Link>
                <a href={LINE_URL} className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-line text-white font-bold text-lg hover:bg-line-dark transition-colors">
                  LINEで相談
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/images/pattern-cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              {/* 季節バッジ */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/20 border border-warning/40 backdrop-blur-md">
                <AlertTriangle className="h-3.5 w-3.5 text-warning-light" />
                <span className="text-warning-light text-xs md:text-sm font-bold tracking-wide">{getSeasonalMessage()}</span>
              </div>

              {/* 改善キャッチコピー：感情訴求型 */}
              <h1 className="text-3xl md:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.2] tracking-tight">
                その雨漏り、放置すると<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-cta-light">修理費が3倍</span>に。
              </h1>

              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                写真3枚で<strong className="text-white">AIが即座に診断</strong>。<br />
                <span className="text-accent font-bold">費用の目安</span>と<span className="text-accent font-bold">火災保険の適用可能性</span>が<br className="hidden md:block" />
                <span className="text-cta font-black text-2xl mx-1">最短3分</span>で分かります。
              </p>

              {/* メインCTA：1つに絞り、オレンジ化 */}
              <div className="flex flex-col gap-3 pt-2 items-center lg:items-start">
                <Link
                  href="/diagnosis"
                  className="relative inline-flex items-center justify-center h-16 px-10 bg-cta text-white hover:bg-cta-dark text-xl font-black rounded-full shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:shadow-[0_0_40px_rgba(255,107,53,0.7)] transition-all transform hover:-translate-y-1 animate-pulse-cta-glow overflow-hidden"
                >
                  <span className="absolute inset-0 cta-shimmer"></span>
                  <Camera className="h-6 w-6 mr-2 relative z-10" />
                  <span className="relative z-10">写真3枚で今すぐ無料診断</span>
                </Link>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  登録不要・最短3分で結果表示・完全無料
                </p>
                {/* LINEはサブリンク化 */}
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-line transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  LINEで相談する →
                </a>
              </div>

              {/* 信頼バッジ強化 */}
              <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start text-sm font-medium text-slate-300">
                {[
                  { icon: <CheckCircle className="h-4 w-4 text-accent" />, txt: '見積だけOK' },
                  { icon: <Shield className="h-4 w-4 text-accent" />, txt: '無理な勧誘なし' },
                  { icon: <Award className="h-4 w-4 text-accent" />, txt: '建設業許可取得済' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    {item.icon} {item.txt}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                </div>
                <span className="text-sm text-slate-300">Google評価 <strong className="text-white">4.8</strong></span>
                <span className="text-slate-500">|</span>
                <img src={LIXIL_BADGE_URL} alt="LIXILリフォームネット" className="w-5 h-5 rounded-sm object-contain opacity-70" />
                <span className="text-xs text-slate-400">LIXIL加盟店</span>
              </div>
            </div>

            {/* 診断結果プレビュー（モックアップの代わり） */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 md:w-80 lg:w-[22rem]">
                {/* 結果プレビューカード */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 animate-float">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-cta/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-cta" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">AI診断結果サンプル</p>
                      <p className="text-sm font-bold text-primary">こんな結果が3分で届きます</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">推定修理費</p>
                      <p className="text-2xl font-black text-primary">¥58,000<span className="text-sm font-normal text-slate-500">〜</span></p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-slate-500 mb-1">火災保険</p>
                      <p className="text-lg font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> 適用可能性あり
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <p className="text-xs text-slate-500 mb-1">緊急度</p>
                        <p className="text-sm font-bold text-amber-700">中（1ヶ月以内推奨）</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs text-slate-500 mb-1">損傷タイプ</p>
                        <p className="text-sm font-bold text-blue-700">屋根材の割れ</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">※ 実際の診断結果の一例です</p>
                  </div>
                </div>

                {/* 背景グロー */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[90%] bg-cta/15 rounded-full blur-[80px] -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Stats Section ═══════════ */}
      <StatsSection />

      {/* ═══════════ Pain Points（不安の言語化）セクション ═══════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-warning text-sm font-bold">こんなお悩み、ありませんか？</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-primary">
              雨漏りの不安、<span className="text-cta">一人で抱えていませんか？</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            {[
              "修理費がいくらかかるか分からず不安",
              "業者に頼んだら高額な見積もりを出されそう",
              "火災保険が使えるかもしれないけど、調べ方が分からない",
              "本当に必要な工事だけやってほしい（過剰工事は嫌）",
              "放置していいのか、すぐ対応すべきなのか判断できない",
              "どの業者に頼めばいいか分からない",
            ].map((pain, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex-shrink-0 w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-warning text-sm font-bold">✓</span>
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>

          {/* 解決宣言 */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-white text-center max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              AI雨漏りドクターなら、<br className="md:hidden" />すべて解決できます。
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: <Camera className="h-6 w-6" />, title: "写真3枚で即診断", desc: "費用の目安が3分で分かる" },
                { icon: <Umbrella className="h-6 w-6" />, title: "火災保険も自動判定", desc: "適用可能性をAIがチェック" },
                { icon: <Shield className="h-6 w-6" />, title: "必要な工事だけ提案", desc: "過剰工事は一切しません" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 中間CTA */}
          <MidCTA text="まずは無料でAI診断" subtext="登録不要・最短3分で結果が届きます" />
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

          <div className="grid md:grid-cols-3 gap-8">
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
          <MidCTA text="3分で修理費の目安が分かる" subtext="AI診断は完全無料。見積だけでもOKです。" />
        </div>
      </section>

      {/* ═══════════ Fire Insurance Section（火災保険訴求強化） ═══════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-100 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 mb-4">
                  <Umbrella className="h-4 w-4 text-green-700" />
                  <span className="text-green-700 text-sm font-bold">知らないと損！</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-primary mb-4">
                  火災保険で<span className="text-green-600">実質0円</span>に<br />なるケースも。
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  雨漏り修理は、台風・強風・雹（ひょう）などの自然災害が原因の場合、<strong className="text-primary">火災保険の「風災補償」</strong>で修理費用が全額カバーされることがあります。
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  当社のAI診断では、損傷の状態から<strong className="text-primary">火災保険の適用可能性を自動判定</strong>。保険申請に必要な報告書の作成までサポートします。
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-slate-500 mb-1">他社の現地調査費用</p>
                  <p className="text-lg font-bold text-slate-400 line-through">平均 2〜5万円</p>
                  <p className="text-sm text-slate-500 mt-2 mb-1">当社のAI診断</p>
                  <p className="text-2xl font-black text-cta">0円 <span className="text-sm font-normal text-slate-500">（完全無料）</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-bold text-primary">AI診断で保険適用を判定</h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-[52px]">写真から損傷原因をAIが分析し、風災適用の可能性を判定します。</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-bold text-primary">保険申請用の報告書を作成</h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-[52px]">現地調査後、保険会社に提出する詳細な報告書を作成します。</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-bold text-primary">保険適用で実質0円に</h4>
                  </div>
                  <p className="text-sm text-slate-600 pl-[52px]">風災認定されれば、修理費用の全額が保険でカバーされます。</p>
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
            <p className="text-slate-400">事前承認なしの追加費用は一切ありません。</p>
          </div>

          {/* AI診断を別格扱い */}
          <div className="max-w-lg mx-auto mb-10">
            <div className="relative bg-gradient-to-br from-cta to-cta-dark rounded-2xl p-8 text-center shadow-2xl border-2 border-cta-light/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-cta px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                まずはここから
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">AI 3分診断</h3>
              <div className="text-5xl font-black mt-2 mb-4 text-white">¥0</div>
              <ul className="space-y-2 text-sm text-white/90 mb-6 text-left max-w-xs mx-auto">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 最短3分で結果表示</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-white flex-shrink-0" /> 火災保険の適用可能性を判定</li>
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
            {/* Light Plan */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-accent font-bold text-lg mb-2">ライト現地診断</h3>
              <div className="text-3xl font-bold mt-2 mb-6">¥8,800</div>
              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 平日9〜18時対応</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 目視調査＋湿度計測</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 簡易報告書（写真付）</li>
              </ul>
              <a href="tel:0120-410-654" className="block w-full text-center py-3 rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                予約する
              </a>
            </div>

            {/* Standard Plan (Featured) */}
            <div className="relative bg-primary rounded-xl p-6 text-white border-2 border-accent shadow-2xl scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                人気 No.1
              </div>
              <h3 className="text-accent font-bold text-lg mb-2">スタンダード</h3>
              <div className="text-3xl font-bold mt-2 mb-6">¥33,000<span className="text-lg font-normal opacity-70">〜</span></div>
              <ul className="space-y-3 text-sm text-slate-100 mb-6">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 赤外線サーモグラフィ</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 散水試験（漏水再現）</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 保険申請用報告書</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> ドローン（必要時）</li>
              </ul>
              <a href="tel:0120-410-654" className="block w-full text-center py-3 rounded-md bg-accent text-primary hover:bg-accent/90 font-bold h-12 leading-6 transition-colors">
                予約する
              </a>
            </div>

            {/* Repair Plan */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-accent font-bold text-lg mb-2">一次止水</h3>
              <div className="text-3xl font-bold mt-2 mb-6">¥22,000<span className="text-lg font-normal opacity-70">〜</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 応急処置（72h以内）</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> シール打ち替え/防水</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /> 30日間無料再訪保証</li>
              </ul>
              <a href="tel:0120-410-654" className="block w-full text-center py-3 rounded-md bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                今すぐ電話
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Steps Section ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">AI診断から修理完了まで、<span className="text-cta">たった5ステップ</span></h2>
            <p className="text-slate-600">まずはステップ1のAI診断から。あとは私たちにお任せください。</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-100 -z-0"></div>
            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: "01", title: "AI診断", desc: "写真3枚で概算。保険目安と費用レンジを即表示します。", time: "3分", active: true },
                { step: "02", title: "日程確定", desc: "最短48hで現地訪問の日程を調整します。", time: "最短48h", active: false },
                { step: "03", title: "現地診断", desc: "必要に応じドローン／サーモで原因を特定。", time: "即日〜", active: false },
                { step: "04", title: "一次止水", desc: "原則72h以内を目指して応急処置を実施します。", time: "72h以内", active: false },
                { step: "05", title: "本復旧", desc: "報告書を納品し、根本修繕を実施します。", time: "工事後", active: false },
              ].map((item, i) => (
                <div key={i} className="relative bg-white md:bg-transparent pt-4 md:pt-0">
                  {item.active ? (
                    <Link href="/diagnosis" className="block group">
                      <div className="w-24 h-24 mx-auto bg-cta border-4 border-cta rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg mb-6 relative z-10 group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div className="text-center px-2">
                        <h3 className="text-lg font-bold text-cta mb-2">{item.title}</h3>
                        <span className="inline-block mb-2 bg-cta/10 text-cta px-3 py-1 rounded-full text-xs font-bold">{item.time}</span>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        <p className="text-xs text-cta font-bold mt-2 flex items-center justify-center gap-1">
                          ← 今ここから始められます <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-2xl font-black text-slate-400 shadow-lg mb-6 relative z-10">
                        {item.step}
                      </div>
                      <div className="text-center px-2">
                        <h3 className="text-lg font-bold text-slate-400 mb-2">{item.title}</h3>
                        <span className="inline-block mb-3 bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">{item.time}</span>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 中間CTA */}
          <MidCTA text="ステップ1のAI診断を今すぐ始める" subtext="AI診断後、自動で次のステップに進みます" />
        </div>
      </section>

      {/* ═══════════ Cases Section ═══════════ */}
      <section id="cases" className="py-24 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">実際にAI診断から<span className="text-cta">修理された事例</span></h2>
              <p className="text-slate-600">証拠に基づく確実な診断と、再発を防ぐ根本修繕</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Case 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-slate-100">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src={CASE1_IMG} alt="スレート屋根の割れ修繕" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold mb-2">🎉 風災適用・全額カバー</span>
                  <h3 className="text-xl font-bold">スレート屋根の割れ修繕</h3>
                  <p className="text-sm opacity-90">大阪狭山市 / 費用 ¥58,000</p>
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
                    <span className="font-medium text-slate-700">割れ補修＋棟板金</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100 mb-3">
                  <p className="text-sm text-green-700 font-bold flex items-center gap-2">
                    <Umbrella className="h-4 w-4" /> 火災保険適用で実質負担 ¥0
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
                  <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold mb-2">🎉 全額保険適用</span>
                  <h3 className="text-xl font-bold">外壁シーリング打替え</h3>
                  <p className="text-sm opacity-90">尼崎市 / 費用 ¥98,000</p>
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
                    <Umbrella className="h-4 w-4" /> 火災保険適用で実質負担 ¥0
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 p-3 rounded-lg">
                  <Camera className="h-4 w-4" /> 証拠資料：ロープ撮影動画、劣化写真
                </div>
              </div>
            </div>
          </div>

          {/* 中間CTA */}
          <MidCTA text="あなたの雨漏りも診断してみませんか？" subtext="写真3枚で費用と保険適用の目安が分かります" />
        </div>
      </section>

      {/* ═══════════ Tech Section ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">技術と安全への取り組み</h2>
            <p className="text-slate-600">必要なツールだけを選択。事実ベースの報告書で確実にサポートします。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* ═══════════ Testimonials ═══════════ */}
      <section id="testimonials" className="py-24 bg-primary text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">AI診断を使った方の、<span className="text-cta">リアルな声</span></h2>
            <p className="text-slate-300">実際にご利用いただいたお客様からの声をご紹介します</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "M様", area: "大阪市旭区 / 50代女性", txt: "他社では屋根全体の葺き替えを提案されましたが、AI診断で部分修繕で済むと分かり、火災保険で全額カバーできました。スマホで写真を送るだけで本当に結果が来て驚きました。", highlight: "AI診断で部分修繕で済むと分かり" },
              { name: "T様", area: "大阪狭山市 / 40代男性", txt: "48時間以内に現地診断に来ていただき、72時間で一次止水を完了。AI診断の概算と実際の費用がほぼ一致していて、信頼できると感じました。他社の見積もりと比較する材料にもなりました。", highlight: "AI診断の概算と実際の費用がほぼ一致" },
              { name: "K様", area: "尼崎市 / 60代女性", txt: "ロープアクセスで足場不要だったので、近所に迷惑をかけずに済みました。最初は高額請求が心配でしたが、AI診断で事前に費用が分かっていたので安心して依頼できました。", highlight: "AI診断で事前に費用が分かっていたので安心" }
            ].map((item, i) => (
              <div key={i} className="bg-primary-dark rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />)}
                </div>
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{item.area}</p>
                <p className="text-sm leading-relaxed opacity-90">&ldquo;{item.txt}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* 中間CTA */}
          <div className="py-8 text-center">
            <Link
              href="/diagnosis"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-cta hover:bg-cta-dark text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Camera className="h-5 w-5" />
              皆さまのように、まずはAI診断から
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ Representative Message（代表者メッセージ） ═══════════ */}
      <section className="py-24 bg-white">
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
                    alt="代表"
                    className="w-64 h-64 md:w-72 md:h-72 rounded-2xl object-cover shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-xs">株式会社ドローン工務店</p>
                    <p className="font-bold">代表</p>
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
                    だからこそ、<strong className="text-primary">AIを使って適正価格を可視化</strong>し、
                    お客様が損をしない仕組みを作りました。ドローンやサーモグラフィなどの最新技術と、
                    職人の経験を組み合わせることで、<strong className="text-primary">証拠に基づいた確実な診断</strong>を提供しています。
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

      {/* ═══════════ LINE Add Friend ═══════════ */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="rounded-xl p-6 bg-gradient-to-br from-line to-line-dark text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-white rounded-lg p-3 flex items-center justify-center">
                  <img src={LINE_QR_URL} alt="LINE公式アカウントQRコード" className="w-full h-full object-contain rounded" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">LINE で診断結果を受け取る</h3>
                <p className="mb-4 opacity-90">
                  友だち追加すると、AI診断結果や予約確認をLINEで受け取れます。<br />
                  24時間365日、自動応答でご質問にお答えします。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-line rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" />
                    友だち追加
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-90 text-center md:text-left">
                ✅ AI診断結果をLINEで即座に受信
                <span className="mx-2">|</span>
                ✅ 予約確認・リマインダー通知
                <span className="mx-2">|</span>
                ✅ 24時間自動応答
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Risk Warning（放置リスク） ═══════════ */}
      <section className="py-16 bg-warning/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-6">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="text-warning font-bold">放置すると、こうなります</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary mb-8">
              雨漏りの放置は、<span className="text-warning">家の寿命を縮めます</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { period: "1ヶ月放置", risk: "カビ・ダニの発生", cost: "修理費 +30%", icon: <TrendingDown className="h-6 w-6" /> },
                { period: "半年放置", risk: "木材の腐食・シロアリ", cost: "修理費 2〜3倍", icon: <TrendingDown className="h-6 w-6" /> },
                { period: "1年以上放置", risk: "構造体の損傷", cost: "修理費 5倍以上", icon: <TrendingDown className="h-6 w-6" /> },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-warning/20 shadow-sm">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center text-warning mx-auto mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-primary text-lg mb-1">{item.period}</h3>
                  <p className="text-slate-600 text-sm mb-2">{item.risk}</p>
                  <p className="text-warning font-black text-lg">{item.cost}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 mb-6">早期発見・早期対応が、修理費を最小限に抑える最善の方法です。</p>
            <MidCTA text="今すぐ無料AI診断で確認する" subtext="3分で現状の緊急度が分かります" />
          </div>
        </div>
      </section>

      {/* ═══════════ Final CTA ═══════════ */}
      <section className="py-24 bg-gradient-to-br from-primary-dark to-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cta/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-sm font-bold text-white/80">「高すぎる見積もり」に、もう悩まない。</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            写真3枚でOK。<br />今すぐAIが概算します。
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 font-medium">
            スマホで撮って送るだけ。<br className="md:hidden" />最短3分で費用の目安と火災保険の適用可能性が分かります。
          </p>

          {/* 社会的証明 */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="h-4 w-4 text-accent" />
              <span>累計 <strong>1,247件</strong> の診断実績</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>Google評価 <strong>4.8</strong></span>
            </div>
          </div>

          <Link
            href="/diagnosis"
            className="relative inline-flex items-center justify-center h-16 px-12 text-xl font-black bg-cta text-white hover:bg-cta-dark shadow-[0_0_30px_rgba(255,107,53,0.5)] rounded-full transition-all transform hover:-translate-y-1 animate-pulse-cta-glow overflow-hidden"
          >
            <span className="absolute inset-0 cta-shimmer"></span>
            <Camera className="h-6 w-6 mr-2 relative z-10" />
            <span className="relative z-10">写真3枚で今すぐ無料診断</span>
          </Link>
          <p className="mt-4 text-sm text-white/60">登録不要・最短3分で結果表示・完全無料</p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white/70 hover:text-white font-bold transition-colors text-sm">
              <MessageCircle className="h-4 w-4 mr-2" /> LINEで相談する
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <a href="tel:0120-410-654" className="inline-flex items-center text-white/70 hover:text-white font-bold transition-colors text-sm">
              <Phone className="h-4 w-4 mr-2" /> 0120-410-654
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
                  <a href="tel:0120-410-654" className="hover:text-white transition-colors">0120-410-654</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:drone@loki-group.com" className="hover:text-white transition-colors">drone@loki-group.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">法的情報</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-white/80 hover:text-white transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/terms" className="text-white/80 hover:text-white transition-colors">利用規約</Link></li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-white/60 mb-2">建設業許可</p>
                <p className="text-sm text-white/80">（般ー6）笖161998号</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center gap-2">
                <img src={DROCO_ICON_URL} alt="ドロコ" className="w-6 h-6 rounded-sm object-contain" />
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
      <div className={`floating-cta-bar md:hidden ${showFloatingCTA ? 'visible' : ''}`}>
        <div className="flex gap-2">
          <Link
            href="/diagnosis"
            className="flex-[7] flex items-center justify-center gap-2 h-12 bg-cta text-white font-bold rounded-lg text-sm shadow-md"
          >
            <Camera className="h-4 w-4" />
            無料AI診断（3分）
          </Link>
          <a
            href="tel:0120-410-654"
            className="flex-[3] flex items-center justify-center h-12 bg-primary text-white font-bold rounded-lg text-sm shadow-md"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* ═══════════ Floating CTA (Desktop) ═══════════ */}
      {showFloatingCTA && (
        <div className="hidden md:block fixed bottom-8 right-8 z-50">
          <Link
            href="/diagnosis"
            className="flex items-center gap-2 px-6 py-3 bg-cta text-white font-bold rounded-full shadow-xl hover:bg-cta-dark transition-all hover:-translate-y-1 animate-pulse-cta-glow"
          >
            <Camera className="h-5 w-5" />
            無料AI診断
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Stats Sub-component ─── */
function StatsSection() {
  const stat1 = useCountUp({ end: 1247, duration: 2000 });
  const stat2 = useCountUp({ end: 3, duration: 2000 });
  const stat3 = useCountUp({ end: 12, duration: 2000 });
  const stat4 = useCountUp({ end: 4.8, duration: 2000, decimals: 1 });

  return (
    <section className="relative -mt-10 z-20 container px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {[
            { ref: stat1.ref, val: stat1.displayValue, unit: "件", label: "AI診断 累計" },
            { ref: stat2.ref, val: stat2.displayValue, unit: "分", label: "最短診断時間" },
            { ref: stat3.ref, val: stat3.displayValue, unit: "社", label: "提携職人" },
            { ref: stat4.ref, val: stat4.displayValue, unit: "", label: "Google評価" }
          ].map((item, i) => (
            <div key={i} ref={item.ref} className="text-center px-2">
              <div className="text-3xl md:text-4xl font-black text-primary">
                {item.val}<span className="text-lg font-bold ml-1">{item.unit}</span>
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">{item.label}</div>
              {i === 3 && (
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 text-yellow-400 fill-current" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
