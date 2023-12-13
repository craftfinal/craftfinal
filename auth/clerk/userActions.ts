import { InvalidAuthUserErr, UserUpsertFailedErr } from "@/types/user";
import { prisma } from "@/prisma/client";
import { User as ClerkAuthUser, currentUser } from "@clerk/nextjs/server";
import type { User as PrismaUser } from "@prisma/client";

export async function getAuthenticatedUser(): Promise<PrismaUser> {
  let authUser = null;

  authUser = await currentUser();
  if (!authUser) {
    throw new InvalidAuthUserErr(`Invalid authUser:` + authUser);
  }

  const authProviderId = authUser.id;
  if (!authUser?.primaryEmailAddressId) {
    throw new InvalidAuthUserErr(`Invalid authUser.primaryEmailAddressId=${authUser.primaryEmailAddressId}`);
  }

  const primaryEmail = getPrimaryEmailAddress(authUser);
  if (!primaryEmail) {
    throw new InvalidAuthUserErr(
      `Invalid authUser.primaryEmail=${primaryEmail} from authUser.primaryEmailAddressId=${authUser.primaryEmailAddressId}`,
    );
  }

  // Create or update user with the current data from the authentication provider, Clerk Auth
  const userData = {
    authProviderId: authUser.id,
    email: primaryEmail,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
  };

  const user = await prisma.user.upsert({
    where: { authProviderId },
    update: userData,
    create: userData,
  });
  if (!user) {
    throw new UserUpsertFailedErr();
  }

  return user;
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
