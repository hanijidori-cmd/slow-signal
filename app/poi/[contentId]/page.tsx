"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PoiDetail = {
  title: string | null;
  overview: string | null;
  firstImage: string | null;
  usetime: string | null;
  restdate: string | null;
  parking: string | null;
  infocenter: string | null;
  chkpet: string | null;
  error?: string;
};

export default function PoiDetailPage({ params }: { params: { contentId: string } }) {
  const router = useRouter();
  const [data, setData] = useState<PoiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/poi/${params.contentId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(() => setError("공공데이터를 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [params.contentId]);

  return (
    <div>
      <div className="top-bar">
        <span className="brand">경유지 상세</span>
      </div>

      {loading && <div className="card">불러오는 중...</div>}

      {error && (
        <div className="card">
          {error}
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      )}

      {data && !error && (
        <>
          {data.firstImage && (
            <div className="image-block">
              <img src={data.firstImage} alt={data.title ?? ""} />
            </div>
          )}
          <div className="card" style={{ marginTop: -8 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{data.title}</div>
            {data.overview && (
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                {data.overview}
              </p>
            )}

            <div className="grid-2" style={{ marginTop: 12 }}>
              <div className="stat-box">
                <div className="label">이용시간</div>
                <div className="value">{data.usetime || "정보 없음"}</div>
              </div>
              <div className="stat-box">
                <div className="label">쉬는날</div>
                <div className="value">{data.restdate || "정보 없음"}</div>
              </div>
              <div className="stat-box">
                <div className="label">주차</div>
                <div className="value">{data.parking || "정보 없음"}</div>
              </div>
              <div className="stat-box">
                <div className="label">문의</div>
                <div className="value">{data.infocenter || "정보 없음"}</div>
              </div>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => router.push("/arrival")}>
              체크인 준비 완료
            </button>
          </div>
        </>
      )}

      <div className="api-label">사용 API: KorService2 detailCommon2 + detailIntro2 + detailImage2</div>
    </div>
  );
}
