"use client";

import { Alert } from "@/components/Alert";
import { Form } from "@/components/Form";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { Button, FormControl, TextInput } from "@primer/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <h1>Signup</h1>
      {errorMessage && <Alert status={error}>{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormControl required>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            className="w-full"
            type="email"
            name="email"
            onChange={e => setEmail(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl required>
          <FormControl.Label>Password</FormControl.Label>
          <TextInput
            className="w-full"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl required>
          <FormControl.Label>Repeat password</FormControl.Label>
          <TextInput
            className="w-full"
            type="password"
            name="repeat-password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            onChange={e => setRepeatPassword(e.currentTarget.value)}
          />
        </FormControl>
        <div className="flex flex-col gap-2">
          <Button variant="primary" type="submit">
            Signup
          </Button>
          <Button as={Link} href="/login" variant="invisible">
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}
