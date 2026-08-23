"use client";

import { useEffect, useState } from "react";
import { getTripState, setTripState, TripState } from "@/lib/clientState";

const CARBON_FACTOR_KG_PER_KM = 0.12;

export default function ArrivalPage() {
  const [trip, setTrip] = useState<TripState | null>(null);

  useEffect(() => {
    const current = getTripState();
    const distance = current.selectedCandidate?.distanceKm ?? 0;
    const points = Math.round(distance * 5);
    const badgeName = "남도 슬로우러 배지";

    const badges = current.badges ?? [];
    const alreadyHas = badges.includes(badgeName);
    const nextBadges = alreadyHas ? badges : [...badges, badgeName];
    const nextPoints = (current.totalPoints ?? 0) + points;

    const updated = setTripState({ badges: nextBadges, totalPoints: nextPoints });
    setTrip(updated ?? current);
  }, []);

  if (!trip) return <div className="card">불러오는 중...</div>;

  const distance = trip.selectedCandidate?.distanceKm ?? 0;
  const carbon = Math.round(distance * CARBON_FACTOR_KG_PER_KM * 100) / 100;

  const shareText = `남도 슬로우 여정을 완주했어요! ${
    trip.selectedCandidate?.title ?? ""
  }로 우회해서 탄소 ${carbon}kg을 절감했습니다. #슬로우시그널 #전남여행`;

  const shareViaKakao = () => {
    // 카카오톡 공유하기 SDK 연동 지점
    // Kakao.Share.sendDefault({...}) 형태로 구현, kakao.min.js 로드 후 사용
    if (navigator.share) {
      navigator.share({ title: "슬로우-시그널", text: shareText }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      alert("공유 텍스트가 복사되었습니다. 카카오톡에 붙여넣어 공유해보세요.");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <span className="brand">도착 및 보상</span>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#e6f3ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 26,
          }}
        >
          ✓
        </div>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>남도 슬로우러 배지 획득</div>

        <div className="grid-2" style={{ textAlign: "left", marginBottom: 16 }}>
          <div className="stat-box">
            <div className="label">우회거리</div>
            <div className="value">{distance}km</div>
          </div>
          <div className="stat-box">
            <div className="label">탄소절감</div>
            <div className="value">{carbon}kg</div>
          </div>
          <div className="stat-box">
            <div className="label">가치포인트</div>
            <div className="value">+{Math.round(distance * 5)}</div>
          </div>
          <div className="stat-box">
            <div className="label">누적배지</div>
            <div className="value">{trip.badges?.length ?? 0}개</div>
          </div>
        </div>

        <button className="btn btn-accent" onClick={shareViaKakao}>
          카카오톡으로 공유하기
        </button>
      </div>

      <div className="api-label">
        사용 API: 카카오 공유하기(Share) · 로컬 계산(탄소·포인트) · localStorage 저장
      </div>
    </div>
  );
}
