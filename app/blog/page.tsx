import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, ArrowRight, Tag } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { BlogHeader, BlogFooter } from '@/components/BlogChrome';

export const metadata: Metadata = {
  title: 'お役立ち情報｜雨漏り・12条点検の基礎知識 | 雨漏りドクター',
  description:
    '大阪・関西の雨漏り点検と、建築基準法12条の定期報告（12条点検）について、建物オーナー・住まい手向けにやさしく解説する情報ページです。',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'お役立ち情報｜雨漏り・12条点検の基礎知識',
    description: '雨漏りと12条点検の基礎知識をまとめています。',
    type: 'website',
  },
};

// 記事はビルド時に静的生成。Make が .md を commit → 再デプロイで反映。
export const dynamic = 'force-static';

const CATEGORY_STYLE: Record<string, string> = {
  雨漏り: 'bg-cta/10 text-cta',
  '12条点検': 'bg-primary/10 text-primary',
  お役立ち: 'bg-slate-100 text-slate-600',
  お知らせ: 'bg-accent/10 text-accent-dark',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="editorial-page min-h-screen bg-slate-50 font-sans">
      <BlogHeader />

      <section className="bg-primary text-white py-16">
        <div className="container">
          <p className="text-accent font-bold text-sm mb-2">お役立ち情報</p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            雨漏りと12条点検の、<br className="md:hidden" />知っておきたい基礎知識
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl">
            大阪・関西の現場目線で、雨漏りの見分け方や、建物オーナー様向けの12条点検（定期報告）の基本を整理しています。
          </p>
        </div>
      </section>

      <main className="container py-12">
        {posts.length === 0 ? (
          <p className="text-center text-slate-500 py-20">記事を準備中です。</p>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {post.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover} alt={post.title} className="w-full h-44 object-cover" />
                )}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLE[post.category] ?? 'bg-slate-100 text-slate-600'}`}>
                      {post.category}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-primary leading-snug group-hover:text-cta transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3 flex-1">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />約{post.readingMinutes}分</span>
                    <span className="ml-auto flex items-center gap-1 text-cta font-bold group-hover:gap-2 transition-all">
                      読む <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.some((p) => p.tags.length > 0) && (
          <div className="mt-12 flex flex-wrap items-center gap-2 justify-center text-sm">
            <Tag className="h-4 w-4 text-slate-400" />
            {[...new Set(posts.flatMap((p) => p.tags))].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </main>

      <BlogFooter />
    </div>
  );
}
