// @/layouts/ArticleLayoutMDX.tsx

import { MainLayoutProps } from "@/layouts/MainLayout";
import { cn } from "@/lib/utils";

interface ArticleLayoutProps extends MainLayoutProps {}
export default async function ArticleLayoutMDX({ className, children }: Readonly<ArticleLayoutProps>) {
  return <article className={cn("prose dark:prose-invert md:prose-lg lg:prose-xl", className)}>{children}</article>;
}
