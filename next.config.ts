import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Ignores ESLint errors during build
    },
    typescript: {
        ignoreBuildErrors: true, // Ignores TypeScript errors during build
    },
    reactStrictMode: true
};

const i18nextConfig = {
    ...nextConfig,
};

export default i18nextConfig;
