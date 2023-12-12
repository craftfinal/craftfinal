"use server";

import { headers } from "next/headers";
import RenderBreadcrumbs from "./RenderBreadcrumbs";

export default async function Breadcrumbs() {
  const pathname = headers().get("x-pathname");
  const query = headers().get("x-query");

  return <RenderBreadcrumbs pathname={pathname} query={query} />;
}
