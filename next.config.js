module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://217.144.104.99:3000/api/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    domains: ['217.144.104.99:3000', '217.144.104.99', 'nosheno.com'],
  },
};
