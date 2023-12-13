import type { User as PrismaUser } from "@prisma/client";

export type AuthenticatedUser = PrismaUser | null | undefined;

export class NotAuthenticatedErr extends Error {}
export class InvalidAuthUserErr extends Error {}
export class UserUpsertFailedErr extends Error {}
