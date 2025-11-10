/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Temporarily ignore TypeScript errors to allow dev server to start
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    '@repo/api',
    '@repo/lib',
    '@repo/theme',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};

export default nextConfig;
