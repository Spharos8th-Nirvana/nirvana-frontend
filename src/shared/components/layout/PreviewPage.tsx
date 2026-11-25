import type { ReactNode } from "react";
import PageHero from "@/shared/components/layout/PageHero";

type PreviewPageProps = {
  title: string;
  description: string;
  image?: string;
  children: ReactNode;
};

export function PreviewPage({ title, description, image = "/images/photo-18464fadd2d70532.jpg", children }: PreviewPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <PageHero title={title} description={description} image={image} />
      <section className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">{children}</section>
    </main>
  );
}
