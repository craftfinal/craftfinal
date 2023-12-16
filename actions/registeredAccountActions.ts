// @/actions/registeredUserActions.ts

"use server";

import { AccountType } from "@/auth/account";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import { prismaClient } from "@/prisma/client";
import { InvalidAccountErr, Base58CheckAccountOrNull } from "@/types/user";
import { User as ClerkAuthUser, auth, currentUser } from "@clerk/nextjs/server";
import { getAccountByProviderAccountId } from "./user";
import { getDbIdFromBase58CheckId } from "@/types/utils/base58checkId";

function getProviderAccountId(availableProviderAccountId?: string): string | null {
  if (availableProviderAccountId) {
    return availableProviderAccountId;
  }
  // const providerAccount = await currentUser();
  // const providerAccountId = providerAccount?.user;
  const { userId: providerAccountId } = auth();
  return providerAccountId;
}

export async function getRegisteredAccountOrNull(): Promise<Base58CheckAccountOrNull> {
  try {
    return await getRegisteredAccount();
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getRegisteredAccountOrNull(): exception in getRegisteredAccount(): `, error);
    // }
  }
  return null;
}

async function getRegisteredAccount(
  // availableProviderAccountId?: string,
  availableProviderAccountId?: string,
): Promise<Base58CheckAccountOrNull> {
  const providerAccountId = getProviderAccountId(availableProviderAccountId);
  if (!providerAccountId) {
    throw new InvalidAccountErr(`Invalid providerAccountId: ${providerAccountId}`);
  }

  const provider = registeredAccountMiddleware.id;

  // If the user exists, fetch data from database
  const authUser = await getAccountByProviderAccountId(provider, providerAccountId);
  return authUser;
}

export async function getOrCreateRegisteredAccount(): Promise<Base58CheckAccountOrNull> {
  // const providerAccount = await currentUser();
  const { userId: providerAccountId } = auth();
  if (!providerAccountId) {
    throw new InvalidAccountErr(`Could not get providerAccountId from Clerk Auth`);
  }
  let userAccount;
  try {
    userAccount = await getRegisteredAccount(providerAccountId);
  } catch (exc) {
    // console.log(`getOrCreateRegisteredAccount: exception from getRegisteredAccount`, exc);
  }
  if (!userAccount) {
    userAccount = await createOrUpdateRegisteredAccount(providerAccountId);
  }
  return userAccount;
}

async function createOrUpdateRegisteredAccount(stateProviderAccountId: string): Promise<Base58CheckAccountOrNull> {
  const provider = registeredAccountMiddleware.id;
  const type = AccountType.Registered;
  const providerAccount = auth();
  if (!providerAccount) {
    throw new InvalidAccountErr(`Invalid providerAccount: ${JSON.stringify(providerAccount)}`);
  }
  const providerUser = await currentUser();
  if (!providerUser) {
    throw new InvalidAccountErr(`Invalid providerUser: ${JSON.stringify(providerUser)}`);
  }

  const primaryEmail = getPrimaryEmailAddress(providerUser);
  if (!primaryEmail) {
    throw new InvalidAccountErr(`Invalid primary email for providerAccount: ${JSON.stringify(providerAccount)}`);
  }

  const providerAccountId = getDbIdFromBase58CheckId(stateProviderAccountId);

  // Dreate or update the Account
  const account = await prismaClient.account.upsert({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    update: {
      user: {
        update: {
          email: primaryEmail,
          firstName: providerUser.firstName,
          lastName: providerUser.lastName,
        },
      },
    },
    create: {
      provider,
      providerAccountId,
      type,
      user: {
        create: {
          email: primaryEmail,
          firstName: providerUser.firstName,
          lastName: providerUser.lastName,
        },
      },
    },
    include: { user: true },
  });
  return account;
}

function getPrimaryEmailAddress(authUser: ClerkAuthUser) {
  const emailAddresses = authUser.emailAddresses;
  const primaryEmailAddressId = authUser.primaryEmailAddressId;

  if (emailAddresses && primaryEmailAddressId) {
    const primaryEmailAddress = emailAddresses.find((a) => a.id === primaryEmailAddressId);
    if (primaryEmailAddress) {
      return primaryEmailAddress?.emailAddress;
    }
  }
  return undefined;
}
