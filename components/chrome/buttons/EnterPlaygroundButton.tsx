// @/components/layout/buttons/EnterPlaygroundButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import { siteNavigation } from "@/config/navigation";
import UserActionButton from "../../custom/UserActionButton";

export interface EnterPlaygroundButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function EnterPlaygroundButton({ user }: EnterPlaygroundButtonProps) {
  return (
    <UserActionButton signedIn={siteNavigation.antePlayground} signedOut={siteNavigation.antePlayground} user={user} />
  );
}
