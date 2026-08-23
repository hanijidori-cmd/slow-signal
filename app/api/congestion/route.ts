import { NextRequest, NextResponse } from "next/server";
import { CONGESTED_HOTSPOTS } from "@/lib/candidates";
import {
  congestionFromExData,
  timeOfDayBonus,
  hotspotBonus,
  computeCongestionIndex,
  ExVdsRecord,
} from "@/lib/congestion";

const EX_API_KEY = process.env.EX_API_KEY!;
const EX_URL = "https://data.ex.co.kr/openapi/odtraffic/trafficAmountByRealtime";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destName = searchParams.get("destName") || "";
  const routeName = searchParams.get("routeName"); // 예: "남해선" — 없으면 전체 중 최댓값 사용

  let exWeight = 0;
  let exError: string | null = null;
  let sample: ExVdsRecord[] = [];

  try {
    const url = `${EX_URL}?key=${EX_API_KEY}&type=json`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`EX API 응답 오류: ${res.status}`);
    const data = await res.json();
    const list: ExVdsRecord[] = data?.list ?? data?.response?.body?.items ?? [];

    const filtered = routeName
      ? list.filter((r) => r.routeName?.includes(routeName))
      : list;

    sample = filtered.slice(0, 5);
    exWeight = congestionFromExData(filtered);
  } catch (err) {
    console.error("한국도로공사 API 호출 실패:", err);
    exError = "실시간 도로 데이터를 불러오지 못해 시간대 기반 보정만 적용됩니다.";
  }

  const timeBonus = timeOfDayBonus();
  const hotspot = hotspotBonus(destName, CONGESTED_HOTSPOTS);
  const congestionIndex = computeCongestionIndex({ exWeight, timeBonus, hotspot });

  return NextResponse.json({
    congestionIndex,
    breakdown: { exWeight, timeBonus, hotspot },
    exError,
    sample,
    isCongested: congestionIndex >= 60,
  });
}
