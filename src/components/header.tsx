import AuthToggle from "@/components/auth-toggle";
import UserNav from "@/components/dashboard-panel/user-nav";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export default async function Header() {
  const { user, isLoggedIn } = await getCurrentUser();

  return (
    <header className="sticky top-0 border-b bg-background">
      <div className="container flex h-16 items-center gap-4 md:gap-8">
        <Link href="/">
          <Logo />
        </Link>
        <Navbar />
        <div className="ml-auto flex items-center space-x-4">
          {isLoggedIn ? <UserNav user={user!} /> : <AuthToggle />}
        </div>
      </div>
    </header>
  );
}
