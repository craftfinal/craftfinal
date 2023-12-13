"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthenticatedUser as getClerkAuthenticatedUser } from "@/auth/clerk/userActions";
import { getAuthenticatedUser as getTemporaryAuthenticatedUser } from "@/auth/temporary/userActions";
import { siteConfig } from "@/config/site";
import { getExecutedMiddlewareIds } from "@/middlewares/executeMiddleware";
import { prisma } from "@/prisma/client";
import { IdSchemaType } from "@/schemas/id";
import { ItemDataUntypedType } from "@/schemas/item";
import { ModificationTimestampType } from "@/types/timestamp";
import type { User as PrismaUser, User } from "@prisma/client";
import Chance from "chance";
import { headers } from "next/headers";
import { InvalidAuthUserErr } from "../types/user";

export const getCurrentUserOrNull = async (): Promise<PrismaUser | null> => {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`actions/user:getCurrentUserOrNull(): exception in getCurrentUser(): `, error);
    }
  }
  return null;
};

export const getCurrentUserIdOrNull = async (): Promise<IdSchemaType | null> => {
  let currentUserId = null;
  try {
    const currentUser = await getCurrentUser();
    currentUserId = currentUser?.id;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`actions/user:getCurrentUserIdOrNull(): exception in getCurrentUser(): `, error);
    }
  }
  return currentUserId;
};

/**
 * Ensure that a `User` exists in the database, persist its unique `userId`
 * as a cookie and return a promise of the `User` object
 * There are two ways to obtain the `userId`:
 * 1. If ClerkAuth middleware has been executed, a call to `currentUser()` will return
 *    the `AuthProviderId`, which allows us to either create a user or retrieve it
 * 2. Otherwise, if the user accepts cookies, a cookie may have been set and
 *    we can obtain the userId from the cookie
 * @returns Promise<PrismaUser>
 */

export async function getCurrentUser(): Promise<PrismaUser> {
  let authUser = null;
  // Determine which middleware has been executed
  const authMiddlewareIds = getExecutedMiddlewareIds(headers());
  // console.log(`getCurrentUser: middlewares=${authMiddlewareIds}`);

  if (authMiddlewareIds.includes("clerkauth")) {
    // Option 1: try to authenticate user basd on Clerk Auth
    authUser = getClerkAuthenticatedUser();
  }
  if (!authUser) {
    // Option 2: Try to authenticate a temporary user based on a cookie
    authUser = getTemporaryAuthenticatedUser();
  }

  if (!authUser) {
    throw new InvalidAuthUserErr(`Invalid authUser:` + authUser);
  }

  return authUser;
}

export const getUserByAuthProviderId = async (authProviderId: string): Promise<User | undefined> => {
  const user = await prisma.user.findUnique({
    where: { authProviderId: authProviderId },
  });
  if (!user) {
    throw Error(`No user with authProviderId=${authProviderId.substring(0, authProviderId.length / 4)} found`);
  }

  return user;
};

export async function getUserById(id: IdSchemaType) {
  if (!id) {
    throw Error;
  }
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getUserLastModifiedById(id: IdSchemaType): Promise<ModificationTimestampType> {
  if (!id) {
    throw Error;
  }
  const user = await getUserById(id);
  return user?.lastModified as ModificationTimestampType;
}

export async function getRandomUserData(id: IdSchemaType): Promise<ItemDataUntypedType> {
  const chance = new Chance();
  const primaryEmail = chance.email({ domain: siteConfig.canonicalDomainName });
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.last({ nationality: "en" });
  const userData = {
    id,
    primaryEmail,
    firstName,
    lastName,
  };
  return userData;
}
