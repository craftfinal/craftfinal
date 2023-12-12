// @/layouts/MainArticleLayoutMDX.tsx

import MainLayout, { MainLayoutChildrenProps, MainLayoutProps } from "@/layouts/MainLayout";
import ArticleLayoutMDX from "./ArticleLayoutMDX";

export interface ArticleLayoutChildrenProps extends MainLayoutChildrenProps {}

interface ArticleLayoutProps extends MainLayoutProps {}
export default async function MainArticleLayoutMDX({ user, className, children }: Readonly<ArticleLayoutProps>) {
  return (
    <MainLayout user={user}>
      <ArticleLayoutMDX className={className}>{children}</ArticleLayoutMDX>
    </MainLayout>
  );
}
