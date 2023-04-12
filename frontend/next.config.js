/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
