import { AccountType } from "@/auth/account";
import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const UserProfileNavigation = React.forwardRef<
  HTMLAnchorElement,
  React.LinkHTMLAttributes<HTMLAnchorElement> & AuthenticatedContentLayoutChildrenProps
>(({ account = null, ...props }, ref) => {
  const Comp = account?.type === AccountType.Registered ? UserProfileButton : SigninButton;
  return <Comp ref={ref} {...props} />;
});
UserProfileNavigation.displayName = "UserProfileNavigation";

const UserProfileButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(className, "relative")}>
        <Link
          href={siteNavigation.userProfile.href}
          className={cn("h-[32px] w-[32px] rounded-full p-0")}
          ref={ref}
          {...props}
        >
          <div className={"absolute left-0 top-0 h-[32px] w-[32px] rounded-full bg-muted-foreground p-0"}></div>
        </Link>
        <div className="absolute left-0 top-0 h-[32px] w-[32px] rounded-full p-0">
          <UserButton
            userProfileMode="navigation"
            afterSignOutUrl="/"
            userProfileUrl={siteNavigation.userProfile.href}
          />
        </div>
      </div>
    );
  },
);
UserProfileButton.displayName = "UserProfileButton";

const SigninButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Link legacyBehavior passHref href={siteNavigation.signIn.href} ref={ref} {...props}>
        <Button className={className} variant="secondary">
          {siteNavigation.signIn.menuTitle}
        </Button>
      </Link>
    );
  },
);
SigninButton.displayName = "SigninButton";
