// @/components/layout/buttons/TryAppButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import { appNavigation } from "@/config/appNavigation";
import UserActionButton from "../../custom/UserActionButton";

export interface TryAppButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function TryAppButton({ user }: TryAppButtonProps) {
  return <UserActionButton signedIn={appNavigation.enterApp} signedOut={appNavigation.tryApp} user={user} />;
}
