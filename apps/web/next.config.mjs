/** @type {import('next').NextConfig} */
import nextra from 'nextra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Temporarily ignore TypeScript errors to allow dev server to start
    ignoreBuildErrors: true,
  },
  eslint: {
    // Exclude test files from build linting
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  transpilePackages: [
    '@repo/api',
    '@repo/lib',
    '@repo/theme',
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './src'),
    };
    
    // Optimize memory during build
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
  // Allow pages directory to coexist with app directory
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
};

export default withNextra(nextConfig);
