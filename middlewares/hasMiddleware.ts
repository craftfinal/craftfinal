"use server";

import { middlewares } from "@/middleware";

export async function hasMiddleware(middlewareId: string) {
  return middlewares.find((middleware) => middleware.id === middlewareId && !middleware.disabled);
}
