// @/components/layout/main/SignupButton.tsx

import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import { appNavigation } from "@/config/appNavigation";
import UserActionButton from "../../custom/UserActionButton";

export interface SignupButtonProps extends AuthenticatedContentLayoutChildrenProps {}
export default async function SignupButton({ user }: SignupButtonProps) {
  return <UserActionButton user={user} signedIn={appNavigation.afterSignIn} signedOut={appNavigation.signUp} />;
}
