"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KakaoMap from "@/components/KakaoMap";
import { DESTINATIONS } from "@/lib/destinations";
import { getTripState, TripState } from "@/lib/clientState";

export default function MapPage() {
  const router = useRouter();
  const [trip, setTrip] = useState<TripState | null>(null);

  useEffect(() => {
    setTrip(getTripState());
  }, []);

  if (!trip) return <div className="card">불러오는 중...</div>;

  const dest = DESTINATIONS.find((d) => d.id === trip.destinationId) ?? DESTINATIONS[0];
  const candidate = trip.selectedCandidate;

  if (!candidate) {
    return (
      <div className="card">
        선택된 우회지가 없습니다.
        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => router.push("/route-select")}>
          경로 선택으로 돌아가기
        </button>
      </div>
    );
  }

  const kakaoMapLink = `https://map.kakao.com/link/to/${encodeURIComponent(
    candidate.title
  )},${candidate.mapY},${candidate.mapX}`;
  // 티맵 딥링크: appName은 임의 식별자, 실제 배포 시 등록된 값으로 교체 권장
  const tmapLink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=YOUR_TMAP_APP_KEY&name=${encodeURIComponent(
    candidate.title
  )}&lon=${candidate.mapX}&lat=${candidate.mapY}`;

  return (
    <div>
      <div className="top-bar">
        <span className="brand">경로 지도</span>
      </div>

      <KakaoMap
        center={{ lat: dest.lat, lng: dest.lng }}
        markers={[
          { lat: dest.lat, lng: dest.lng, label: dest.name, color: "red" },
          { lat: candidate.mapY, lng: candidate.mapX, label: candidate.title, color: "green" },
        ]}
      />

      <div className="card">
        <div style={{ fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: "var(--color-danger)" }}>●</span> {dest.name}(기존) &nbsp;&nbsp;
          <span style={{ color: "var(--color-primary)" }}>●</span> {candidate.title}(우회)
        </div>
        <div className="stat-box" style={{ marginBottom: 12 }}>
          <div className="label">우회 거리</div>
          <div className="value">+{candidate.distanceKm}km</div>
        </div>
        <a className="btn btn-accent" href={kakaoMapLink} target="_blank" rel="noreferrer">
          카카오맵으로 길찾기
        </a>
        <div style={{ height: 8 }} />
        <a className="btn btn-outline" href={tmapLink} target="_blank" rel="noreferrer">
          티맵으로 길찾기
        </a>
      </div>

      <div className="btn-row">
        <button className="btn btn-outline" onClick={() => router.push(`/poi/${candidate.contentId}`)}>
          경유지 자세히 보기
        </button>
      </div>

      <div className="api-label">사용 API: 카카오맵 JS SDK + 카카오맵/티맵 딥링크</div>
    </div>
  );
}
