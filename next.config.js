/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["http://51.79.38.102:3000/", "51.79.38.102"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://51.79.38.102:3000/api/:path*", // Proxy to Backend
      },
    ];
  },
};
