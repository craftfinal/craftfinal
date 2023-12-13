// @/components/auth/UserCard.tsx

"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { siteNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { AuthenticatedUser } from "@/types/user";
import { Check, CoffeeIcon, MartiniIcon } from "lucide-react";
import Link from "next/link";

export interface AuthenticatedUserCardProps extends React.ComponentProps<typeof Card> {
  user?: AuthenticatedUser;
}

export interface UserCardProps extends React.ComponentProps<typeof Card> {
  user: AuthenticatedUser;
  authSource: string;
}
export default async function UserCard({ user, authSource, className, ...props }: UserCardProps) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>{authSource}</CardTitle>
        {user ? (
          <CardDescription className="flex items-center justify-between text-sm leading-none">
            <span>Authenticated with {user.authProviderName} user</span>
            <span className="font-mono text-sm font-medium">{user.authProviderId}</span>.{" "}
            <MartiniIcon className="mr-2 h-4 w-4" />
          </CardDescription>
        ) : (
          <CardDescription className="text-sm leading-none">
            <CoffeeIcon className="mr-2 hidden h-4 w-4" />
            <span className="font-mono text-sm font-medium">Not recognized as {authSource} user</span>.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Table>
          <TableBody className="text-xs">
            <TableRow>
              <TableHead className="font-medium">User ID</TableHead>
              <TableCell>
                <span className="font-mono text-sm">{user?.id}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Auth provider ID</TableHead>
              <TableCell>
                <span className="font-mono text-sm">{user?.authProviderId}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Email</TableHead>
              <TableCell>{user?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">First name</TableHead>
              <TableCell>{user?.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Last name</TableHead>
              <TableCell>{user?.lastName}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Link href={siteNavigation.inPlayground.href} title={siteNavigation.inPlayground.title}>
          <Button className="w-full">
            <Check className="mr-2 h-4 w-4" /> {siteNavigation.inPlayground.title}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
