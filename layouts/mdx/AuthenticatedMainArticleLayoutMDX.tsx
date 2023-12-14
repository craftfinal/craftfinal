import { MainLayoutProps } from "@/layouts/MainLayout";
import AuthenticatedMainLayout from "../AuthenticatedMainLayout";
import ArticleMDX from "./ArticleMDX";

export default async function AuthenticatedMainArticleLayoutMDX({ className, children }: Readonly<MainLayoutProps>) {
  return (
    <AuthenticatedMainLayout>
      <ArticleMDX className={className}>{children}</ArticleMDX>
    </AuthenticatedMainLayout>
  );
}
