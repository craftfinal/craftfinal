// @/components/auth/AccountTable.tsx
"use server";
import { Base58CheckAccount } from "@/types/user";
import AccountId from "@/components/custom/AccountId";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export interface AccountTableProps extends React.ComponentProps<typeof Table> {
  account: Base58CheckAccount;
  provider: string;
}

export default async function AccountTable({ account, provider, className, ...props }: AccountTableProps) {
  return (
    <Table className={className} {...props}>
      <TableBody className="text-xs">
        <TableRow>
          <TableHead className="h-auto font-bold">Name</TableHead>
          <TableCell>
            <span className="font-medium">
              {account?.user?.firstName} {account?.user?.lastName}
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">Email</TableHead>
          <TableCell>{account?.user?.email}</TableCell>
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
            <AccountId id={account.id} className="text-xs" />.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="h-auto font-medium">ID</TableHead>
          <TableCell>
            <AccountId id={account?.providerAccountId} className="text-xs" />.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
