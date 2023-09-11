/**
 * @type {import("next").NextConfig}
 * */
const nextConfig = {
  eslint: {
    // Warning: Only enable this if you do linting through CI before pushing to production!
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/:id(\\d{1,})',
        destination: '/user/:id',
        permanent: true,
      },
      {
        source: '/:id(\\d{1,})/json',
        destination: '/api/user/:id',
        permanent: true,
      },
      {
        source: '/user/:id(\\d{1,})/json',
        destination: '/api/user/:id',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:id/tag.png',
        destination: '/api/riitag/:id*',
      },
      {
        source: '/:id/riitag.wad',
        destination: '/api/user/:id*/riitag.wad',
      },
      {
        source: '/:id/tag.max.png',
        destination: '/api/riitag/:id*?max=true',
      },
      {
        source: '/3ds',
        destination: '/api/update-tag/3ds',
      },
      {
        source: '/switch',
        destination: '/api/update-tag/switch',
      },
      {
        source: '/wii',
        destination: '/api/update-tag/wii',
      },
      {
        source: '/wiiu',
        destination: '/api/update-tag/wiiu',
      },
      {
        source: '/Wiinnertag.xml',
        destination: '/api/account/wiinnertag',
      },
    ];
  },
};

// eslint-disable-next-line unicorn/prefer-module
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.WEBPACK_ANALYZE === 'true',
});

// eslint-disable-next-line unicorn/prefer-module
module.exports = withBundleAnalyzer(nextConfig);
