/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-gesture-handler',
    'react-native-reanimated',
    '@repo/ui',
    '@repo/screens',
    '@repo/theme',
    '@repo/api',
    '@repo/lib',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};

export default nextConfig;

