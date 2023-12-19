// @/app/(authenticated)/playground/page.tsx

"use client";

import { getIronSessionAccountOrNull } from "@/auth/iron-session/ironSessionActions";
import { AuthenticatedAccountCardProps } from "@/components/auth/AccountCard";
import { CreateIronSessionAccountButton } from "@/components/auth/CreateIronSessionAccountButton";
import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EnterPlaygroundButtonClient({ account, className }: AuthenticatedAccountCardProps) {
  // Fetch current user on the server
  const [currentAccount, setCurrentAccount] = useState<Base58CheckAccountOrNullOrUndefined>(account);

  useEffect(() => {
    if (currentAccount === undefined) {
      // Async function to get account
      const fetchAccount = async () => {
        const fetchedAccount = await getIronSessionAccountOrNull();
        setCurrentAccount(fetchedAccount ?? null);
      };
      fetchAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !currentAccount ? (
    <CreateIronSessionAccountButton setCurrentAccount={setCurrentAccount} />
  ) : (
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
