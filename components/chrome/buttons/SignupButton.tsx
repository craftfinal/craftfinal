// @/components/layout/buttons/SignupButton.tsx

import { siteNavigation } from "@/config/navigation";
import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import UserActionButton from "../../custom/UserActionButton";

export interface SignupButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function SignupButton({ account }: SignupButtonProps) {
  return <UserActionButton account={account} signedIn={siteNavigation.afterSignIn} signedOut={siteNavigation.signUp} />;
}
