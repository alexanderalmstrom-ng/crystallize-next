import "../styles/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import { TRPCReactProvider } from "@/trpc/client";

const portraitText = localFont({
  src: [
    {
      path: "../fonts/PortraitText-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PortraitText-RegularItalic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-portrait-text",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Crystallize Next",
  description: "Crystallize Next",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${portraitText.variable} antialiased min-h-screen flex flex-col`}
      >
        <TRPCReactProvider>
          <SiteHeader />
          <main className="grow">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
