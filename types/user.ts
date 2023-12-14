import type { Account, User } from "@prisma/client";

export type UserAccount = User & { account: Account };
export type UserAccountOrNull = UserAccount | null;
export type UserAccountOrNullOrUndefined = UserAccount | null | undefined;

export class NotAuthenticatedErr extends Error {}
export class InvalidAuthUserErr extends Error {}
export class UserUpsertFailedErr extends Error {}
