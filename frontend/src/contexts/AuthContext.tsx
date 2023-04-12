"use client";
import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

type AuthContextData = {
  signout: () => void;
  authenticated: boolean;
  userID: string | null;
  setUserID: (id: string) => void;
  apiToken: string | null;
  setApiToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextData>({
  signout: () => {},
  authenticated: false,
  userID: null,
  setUserID: () => {},
  apiToken: null,
  setApiToken: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const cachedAPIToken = typeof window !== "undefined" ? localStorage.getItem("apiToken") : null;
  const cachedUserID = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const [apiToken, setApiToken] = useState(cachedAPIToken);
  const [userID, setUserID] = useState(cachedUserID);

  const authenticated = apiToken !== null && userID !== null;

  function signout() {
    setApiToken(null);
    setUserID(null);
    localStorage.removeItem("apiToken");
    localStorage.removeItem("userID");
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ apiToken, setApiToken, userID, setUserID, authenticated, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
