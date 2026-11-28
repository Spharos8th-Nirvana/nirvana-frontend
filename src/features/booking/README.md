# Booking Feature

예약 흐름 중 예약 정보 입력(2단계) 화면과 입력 검사, 마이페이지의 예약 내역 화면을 관리합니다.
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

## 마이페이지 예약 내역

- 데이터 기준: DB 예약 화면용 조회 테이블 `nirvana_booking_query.bookingViews`. 타입(`types/booking-view.ts`)과 임시 데이터(`data/my-bookings.ts`)는 칸 이름을 그대로 씁니다.
- 상태 이름, 상태 탭, 날짜·인원 표시는 `utils/booking-status.ts`에 모았습니다. 미참석(`NOSHOW`)은 탭 없이 '전체'에서만 보입니다.
- `components/molecules/BookingStatusBadge`: 목록과 상세 패널이 함께 쓰는 상태 배지
- `components/organisms/MyBookingList`: 예약 목록. 줄 어디를 눌러도 상세 패널이 열립니다.
- `components/organisms/MyBookingDetailPanel`: 오른쪽에서 밀려 나오는 예약 상세 패널(읽기 전용). 후기 작성은 후기 작성 화면으로 연결(`from=bookings`)했고, 결제하기·예약 취소는 자리만 있습니다.
- `components/templates/MyBookingsTemplate`: 상태 탭, 목록, 상세 패널을 묶고 고른 탭과 열린 예약을 기억합니다.
- 화면 조립은 `app/(user)/mypage/page.tsx`가 맡습니다. 주소에 `?booking=예약번호`가 있으면 그 예약의 상세 패널을 연 채로 시작하고, 패널을 닫으면 주소를 `/mypage`로 정리합니다 (후기 작성에서 돌아올 때). 예약 API가 정해지면 임시 데이터 대신 서버에서 조회합니다.
