import type { MetadataRoute } from 'next';
import { getAllPosts, getPostModifiedDate } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

/**
 * サイトマップ。静的ページ＋ブログ記事を列挙する。
 * Make が content/blog に .md を足すたび、再デプロイで自動的にエントリが増える。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/company`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/diagnosis`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: getPostModifiedDate(post) || undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
