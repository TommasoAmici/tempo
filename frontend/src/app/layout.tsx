"use client";

import "temporal-polyfill/global";

import { AuthProvider } from "@/contexts/AuthContext";

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
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
