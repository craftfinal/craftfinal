// @/layouts/MainArticleLayoutMDX.tsx

import MainLayout, { MainLayoutChildrenProps, MainLayoutProps } from "@/layouts/MainLayout";
import ArticleMDX from "./ArticleMDX";

export interface ArticleLayoutChildrenProps extends MainLayoutChildrenProps {}

interface ArticleLayoutProps extends MainLayoutProps {}
export default async function MainArticleLayoutMDX({
  account: user,
  className,
  children,
}: Readonly<ArticleLayoutProps>) {
  return (
    <MainLayout account={user}>
      <ArticleMDX className={className}>{children}</ArticleMDX>
    </MainLayout>
  );
}
