import AuthToggle from "@/components/auth-toggle";
import Navbar from "@/components/layout/navbar";
import Logo from "@/components/logo";
import UserNav from "@/components/user-nav";
import { currentUser } from "@/lib/session";
import Link from "next/link";

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 border-b bg-background">
      <div className="container flex h-16 items-center gap-4 md:gap-8">
        <Link href="/">
          <Logo />
        </Link>
        <Navbar />
        <div className="ml-auto flex items-center space-x-4">
          {user ? <UserNav user={user} /> : <AuthToggle />}
        </div>
      </div>
    </header>
  );
}
