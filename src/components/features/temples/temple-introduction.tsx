type TempleIntroductionProps = {
  name: string;
  address: string;
  phone: string;
  introduction: string;
  directions: string;
};

export default function TempleIntroduction({
  name,
  address,
  phone,
  introduction,
  directions,
}: TempleIntroductionProps) {
  return (
    <div className="space-y-24">
      {/* 사찰 기본 정보 */}
      <div className="text-center text-sm leading-7 text-[#756F62]">
        <p>주소</p>
        <p className="font-medium text-[#173F35]">{address || "주소 정보 준비 중"}</p>

        <p className="mt-2">전화번호</p>
        <p className="font-medium text-[#173F35]">{phone || "전화번호 정보 준비 중"}</p>
      </div>

      {/* 사찰 소개글 */}
      <section className="flex min-h-[240px] items-center justify-center border border-[#D8CCB8] px-8 py-12">
        <div className="max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#173F35]">{name} 소개</h2>

          <p className="mt-6 whitespace-pre-line leading-8 text-[#756F62]">
            {introduction || "사찰 소개글을 준비하고 있습니다."}
          </p>
        </div>
      </section>

      {/* 찾아오시는 길 */}
      <section className="text-center">
        <p className="text-xs font-semibold text-[#8A8173]">위치</p>

        <h2 className="mt-2 text-2xl font-bold text-[#173F35]">찾아오시는 길</h2>

        <p className="mx-auto mt-6 max-w-3xl leading-7 text-[#756F62]">
          {directions || "찾아오시는 길 정보를 준비하고 있습니다."}
        </p>

        {/* 지도 영역 */}
        <div className="mt-10 flex h-[300px] items-center justify-center border border-[#D8CCB8] bg-[#EEE5D3] md:h-[420px]">
          <span className="text-lg font-semibold text-[#756F62]">지도 영역</span>
        </div>
      </section>
    </div>
  );
}
