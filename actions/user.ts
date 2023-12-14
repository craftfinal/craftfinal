// @/actions/user.ts

"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrCreateRegisteredUser } from "@/actions/registeredUserActions";
import { getOrCreateTemporaryUser } from "@/actions/temporaryUserActions";
import { siteConfig } from "@/config/site";
import { getExecutedMiddlewareIds } from "@/middlewares/executeMiddleware";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import temporaryAccountMiddleware from "@/middlewares/withTemporaryAccount";
import { prismaClient } from "@/prisma/client";
import { IdSchemaType } from "@/schemas/id";
import { ItemDataUntypedType } from "@/schemas/item";
import { ModificationTimestampType } from "@/types/timestamp";
import Chance from "chance";
import { headers } from "next/headers";
import { InvalidAuthUserErr, UserAccountOrNull } from "../types/user";

export const getCurrentUserOrNull = async (): Promise<UserAccountOrNull> => {
  try {
    return await getCurrentUser();
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getCurrentUserOrNull(): exception in getCurrentUser(): `, error);
    // }
  }
  return null;
};

export const getCurrentUserIdOrNull = async (): Promise<IdSchemaType | null> => {
  let currentUserId = null;
  try {
    const currentUser = await getCurrentUser();
    currentUserId = currentUser?.id ?? null;
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getCurrentUserIdOrNull(): exception in getCurrentUser(): `, error);
    // }
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

export async function getCurrentUser(): Promise<UserAccountOrNull> {
  let authUser = null;
  // Determine which middleware has been executed
  const authMiddlewareIds = getExecutedMiddlewareIds(headers());
  // console.log(`getCurrentUser: middlewares=${authMiddlewareIds}`);

  if (authMiddlewareIds.includes(registeredAccountMiddleware.id)) {
    // Option 1: try to authenticate user basd on Clerk Auth
    try {
      authUser = await getOrCreateRegisteredUser();
    } catch (exc) {
      console.log(`getCurrentUser: Exception in getOrCreateRegisteredUser:`, exc);
    }
  }
  if (!authUser) {
    if (authMiddlewareIds.includes(temporaryAccountMiddleware.id)) {
      // Option 2: Try to authenticate a temporary user based on a cookie
      try {
        authUser = await getOrCreateTemporaryUser();
      } catch (exc) {
        console.log(`getCurrentUser: Exception in getOrCreateTemporaryUser:`, exc);
      }
    }
  }

  if (!authUser) {
    throw new InvalidAuthUserErr(`Invalid authUser:` + authUser);
  }

  return authUser;
}

export const getUserByAccount = async (provider: string, providerAccountId: string): Promise<UserAccountOrNull> => {
  // Find the account and include the related user
  const account = await prismaClient.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: provider,
        providerAccountId: providerAccountId,
      },
    },
    include: { user: true },
  });

  if (!account) {
    throw Error(
      `No user with providerAccountId=${providerAccountId.substring(0, providerAccountId.length / 4)}... found`,
    );
  }

  return { ...account.user, account };
};

export async function getUserById(id: IdSchemaType) {
  if (!id) {
    throw Error;
  }
  return await prismaClient.user.findUnique({
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
