/** FIXME: It is imperative that this file is called `contentlayer.config.js`, not `contentlayer.config.ts`, to avoid the following error when running `npm run build`:
 * npm run build

> craftfinal@0.1.0 build
> next build

   ▲ Next.js 14.0.3
   - Environments: .env

NoConfigFoundError {
  cwd: '/Users/shz/Resources/Code/nextjs/craftfinal',
  configPath: undefined,
  _tag: 'NoConfigFoundError',
  toString: [Function (anonymous)],
  [Symbol()]: {
    cwd: '/Users/shz/Resources/Code/nextjs/craftfinal',
    configPath: undefined
  },
  [Symbol()]: [ 'configPath', 'cwd' ]
}
   Creating an optimized production build  .                                                                                                               
~/Resources/Code/nextjs/craftfinal main* ⇡
 */

import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/*.md`,
  fields: {
    name: { type: "string", required: true },
    image: { type: "string", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (author) => {
        const parts = author._raw.flattenedPath.split("/");
        return parts[parts.length - 1];
      },
    },
  },
}));

export const Fragment = defineDocumentType(() => ({
  name: "Fragment",
  filePathPattern: "**/*.md",
  fields: {
    title: { type: "string", required: true },
    headline: { type: "markdown", required: true },
  },
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    url: { type: "string", resolve: (post) => `/about/${post._raw.flattenedPath}` },
  },
}));

export default makeSource({ contentDirPath: "content", documentTypes: [Author, Fragment, Post] });
// export default makeSource({ contentDirPath: "content", documentTypes: [MarkdownContent] });
