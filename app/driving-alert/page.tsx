"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTripState } from "@/lib/clientState";

// 이 화면은 의도적으로 정보 밀도를 최소화했습니다.
// 실제 배포본에서는 GPS 속도 감지 + 지오펜스 통과 시 딱 1회만 이 화면을 띄우고,
// 평소에는 백그라운드에서 조용히 대기해야 합니다. (design guide의 예외 화면)
export default function DrivingAlertPage() {
  const router = useRouter();

  useEffect(() => {
    const trip = getTripState();
    const text = `지금 가면 막힙니다. 우회하면 ${
      trip.selectedCandidate?.title ?? "한적한 경로"
    }가 있어요.`;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR";
      window.speechSynthesis.speak(utter);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 24,
        gap: 16,
      }}
    >
      <div style={{ textAlign: "center", fontSize: 15, color: "var(--color-warning-text)" }}>
        지금 가면 막힙니다. 우회할까요?
      </div>
      <button
        className="btn btn-primary"
        style={{ padding: "22px 16px", fontSize: 18 }}
        onClick={() => router.push("/map")}
      >
        우회할게요
      </button>
      <button
        className="btn btn-outline"
        style={{ padding: "22px 16px", fontSize: 18 }}
        onClick={() => router.push("/")}
      >
        계속 갈게요
      </button>
    </div>
  );
}
