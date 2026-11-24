type PageHeroProps = {
  title: string;
  description: string;
  image: string;
};

export default function PageHero({ title, description, image }: PageHeroProps) {
  return (
    <section
      data-page-hero
      className="relative flex min-h-[400px] items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* 배경 이미지 어둡게 처리 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 제목과 설명 */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-3xl font-bold md:text-[40px]">{title}</h1>

        <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-white/90 sm:text-sm md:mt-6 md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
