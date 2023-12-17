// @/actions/pathnameAndSearchParamsActions.ts

"use server";

import { headers } from "next/headers";
import {
  PathnameAndSearchParamsType,
  pathnameAndSearchParamsHeaderName,
} from "../middlewares/utils/pathnameAndSearchParams";

export async function getPathnameAndSearchParams(): Promise<PathnameAndSearchParamsType> {
  let pathnameAndSearchParams: PathnameAndSearchParamsType = {
    pathname: null,
    searchParams: null,
  };
  try {
    pathnameAndSearchParams = {
      pathname: headers().get(pathnameAndSearchParamsHeaderName.pathname),
      searchParams: headers().get(pathnameAndSearchParamsHeaderName.searchParams),
    };
  } catch (error) {
    // if (process.env.NODE_ENV === "development") {
    console.log(`actions/pathnameActions:getPathnameAndSearchParams(): `, error);
    // }
  }
  return pathnameAndSearchParams;
}

export async function getPathname(): Promise<string | null> {
  const pathnameAndSearchParams = await getPathnameAndSearchParams();
  if (pathnameAndSearchParams) {
    return pathnameAndSearchParams.pathname;
  }
  return null;
}
