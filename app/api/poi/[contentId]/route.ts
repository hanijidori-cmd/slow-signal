import { NextRequest, NextResponse } from "next/server";

const KTO_API_KEY = process.env.KTO_API_KEY!;
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

async function fetchItem(url: string) {
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`KTO API 호출 실패: ${res.status}`);
  const data = await res.json();
  return data?.response?.body?.items?.item ?? null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { contentId: string } }
) {
  const contentId = params.contentId;
  if (!contentId) {
    return NextResponse.json({ error: "contentId가 없습니다." }, { status: 400 });
  }

  try {
    const [commonRaw, introRaw, imagesRaw] = await Promise.all([
      fetchItem(
        `${BASE_URL}/detailCommon2?serviceKey=${KTO_API_KEY}&MobileOS=ETC&MobileApp=SlowSignal&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&overviewYN=Y&_type=json`
      ),
      fetchItem(
        `${BASE_URL}/detailIntro2?serviceKey=${KTO_API_KEY}&MobileOS=ETC&MobileApp=SlowSignal&contentId=${contentId}&contentTypeId=12&_type=json`
      ),
      fetchItem(
        `${BASE_URL}/detailImage2?serviceKey=${KTO_API_KEY}&MobileOS=ETC&MobileApp=SlowSignal&contentId=${contentId}&imageYN=Y&_type=json`
      ),
    ]);

    const c = Array.isArray(commonRaw) ? commonRaw[0] : commonRaw;
    const i = Array.isArray(introRaw) ? introRaw[0] : introRaw;
    const imgs = Array.isArray(imagesRaw) ? imagesRaw : imagesRaw ? [imagesRaw] : [];

    if (!c) {
      return NextResponse.json(
        { error: "해당 관광지 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      contentId,
      title: c.title ?? null,
      addr1: c.addr1 ?? null,
      addr2: c.addr2 ?? null,
      mapX: c.mapx ?? null,
      mapY: c.mapy ?? null,
      firstImage: c.firstimage || c.firstimage2 || null,
      overview: c.overview ?? null,
      tel: c.tel ?? null,
      homepage: c.homepage ?? null,
      usetime: i?.usetime ?? null,
      restdate: i?.restdate ?? null,
      parking: i?.parking ?? null,
      infocenter: i?.infocenter ?? null,
      chkpet: i?.chkpet ?? null,
      chkbabycarriage: i?.chkbabycarriage ?? null,
      chkcreditcard: i?.chkcreditcard ?? null,
      expguide: i?.expguide ?? null,
      subImages: imgs.map((img: any) => ({
        original: img.originimgurl,
        small: img.smallimageurl,
      })),
    });
  } catch (err) {
    console.error("POI 상세 조회 실패:", err);
    return NextResponse.json(
      { error: "공공데이터 API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
