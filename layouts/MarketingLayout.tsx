// @/layouts/MarketingLayout.tsx

import { MainLayoutProps } from "@/layouts/MainLayout";
import AuthenticatedMainArticleLayoutMDX from "@/layouts/mdx/AuthenticatedMainArticleLayoutMDX";
import { ArticleLayoutChildrenProps } from "./mdx/MainArticleLayoutMDX";

export interface MarketingLayoutChildrenProps extends ArticleLayoutChildrenProps {}
interface MarketingLayoutProps extends MainLayoutProps {}
export default async function MarketingLayout({ account: user, children }: Readonly<MarketingLayoutProps>) {
  return (
    <AuthenticatedMainArticleLayoutMDX account={user} className="container">
      {children}
    </AuthenticatedMainArticleLayoutMDX>
  );
}
