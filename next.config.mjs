/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb',
          responseLimit: false  // Set your desired limit
        },
      },
};

export default nextConfig;
