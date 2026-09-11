/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return ['/admin/:path*', '/result/:path*', '/api/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'files.manuscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // PDF用の同梱フォント（lib/pdf/fonts）をサーバーレス関数のバンドルに含める。
  // import されないファイルは output file tracing に拾われないため明示する。
  outputFileTracingIncludes: {
    '/api/diagnosis': ['./lib/pdf/fonts/**/*'],
    '/api/diagnosis/process': ['./lib/pdf/fonts/**/*'],
  },
};

module.exports = nextConfig;
