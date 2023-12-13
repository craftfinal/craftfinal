"use server";

import { getAuthProviderIdCookieName } from "@/middlewares/getAuthProviderIdCookieName";
import { prisma } from "@/prisma/client";
import { IdSchemaType } from "@/schemas/id";
import { InvalidAuthUserErr } from "@/types/user";
import type { User as PrismaUser } from "@prisma/client";
import { cookies } from "next/headers";

export const getTemporaryUserOrNull = async (): Promise<PrismaUser | null> => {
  try {
    return await getTemporaryUser();
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getTemporaryUserOrNull(): exception in getTemporaryUser(): `, error);
    // }
  }
  return null;
};

export const getTemporaryUserIdOrNull = async (): Promise<IdSchemaType | null> => {
  let currentUserId = null;
  try {
    const currentUser = await getTemporaryUser();
    currentUserId = currentUser?.id;
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`actions/user:getTemporaryUserIdOrNull(): exception in getTemporaryUser(): `, error);
    // }
  }
  return currentUserId;
};

export async function getTemporaryUser(): Promise<PrismaUser> {
  const userCookies = cookies(); // Get all cookies
  const authProviderId = userCookies.get(getAuthProviderIdCookieName())?.value; // Retrieve specific cookie by name

  if (!authProviderId) {
    throw new InvalidAuthUserErr(`Invalid authProviderId:` + authProviderId);
  }

  // If the user exists, fetch data from database
  const authUser = await prisma.user.findUnique({
    where: { authProviderId },
  });

  if (!authUser) {
    throw new InvalidAuthUserErr(`Invalid authUser=${authUser} from authProviderId=${authProviderId}`);
  }

  return authUser;
}
