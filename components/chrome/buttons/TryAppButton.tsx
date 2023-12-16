// @/components/layout/buttons/TryAppButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import { siteNavigation } from "@/config/navigation";
import UserActionButton from "../../custom/UserActionButton";

export interface TryAppButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function TryAppButton({ account }: TryAppButtonProps) {
  return <UserActionButton signedIn={siteNavigation.enterApp} signedOut={siteNavigation.tryApp} account={account} />;
}
