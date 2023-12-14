// @/components/auth/TemporarayUserCleanup.tsx

"use client";

import { getOrResetTemporaryUser } from "@/actions/temporaryUserActions";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { useEffect, useState } from "react";
import UserCard, { AuthenticatedUserCardProps } from "./UserCard";

export default function TemporaryUserCleanup(props: AuthenticatedUserCardProps) {
  const [temporaryUser, setTemporaryUser] = useState<UserAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (temporaryUser === undefined) {
      const initializeTemporaryUser = async () => {
        // Fetch current user by calling a server action
        try {
          const user = await getOrResetTemporaryUser();
          setTemporaryUser(user);
        } catch (exc) {
          console.log(`TemporaryUserCleanup: exception in getOrResetTemporaryUser:`, exc);
        }
      };
      initializeTemporaryUser();
    }
  }, [temporaryUser]); // Empty dependency array to run only once after component mounts

  return !temporaryUser ? null : <UserCard {...props} user={temporaryUser} />;
}
