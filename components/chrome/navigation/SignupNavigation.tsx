import { AccountType } from "@/auth/account";
import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import Link from "next/link";
import React from "react";

export const SignupNavigation = React.forwardRef<
  HTMLAnchorElement,
  React.LinkHTMLAttributes<HTMLAnchorElement> & { account?: Base58CheckAccountOrNullOrUndefined }
>(({ account = null, ...props }, ref) => {
  return account?.type === AccountType.Registered ? null : <SignupButton ref={ref} {...props} />;
});
SignupNavigation.displayName = "SignupNavigation";

const SignupButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Link legacyBehavior passHref href={siteNavigation.signUp.href} ref={ref} {...props}>
        <Button className={className} variant="default">
          {siteNavigation.signUp.menuTitle}
        </Button>
      </Link>
    );
  },
);
SignupButton.displayName = "SignupButton";
