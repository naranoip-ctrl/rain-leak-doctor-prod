import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, ChevronRight, Camera, ArrowRight } from 'lucide-react';
import { getAllPosts, getPostBySlug, getPostImageUrl, getPostModifiedDate } from '@/lib/blog';
import { COMPANY_URL, DEFAULT_OG_IMAGE, ORGANIZATION_ID, SITE_NAME, SITE_URL } from '@/lib/site';
import { BlogHeader, BlogFooter } from '@/components/BlogChrome';
import { TrackedLineLink } from '@/components/TrackedLineLink';

export const dynamic = 'force-static';
export const dynamicParams = false;

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
  const image = post.cover
    ? { url: getPostImageUrl(post.cover), alt: post.title }
    : { ...DEFAULT_OG_IMAGE, url: getPostImageUrl() };
  return {
    title: `${post.title} | 雨漏りドクター`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      publishedTime: post.date,
      modifiedTime: getPostModifiedDate(post),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
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

  const url = `${SITE_URL}/blog/${post.slug}`;
  const modifiedDate = getPostModifiedDate(post);
  const otherPosts = getAllPosts().filter((candidate) => candidate.slug !== post.slug);
  const relatedPosts = [
    ...otherPosts.filter((candidate) => candidate.category === post.category),
    ...otherPosts.filter((candidate) => candidate.category !== post.category),
  ].slice(0, 2);

  // 構造化データ（BlogPosting）。検索での見え方を助ける。
  const jsonLd = [{
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: post.author,
      url: COMPANY_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: '株式会社ドローン工務店',
      url: COMPANY_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: getPostImageUrl(post.cover),
  }, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'お役立ち情報', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }];

  return (
    <div className="editorial-page min-h-screen bg-slate-50 font-sans">
      <BlogHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
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

        <div className="mt-4 mb-8 pb-6 border-b border-slate-200 text-xs sm:text-sm text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" aria-hidden="true" />公開 <time dateTime={post.date}>{post.date}</time></span>
            {post.updated && post.updated !== post.date && (
              <span>更新 <time dateTime={modifiedDate}>{modifiedDate}</time></span>
            )}
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" />約{post.readingMinutes}分で読めます</span>
          </div>
          <p className="mt-3">
            著者：<a href="https://loki-drone.com/company/" className="text-primary underline underline-offset-4 hover:text-cta">{post.author}</a>
          </p>
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

        {relatedPosts.length > 0 && (
          <section className="mt-10" aria-labelledby="related-posts-heading">
            <h2 id="related-posts-heading" className="text-lg font-bold text-primary">あわせて読む</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-primary/40 transition-colors"
                >
                  <span className="text-xs text-slate-500">{relatedPost.category}</span>
                  <h3 className="mt-1 text-sm font-bold leading-relaxed text-primary group-hover:text-cta">{relatedPost.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

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
