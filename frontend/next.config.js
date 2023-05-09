/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
