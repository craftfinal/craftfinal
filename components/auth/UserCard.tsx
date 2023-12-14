// @/components/auth/UserCard.tsx

"use server";

import AccountId from "@/components/custom/AccountId";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CoffeeIcon, MartiniIcon } from "lucide-react";

import { UserAccountOrNull, UserAccountOrNullOrUndefined } from "@/types/user";
import AccountTable from "./AccountTable";

export interface AuthenticatedUserCardProps extends React.ComponentProps<typeof Card> {
  user?: UserAccountOrNull;
}

export interface UserCardProps extends React.ComponentProps<typeof Card> {
  user: UserAccountOrNullOrUndefined;
  provider?: string;
}

export default async function UserCard({ user, provider, className, ...props }: UserCardProps) {
  const accountProvider = provider ?? user?.account.provider;
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>
          <span className="font-normal text-muted-foreground">Account provider: </span>
          <span className="font-mono">{accountProvider}</span>
        </CardTitle>
        {user ? (
          <CardDescription className="flex items-center justify-between text-sm leading-none">
            <span>
              Authenticated with provider <span className="font-xs font-mono">{user.account.provider}</span> with id{" "}
              <AccountId id={user.account.providerAccountId} />.
            </span>
            <MartiniIcon className="mr-2 h-4 w-4" />
          </CardDescription>
        ) : (
          <CardDescription className="text-sm leading-none">
            <CoffeeIcon className="mr-2 hidden h-4 w-4" />
            <span>Not recognized as {accountProvider} user</span>.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!user || !accountProvider ? null : <AccountTable user={user} provider={accountProvider} />}
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
}
