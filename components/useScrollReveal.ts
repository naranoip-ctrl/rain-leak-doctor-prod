'use client';

import { useEffect } from 'react';

export function useScrollReveal(selector: string) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (reduceMotion) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const reveal = (el: HTMLElement) => {
      el.classList.add('is-revealed');
    };

    const catchUp = () => {
      const viewportBottom = window.innerHeight + 80;
      elements.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportBottom && rect.bottom > -80) reveal(el);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    elements.forEach((el) => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });

    catchUp();
    window.addEventListener('scroll', catchUp, { passive: true });
    window.addEventListener('resize', catchUp);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', catchUp);
      window.removeEventListener('resize', catchUp);
    };
  }, [selector]);
}
