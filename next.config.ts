const withPWA = require('next-pwa')({
    dest: 'public', // The destination folder for the service worker file
    // Optional configurations
    // disable: process.env.NODE_ENV === 'development', // Disable in development mode
    // register: true, // Automatically register the service worker
    // scope: '/app', // Optional scope for your service worker
    // sw: 'service-worker.js', // Optional: Specify custom service worker file
});

module.exports = withPWA({
    reactStrictMode: true, // This stays in Next.js configuration
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint errors during build
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during build
    },
});
