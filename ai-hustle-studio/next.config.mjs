/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // enables the app/ directory routing
  },
  trailingSlash: false, // optional, ensures URLs don't require a trailing slash
  reactStrictMode: true,
};

export default nextConfig;
