// @/actions/temporaryUserAction.ts

"use server";

import { AccountType } from "@/auth/account";
import { getAuthProviderIdCookieName } from "@/middlewares/getAuthProviderIdCookieName";
import temporaryAccountMiddleware from "@/middlewares/withTemporaryAccount";
import { prismaClient } from "@/prisma/client";
import { IdSchemaType } from "@/schemas/id";
import { InvalidAuthUserErr, UserAccount, UserAccountOrNull } from "@/types/user";
import { cookies } from "next/headers";
import { getUserByAccount } from "./user";

export const getTemporaryUserOrNull = async (providerAccountId?: string): Promise<UserAccountOrNull> => {
  try {
    return await getTemporaryUser(providerAccountId);
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getTemporaryUserOrNull(): exception in getTemporaryUser(): `, error);
    // }
  }
  return null;
};

export async function getTemporaryUser(providerAccountId?: string): Promise<UserAccountOrNull> {
  const provider = temporaryAccountMiddleware.id;
  const accountId = getTemporaryAccountIdFromCookie(providerAccountId);

  if (!accountId) {
    throw new InvalidAuthUserErr(`Invalid providerAccountId:` + accountId);
  }

  let authUser = null;
  try {
    // If the user exists, fetch data from database
    authUser = await getUserByAccount(provider, accountId);
  } catch (exc) {
    throw new InvalidAuthUserErr(
      `Exception when looking up user with provider=${provider} providerAccountId=${accountId}`,
    );
  }
  return authUser;
}

export async function getOrCreateTemporaryUser(providerAccountId?: string): Promise<UserAccountOrNull> {
  let authUser = null;
  const accountId = providerAccountId ?? getTemporaryAccountIdFromCookie();
  try {
    authUser = await getTemporaryUser(accountId);
    if (authUser) {
      return authUser;
    }
  } catch (exc) {
    console.log(`getOrCreateTemporaryUser: exception in getTemporaryUser:`, exc);
  }
  // If an accountId cookie is available, create the corresponding `User` and `Account`
  if (accountId) {
    // Create account
    authUser = await createTemporaryUser(accountId);
    console.log(`getOrCreateTemporaryUser: created newTemporaryUser from accountId=${accountId}:`, authUser);
  }
  return authUser;
}

export async function createTemporaryUser(providerAccountId: string): Promise<UserAccount> {
  // Create user
  const email = "temporary@example.com";
  const firstName = "Temporary";
  const lastName = "User";
  const provider = temporaryAccountMiddleware.id;
  const type = AccountType.Temporary;
  try {
    const newUser = await prismaClient.user.create({
      data: {
        email,
        firstName,
        lastName,
      },
    });

    const newAccount = await prismaClient.account.create({
      data: {
        userId: newUser.id,
        provider,
        type,
        providerAccountId: providerAccountId,
        // Include any other necessary fields
      },
    });
    const newAccountUser = { ...newUser, account: newAccount };
    return newAccountUser;
  } catch (error) {
    console.error(`Error creating temporary user account: ${error}`);
    // Handle any errors appropriately
    throw error;
  }
}

// To be called from client compmonents exclusively to enable possibly deleting the cookie
export async function getOrResetTemporaryUser(providerAccountId?: string): Promise<UserAccountOrNull> {
  let authUser = null;
  const accountId = providerAccountId ?? getTemporaryAccountIdFromCookie();
  try {
    authUser = await getTemporaryUser(accountId);
    if (authUser) {
      return authUser;
    }
  } catch (exc) {
    console.log(`getOrResetTemporaryUser: calling resetTemporaryUser due to exception in getTemporaryUser:`, exc);
    resetTemporaryUser();
  }
  // // If an accountId cookie is available, create the corresponding `User` and `Account`
  // if (accountId) {
  //   // Create account
  //   authUser = await createTemporaryUser(accountId);
  //   console.log(`getOrResetTemporaryUser: created newTemporaryUser from accountId=${accountId}:`, authUser);
  // }
  return authUser;
}

export async function resetTemporaryUser(): Promise<void> {
  const authProviderIdCookieName = getAuthProviderIdCookieName();
  // Delete the cookie as their are no corresponding `Account` and `User` records in the database
  console.log(`resetTemporaryUser: request cookie "${authProviderIdCookieName}" to be deleted if it exists`);
  cookies().delete(authProviderIdCookieName);
}

function getTemporaryAccountIdFromCookie(providerAccountId?: string): IdSchemaType | undefined {
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
