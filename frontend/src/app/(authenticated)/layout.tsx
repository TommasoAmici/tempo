"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { SWRConfig } from "swr";

import { AuthContext } from "@/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const { apiToken } = useContext(AuthContext);

  useEffect(() => {
    if (!apiToken) {
      router.push("/login");
      return;
    }
  }, []);

  if (!apiToken) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        fetcher: (resource: string, init: RequestInit) =>
          fetch(resource, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Basic " + btoa(apiToken),
            },
            ...init,
          }).then(res => res.json()),
      }}
    >
      <div className="flex gap-8">
        <main className="w-full">{children}</main>
      </div>
    </SWRConfig>
  );
}
