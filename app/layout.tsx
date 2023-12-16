// @/app/layout.tsx

import "@/app/globals.css";
import { PHProvider, PostHogPageview } from "@/components/providers/PostHog";
import { Toaster } from "@/components/ui/toaster";
import siteMetadata from "@/data/siteMetadata";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { AppThemeProvider } from "../components/chrome/AppThemeProvider";

// import AuthUserProvider from "@/auth/AuthUserProvider.client";
// import { getCurrentUserOrNull } from "@/actions/user";

// import { getExecutedMiddlewareIds } from "@/middlewares/executeMiddleware";
// import { headers } from "next/headers";
// import ClerkAuthProvider from "@/auth/clerk/ClerkAuthProvider";
// import { ThemeProvider } from "@/components/providers/ThemeProvider";
// import { siteConfig } from "@/config/site";
// import { Suspense } from "react";
// import { PHProvider, PostHogPageview } from "@/components/providers/PostHog";
// import "css/tailwind.css";
// import Header from '@/components/Header'
// import SectionContainer from '@/components/SectionContainer'
// import Footer from '@/components/Footer'

// const space_grotesk = Space_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-space-grotesk',
// })

const fontInter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: siteConfig.name,
//   description: siteConfig.description,
// };

export async function generateMetadata(): Promise<Metadata> {
  // const pathname = headers().get("x-pathname");
  // console.log(`generateMetadata: pathname: `, pathname);
  const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    openGraph: {
      title: siteMetadata.title,
      description: siteMetadata.description,
      url: "./",
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: siteMetadata.title,
      card: "summary_large_image",
      images: [siteMetadata.socialBanner],
    },
  };
  return metadata;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // const layoutHeaders = headers();
  // console.log(`RootLayout: headers:`, JSON.stringify(layoutHeaders));
  // const middlewares = getExecutedMiddlewareIds(layoutHeaders);
  // console.log(`RootLayout: pathname=${layoutHeaders.get("x-pathname")} executed middlewares:`, middlewares);
  // console.log(`Headers: x-pathname:`, layoutHeaders.get("x-pathname"), `x-query:`, layoutHeaders.get("x-query"));

  return (
    <html lang={siteMetadata.language} suppressHydrationWarning>
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className={fontInter.className}>
        <PHProvider>
          {/** Ensure that the component can be statically rendered by wrapping
           `PostHogPageview`, which calls `useSearchParams`, in a `Suspense` boundary */}
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <AppThemeProvider>
            {/* <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} /> */}

            <div className="relative bg-background">
              <div className="relative z-10 flex min-w-full flex-col justify-between">{children}</div>
              <div className="z-5 fixed left-0 top-0 h-screen w-full filter dark:bg-gradient-to-br dark:from-neutral-600 dark:to-slate-950 dark:opacity-90 dark:blur-3xl"></div>
            </div>
            <Toaster />
          </AppThemeProvider>
        </PHProvider>
      </body>
    </html>
  );
}
