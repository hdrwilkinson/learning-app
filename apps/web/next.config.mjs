/** @type {import('next').NextConfig} */
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
    };
    return config;
  },
};

export default nextConfig;

