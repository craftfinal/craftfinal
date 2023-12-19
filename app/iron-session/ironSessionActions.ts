"use server";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SessionData, defaultSession, sessionOptions, sleep } from "./lib";

export async function getSession(simulateLookup = true) {
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

export async function logout() {
  "use server";

  // false => no db call for logout
  const session = await getSession(false);
  session.destroy();
  revalidatePath("/iron-session");
}

export async function login(formData: FormData) {
  "use server";

  const session = await getSession();

  session.username = (formData.get("username") as string) ?? "No username";
  session.isLoggedIn = true;
  await session.save();
  revalidatePath("/iron-session");
}
