"use server";

import { headers } from "next/headers";
import RenderBreadcrumbs from "./RenderBreadcrumbs";

import {
  PathnameAndSearchParamsType,
  pathnameAndSearchParamsHeaderName,
} from "@/middlewares/utils/pathnameAndSearchParams";
/*
function getPathnameAndSearchParams(): Promise<PathnameAndSearchParamsType> {
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
*/
export default async function Breadcrumbs() {
  const props: PathnameAndSearchParamsType = {
    // pathname: headers().get("x-pathname"),
    // searchParams: headers().get("x-query"),
    pathname: headers().get(pathnameAndSearchParamsHeaderName.pathname),
    searchParams: headers().get(pathnameAndSearchParamsHeaderName.searchParams),
  };
  // const props = await getPathnameAndSearchParams();

  return <RenderBreadcrumbs {...props} />;
}
