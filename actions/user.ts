// @/actions/user.ts

"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrCreateRegisteredAccount } from "@/actions/registeredAccountActions";
import { getOrCreateIronSessionAccount } from "@/auth/iron-session/ironSessionActions";
import { ironSessionAccountMiddlewareId } from "@/auth/iron-session/lib";
import { getExecutedMiddlewareIds } from "@/middlewares/executeMiddleware";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import { prismaClient } from "@/prisma/client";
import { StateIdSchemaType } from "@/schemas/id";
import {
  Base58CheckAccount,
  Base58CheckAccountOrNull,
  Base58CheckUser,
  Base58CheckUserOrNull,
  InvalidAccountErr,
} from "@/types/user";
import { stateAccountFromDbAccount, stateUserFromDbUser } from "@/types/utils/base58checkId";
import { headers } from "next/headers";

export async function getAccountByProviderAccountId(
  provider: string,
  providerAccountId: string,
): Promise<Base58CheckAccount> {
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
      `No account with providerAccountId=${providerAccountId.substring(0, providerAccountId.length / 4)}... found`,
    );
  }

  return stateAccountFromDbAccount(account);
}

export async function getCurrentAccountOrNull(): Promise<Base58CheckAccountOrNull> {
  try {
    return await getCurrentAccount();
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getCurrentAccountOrNull(): exception in getCurrentAccount(): `, error);
    // }
  }
  return null;
}

export async function getCurrentAccountIdOrNull(): Promise<StateIdSchemaType | null> {
  let currentAccountId = null;
  try {
    const currentAccount = await getCurrentAccount();
    currentAccountId = currentAccount?.id ?? null;
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getCurrentAccountIdOrNull(): exception in getCurrentAccount(): `, error);
    // }
  }
  return currentAccountId;
}

export async function getCurrentAccount(): Promise<Base58CheckAccount> {
  let existingAccount = null;
  // Determine which middleware has been executed
  const authMiddlewareIds = getExecutedMiddlewareIds(headers());
  // console.log(`getCurrentAccount: middlewares=${authMiddlewareIds}`);

  if (authMiddlewareIds.includes(registeredAccountMiddleware.id)) {
    // Option 1: try to authenticate user basd on Clerk Auth
    try {
      existingAccount = await getOrCreateRegisteredAccount();
    } catch (exc) {
      // console.log(`getCurrentAccount: Exception in getOrCreateRegisteredAccount:`, exc);
    }
  }
  if (!existingAccount) {
    if (authMiddlewareIds.includes(ironSessionAccountMiddlewareId)) {
      // Option 2: Try to authenticate a temporary account based on a cookie
      try {
        existingAccount = await getOrCreateIronSessionAccount();
      } catch (exc) {
        console.log(`getCurrentAccount: Exception in getOrCreateIronSession:`, exc);
      }
    }
  }

  if (!existingAccount) {
    throw new InvalidAccountErr(`Invalid existingAccount:` + existingAccount);
  }

  // Convert the user ID to base58check format
  // return userAccountFromAccount(existingAccount);
  return existingAccount;
}

export async function getCurrentUserOrNull(): Promise<Base58CheckUserOrNull> {
  const currentAccount = await getCurrentAccountOrNull();
  return currentAccount && stateUserFromDbUser(currentAccount.user);
}

export async function getCurrentUserIdOrNull(): Promise<StateIdSchemaType | null> {
  const currentAccount = await getCurrentAccountOrNull();
  return currentAccount?.user?.id ?? null;
}

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

export async function getCurrentUser(): Promise<Base58CheckUser> {
  const currentAccount = await getCurrentAccount();
  return stateUserFromDbUser(currentAccount.user);
}

/* Unused function
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
 */

/* Unused function
import { ModificationTimestampType } from "@/types/timestamp";
export async function getUserLastModifiedById(id: IdSchemaType): Promise<ModificationTimestampType> {
  if (!id) {
    throw Error;
  }
  const user = await getUserById(id);
  return user?.lastModified as ModificationTimestampType;
}
 */

/* Unused function
import { siteConfig } from "@/config/site";
import { ItemDataUntypedType } from "@/schemas/item";
import Chance from "chance";
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
 */
