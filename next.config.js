const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**': [path.join(process.cwd(), 'prisma', 'dev.db')],
    'app/**': [path.join(process.cwd(), 'prisma', 'dev.db')],
  },
};

module.exports = nextConfig;
