import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: `${process.env.NEXT_PUBLIC_CRAFTFINAL_APP_NAME ?? "CraftFinal"}`,
  canonicalDomainName: `${process.env.NEXT_PUBLIC_CRAFTFINAL_APP_DOMAIN ?? "craftfinal.com"}`,
  description: `${process.env.NEXT_PUBLIC_CRAFTFINAL_APP_DESCRIPTION ?? "Craft the final version"}`,
  url: `${
    process.env.NEXT_PUBLIC_CRAFTFINAL_APP_URL ?? process.env.NEXT_PUBLIC_CRAFTFINAL_APP_DOMAIN
      ? "https://" + process.env.NEXT_PUBLIC_CRAFTFINAL_APP_DOMAIN
      : "craftfinal.com"
  }`,
  ogImage: "https://tx.shadcn.com/og.jpg",
  author: {
    name: "Simon Heimlicher",
    links: {
      twitter: "https://twitter.com/simonheimlicher",
      github: "https://github.com/simonheimlicher",
      linkedin: "https://linkedin.com/in/simonheimlicher",
      professionalWebsite: "https://simon.heimlicher.com",
      personalWebsite: "https://simi.sh",
    },
  },
  platforms: `<span class="uppercase text-muted-foreground">Supported browsers:</span> latest version of Google Chrome on Windows and macOS.`,
};
