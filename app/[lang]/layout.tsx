import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { Noto_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "../globals.css";
import { Locale, i18n } from "../../i18n/i18nConfig";
import { getDictionary } from "../../i18n/dictionaries";

const NotoSans = Noto_Sans({ subsets: ["latin"] });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const dictionary = await getDictionary((await params).lang);

  return {
    title: `Kana'Sheet - ${dictionary.appName}`,
    description: dictionary.appDescription,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  return (
    <html lang={(await params).lang} suppressHydrationWarning>
      <body className={NotoSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
