const samples = [
  {
    name: "A. Pretendard",
    description: "단정하고 안정적인 인상",
    font: "Pretendard Variable, sans-serif",
  },
  {
    name: "B. SUIT",
    description: "가볍고 절제된 미니멀한 인상",
    font: "SUIT Variable, sans-serif",
  },
];

export default function FontTestPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#B75D32]">
          NIRVANA TYPOGRAPHY TEST
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#173F35]">글꼴 비교하기</h1>

        <p className="mt-3 text-sm text-[#756F62]">같은 문구를 두 가지 글꼴로 비교해 보세요.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {samples.map((sample) => (
            <section
              key={sample.name}
              className="rounded-xl border border-[#D8D0C0] bg-white p-6 sm:p-8"
              style={{ fontFamily: sample.font }}
            >
              <p className="text-sm font-semibold text-[#B75D32]">{sample.name}</p>

              <p className="mt-2 text-xs text-[#8A8173]">{sample.description}</p>

              <div className="mt-10">
                <p className="text-xs font-medium tracking-[0.2em] text-[#B75D32]">
                  TEMPLE EXPERIENCE
                </p>

                <h2 className="mt-4 text-3xl font-semibold leading-snug text-[#173F35] sm:text-4xl">
                  고요한 사찰에서의 하루
                </h2>

                <p className="mt-5 text-sm leading-7 text-[#756F62]">
                  바쁜 일상에서 벗어나 나를 만나는 특별한 시간을 경험해 보세요. 한국의 아름다운
                  사찰에서 새로운 쉼을 발견해 보세요.
                </p>
              </div>

              <div className="mt-10 border-t border-[#EEE5D3] pt-6">
                <h3 className="text-xl font-semibold text-[#173F35]">지금 인기 있는 체험</h3>

                <p className="mt-3 text-sm text-[#756F62]">새벽 숲, 나를 깨우는 시간</p>

                <p className="mt-2 text-sm font-semibold text-[#173F35]">₩80,000 / 1인</p>

                <button
                  type="button"
                  className="mt-6 rounded-full bg-[#B75D32] px-6 py-3 text-sm font-medium text-white"
                >
                  자세히 보기
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
