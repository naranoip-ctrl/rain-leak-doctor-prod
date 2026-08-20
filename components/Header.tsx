'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-dark rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/10">
            <span className="text-white font-bold text-xl">雨</span>
          </div>
          <span
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            雨漏りドクター
          </span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <a
            href="#features"
            className={`transition-colors ${
              isScrolled
                ? 'text-slate-600 hover:text-primary'
                : 'text-white hover:text-cyan-100'
            }`}
          >
            サービス
          </a>
          <a
            href="#how-it-works"
            className={`transition-colors ${
              isScrolled
                ? 'text-slate-600 hover:text-primary'
                : 'text-white hover:text-cyan-100'
            }`}
          >
            診断の流れ
          </a>
          <a
            href="#stats"
            className={`transition-colors ${
              isScrolled
                ? 'text-slate-600 hover:text-primary'
                : 'text-white hover:text-cyan-100'
            }`}
          >
            実績
          </a>
        </nav>
      </div>
    </header>
  );
}
