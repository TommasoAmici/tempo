"use client";

import { redirect } from "next/navigation";
import { useContext } from "react";
import { SWRConfig } from "swr";

import { AuthContext } from "@/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const { apiToken } = useContext(AuthContext);

  if (!apiToken) {
    redirect("/login");
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
      {children}
    </SWRConfig>
  );
}
