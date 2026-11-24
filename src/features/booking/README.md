# Booking Feature

예약 흐름 중 예약 정보 입력(2단계) 화면과 입력 검사를 관리합니다.
1단계(회차·인원 선택)는 프로그램 상세의 `features/program`이 맡고, 선택한 회차와 인원만 주소로 넘겨받습니다.

## 데이터 기준

- 입력 항목과 필수 여부는 DB DDL(`nirvana_booking.bookings`, `bookingParticipants`, `bookingTerms`)을 따릅니다. 피그마는 화면 배치 참고용입니다.
- 지금은 임시 데이터(`data/`)를 사용합니다. 실제 요청·응답 타입은 API(Swagger) 확정 후 맞춥니다.
- 화면의 입력 검사는 사용자를 돕기 위한 것이고, 최종 검증은 Backend가 합니다.
- 개인정보(예약자·참가자 정보)는 주소(URL)나 콘솔에 남기지 않습니다.

## Component layers

- `components/atoms`: 입력 칸 묶음(라벨, 필수 표시, 오류 문구)
- `components/organisms`: 진행 단계, 예약자 정보, 참가자 정보, 약관·환불 규정, 예약 요약
- `components/templates`: organism을 화면 순서로 조립하고 입력 상태와 검사를 연결
- `app/(user)/programs/[id]/booking`: 1단계에서 넘어온 회차·인원 확인과 서버 데이터 조립
