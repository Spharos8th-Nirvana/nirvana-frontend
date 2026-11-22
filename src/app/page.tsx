import { HeroSection } from "@/components/features/home/hero-section";
import { PopularPrograms } from "@/components/features/home/popular-programs";
import { RecommendedTemples } from "@/components/features/home/recommended-temples";
import { CommunityStories } from "@/components/features/home/community-stories";
import { NoticeEvents } from "@/components/features/home/notice-events";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PopularPrograms />
      <RecommendedTemples />
      <CommunityStories />
      <NoticeEvents />
    </main>
  );
}
