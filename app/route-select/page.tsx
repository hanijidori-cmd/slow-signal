"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DESTINATIONS } from "@/lib/destinations";
import { getTripState, setTripState } from "@/lib/clientState";

type Candidate = {
  contentId: string;
  title: string;
  mapX: number;
  mapY: number;
  regionName: string;
  distanceKm: number;
  sim: number;
  eff: number;
  score: number;
  firstImage: string | null;
};

export default function RouteSelectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trip = getTripState();
    const dest = DESTINATIONS.find((d) => d.id === trip.destinationId) ?? DESTINATIONS[0];

    const params = new URLSearchParams({
      destLat: String(dest.lat),
      destLng: String(dest.lng),
      destKeyword: dest.keyword,
    });

    fetch(`/api/recommend?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCandidates(data.candidates ?? []);
      })
      .catch((err) => {
        console.error(err);
        setError("추천 우회지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectCandidate = (c: Candidate) => {
    setTripState({
      selectedCandidate: {
        contentId: c.contentId,
        title: c.title,
        mapX: c.mapX,
        mapY: c.mapY,
        distanceKm: c.distanceKm,
        score: c.score,
        regionName: c.regionName,
      },
    });
    router.push("/map");
  };

  return (
    <div>
      <div className="top-bar">
        <span className="brand">경로 선택</span>
      </div>

      {loading && <div className="card">추천 우회지를 찾는 중...</div>}
      {error && <div className="card">{error}</div>}

      {!loading && !error && candidates.length === 0 && (
        <div className="card">20km 이내 조건을 만족하는 추천 우회지가 없습니다.</div>
      )}

      {candidates.map((c, idx) => (
        <div key={c.contentId} className={idx === 0 ? "card card-accent" : "card"}>
          {idx === 0 && (
            <div className="badge" style={{ marginBottom: 8 }}>
              추천 · 매칭점수 {c.score.toFixed(2)}
            </div>
          )}
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {c.title} <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: 12 }}>({c.regionName})</span>
          </div>
          <div className="grid-2" style={{ marginBottom: 10 }}>
            <div className="stat-box">
              <div className="label">거리</div>
              <div className="value">{c.distanceKm}km</div>
            </div>
            <div className="stat-box">
              <div className="label">취향일치(Sim)</div>
              <div className="value">{c.sim.toFixed(2)}</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => selectCandidate(c)}>
            이 경로로 갈게요
          </button>
        </div>
      ))}

      <div className="api-label">
        사용 API: TarRlteTarService1(카테고리) + KorService2 areaBasedList2(후보지)
      </div>
    </div>
  );
}
