// @/mdx-components.tsx

import MarkdownImage from "@/mdx/components/Image";
import { MDXComponents } from "mdx/types";
import { PropsWithChildren } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use the custom MarkdownImage for image tags
    img: MarkdownImage,
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }: PropsWithChildren) => (
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl md:text-center">{children}</h1>
    ),
    h2: ({ children }: PropsWithChildren) => <h2 className="text-zinc-50">{children}</h2>,
    ...components,
  };
}
