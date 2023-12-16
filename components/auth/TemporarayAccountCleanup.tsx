// @/components/auth/TemporarayAccountCleanup.tsx

"use client";

import { getOrResetTemporaryAccount } from "@/actions/temporaryAccountActions";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { useEffect, useState } from "react";
import AccountCard, { AuthenticatedAccountCardProps } from "./AccountCard";

export default function TemporaryAccountCleanup(props: AuthenticatedAccountCardProps) {
  const [temporaryAccount, setTemporaryAccount] = useState<Base58CheckAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (temporaryAccount === undefined) {
      const initializeTemporaryAccount = async () => {
        // Fetch current account by calling a server action
        try {
          const account = await getOrResetTemporaryAccount();
          setTemporaryAccount(account);
        } catch (exc) {
          console.log(`TemporaryAccountCleanup: exception in getOrResetTemporaryAccount:`, exc);
        }
      };
      initializeTemporaryAccount();
    }
  }, [temporaryAccount]); // Empty dependency array to run only once after component mounts

  return !temporaryAccount ? null : <AccountCard {...props} account={temporaryAccount} />;
}
