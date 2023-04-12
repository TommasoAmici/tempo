"use client";

import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const router = useRouter();
  const { authenticated } = useContext(AuthContext);
  if (authenticated) {
    router.push("/dashboard");
    return;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/dashboard">Dashboard</Link>
    </main>
  );
}
