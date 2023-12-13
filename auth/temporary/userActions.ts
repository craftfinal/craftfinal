"use server";

import { InvalidAuthUserErr } from "@/types/user";
import { getAuthProviderIdCookieName } from "@/middlewares/withTemporaryAccount";
import { prisma } from "@/prisma/client";
import type { User as PrismaUser } from "@prisma/client";
import { cookies } from "next/headers";

export async function getAuthenticatedUser(): Promise<PrismaUser> {
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
