import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface SignedInUser {
  user: PrismaUser | null | undefined;
}
export const UserProfileNavigation = React.forwardRef<
  HTMLAnchorElement,
  React.LinkHTMLAttributes<HTMLAnchorElement> & SignedInUser
>(({ user = null, ...props }, ref) => {
  const Comp = user ? UserProfileButton : SigninButton;
  return <Comp ref={ref} {...props} />;
});
UserProfileNavigation.displayName = "UserProfileNavigation";

const UserProfileButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ ...props }, ref) => {
    return (
      <Link href="/user-profile" {...props} ref={ref}>
        <div className={"relative h-[32px] w-[32px] rounded-full bg-muted-foreground"}>
          <div className="absolute left-0 top-0">
            <UserButton userProfileMode="navigation" afterSignOutUrl="/" />
          </div>
        </div>
      </Link>
    );
  },
);
UserProfileButton.displayName = "UserProfileButton";

const SigninButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ ...props }, ref) => {
    return (
      <Link href="/sign-in" ref={ref} {...props}>
        <Button variant="secondary">Sign in</Button>
      </Link>
    );
  },
);
SigninButton.displayName = "SigninButton";
