import { SignOutIcon } from "@primer/octicons-react";
import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { Avatar } from "../Avatar";
import Menu from "../Menu";
import { HeaderLink } from "./HeaderLink";

export function Header() {
  const { authenticated, userID, signout } = useContext(AuthContext);

  function handleSignout() {
    signout();
  }

  return (
    <header className="flex h-16 w-full items-center bg-primary-700 px-8 md:px-16">
      <HeaderLink className="mr-auto" href="/">
        Tempo
      </HeaderLink>

      {!authenticated && <HeaderLink href="/login">Login</HeaderLink>}
      {authenticated && userID && (
        <Menu
          button={<Avatar seed={userID} />}
          items={[
            {
              label: "Sign out",
              onClick: handleSignout,
              Icon: SignOutIcon,
            },
          ]}
        ></Menu>
      )}
    </header>
  );
}
