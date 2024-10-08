import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import HeadingText from "@/components/heading-text";
import { Star } from "lucide-react";

export default async function OpenSource() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/Congglee/budget-tracker",
    { next: { revalidate: 60 } }
  )
    .then((res) => res.json())
    .catch((e) => console.error(e));

  return (
    <section className="container py-12 lg:py-20">
      <div className="flex flex-col items-center gap-4">
        <HeadingText
          subtext="Feel free to view the codebase or contribute!"
          className="text-center"
        >
          Fully Open Source
        </HeadingText>
        <Link
          href={siteConfig.links?.github as string}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Star className="mr-2 h-4 w-4" />
          <span>{stars} on Github</span>
        </Link>
      </div>
    </section>
  );
}
