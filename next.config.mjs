/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['upload.wikimedia.org', 'content.sportslogos.net']
    },
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    },
  };
  
  export default nextConfig;