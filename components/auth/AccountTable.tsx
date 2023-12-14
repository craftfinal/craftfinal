// @/components/auth/AccountTable.tsx
"use server";
import AccountId from "@/components/custom/AccountId";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { UserAccount } from "@/types/user";

export interface AccountTableProps extends React.ComponentProps<typeof Table> {
  user: UserAccount;
  provider: string;
}

export default async function AccountTable({ user, provider, className, ...props }: AccountTableProps) {
  return (
    <Table className={className} {...props}>
      <TableBody className="text-xs">
        <TableRow>
          <TableHead className="h-auto font-bold">Name</TableHead>
          <TableCell>
            <span className="font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">Email</TableHead>
          <TableCell>{user?.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">Provider</TableHead>
          <TableCell>
            <span className="font-mono font-medium">{provider}</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">User ID</TableHead>
          <TableCell>
            <AccountId id={user.id} className="text-xs" />.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">ID</TableHead>
          <TableCell>
            <AccountId id={user?.account.providerAccountId} className="text-xs" />.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
