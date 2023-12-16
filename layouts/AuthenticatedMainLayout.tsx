// @/layouts/AuthenticatedMainLayout.tsx

import { getCurrentAccountOrNull } from "@/actions/user";
import withAuthenticationProviders from "@/auth/withAuthenticationProviders";
import MainLayout, { MainLayoutProps } from "./MainLayout";

export default async function AuthenticatedMainLayout({ className, children }: Readonly<MainLayoutProps>) {
  const AuthenticatedMainLayoutImpl = withAuthenticationProviders(MainLayout);
  const currentAccount = await getCurrentAccountOrNull();

  return (
    <AuthenticatedMainLayoutImpl account={currentAccount} className={className}>
      {children}
    </AuthenticatedMainLayoutImpl>
  );
}
