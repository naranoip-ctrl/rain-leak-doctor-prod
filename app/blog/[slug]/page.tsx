import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, ChevronRight, Camera, ArrowRight } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { BlogHeader, BlogFooter } from '@/components/BlogChrome';
import { TrackedLineLink } from '@/components/TrackedLineLink';

export const dynamic = 'force-static';
export const dynamicParams = false;

const SITE_URL = 'https://aiamamori.com';

// draft:true は getAllPosts で除外済み＝下書きは静的生成・sitemap・一覧いずれにも出ない。
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) return { title: '記事が見つかりません | 雨漏りドクター' };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | 雨漏りドクター`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) notFound();

  // 構造化データ（BlogPosting）。検索での見え方を助ける。
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: '株式会社ドローン工務店',
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    ...(post.cover ? { image: `${SITE_URL}${post.cover}` } : {}),
  };

  return (
    <div className="editorial-page min-h-screen bg-slate-50 font-sans">
      <BlogHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container max-w-3xl py-10 md:py-14">
        {/* パンくず */}
        <nav className="flex items-center gap-1 text-xs text-slate-500 mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-primary">トップ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-primary">お役立ち情報</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-400 truncate">{post.title}</span>
        </nav>

        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4">
          {post.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-primary leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-slate-400 mt-4 mb-8 pb-8 border-b border-slate-200">
          <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />約{post.readingMinutes}分で読めます</span>
        </div>

        {/* 本文（Markdown→HTML）。出所は当社リポジトリのみ＝信頼済み入力。 */}
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* 記事末CTA：主要導線（点検相談 / LINE）へ */}
        <div className="mt-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl md:text-2xl font-black mb-3">気になる症状は、まず点検から。</h2>
          <p className="text-slate-300 text-sm mb-6">
            大阪・関西で現地点検を承ります。点検だけのご依頼も歓迎です。即決は求めません。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#services"
              className="inline-flex items-center justify-center h-12 px-6 bg-cta hover:bg-cta-dark text-white font-bold rounded-full transition-all"
            >
              <Camera className="h-5 w-5 mr-2" />雨漏り点検について見る
            </Link>
            <TrackedLineLink
              location="blog_article_footer"
              label="LINEで相談（匿名OK）"
              className="inline-flex items-center justify-center h-12 px-6 bg-line hover:bg-line-dark text-white font-bold rounded-full transition-all"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-cta transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />お役立ち情報の一覧へ
          </Link>
        </div>
      </article>

      <BlogFooter />
    </div>
  );
}
