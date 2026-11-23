import { HeroSection } from "@/features/home/components/organisms/hero-section";
import { PopularPrograms } from "@/features/home/components/organisms/popular-programs";
import { RecommendedTemples } from "@/features/home/components/organisms/recommended-temples";
import { CommunityStories } from "@/features/home/components/organisms/community-stories";
import { NoticeEvents } from "@/features/home/components/organisms/notice-events";

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
