import { HeroSection } from "@/features/home/components/organisms/HeroSection";
import { PopularPrograms } from "@/features/home/components/organisms/PopularPrograms";
import { RecommendedTemples } from "@/features/home/components/organisms/RecommendedTemples";
import { CommunityStories } from "@/features/home/components/organisms/CommunityStories";
import { NoticeEvents } from "@/features/home/components/organisms/NoticeEvents";

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
