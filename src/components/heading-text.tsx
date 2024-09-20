import { cn } from "@/lib/utils";

interface HeadingTextProps {
  children: string;
  subtext?: string;
  className?: string;
}

export default function HeadingText({
  children,
  subtext,
  className,
}: HeadingTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-3xl font-bold lg:text-4xl">{children}</h2>
      {subtext && (
        <h2 className="font-light text-muted-foreground lg:text-lg">
          {subtext}
        </h2>
      )}
    </div>
  );
}
