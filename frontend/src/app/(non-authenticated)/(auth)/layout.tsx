"use client";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <main className="mx-auto max-w-lg">{children}</main>;
}
