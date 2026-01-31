/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This captures any file request (e.g., /A1B2C3.png)
        source: '/:path((?!api|_next|static).*\\.[a-zA-Z0-9]+)',
        // I've inserted your specific Blob ID from your screenshot here
        destination: `https://blsw42tgorremrif.public.blob.vercel-storage.com/:path`,
      },
    ];
  },
};

export default nextConfig;
