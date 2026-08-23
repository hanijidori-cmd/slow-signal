// 전남 인구감소지역 후보 시군 목록
// areaCode(전남=38)와 sigunguCode는 KTO TourAPI 표준 코드표 기준입니다.
// ⚠️ 제출 전 한 번은 KTO API의 areaCode2 엔드포인트로 실제 값을 재확인하세요.
//    (sigunguCode가 바뀌었을 가능성에 대비한 안전장치)
export type CandidateRegion = {
  name: string;
  areaCode: string;
  sigunguCode: string;
  centerLat: number;
  centerLng: number;
};

export const JEONNAM_AREA_CODE = "38";

export const CANDIDATE_REGIONS: CandidateRegion[] = [
  { name: "보성군", areaCode: "38", sigunguCode: "10", centerLat: 34.7714, centerLng: 127.0797 },
  { name: "고흥군", areaCode: "38", sigunguCode: "9", centerLat: 34.6113, centerLng: 127.2846 },
  { name: "강진군", areaCode: "38", sigunguCode: "13", centerLat: 34.6421, centerLng: 126.7674 },
  { name: "해남군", areaCode: "38", sigunguCode: "14", centerLat: 34.5734, centerLng: 126.5992 },
  { name: "장흥군", areaCode: "38", sigunguCode: "12", centerLat: 34.6813, centerLng: 126.9067 },
  { name: "구례군", areaCode: "38", sigunguCode: "8", centerLat: 35.2024, centerLng: 127.4629 },
];

// 과밀(혼잡) 대표 관광지 — 혼잡 판정 시 가중치를 주는 목적지 목록
export const CONGESTED_HOTSPOTS = ["여수", "순천", "오동도", "순천만"];
