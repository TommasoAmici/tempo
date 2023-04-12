"use client";

import "temporal-polyfill/global";

import { AuthProvider } from "@/contexts/AuthContext";
import { SSRProvider, ThemeProvider } from "@primer/react";

import { Header } from "@/components/Header/Header";
import "./globals.css";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SSRProvider>
            <ThemeProvider>
              <Header />
              <div className="my-8 px-8 md:px-16">{children}</div>
            </ThemeProvider>
          </SSRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
