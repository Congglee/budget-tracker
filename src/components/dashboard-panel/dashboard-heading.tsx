import { cn } from "@/lib/utils";

interface DashboardHeadingProps {
  heading: string;
  description?: string;
  children?: React.ReactNode;
  wrapperClassName?: string;
}

export default function DashboardHeading({
  heading,
  description,
  children,
  wrapperClassName,
}: DashboardHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-wrap lg:flex-row lg:items-center py-5 justify-between gap-4 border-b",
        wrapperClassName
      )}
    >
      <div className="flex-1 space-y-0.5">
        <h2 className="text-3xl font-semibold tracking-tight lg:truncate">
          {heading}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col flex-wrap sm:flex-row sm:items-center sm:space-x-2 gap-2 sm:gap-1">
        {children}
      </div>
    </div>
  );
}
