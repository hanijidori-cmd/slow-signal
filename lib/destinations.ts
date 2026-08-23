// 데모/MVP 범위의 목적지 프리셋입니다.
// 자유 주소 검색을 붙이려면 카카오 로컬(Local) API(주소→좌표 변환, REST API 키 필요)를
// 추가로 연동하면 됩니다. 지금은 심사에서 흔히 언급되는 과밀 목적지 3곳으로 한정했습니다.
export type Destination = {
  id: string;
  name: string;
  keyword: string;
  lat: number;
  lng: number;
  routeName: string; // 한국도로공사 API의 routeName 필터링용
};

export const DESTINATIONS: Destination[] = [
  {
    id: "yeosu-odongdo",
    name: "여수 오동도",
    keyword: "오동도",
    lat: 34.7382,
    lng: 127.7594,
    routeName: "남해선",
  },
  {
    id: "suncheon-bay",
    name: "순천만습지",
    keyword: "순천만습지",
    lat: 34.8763,
    lng: 127.5219,
    routeName: "순천완주선",
  },
];
