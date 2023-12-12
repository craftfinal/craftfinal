// @/layouts/ArticleLayoutMDX.tsx

import { MainLayoutProps } from "@/layouts/MainLayout";

interface ArticleLayoutProps extends MainLayoutProps {}
export default async function ArticleLayoutMDX({ children }: Readonly<ArticleLayoutProps>) {
  return <article className="container prose dark:prose-invert lg:prose-lg dark:lg:prose-lg">{children}</article>;
}
