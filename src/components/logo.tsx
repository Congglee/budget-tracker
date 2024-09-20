"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Logo({
  isOpen,
  wrapperClassName,
  logoClassName,
  textClassName,
}: {
  isOpen?: boolean;
  wrapperClassName?: string;
  logoClassName?: string;
  textClassName?: string;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className={cn("flex items-center gap-3", wrapperClassName)}>
      <Image
        src={"/images/logo.png"}
        alt="Website logo"
        width={40}
        height={40}
        className={cn("size-10 object-cover", logoClassName)}
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
      />
      <h3
        className={cn(
          "bg-gradient-to-r from-[#e6adc5] to-[#8d00f7] bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent transition-[transform,opacity,display] ease-in-out duration-300 whitespace-nowrap",
          textClassName,
          isHomePage && "hidden xs:block",
          isOpen === false
            ? "-translate-x-96 opacity-0 hidden"
            : "translate-x-0 opacity-100"
        )}
      >
        {siteConfig.name}
      </h3>
    </div>
  );
}
