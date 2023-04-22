"use client";

import { Alert } from "@/components/Alert";
import { Form } from "@/components/Form";
import { Heading } from "@/components/Heading";
import { AuthContext } from "@/contexts/AuthContext";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { Button, FormControl, TextInput } from "@primer/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { setApiToken, setUserID } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data: { token: string; user_id: string } = await res.json();
      setApiToken(data.token);
      setUserID(data.user_id);
      localStorage.setItem("apiToken", data.token);
      localStorage.setItem("userID", data.user_id);
      router.push("/dashboard");
    } else {
      setError(res.status);
      const text = await res.text();
      setErrorMessage(text);
    }
  }

  return (
    <>
      <Heading as="h1">Login</Heading>
      {errorMessage && <Alert status={error}>{errorMessage}</Alert>}
      <Form formMethod="POST" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            minLength={MIN_PASSWORD_LENGTH}
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <div className="flex flex-col gap-2">
          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button as={Link} href="/signup" variant="invisible">
            Signup
          </Button>
        </div>
      </Form>
    </>
  );
}
