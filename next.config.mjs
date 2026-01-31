/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This handles any URL that looks like a file (e.g., /ABC123.png)
        source: '/:path((?!api|_next|static).*\\.[a-zA-Z0-9]+)',
        destination: `https://YOUR_BLOB_ID.public.blob.vercel-storage.com/:path`,
      },
    ];
  },
};

export default nextConfig;
