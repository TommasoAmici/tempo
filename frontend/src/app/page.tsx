"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Hero } from "@/components/Hero";
import { AuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { authenticated } = useContext(AuthContext);
  if (authenticated) {
    router.push("/dashboard");
    return;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero
        heading="Track your coding activity and own your data"
        description={
          <p>
            Take charge of your coding activity with Tempo - the open source, self-hosted solution
            that seamlessly integrates with{" "}
            <a
              className="underline"
              target="_blank"
              href="https://wakatime.com/"
              rel="nofollow noopener noreferrer"
            >
              Wakatime
            </a>{" "}
            plugins.
          </p>
        }
      />
    </main>
  );
}
