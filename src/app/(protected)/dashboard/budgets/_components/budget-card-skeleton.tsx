import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BudgetCardSkeletonProps
  extends React.ComponentPropsWithoutRef<typeof Card> {}

export default function BudgetCardSkeleton({
  className,
  ...props
}: BudgetCardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="py-3 flex flex-col xs:flex-row gap-6 bg-muted/50 px-5 space-y-0 items-start xs:items-center">
        <div className="space-y-2 flex flex-col flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/6" />
        </div>
        <div className="ml-auto flex gap-2 flex-shrink-0">
          <Skeleton className="size-8 shrink-0" />
          <Skeleton className="size-8 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Skeleton className="rounded-full h-5 w-full" />
      </CardContent>
      <CardFooter className="flex flex-col gap-y-4 gap-x-6 xs:flex-row xs:justify-between border-t bg-muted/50 px-5 py-3 items-start">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}
