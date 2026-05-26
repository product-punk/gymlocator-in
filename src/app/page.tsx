import Hero from "@/components/home/Hero";
import GymMarquee from "@/components/home/GymMarquee";
import TrendingCities from "@/components/home/TrendingCities";
import FeaturedGyms from "@/components/home/FeaturedGyms";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <GymMarquee />
      <TrendingCities />
      <FeaturedGyms />
      <HowItWorks />
    </main>
  );
}
