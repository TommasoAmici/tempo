import { AuthContext } from "@/contexts/AuthContext";
import { SignOutIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu } from "@primer/react";
import { useContext } from "react";
import { Avatar } from "../Avatar";
import { HeaderLink } from "./HeaderLink";

export function Header() {
  const { authenticated, userID, signout } = useContext(AuthContext);

  function handleSignout() {
    signout();
  }

  return (
    <header className="flex h-16 w-full items-center bg-brand-dark px-8 md:px-16">
      <HeaderLink className="mr-auto" href="/">
        Tempo
      </HeaderLink>

      {!authenticated && <HeaderLink href="/login">Login</HeaderLink>}
      {authenticated && userID && (
        <ActionMenu>
          <ActionMenu.Anchor>
            <button>
              <Avatar seed={userID} />
            </button>
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item onClick={handleSignout}>
                <ActionList.LeadingVisual>
                  <SignOutIcon />
                </ActionList.LeadingVisual>
                Sign out
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      )}
    </header>
  );
}
