# 슬로우-시그널 (Slow-Signal)

2026 관광데이터 활용 공모전 - ① 웹·앱 개발 부문 제출용 MVP

## 실행 전 준비

`.env.local` 파일을 프로젝트 루트에 만들고 아래 3개 값을 채우세요.
(`.env.example` 참고)

> 실제 키 값은 각 발급처(한국관광공사, 한국도로공사, 카카오 개발자 콘솔)에서 직접 발급받아
> 본인 `.env.local`에만 넣으세요. 이 저장소처럼 공개된 곳에 키를 적지 마세요.

```
KTO_API_KEY=<YOUR_KTO_API_KEY>
EX_API_KEY=<YOUR_EX_API_KEY>
NEXT_PUBLIC_KAKAO_JS_KEY=<YOUR_KAKAO_JS_KEY>
```

⚠️ **`NEXT_PUBLIC_KAKAO_JS_KEY`는 이름 그대로 클라이언트(브라우저)에도 노출되는 값입니다.**
카카오 JS 키는 원래 그렇게 설계되어 있고(도메인 화이트리스트로 보안 처리),
`KTO_API_KEY`/`EX_API_KEY`와는 다르게 다뤄야 합니다. `NEXT_PUBLIC_` 접두사를 빼면
지도가 작동하지 않습니다.

Replit / Vercel에 올릴 때는 각 플랫폼의 "Secrets" 또는 "Environment Variables"에
위 3개 키 이름 그대로 등록하면 됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 배포 (Replit에 업로드하는 경우)

1. 이 zip을 Replit에 새 Node.js/Next.js 프로젝트로 Import
2. Secrets에 위 3개 환경변수 등록
3. Run 버튼 클릭 (내부적으로 `npm install && npm run dev` 실행됨)
4. Replit이 배포 URL을 만들어주면, 카카오 개발자 콘솔
   (https://developers.kakao.com/console/app/1438804/config/platform-key)의
   "Web 플랫폼"에 그 도메인을 등록해야 지도가 실제로 표시됩니다.

## 배포 (Vercel에 올리는 경우)

1. GitHub에 이 코드를 새 저장소로 push (`.env*`는 .gitignore에 있어 자동 제외됨)
2. vercel.com에서 저장소 Import
3. Environment Variables에 위 3개 키 등록 후 Deploy
4. 배포 URL을 카카오 콘솔 Web 플랫폼에 등록

## 화면 구성

| 경로 | 화면 | 사용 API |
|---|---|---|
| `/` | 홈 · 혼잡도 확인 | 한국도로공사 실시간 소통 데이터 |
| `/route-select` | 경로 비교 · 추천 우회지 | TarRlteTarService1, KorService2 |
| `/map` | 지도 · 길찾기 딥링크 | 카카오맵 JS SDK |
| `/poi/[contentId]` | 경유지 상세 | KorService2 detailCommon2/Intro2/Image2 |
| `/driving-alert` | 주행 중 알림 (안전 최소설계) | 음성(Web Speech API) |
| `/arrival` | 도착 · 보상 | 로컬 계산 + 카카오 공유하기 |
| `/roadmap` | 발전 방향 (Phase 2·3) | - |

## 알려진 제약 (기능설명서 작성 시 참고)

- `TarRlteTarService1`의 정확한 오퍼레이션명은 재검증이 필요합니다
  (`lib` 및 `app/api/recommend/route.ts`에 주석으로 표시해뒀습니다). 호출이 실패해도
  앱이 죽지 않고 카테고리 없이 진행되도록 처리되어 있습니다.
- `Odii`(오디오 가이드) API는 이번 MVP에 아직 연결하지 않았습니다. 실제 필드명을
  테스트 호출로 확인한 후 `/poi/[contentId]` 화면에 추가하면 됩니다.
- 목적지는 자유 검색이 아니라 프리셋 2곳(`lib/destinations.ts`)으로 한정했습니다.
  자유 검색을 붙이려면 카카오 로컬(Local) API(주소→좌표 변환)가 추가로 필요합니다.
- 인구감소지역 후보 시군의 `sigunguCode`는 표준 코드표 기준이라 실제 KTO API로
  한 번 재확인 권장합니다 (`lib/candidates.ts` 주석 참고).
- 주행 중 GPS 속도/지오펜스 자동 감지는 아직 시뮬레이션 단계입니다. `/driving-alert`
  화면 자체는 완성되어 있으니, 실제 위치 감지 로직만 추가로 연결하면 됩니다.
