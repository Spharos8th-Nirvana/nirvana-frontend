import { HeroSection } from "@/features/home/components/organisms/HeroSection";
import { TemplePassport } from "@/features/home/components/organisms/TemplePassport";
import { PopularPrograms } from "@/features/home/components/organisms/PopularPrograms";
import { RecommendedTemples } from "@/features/home/components/organisms/RecommendedTemples";
import { TemplestayBanner } from "@/features/home/components/organisms/TemplestayBanner";
import { CommunityStories } from "@/features/home/components/organisms/CommunityStories";
import { NoticeEvents } from "@/features/home/components/organisms/NoticeEvents";
import { HomeFaq } from "@/features/home/components/organisms/HomeFaq";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TemplePassport />
      <PopularPrograms />
      <RecommendedTemples />
      <TemplestayBanner />
      <CommunityStories />
      <NoticeEvents />
      <HomeFaq />
    </main>
  );
}
