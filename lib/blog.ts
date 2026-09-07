/**
 * lib/blog.ts
 * Make自動更新ブログの記事ローダ（ビルド時=SSGで実行されるサーバ専用）。
 *
 * 仕組み:
 *  - `content/blog/` に置かれた `.md`（フロントマター付き）を読み込む。
 *  - Make.com のシナリオが GitHub API 経由でこのディレクトリに .md を commit すると、
 *    Vercel の自動デプロイ（本タスクでは無効化＝会長が後で有効化）で記事ページが生成される。
 *  - 追加の管理画面・DBは不要。ファイルを置く＝公開、が唯一の運用。
 *
 * 注意:
 *  - 記事の出所は当社リポジトリ（会長＋Make）のみ＝信頼できる入力として HTML を描画する。
 *    第三者投稿を受け付ける運用に変える場合は sanitize を挟むこと。
 *  - このモジュールは fs を使うためサーバ専用。クライアントコンポーネントから import しない。
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type PostCategory = '雨漏り' | '12条点検' | 'お役立ち' | 'お知らせ';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string; // 任意。フロントマターでは "YYYY-MM-DD" の文字列で指定。
  category: PostCategory | string;
  tags: string[];
  cover?: string;
  author: string;
  readingMinutes: number;
  draft: boolean;
}

export interface Post extends PostMeta {
  html: string;
}

marked.setOptions({ gfm: true, breaks: false });

/**
 * marked が生成した HTML を許可リスト方式でサニタイズする。
 * Make が生成した記事に万一 <script> 等が混入しても除去してから描画する（多層防御）。
 */
function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 'blockquote',
      'strong', 'em', 'b', 'i', 'del', 's', 'code', 'pre', 'br', 'hr', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      th: ['align'],
      td: ['align'],
      code: ['class'],
      span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    // 相対パス（/images/... 等）の画像を許可
    allowProtocolRelative: false,
    transformTags: {
      // 外部リンクは安全のため noopener を付与
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}

/** content/blog 配下の .md ファイル名（拡張子なし）を列挙。ディレクトリが無ければ空配列。 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

/** 日本語主体の本文の概算読了時間（分）。500字/分で丸める。 */
function estimateReadingMinutes(text: string): number {
  const chars = text.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === 'string' && value.trim() !== '') {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/** 厳密な日付文字列だけを採用。2月30日など、Dateが補正する日付も除外する。 */
function toValidDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? value
    : undefined;
}

/** 画面・OG・構造化データ・サイトマップで同じ更新日を使用する。 */
export function getPostModifiedDate(post: Pick<PostMeta, 'date' | 'updated'>): string {
  return post.updated ?? post.date;
}

/** coverの絶対／相対URLを統一し、未設定・無効な値は共通画像へ戻す。 */
export function getPostImageUrl(cover?: string): string {
  const fallback = new URL(DEFAULT_OG_IMAGE.url, SITE_URL).href;
  try {
    const image = new URL(cover?.trim() || fallback, SITE_URL);
    return image.protocol === 'https:' || image.protocol === 'http:' ? image.href : fallback;
  } catch {
    return fallback;
  }
}

/** 1記事を読み込みメタ＋HTMLを返す。存在しない slug は null。 */
export function getPostBySlug(slug: string): Post | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = ['.md', '.mdx']
    .map((ext) => path.join(BLOG_DIR, `${safeSlug}${ext}`))
    .find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const html = sanitize(marked.parse(content, { async: false }) as string);

  return {
    slug: safeSlug,
    title: String(data.title ?? safeSlug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    updated: toValidDate(data.updated),
    category: (data.category as string) ?? 'お役立ち',
    tags: toStringArray(data.tags),
    cover: data.cover ? String(data.cover) : undefined,
    author: String(data.author ?? '株式会社ドローン工務店'),
    readingMinutes: estimateReadingMinutes(content),
    draft: data.draft === true,
    html,
  };
}

/** 公開記事（draft=false）を日付降順で返す。一覧・サイトマップ・トップの新着で使う。 */
export function getAllPosts(): Post[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null && !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** メタのみ（本文HTMLを除く）。一覧描画で軽く扱いたい場合に。 */
export function getAllPostMeta(): PostMeta[] {
  return getAllPosts().map(({ html, ...meta }) => meta);
}
