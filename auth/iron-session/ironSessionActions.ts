// @/auth/iron-session/ironSessionActions.ts

"use server";

import { getAccountByProviderAccountId } from "@/actions/user";
import { AccountType } from "@/auth/account";
import { AppRouteType } from "@/config/appRoutes";
import ironSessionMiddleware from "@/middlewares/withIronSessionAccountOld";
import { prismaClient } from "@/prisma/client";
import { generateStateId, getStateIdFromDbId } from "@/schemas/id";
import { Base58CheckAccount, Base58CheckAccountOrNull, InvalidAccountErr } from "@/types/user";
import { ModelIndicator, stateAccountFromDbAccount } from "@/types/utils/base58checkId";
import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import {
  IronSessionIdSchemaType,
  SessionData,
  isValidIronSessionId,
  revalidateAuthenticatedPaths,
  sessionOptions,
} from "./lib";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getIronSessionAccountOrNull = async (providerAccountId?: string): Promise<Base58CheckAccountOrNull> => {
  try {
    return await getIronSessionAccount(providerAccountId);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`getIronSessionAccountOrNull(): exception in getIronSessionAccount(): `, error);
    }
  }
  return null;
};

export async function getIronSessionAccount(providerAccountId?: string): Promise<Base58CheckAccount> {
  const accountId = await getIronSessionAccountId(providerAccountId);

  if (!accountId) {
    throw new InvalidAccountErr(`Invalid providerAccountId:` + accountId);
  }

  const provider = ironSessionMiddleware.id;

  // If the user exists, fetch data from database
  const existingAccount = await getAccountByProviderAccountId(provider, accountId);
  return existingAccount;
}

export async function getOrCreateIronSessionAccount(): Promise<Base58CheckAccount> {
  try {
    const existingAccount = await getIronSessionAccount();
    if (existingAccount) {
      return existingAccount;
    }
  } catch (exc) {
    console.log(`getOrCreateIronSession:`, exc);
  }

  // Read the accountId from headers and create the corresponding `User` and `Account`
  try {
    const newAccount = await createOrUpdateIronSession();
    console.log(
      `getOrCreateIronSession: created or updated newIronSession with accountId=${newAccount.providerAccountId}:`,
      newAccount,
    );

    return newAccount;
  } catch (exc) {
    console.log(`getOrCreateIronSession:`, exc);
    throw exc;
  }
}

export async function createOrUpdateIronSession(providedProviderAccountId?: string): Promise<Base58CheckAccount> {
  const providerAccountId = providedProviderAccountId ?? (await getIronSessionAccountId());
  if (!providerAccountId || !isValidIronSessionId(providerAccountId)) {
    throw Error(`createOrUpdateIronSession: invalid accountId: ${providerAccountId}`);
  }

  const provider = ironSessionMiddleware.id;
  const type = AccountType.IronSession;
  const firstName = "Iron Session";
  const lastName = "User";
  // Initialize to unique but temporary placeholder email
  // Note: multiple instances of this function may run concurrently;
  // therefore, the id must be different on every invocation. This will be corrected
  // down below when we update the email to correspond to the userId
  const tempEmail = `${generateStateId("account")}@example.com`;

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
            email: tempEmail,
            firstName,
            lastName,
          },
        },
      },
      include: { user: true },
    });

    // Generate the actual email using the user ID
    const email = `${getStateIdFromDbId(account.user.id, ModelIndicator.user)}@${provider}.com`;

    // Update the user with the email address corresponding to the userId
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
    console.error(`createOrUpdateIronSession: error in upserting account and user: ${error}`);
    if (error instanceof PrismaClientKnownRequestError) {
      const prismaError = error as PrismaClientKnownRequestError;
      if (prismaError.code === "P2002") {
        console.log(`createOrUpdateIronSession: accountId already exists; ignoring error`, prismaError);
        return getAccountByProviderAccountId(provider, providerAccountId);
      }
    }
    throw error;
  }
}

// To be called from client compmonents exclusively to enable possibly deleting the cookie
export async function getOrResetIronSession(): Promise<Base58CheckAccountOrNull> {
  try {
    const existingAccount = await getIronSessionAccount();
    if (existingAccount) {
      return existingAccount;
    }
  } catch (exc) {
    console.log(
      `getOrResetIronSession: calling destroyIronSessionAccount due to exception in getIronSessionAccount:`,
      exc,
    );
    // destroyIronSessionAccount();
  }
  return null;
}

async function getIronSessionAccountId(providerAccountId?: string): Promise<IronSessionIdSchemaType | undefined> {
  if (providerAccountId) {
    return providerAccountId;
  }
  const session = await getCurrentIronSession();

  return session?.accountId;
}

async function getCurrentIronSession(): Promise<IronSession<SessionData>> {
  const routeType = AppRouteType.Authenticated; /* FIXME: TO BE DERIVED FROM CURRENT REQUEST */
  const session = await getIronSession<SessionData>(cookies(), sessionOptions[routeType]);
  return session;
}

export async function destroyIronSessionAccount(): Promise<void> {
  console.log(`destroyIronSessionAccount: destroy session`);
  const session = await getCurrentIronSession();
  session?.destroy();
  revalidateAuthenticatedPaths();
}

/*
async function login(formData: FormData) {
  const session = await getSession();

  session.username = (formData.get("username") as string) ?? "No username";
  session.isLoggedIn = true;
  await session.save();
  revalidateAuthenticatedPaths();
}

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  if (simulateLookup) {
    // simulate looking up the user in db
    console.log(
      `iron-session/getSession: simulating looking up the user ${session?.username || undefined} in the database...`,
    );
    await sleep(250);
    if (session.username !== "Alison") {
      session.isLoggedIn = false;
      session.username = "Unknown User";
    }
  }

  return session;
}
*/
