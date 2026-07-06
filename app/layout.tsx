import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/src/app/providers";
import { AuthBootstrapper } from "@/src/app/AuthBootstrapper";
import TenantBootstrapper from "@/src/app/TenantBootstrapper";
import { BootstrapGate } from "@/src/app/BootstrapGate";
import { QueryParamProvider } from "@/src/utils/queryParamProvider";
import { RootNavbar } from "@/src/shared/common/RootNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lanka Tourism",
  description: "Plan Sri Lanka trips with curated destinations, packages, and itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg`}
      >
        <Providers>
          <BootstrapGate
            bootstrappers={
              <>
                <AuthBootstrapper />
                <TenantBootstrapper />
              </>
            }
          >
            <div className="flex flex-col min-h-full">
              <RootNavbar />
              <Suspense fallback={<div className="min-h-screen bg-bg" />}>
                <QueryParamProvider>{children}</QueryParamProvider>
              </Suspense>
            </div>
          </BootstrapGate>
        </Providers>
      </body>
    </html>
  );
}
