"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/Alert";
import { Button, ButtonLink } from "@/components/Button";
import { Form } from "@/components/Form";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("/api/v1/users/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, repeat_password: repeatPassword }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.ok) {
      router.push("/login");
    } else {
      setError(res.status);
      const text = await res.text();
      setErrorMessage(text);
    }
  }

  return (
    <>
      <Heading as="h1">Signup</Heading>
      {errorMessage && <Alert status={error}>{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          className="w-full"
          type="email"
          name="email"
          required
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <Input
          className="w-full"
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={e => setPassword(e.currentTarget.value)}
          required
          label="Password"
        />
        <Input
          className="w-full"
          type="password"
          name="repeat-password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          onChange={e => setRepeatPassword(e.currentTarget.value)}
          required
          label="Repeat password"
        />
        <div className="flex flex-col gap-2">
          <Button variant="primary" type="submit">
            Signup
          </Button>
          <ButtonLink href="/login" variant="secondary">
            Login
          </ButtonLink>
        </div>
      </Form>
    </>
  );
}
