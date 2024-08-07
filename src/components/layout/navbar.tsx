"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/config/links";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavbarDrawer({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle asChild>
            <Link
              href="/"
              className="bg-gradient-to-r from-[#e6adc5] to-[#8d00f7] bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent"
            >
              Budget Tracker
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="grid mt-6 gap-6 text-lg font-medium">
          {navLinks.data.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden flex-col font-medium md:flex md:flex-row md:items-center">
        {navLinks.data.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-lg text-muted-foreground hover:text-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <NavbarDrawer pathname={pathname} />
    </>
  );
}
