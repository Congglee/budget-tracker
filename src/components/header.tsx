import AuthToggle from "@/components/auth-toggle";
import Logo from "@/components/logo";
import ModeToggle from "@/components/mode-toggle";
import Navbar from "@/components/navbar";
import UserNav from "@/components/user-nav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export default async function Header() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const isLoggedIn = await isAuthenticated();

  return (
    <header className="sticky top-0 border-b">
      <div className="container flex h-16 items-center gap-4 md:gap-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="hidden xs:block bg-gradient-to-r from-[#e6adc5] to-[#8d00f7] bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent">
            Budget Tracker
          </span>
        </Link>
        <Navbar />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {isLoggedIn ? <UserNav user={user!} /> : <AuthToggle />}
        </div>
      </div>
    </header>
  );
}
