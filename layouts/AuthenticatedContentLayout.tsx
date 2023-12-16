// @/components/layout/AuthenticatedContentLayout.tsx

import { Base58CheckAccountOrNull } from "@/types/user";
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
  account?: Base58CheckAccountOrNull;
}
