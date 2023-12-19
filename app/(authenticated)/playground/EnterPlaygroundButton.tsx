// @/app/(authenticated)/playground/page.tsx
"use server;";
import { getCurrentAccountOrNull } from "@/actions/user";
import { AuthenticatedAccountCardProps } from "@/components/auth/AccountCard";
import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default async function EnterPlaygroundButton({ account, className }: AuthenticatedAccountCardProps) {
  // Fetch current user on the server
  const currentAccount = account ?? (await getCurrentAccountOrNull());

  return !currentAccount ? null : (
    <Link
      href={siteNavigation.inPlayground.href}
      title={siteNavigation.inPlayground.title}
      className={className}
      passHref
      legacyBehavior
    >
      <Button className="">
        <CheckIcon className="mr-2 h-4 w-4" /> {siteNavigation.inPlayground.title}
      </Button>
    </Link>
  );
}
