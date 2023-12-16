// @/components/auth/AccountCard.tsx

"use server";

import AccountId from "@/components/custom/AccountId";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CoffeeIcon, MartiniIcon } from "lucide-react";

import { Base58CheckAccountOrNull, Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import AccountTable from "./AccountTable";

export interface AuthenticatedAccountCardProps extends React.ComponentProps<typeof Card> {
  account?: Base58CheckAccountOrNull;
}

export interface AccountCardProps extends React.ComponentProps<typeof Card> {
  account: Base58CheckAccountOrNullOrUndefined;
  provider?: string;
}

export default async function AccountCard({ account, provider, className, ...props }: AccountCardProps) {
  const accountProvider = provider ?? account?.provider;
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>
          <span className="font-normal text-muted-foreground">Account provider: </span>
          <span className="font-mono">{accountProvider}</span>
        </CardTitle>
        {account ? (
          <CardDescription className="flex items-center justify-between text-sm leading-none">
            <span>
              Authenticated with provider <span className="font-xs font-mono">{account.provider}</span> with id{" "}
              <AccountId id={account.providerAccountId} />.
            </span>
            <MartiniIcon className="mr-2 h-4 w-4" />
          </CardDescription>
        ) : (
          <CardDescription className="text-sm leading-none">
            <CoffeeIcon className="mr-2 hidden h-4 w-4" />
            <span>Not recognized as {accountProvider} account</span>.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!account || !accountProvider ? null : <AccountTable account={account} provider={accountProvider} />}
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
}
