// @/actions/registeredUserActions.ts

"use server";

import { AccountType } from "@/auth/account";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import { prismaClient } from "@/prisma/client";
import { InvalidAuthUserErr, UserAccountOrNull } from "@/types/user";
import { User as ClerkAuthUser, auth, currentUser } from "@clerk/nextjs/server";

function getProviderAccountId(availableProviderAccountId?: string): string | null {
  if (availableProviderAccountId) {
    return availableProviderAccountId;
  }
  // const providerAccount = await currentUser();
  // const providerAccountId = providerAccount?.user;
  const { userId: providerAccountId } = auth();
  return providerAccountId;
}

export async function getRegisteredUserOrNull(): Promise<UserAccountOrNull> {
  try {
    return await getRegisteredUser();
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getRegisteredUserOrNull(): exception in getRegisteredUser(): `, error);
    // }
  }
  return null;
}

async function getRegisteredUser(
  // availableProviderAccountId?: string,
  availableProviderAccountId?: string,
): Promise<UserAccountOrNull> {
  const providerAccountId = getProviderAccountId(availableProviderAccountId);
  if (!providerAccountId) {
    throw new InvalidAuthUserErr(`Invalid providerAccountId: ${providerAccountId}`);
  }

  const provider = registeredAccountMiddleware.id;

  const account = await prismaClient.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: { user: true },
  });

  if (!account || !account.user) {
    throw new InvalidAuthUserErr(
      `getRegisteredUser: prisma.account.findUnique("${provider}", "${providerAccountId}") returned ${account}`,
    );
  }

  return { ...account.user, account };
}

export async function getOrCreateRegisteredUser(): Promise<UserAccountOrNull> {
  // const providerAccount = await currentUser();
  const { userId: providerAccountId } = auth();
  if (!providerAccountId) {
    // throw new InvalidAuthUserErr(`Could not get providerAccountId from Clerk Auth`);
  }
  let userAccount;
  try {
    userAccount = await getRegisteredUser(providerAccountId);
  } catch (exc) {
    // console.log(`getOrCreateRegisteredUser: exception from getRegisteredUser`, exc);
  }
  if (!userAccount) {
    userAccount = await createRegisteredUser(providerAccountId);
  }
  return userAccount;
}

async function createRegisteredUser(providerAccountId: string): Promise<UserAccountOrNull> {
  const provider = registeredAccountMiddleware.id;
  const type = AccountType.Registered;
  const providerAccount = auth();
  if (!providerAccount) {
    throw new InvalidAuthUserErr(`Invalid providerAccount: ${JSON.stringify(providerAccount)}`);
  }
  const providerUser = await currentUser();
  if (!providerUser) {
    throw new InvalidAuthUserErr(`Invalid providerUser: ${JSON.stringify(providerUser)}`);
  }

  const primaryEmail = getPrimaryEmailAddress(providerUser);
  if (!primaryEmail) {
    throw new InvalidAuthUserErr(`Invalid primary email for providerAccount: ${JSON.stringify(providerAccount)}`);
  }

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
  return { ...account.user, account };
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
