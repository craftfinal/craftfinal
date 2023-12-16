// @/actions/temporaryUserAction.ts

"use server";

import { AccountType } from "@/auth/account";
import { getAuthProviderIdCookieName } from "@/middlewares/getAuthProviderIdCookieName";
import temporaryAccountMiddleware from "@/middlewares/withTemporaryAccount";
import { prismaClient } from "@/prisma/client";
import { StateIdSchemaType } from "@/schemas/id";
import { ModelIndicator, getBase58CheckIdFromUuidAndModel } from "@/types/utils/base58checkId";
import { InvalidAccountErr } from "@/types/user";
import { cookies } from "next/headers";
import { getAccountByProviderAccountId } from "./user";
import { stateAccountFromDbAccount } from "@/types/utils/base58checkId";
import { Base58CheckAccount, Base58CheckAccountOrNull } from "@/types/user";

export const getTemporaryAccountOrNull = async (providerAccountId?: string): Promise<Base58CheckAccountOrNull> => {
  try {
    return await getTemporaryAccount(providerAccountId);
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getTemporaryAccountOrNull(): exception in getTemporaryAccount(): `, error);
    // }
  }
  return null;
};

export async function getTemporaryAccount(providerAccountId?: string): Promise<Base58CheckAccount> {
  const accountId = getTemporaryAccountIdFromCookie(providerAccountId);

  if (!accountId) {
    throw new InvalidAccountErr(`Invalid providerAccountId:` + accountId);
  }

  const provider = temporaryAccountMiddleware.id;

  // If the user exists, fetch data from database
  const existingUser = await getAccountByProviderAccountId(provider, accountId);
  return existingUser;
}

export async function getOrCreateTemporaryAccount(providerAccountId?: string): Promise<Base58CheckAccount> {
  const accountId = providerAccountId ?? getTemporaryAccountIdFromCookie();
  try {
    const existingUser = await getTemporaryAccount(accountId);
    if (existingUser) {
      return existingUser;
    }
  } catch (exc) {
    console.log(`getOrCreateTemporaryAccount: exception in getTemporaryAccount:`, exc);
  }
  // If an accountId cookie is available, create the corresponding `User` and `Account`
  if (!accountId) {
    throw Error(`getOrCreateTemporaryAccount: cannot create tempoary user as accountId is ${accountId}`);
  }

  // Create account
  const newUser = await createOrUpdateTemporaryAccount(accountId);
  // console.log(`getOrCreateTemporaryAccount: created or updated newTemporaryAccount from accountId=${accountId}:`, newUser);

  return newUser;
}

export async function createOrUpdateTemporaryAccount(providerAccountId: string): Promise<Base58CheckAccount> {
  const provider = temporaryAccountMiddleware.id;
  const type = AccountType.Temporary;
  const firstName = "Temporary";
  const lastName = "User";

  try {
    // Upsert account and user
    let account = await prismaClient.account.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      update: {
        user: {
          update: {
            firstName,
            lastName,
          },
        },
      },
      create: {
        provider,
        providerAccountId,
        type,
        user: {
          create: {
            email: "temporary.user@example.com", // Temporary placeholder email
            firstName,
            lastName,
          },
        },
      },
      include: { user: true },
    });

    // Generate the actual email using the user ID
    const email = `${getBase58CheckIdFromUuidAndModel(account.user.id, ModelIndicator.user)}@${provider}.com`;

    // Update the user with the new email
    account = await prismaClient.account.update({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      data: {
        user: {
          update: {
            email,
          },
        },
      },
      include: { user: true },
    });

    return stateAccountFromDbAccount(account);
  } catch (error) {
    console.error(`createOrUpdateTemporaryAccount: error in upserting account and user: ${error}`);
    throw error;
  }
}

// To be called from client compmonents exclusively to enable possibly deleting the cookie
export async function getOrResetTemporaryAccount(providerAccountId?: string): Promise<Base58CheckAccountOrNull> {
  const accountId = providerAccountId ?? getTemporaryAccountIdFromCookie();
  try {
    const existingUser = await getTemporaryAccount(accountId);
    if (existingUser) {
      return existingUser;
    }
  } catch (exc) {
    console.log(
      `getOrResetTemporaryAccount: calling resetTemporaryAccount due to exception in getTemporaryAccount:`,
      exc,
    );
    resetTemporaryAccount();
  }
  // // If an accountId cookie is available, create the corresponding `User` and `Account`
  // if (accountId) {
  //   // Create account
  //   authUser = await createTemporaryAccount(accountId);
  //   console.log(`getOrResetTemporaryAccount: created newTemporaryAccount from accountId=${accountId}:`, authUser);
  // }
  return null;
}

export async function resetTemporaryAccount(): Promise<void> {
  const authProviderIdCookieName = getAuthProviderIdCookieName();
  // Delete the cookie as their are no corresponding `Account` and `User` records in the database
  console.log(`resetTemporaryAccount: request cookie "${authProviderIdCookieName}" to be deleted if it exists`);
  cookies().delete(authProviderIdCookieName);
}

function getTemporaryAccountIdFromCookie(providerAccountId?: string): StateIdSchemaType | undefined {
  if (providerAccountId) {
    return providerAccountId;
  }
  const authProviderIdCookieName = getAuthProviderIdCookieName();
  const accountId = cookies().get(authProviderIdCookieName)?.value; // Retrieve specific cookie by name
  // console.log(
  //   `getTemporaryAccountIdFromCookie: accountId=${accountId}`,
  //   "\nheaders().getSetCookie():",
  //   headers().getSetCookie(),
  //   "\nheaders().get('x-temporaryuser-create-id')\n",
  //   headers().get("x-temporaryuser-create-id"),
  //   "\ncookies().getAll()\n",
  //   cookies().getAll(),
  // );
  return accountId;
}
