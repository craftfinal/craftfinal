// @/providers/PostHog.tsx

// https://posthog.com/docs/libraries/next-js

"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  if (process.env.NODE_ENV !== "production") {
    return children;
  }
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    });
  }
  return (
    <PostHogProvider client={posthog}>
      {/** Ensure that the component can be statically rendered by wrapping
        `PostHogPageview`, which calls `useSearchParams`, in a `Suspense` boundary */}
      <Suspense>
        <PostHogPageview />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
