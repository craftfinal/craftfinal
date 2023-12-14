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
          <TableHead className="font-medium">Provider</TableHead>
          <TableCell>
            <span className="font-mono font-bold">{provider}</span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">User ID</TableHead>
          <TableCell>
            <AccountId id={user.id} className="text-xs" />.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="font-medium">ID</TableHead>
          <TableCell>
            <AccountId id={user?.account.providerAccountId} className="text-xs" />.
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
  );
}
