// next.config.mjs

import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  /*reactStrictMode: true,*/ /*swcMinify: true,*/
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

// FIXME: Error when combining `withMDZ` with `withContentlayer`:
// <w> [webpack.cache.PackFileCacheStrategy/webpack.FileSystemInfo] Parsing of /Users/shz/Resources/Code/nextjs/craftfinal/node_modules/@contentlayer/core/dist/dynamic-build.js for build dependencies failed at 'import(`file://${compiledConfigPath}`)'.
// import { withContentlayer } from "next-contentlayer";
// export default withContentlayer(withMDX(nextConfig));

// NOTE: To use contentlayer without `@next/mdx`, rename this file,
// i.e., `next.config.mjs` to `next.config.js`
