// @/layouts/MainArticleLayoutMDX.tsx

import MainLayout, { MainLayoutChildrenProps, MainLayoutProps } from "@/layouts/MainLayout";

export interface ArticleLayoutChildrenProps extends MainLayoutChildrenProps {}

interface ArticleLayoutProps extends MainLayoutProps {}
export default async function MainArticleLayoutMDX({ user, children }: Readonly<ArticleLayoutProps>) {
  return (
    <MainLayout user={user}>
      <article className="container prose dark:prose-invert lg:prose-lg dark:lg:prose-lg">{children}</article>
    </MainLayout>
  );
}
