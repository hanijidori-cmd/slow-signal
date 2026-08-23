"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DESTINATIONS } from "@/lib/destinations";
import { setTripState } from "@/lib/clientState";

export default function HomePage() {
  const router = useRouter();
  const [destId, setDestId] = useState(DESTINATIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    congestionIndex: number;
    isCongested: boolean;
    breakdown: { exWeight: number; timeBonus: number; hotspot: number };
    exError: string | null;
  } | null>(null);

  const destination = DESTINATIONS.find((d) => d.id === destId)!;

  const checkCongestion = async () => {
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({
        destName: destination.name,
        routeName: destination.routeName,
      });
      const res = await fetch(`/api/congestion?${params.toString()}`);
      const data = await res.json();
      setResult(data);
      setTripState({
        destinationId: destination.id,
        destinationName: destination.name,
        destLat: destination.lat,
        destLng: destination.lng,
        congestionIndex: data.congestionIndex,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="top-bar">
        <span className="brand">슬로우-시그널</span>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 6 }}>
          목적지
        </div>
        <select
          value={destId}
          onChange={(e) => {
            setDestId(e.target.value);
            setResult(null);
          }}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          {DESTINATIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={checkCongestion} disabled={loading}>
          {loading ? "혼잡도 확인 중..." : "혼잡도 확인하기"}
        </button>
      </div>

      {result && (
        <>
          <div className="warning-banner">
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {result.isCongested
                ? `혼잡 지수 ${result.congestionIndex}/100 — 지금 가면 막힙니다`
                : `혼잡 지수 ${result.congestionIndex}/100 — 비교적 원활합니다`}
            </div>
            <div style={{ fontSize: 12 }}>
              고속도로 실측 +{result.breakdown.exWeight} · 시간대 보정 +
              {result.breakdown.timeBonus} · 과밀지 가중 +{result.breakdown.hotspot}
            </div>
            {result.exError && (
              <div style={{ fontSize: 11, marginTop: 6 }}>{result.exError}</div>
            )}
          </div>

          {result.isCongested && (
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={() => router.push("/route-select")}
              >
                슬로우 경로 보기
              </button>
            </div>
          )}
        </>
      )}

      <div className="api-label">사용 API: 한국도로공사 실시간 소통 데이터 + 시간대 보정 로직</div>

      <div className="footer-nav">
        <a href="/driving-alert">주행 중 알림<br />미리보기</a>
        <a href="/arrival">도착 보상<br />미리보기</a>
        <a href="/roadmap">발전 방향<br />로드맵</a>
      </div>
    </div>
  );
}
