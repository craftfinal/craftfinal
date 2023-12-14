import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import Link from "next/link";
import React from "react";

export const SignupNavigation = React.forwardRef<
  HTMLAnchorElement,
  React.LinkHTMLAttributes<HTMLAnchorElement> & { user?: UserAccountOrNullOrUndefined }
>(({ user = null, ...props }, ref) => {
  return user ? null : <SignupButton ref={ref} {...props} />;
});
SignupNavigation.displayName = "SignupNavigation";

const SignupButton = React.forwardRef<HTMLAnchorElement, React.LinkHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Link href={siteNavigation.signUp.href} ref={ref} {...props}>
        <Button className={className} variant="default">
          {siteNavigation.signUp.menuTitle}
        </Button>
      </Link>
    );
  },
);
SignupButton.displayName = "SignupButton";
