import type { Metadata } from "next";
import "../styles/globals.css";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import AppProvider from "@/app/app-context";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { siteConfig } from "@/config/site";
import { baseOpenGraph } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: {
    template: "%s | Budget Tracker",
    default: "Budget Tracker",
  },
  description: "Track your expenses and income with Budget Tracker.",
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url.author }],
  creator: siteConfig.author,
  openGraph: {
    ...baseOpenGraph,
    type: "website",
    url: siteConfig.url.base,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  alternates: {
    canonical: siteConfig.url.base,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#6d28d9" height={2.5} showSpinner={false} />
            <AppProvider>{children}</AppProvider>
          </ThemeProvider>
          <Toaster richColors theme="system" closeButton />
        </body>
      </html>
    </SessionProvider>
  );
}
