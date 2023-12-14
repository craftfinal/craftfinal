import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const UserProfileNavigation = React.forwardRef<
  HTMLAnchorElement,
  React.LinkHTMLAttributes<HTMLAnchorElement> & AuthenticatedContentLayoutChildrenProps
>(({ user = null, ...props }, ref) => {
  const Comp = user ? UserProfileButton : SigninButton;
  return <Comp ref={ref} {...props} />;
});
UserProfileNavigation.displayName = "UserProfileNavigation";

const UserProfileButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ ...props }, ref) => {
    return (
      <Link href={siteNavigation.userProfile.href} {...props} ref={ref}>
        <div className={"relative h-[32px] w-[32px] rounded-full bg-muted-foreground"}>
          <div className="absolute left-0 top-0">
            <UserButton
              userProfileMode="navigation"
              afterSignOutUrl="/"
              userProfileUrl={siteNavigation.userProfile.href}
            />
          </div>
        </div>
      </Link>
    );
  },
);
UserProfileButton.displayName = "UserProfileButton";

const SigninButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Link href={siteNavigation.signIn.href} ref={ref} {...props}>
        <Button className={className} variant="secondary">
          {siteNavigation.signIn.menuTitle}
        </Button>
      </Link>
    );
  },
);
SigninButton.displayName = "SigninButton";
