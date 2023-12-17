// @/actions/temporaryUserAction.ts

"use server";

import { AccountType } from "@/auth/account";
import { getAuthProviderIdCookieName } from "@/middlewares/getAuthProviderIdCookieName";
import temporaryAccountMiddleware, { accountIdToCreateHeader } from "@/middlewares/withTemporaryAccount";
import { prismaClient } from "@/prisma/client";
import { getStateIdFromDbId } from "@/schemas/id";
import { TemporaryAccountIdSchemaType, isValidTemporaryAccountId } from "@/schemas/utils/temporaryAccount";
import { Base58CheckAccount, Base58CheckAccountOrNull, InvalidAccountErr } from "@/types/user";
import { ModelIndicator, stateAccountFromDbAccount } from "@/types/utils/base58checkId";
import { cookies, headers } from "next/headers";
import { getAccountByProviderAccountId } from "./user";

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
  if (accountId && isValidTemporaryAccountId(accountId)) {
    try {
      const existingUser = await getTemporaryAccount(accountId);
      if (existingUser) {
        return existingUser;
      }
    } catch (exc) {
      /* FIXME: It appears that the following call to `deleteTemporaryAccountIdCookie` leads to error 500:
      Error: Cookies can only be modified in a Server Action or Route Handler. 
      Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
      console.log(
        `getOrCreateTemporaryAccount: delete accountId cookie as there is no account with acccountId="${accountId}"` +
          `Exception: ${JSON.stringify(exc)}`,
      );
      deleteTemporaryAccountIdCookie();
      */
      console.log(
        `getOrCreateTemporaryAccount: should delete accountId cookie as there is no account with acccountId="${accountId}"` +
          `Exception: ${JSON.stringify(exc)}`,
      );
    }
  }

  // Read the accountId from headers and create the corresponding `User` and `Account`
  const newAccount = await createOrUpdateTemporaryAccount(accountId);
  console.log(
    `getOrCreateTemporaryAccount: created or updated newTemporaryAccount with accountId=${newAccount.providerAccountId}:`,
    newAccount,
  );

  return newAccount;
}

export async function createOrUpdateTemporaryAccount(providedProviderAccountId?: string): Promise<Base58CheckAccount> {
  const providerAccountId =
    providedProviderAccountId && isValidTemporaryAccountId(providedProviderAccountId)
      ? providedProviderAccountId
      : getIdToCreateTemporaryAccount();

  if (!providerAccountId || !isValidTemporaryAccountId(providerAccountId)) {
    throw Error(`createOrUpdateTemporaryAccount: providerAccountId not available`);
  }

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
    const email = `${getStateIdFromDbId(account.user.id, ModelIndicator.user)}@${provider}.com`;

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
      `getOrResetTemporaryAccount: calling deleteTemporaryAccountIdCookie due to exception in getTemporaryAccount:`,
      exc,
    );
    deleteTemporaryAccountIdCookie();
  }
  return null;
}

export async function deleteTemporaryAccountIdCookie(): Promise<void> {
  const authProviderIdCookieName = getAuthProviderIdCookieName();
  // Delete the cookie as their are no corresponding `Account` and `User` records in the database
  console.log(
    `deleteTemporaryAccountIdCookie: request cookie "${authProviderIdCookieName}" to be deleted if it exists`,
  );
  cookies().delete(authProviderIdCookieName);
}

function getTemporaryAccountIdFromCookie(providerAccountId?: string): TemporaryAccountIdSchemaType | undefined {
  if (providerAccountId) {
    return providerAccountId;
  }
  const authProviderIdCookieName = getAuthProviderIdCookieName();
  const accountId = cookies().get(authProviderIdCookieName)?.value; // Retrieve specific cookie by name
  // console.log(
  //   `getTemporaryAccountIdFromCookie: accountId=${accountId}`,
  //   "\nheaders().getSetCookie():",
  //   headers().getSetCookie(),
  //   `\nheaders().get(${accountIdToCreateHeader})\n`,
  //   headers().get(accountIdToCreateHeader),
  //   "\ncookies().getAll()\n",
  //   cookies().getAll(),
  // );
  return accountId;
}

function getIdToCreateTemporaryAccount(): TemporaryAccountIdSchemaType | null {
  try {
    const accountId = headers().get(accountIdToCreateHeader); // Retrieve specific cookie by name
    if (accountId && isValidTemporaryAccountId(accountId)) {
      console.log(`getIdToCreateTemporaryAccount: accountId=${accountId}`);
      return accountId;
    }
    console.log(
      `getIdToCreateTemporaryAccount: invalid accountId=${accountId} [${typeof accountId}]`,
      "\nheaders().getSetCookie():",
      headers().getSetCookie(),
      `\nheaders().get(${accountIdToCreateHeader})\n`,
      headers().get(accountIdToCreateHeader),
      "\ncookies().getAll()\n",
      cookies().getAll(),
    );
  } catch (error) {
    console.error(`getIdToCreateTemporaryAccount: exception: ${JSON.stringify(error)}`);
  }
  return null;
}
