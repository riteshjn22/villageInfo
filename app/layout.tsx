"use client";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
        {/* Lordicon Web Component script */}
        <Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
