import { NextRequest, NextResponse } from "next/server";
import { CANDIDATE_REGIONS } from "@/lib/candidates";
import { simScore, effScore, totalScore, distanceTo } from "@/lib/scoring";

const KTO_API_KEY = process.env.KTO_API_KEY!;
const KOR_SERVICE = "https://apis.data.go.kr/B551011/KorService2";
const TAR_RLTE_SERVICE = "https://apis.data.go.kr/B551011/TarRlteTarService1";

// 목적지의 연관 카테고리를 조회합니다.
// ⚠️ TarRlteTarService1의 정확한 오퍼레이션명(areaBasedList1 등)은 KTO 문서에서
//    반드시 재확인하세요. 이 함수는 실패해도 앱이 죽지 않도록 null을 반환합니다.
//    (실제 서비스에서는 이 데이터가 "실시간 취향 분석"이 아니라
//    "2024.5~2025.4 티맵 이동데이터 기반 과거 패턴"임을 화면에 명시해야 합니다.)
async function fetchDestinationCategory(keyword: string): Promise<string | null> {
  try {
    const url = `${TAR_RLTE_SERVICE}/searchKeyword1?serviceKey=${KTO_API_KEY}&MobileOS=ETC&MobileApp=SlowSignal&keyword=${encodeURIComponent(
      keyword
    )}&numOfRows=1&pageNo=1&_type=json`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.response?.body?.items?.item;
    const first = Array.isArray(item) ? item[0] : item;
    return first?.rlteCtgryMclsNm ?? null;
  } catch (err) {
    console.error("연관관광지 API 조회 실패(카테고리 조회 생략):", err);
    return null;
  }
}

type CandidatePlace = {
  contentId: string;
  title: string;
  mapX: number;
  mapY: number;
  category: string | null;
  addr1: string | null;
  firstImage: string | null;
};

async function fetchCandidatesInRegion(
  areaCode: string,
  sigunguCode: string
): Promise<CandidatePlace[]> {
  try {
    const url = `${KOR_SERVICE}/areaBasedList2?serviceKey=${KTO_API_KEY}&MobileOS=ETC&MobileApp=SlowSignal&areaCode=${areaCode}&sigunguCode=${sigunguCode}&contentTypeId=12&numOfRows=10&pageNo=1&arrange=Q&_type=json`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.response?.body?.items?.item ?? [];
    const list = Array.isArray(items) ? items : [items];
    return list
      .filter((it: any) => it?.mapx && it?.mapy)
      .map((it: any) => ({
        contentId: it.contentid,
        title: it.title,
        mapX: parseFloat(it.mapx),
        mapY: parseFloat(it.mapy),
        category: it.cat3 ?? null,
        addr1: it.addr1 ?? null,
        firstImage: it.firstimage || it.firstimage2 || null,
      }));
  } catch (err) {
    console.error(`후보지 조회 실패 (지역코드 ${sigunguCode}):`, err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destLat = parseFloat(searchParams.get("destLat") || "");
  const destLng = parseFloat(searchParams.get("destLng") || "");
  const destKeyword = searchParams.get("destKeyword") || "";

  if (Number.isNaN(destLat) || Number.isNaN(destLng)) {
    return NextResponse.json(
      { error: "destLat, destLng 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const destCategory = await fetchDestinationCategory(destKeyword);

  const regionResults = await Promise.all(
    CANDIDATE_REGIONS.map((region) =>
      fetchCandidatesInRegion(region.areaCode, region.sigunguCode).then((places) => ({
        region,
        places,
      }))
    )
  );

  const scored = regionResults.flatMap(({ region, places }) =>
    places.map((p) => {
      const distanceKm = distanceTo(destLat, destLng, p.mapY, p.mapX);
      const sim = simScore(destCategory, p.category);
      const eff = effScore(distanceKm);
      const score = totalScore(sim, eff);
      return {
        ...p,
        regionName: region.name,
        distanceKm: Math.round(distanceKm * 10) / 10,
        sim,
        eff,
        score,
      };
    })
  );

  const top3 = scored
    .filter((s) => s.eff > 0) // 20km 초과는 후보에서 제외
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return NextResponse.json({
    destCategory,
    destCategoryNote:
      "연관관광지API 기반 과거(2024.5~2025.4) 이동패턴 카테고리 — 실시간 취향분석 아님",
    candidates: top3,
  });
}
