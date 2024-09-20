import FeatureCards from "@/app/(frontpage)/_components/feature-cards";
import Hero from "@/app/(frontpage)/_components/hero";
import OpenSource from "@/app/(frontpage)/_components/open-source";
import Overview from "@/app/(frontpage)/_components/overview";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <Overview />
      <OpenSource />
    </main>
  );
}
