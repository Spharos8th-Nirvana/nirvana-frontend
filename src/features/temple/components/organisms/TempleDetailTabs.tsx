"use client";

import { useState } from "react";
import TempleIntroduction from "@/features/temple/components/organisms/TempleIntroduction";
import TempleFacilities from "@/features/temple/components/organisms/TempleFacilities";
import type { TempleFacility } from "@/features/temple/data/temple-facilities";
import TemplePrograms from "@/features/temple/components/organisms/TemplePrograms";
import type { Program } from "@/features/program/data/programs";
import TempleReviews from "@/features/temple/components/organisms/TempleReviews";
import type { TempleReview } from "@/features/temple/data/temple-reviews";
import TempleNotices from "@/features/temple/components/organisms/TempleNotices";
import type { TempleNotice } from "@/features/temple/data/temple-notices";

const tabs = [
  { id: "intro", label: "사찰 소개" },
  { id: "facilities", label: "시설 안내" },
  { id: "programs", label: "체험 프로그램" },
  { id: "reviews", label: "체험 리뷰" },
  { id: "notices", label: "공지사항" },
];

type TempleDetailTabsProps = {
  templeId: number;
  templeName: string;
  address: string;
  phone: string;
  introduction: string;
  directions: string;
  facilities: TempleFacility[];
  programs: Program[];
  reviews: TempleReview[];
  initialTab?: string;
  notices: TempleNotice[];
};

export default function TempleDetailTabs({
  templeId,
  initialTab,
  templeName,
  address,
  phone,
  introduction,
  directions,
  facilities,
  programs,
  reviews,
  notices,
}: TempleDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || "intro");

  return (
    <section id="reviews-section" className="mt-16">
      {/* 탭 메뉴 */}
      <div className="flex overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-5 py-4 text-sm transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-primary font-bold text-primary"
                : "text-muted hover:font-bold hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="min-h-[300px] py-10">
        {activeTab === "intro" && (
          <TempleIntroduction
            name={templeName}
            address={address}
            phone={phone}
            introduction={introduction}
            directions={directions}
          />
        )}

        {activeTab === "facilities" && <TempleFacilities facilities={facilities} />}

        {activeTab === "programs" && <TemplePrograms programs={programs} />}

        {activeTab === "reviews" && <TempleReviews reviews={reviews} />}

        {activeTab === "notices" && <TempleNotices templeId={Number(templeId)} notices={notices} />}
      </div>
    </section>
  );
}
