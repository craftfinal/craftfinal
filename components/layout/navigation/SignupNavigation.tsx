import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/siteNavigation";
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";
import { ReactNode } from "react";

export function SignupNavigation({ user, signedInChildren, children }: SignupNavigationProps) {
  if (user === undefined) {
    return null;
  }
  return user ? (
    <SignupNavigationWithUser signedInChildren={signedInChildren} />
  ) : (
    <SignupNavigationWithoutUser>{children}</SignupNavigationWithoutUser>
  );
}
function SignupNavigationWithUser({ signedInChildren }: { signedInChildren?: ReactNode }) {
  return signedInChildren ? <Link href={siteNavigation.antePlayground.href}>{signedInChildren}</Link> : null;
}
function SignupNavigationWithoutUser({ children }: { children?: ReactNode }) {
  return children ? (
    <Link href={siteNavigation.signUp.href}>{children}</Link>
  ) : (
    <Button variant="default">
      <Link href={siteNavigation.signUp.href}>{siteNavigation.signUp.title}</Link>
    </Button>
  );
}
interface SignupNavigationProps {
  user?: PrismaUser | null;
  signedInChildren?: ReactNode;
  children?: ReactNode;
}
