import AuthToggle from "@/components/auth-toggle";
import Logo from "@/components/logo";
import ModeToggle from "@/components/mode-toggle";
import Navbar from "@/components/navbar";
import UserNav from "@/components/user-nav";
import { getCurrentUser } from "@/lib/session";

export default async function Header() {
  const { user, isLoggedIn } = await getCurrentUser();

  return (
    <header className="sticky top-0 border-b">
      <div className="container flex h-16 items-center gap-4 md:gap-8">
        <Logo />
        <Navbar />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {isLoggedIn ? <UserNav user={user!} /> : <AuthToggle />}
        </div>
      </div>
    </header>
  );
}
