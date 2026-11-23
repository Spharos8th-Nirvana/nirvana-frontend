import type { TempleFacility } from "@/data/temple-facilities";

type TempleFacilitiesProps = {
  facilities: TempleFacility[];
};

export default function TempleFacilities({
  facilities,
}: TempleFacilitiesProps) {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">시설 안내</h2>
        <p className="mt-2 text-sm text-[#756F62]">
          사찰에서 이용할 수 있는 주요 시설을 소개합니다.
        </p>
      </div>

      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <article
              key={facility.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div
                role="img"
                aria-label={facility.name}
                className="h-56 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("${facility.image}")`,
                }}
              />

              <div className="p-5">
                <h3 className="text-lg font-bold text-primary">
                  {facility.name}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#756F62]">
                  {facility.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#D8CCB8] px-5 py-16 text-center">
          <p className="text-primary">등록된 시설 정보가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
