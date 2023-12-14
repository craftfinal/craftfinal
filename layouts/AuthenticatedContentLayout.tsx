// @/components/layout/AuthenticatedContentLayout.tsx

import { UserAccountOrNull } from "@/types/user";
import { ReactNode } from "react";

import AuthenticatedMainLayout from "./AuthenticatedMainLayout";
export default async function AuthenticatedContentLayout({ children, ...props }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthenticatedMainLayout className="container" {...props}>
      {children}
    </AuthenticatedMainLayout>
  );
}

export interface AuthenticatedContentLayoutChildrenProps {
  user?: UserAccountOrNull;
}
