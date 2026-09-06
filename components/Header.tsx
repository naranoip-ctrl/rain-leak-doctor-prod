'use client';

import { BrandMark } from '@/components/BrandMark';
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
      className={`public-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container min-h-[72px] py-3 flex items-center justify-between gap-3">
        <BrandMark />
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
