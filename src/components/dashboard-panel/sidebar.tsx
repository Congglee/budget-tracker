import { useAppContext } from "@/app/app-context";
import Menu from "@/components/dashboard-panel/menu";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebarOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebarOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard">
            <Logo isOpen={sidebarOpen} />
          </Link>
        </Button>
        <Menu isOpen={sidebarOpen} />
      </div>
    </aside>
  );
}

function SidebarToggle({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean | undefined;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
