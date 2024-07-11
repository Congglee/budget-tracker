import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  wrapperClassName,
  logoClassName,
  textClassName,
}: {
  wrapperClassName?: string;
  logoClassName?: string;
  textClassName?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", wrapperClassName)}>
      <Image
        src={"/images/logo.png"}
        alt="Website logo"
        width={40}
        height={40}
        className={cn("size-10 object-cover", logoClassName)}
        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
      />
      <span
        className={cn(
          "hidden xs:block bg-gradient-to-r from-[#e6adc5] to-[#8d00f7] bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent",
          textClassName
        )}
      >
        Budget Tracker
      </span>
    </Link>
  );
}
