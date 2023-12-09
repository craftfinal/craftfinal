import { NextMiddleware, NextResponse } from "next/server";

// https://stackoverflow.com/a/77230182/617559
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export default function executeMiddleware(middlewares: MiddlewareFactory[] = [], index = 0): NextMiddleware {
  const current = middlewares[index];
  if (current) {
    const next = executeMiddleware(middlewares, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}
