"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidAuthUserErr, UserUpsertFailedErr, getPrimaryEmailAddress } from "@/auth/clerk/userActions";
import { siteConfig } from "@/config/site";
import { getExecutedMiddlewareIds } from "@/middlewares/executeMiddleware";
import { getAuthProviderIdCookieName } from "@/middlewares/withTemporaryAccount";
import { prisma } from "@/prisma/client";
import { IdSchemaType } from "@/schemas/id";
import { ModificationTimestampType } from "@/types/timestamp";
import { currentUser } from "@clerk/nextjs";
import { User as ClerkAuthUser } from "@clerk/nextjs/server";
import type { User as PrismaUser, User } from "@prisma/client";
import Chance from "chance";
import { cookies, headers } from "next/headers";

export const getCurrentUserOrNull = async (): Promise<PrismaUser | null> => {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`actions/user:getCurrentUserOrNull(): exception in getCurrentUser(): `, error);
    }
  }
  return null;
};

export const getCurrentUserIdOrNull = async (): Promise<IdSchemaType | null> => {
  let currentUserId = null;
  try {
    const currentUser = await getCurrentUser();
    currentUserId = currentUser?.id;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`actions/user:getCurrentUserIdOrNull(): exception in getCurrentUser(): `, error);
    }
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
 *    we can obtain the
 * @returns Promise<PrismaUser>
 */

export async function getCurrentUser(): Promise<PrismaUser> {
  let authUser = null;
  // Determine which middleware has been executed
  const authMiddlewareIds = getExecutedMiddlewareIds(headers());
  console.log(`getCurrentUser: middlewares=${authMiddlewareIds}`);

  let authProviderId: string | undefined, primaryEmail: string | undefined;
  if (authMiddlewareIds.includes("clerkauth")) {
    // Option 1: try to authenticate user basd on Clerk Auth
    authUser = await currentUser();
    if (authUser) {
      authProviderId = authUser.id;
      if (!authUser?.primaryEmailAddressId) {
        throw new InvalidAuthUserErr(`Invalid authUser.primaryEmailAddressId=${authUser.primaryEmailAddressId}`);
      }

      primaryEmail = getPrimaryEmailAddress(authUser);
      if (!primaryEmail) {
        throw new InvalidAuthUserErr(
          `Invalid authUser.primaryEmail=${primaryEmail} from authUser.primaryEmailAddressId=${authUser.primaryEmailAddressId}`,
        );
      }
    }
  }
  if (!authUser) {
    // Option 2: Try to authenticate a temporary user based on a cookie
    const userCookies = cookies(); // Get all cookies
    authProviderId = userCookies.get(getAuthProviderIdCookieName())?.value; // Retrieve specific cookie by name
    if (authProviderId) {
      const chance = new Chance(); // instantiate
      primaryEmail = chance.email({ domain: siteConfig.canonicalDomainName });
      const firstName = chance.first({ nationality: "en" });
      const lastName = chance.last({ nationality: "en" });
      // If the user already exists, fetch data from database
      const userData = await prisma.user.findUnique({
        where: { authProviderId },
      });

      if (userData) {
        primaryEmail = userData.email ?? primaryEmail;
        authUser = {
          id: authProviderId,
          firstName: userData.firstName ?? firstName,
          lastName: userData.lastName ?? lastName,
        };
      } else {
        authUser = {
          id: authProviderId,
          firstName: firstName,
          lastName: lastName,
        };
      }
    }
  }

  if (!authUser) {
    throw new InvalidAuthUserErr(`Invalid authUser:` + authUser);
  }
  // Create or update user
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

  // https://stackoverflow.com/a/77258216/617559
  // const makeInstantiator =
  //   <T extends z.ZodType<any>>(model: T) =>
  //   (input: z.input<T>): z.output<T> => {
  //     return model.safeParse(input);
  //   };

  // const instantiateUser = makeInstantiator(userSchema);
  // const augmentedUser = instantiateUser(user);
  // console.log(`actions/user: augmentedUser returned`, augmentedUser);
  // return augmentedUser;
  return user;
}

export const getUserByAuthProviderId = async (authProviderId: string): Promise<User | undefined> => {
  const user = await prisma.user.findUnique({
    where: { authProviderId: authProviderId },
  });
  if (!user) {
    throw Error(`No user with authProviderId=${authProviderId.substring(0, authProviderId.length / 4)} found`);
  }

  return user;
};

export async function getUserById(id: IdSchemaType) {
  if (!id) {
    throw Error;
  }
  return await prisma.user.findUnique({
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
