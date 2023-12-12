// @/components/layout/buttons/SignupButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import { siteNavigation } from "@/config/navigation";
import UserActionButton from "../../custom/UserActionButton";

export interface SignupButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function SignupButton({ user }: SignupButtonProps) {
  return <UserActionButton user={user} signedIn={siteNavigation.afterSignIn} signedOut={siteNavigation.signUp} />;
}
