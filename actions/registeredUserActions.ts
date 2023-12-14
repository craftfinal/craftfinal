import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import { prismaClient } from "@/prisma/client";
import { InvalidAuthUserErr, UserAccountOrNull, UserAccountOrNullOrUndefined, UserUpsertFailedErr } from "@/types/user";
import { User as ClerkAuthUser, currentUser } from "@clerk/nextjs/server";

export const getRegisteredUserOrNull = async (
  availableProviderAccount?: ClerkAuthUser,
): Promise<UserAccountOrNullOrUndefined> => {
  try {
    return await getRegisteredUser(availableProviderAccount);
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getRegisteredUserOrNull(): exception in getRegisteredUser(): `, error);
    // }
  }
  return null;
};

export async function getRegisteredUser(
  availableProviderAccount?: ClerkAuthUser,
): Promise<UserAccountOrNullOrUndefined> {
  const providerAccount = availableProviderAccount ?? (await currentUser());
  if (!providerAccount) {
    throw new InvalidAuthUserErr(`Invalid providerAccount: ${providerAccount}`);
  }

  const providerAccountId = providerAccount.id;
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
    throw new UserUpsertFailedErr();
  }

  return { ...account.user, account };
}

export async function getOrCreateRegisteredUser(): Promise<UserAccountOrNull> {
  const providerAccount = await currentUser();
  if (!providerAccount) {
    throw new InvalidAuthUserErr(`Could not get providerAccount from Clerk Auth`);
  }
  let userAccount = await getRegisteredUser(providerAccount);
  if (!userAccount) {
    userAccount = await createRegisteredUser(providerAccount);
  }
  return userAccount;
}

export async function createRegisteredUser(providerAccount: ClerkAuthUser): Promise<UserAccountOrNull> {
  const providerAccountId = providerAccount.id;
  const provider = registeredAccountMiddleware.id;
  const type = provider; // For the time being identical to provider
  const primaryEmail = getPrimaryEmailAddress(providerAccount);
  if (!primaryEmail) {
    throw new InvalidAuthUserErr(`Invalid primary email for providerAccount: ${providerAccount.id}`);
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
          firstName: providerAccount.firstName,
          lastName: providerAccount.lastName,
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
          firstName: providerAccount.firstName,
          lastName: providerAccount.lastName,
        },
      },
    },
    include: { user: true },
  });
  return { ...account.user, account };
}

const getPrimaryEmailAddress = (authUser: ClerkAuthUser) => {
  const emailAddresses = authUser.emailAddresses;
  const primaryEmailAddressId = authUser.primaryEmailAddressId;

  if (emailAddresses && primaryEmailAddressId) {
    const primaryEmailAddress = emailAddresses.find((a) => a.id === primaryEmailAddressId);
    if (primaryEmailAddress) {
      return primaryEmailAddress?.emailAddress;
    }
  }
  return undefined;
};
