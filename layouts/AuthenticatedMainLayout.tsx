// @/layouts/AuthenticatedMainLayout.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import withAuthenticationProviders from "@/auth/withAuthenticationProviders";
import MainLayout, { MainLayoutProps } from "./MainLayout";

export default async function AuthenticatedMainLayout({ className, children }: Readonly<MainLayoutProps>) {
  const AuthenticatedMainLayoutImpl = withAuthenticationProviders(MainLayout);
  const currentUser = await getCurrentUserOrNull();

  return (
    <AuthenticatedMainLayoutImpl user={currentUser} className={className}>
      {children}
    </AuthenticatedMainLayoutImpl>
  );
}
