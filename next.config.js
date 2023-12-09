// next.config.js
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  /*reactStrictMode: true,*/ /*swcMinify: true,*/
};

module.exports = withContentlayer(nextConfig);
