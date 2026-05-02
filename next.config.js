/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'assets.coingecko.com' }
    ]
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /virtualMasterPool\.js/, message: /Critical dependency: the request of a dependency is an expression/ }
    ];
    return config;
  }
};

module.exports = nextConfig;