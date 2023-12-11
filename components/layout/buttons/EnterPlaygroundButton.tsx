// @/components/layout/buttons/EnterPlaygroundButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import { appNavigation } from "@/config/appNavigation";
import UserActionButton from "../../custom/UserActionButton";

export interface EnterPlaygroundButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function EnterPlaygroundButton({ user }: EnterPlaygroundButtonProps) {
  return (
    <UserActionButton signedIn={appNavigation.enterPlayground} signedOut={appNavigation.enterPlayground} user={user} />
  );
}
