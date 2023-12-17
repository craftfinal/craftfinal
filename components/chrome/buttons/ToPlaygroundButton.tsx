// @/components/layout/buttons/ToPlaygroundButton.tsx

import UserActionButton from "@/components/custom/UserActionButton";
import { siteNavigation } from "@/config/navigation";
import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";

export interface ToPlaygroundButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function ToPlaygroundButton({ account }: ToPlaygroundButtonProps) {
  return (
    <UserActionButton
      signedIn={siteNavigation.antePlayground}
      signedOut={siteNavigation.antePlayground}
      account={account}
      prefetch={false}
    />
  );
}
