"use client";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <main className="mx-auto my-8 max-w-lg px-8 md:px-16">{children}</main>;
}
