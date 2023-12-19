import { middlewares } from "@/middleware";

export function hasMiddleware(middlewareId: string) {
  const match = middlewares.find((middleware) => middleware.id === middlewareId);
  return match && match.disabled === false;
}
