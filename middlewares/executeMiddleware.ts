// @/middlewares/executeMiddlewares.ts

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { NextMiddleware, NextResponse } from "next/server";
// import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";

// Inspired by: https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs

/**
 * A factory type for creating middleware functions.
 */

// Inspired by: https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs

/**
 * A factory type for creating middleware functions.
 */
export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
/**
 * Represents an entry for a middleware, with an ID, the middleware function itself, and an optional disabled flag.
 */
export interface MiddlewareEntry {
  id: string;
  fn: MiddlewareFactory;
  disabled?: boolean;
}

/**
 * Executes a chain of middlewares in sequence.
 *
 * @param middlewares - An array of MiddlewareEntry objects to be executed.
 * @param index - The current index of middleware being executed.
 * @returns A NextMiddleware function.
 */
export default function executeMiddleware(middlewares: MiddlewareEntry[], index = 0): NextMiddleware {
  if (index >= middlewares.length) {
    // No more middlewares to execute
    return () => NextResponse.next();
  }

  const current = middlewares[index];
  const next = executeMiddleware(middlewares, index + 1);

  if (current && !current.disabled) {
    // If the current middleware is enabled, execute it
    return async (req, evt) => {
      const response = await current.fn(next)(req, evt);
      if (response instanceof NextResponse) {
        // Add the middleware ID to the response headers
        response.headers.set(`${authMiddlewareHeaderPrefix}${current.id}`, String(index));
        addMiddlewareId(response, current, index);
      }
      return response;
    };
  } else {
    // If the current middleware is disabled, skip to the next
    return next;
  }
}

/**
 * A prefix that is added, along with the `id` of the middleware and its index in the
 * list of middleware entries, as a header after executing each middleware
 */
export const authMiddlewareHeaderPrefix = `x-middleware-`;

/**
 * Adds a middleware ID to the response headers.
 *
 * @param response - The NextResponse object to modify.
 * @param middlewareId - The ID of the middleware to add.
 * @returns The modified NextResponse object.
 */
export function addMiddlewareId(response: NextResponse, current: MiddlewareEntry, index: number): NextResponse {
  if (response) {
    // Directly modify the headers of the response
    response.headers.set(`${authMiddlewareHeaderPrefix}${current.id}`, String(index));
  }
  return response;
}

/**
 * Filters the headers based on a given prefix.
 *
 * @param headersList - The headers to filter.
 * @param prefix - The prefix to filter by.
 * @returns An array of header key-value pairs that match the prefix.
 */
export function filterHeadersByPrefix(headersList: ReadonlyHeaders, prefix: string) {
  const filteredHeaders = [];

  for (const [key, value] of headersList.entries()) {
    if (key.startsWith(prefix)) {
      filteredHeaders.push([key, value]);
    }
  }

  return filteredHeaders;
}

/**
 * Extracts middleware IDs from the headers based on a predefined prefix.
 *
 * @param headersList - The headers to extract middleware IDs from.
 * @returns An array of middleware IDs that were executed.
 */
export function getExecutedMiddlewareIds(headersList: ReadonlyHeaders) {
  const prefixRegex = new RegExp(`^${authMiddlewareHeaderPrefix}`);
  const authMiddlewareIds = filterHeadersByPrefix(headersList, authMiddlewareHeaderPrefix).map((entry) =>
    entry[0].replace(prefixRegex, ""),
  );
  return authMiddlewareIds;
}
