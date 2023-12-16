import type { Account, User } from "@prisma/client";

export class NotAuthenticatedErr extends Error {}
export class InvalidAccountErr extends Error {}
export class AccountUpsertFailedErr extends Error {}

export type AccountWithUser = Account & {
  user: User;
};

export type Base58CheckUser = Omit<User, "id"> & {
  id: string; // base58check format
};

export type Base58CheckUserOrNull = Base58CheckUser | null;
export type Base58CheckUserOrNullOrUndefined = Base58CheckUser | null | undefined;

export type Base58CheckAccount = Omit<Account, "id" | "user"> & {
  id: string; // base58check format
  user: Base58CheckUser;
};

export type Base58CheckAccountOrNull = Base58CheckAccount | null;
export type Base58CheckAccountOrNullOrUndefined = Base58CheckAccount | null | undefined;
