"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { useContext } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const { apiToken } = useContext(AuthContext);

  if (apiToken) {
    redirect("/dashboard");
  }

  return <main className="mx-auto my-8 max-w-lg px-8 md:px-16">{children}</main>;
}
