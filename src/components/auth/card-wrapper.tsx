import BackButton from "@/components/auth/back-button";
import Social from "@/components/auth/social";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
  children: React.ReactNode;
  heading: string;
  description?: string;
  backBtnLabel: string;
  backBtnHref: string;
  showSocial?: boolean;
  wrapperClassName?: string;
}

export default function CardWrapper({
  children,
  heading,
  description,
  backBtnHref,
  backBtnLabel,
  showSocial,
  wrapperClassName,
}: CardWrapperProps) {
  return (
    <Card className={cn("max-w-[420px] w-full", wrapperClassName)}>
      <CardHeader>
        <CardTitle className="text-2xl">{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex-col gap-4">
        {showSocial && <Social />}
        <BackButton label={backBtnLabel} href={backBtnHref} />
      </CardFooter>
    </Card>
  );
}
