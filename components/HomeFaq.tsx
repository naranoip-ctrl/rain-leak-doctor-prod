import { ChevronRight } from 'lucide-react';
import { homeFaqs } from '@/lib/home-faq';

export function HomeFaq() {
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">よくあるご質問</h2>
          <p className="text-slate-600">ご相談前に多いご質問をまとめました。</p>
        </div>
        <div className="space-y-3">
          {homeFaqs.map((item) => (
            <details key={item.q} className="home-faq group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-bold text-primary hover:bg-slate-50">
                <span>{item.q}</span>
                <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
