"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

type MarkerPoint = {
  lat: number;
  lng: number;
  label: string;
  color?: string;
};

export default function KakaoMap({
  center,
  markers,
  height = 220,
}: {
  center: { lat: number; lng: number };
  markers: MarkerPoint[];
  height?: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  const initMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 8,
      });

      const path: any[] = [];
      markers.forEach((m) => {
        const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
        new window.kakao.maps.Marker({ map, position: pos, title: m.label });
        path.push(pos);
      });

      if (path.length >= 2) {
        new window.kakao.maps.Polyline({
          map,
          path,
          strokeWeight: 4,
          strokeColor: "#1f6f5c",
          strokeOpacity: 0.8,
          strokeStyle: "shortdash",
        });
      }
    });
  };

  useEffect(() => {
    if (window.kakao?.maps) initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, markers]);

  if (!kakaoJsKey) {
    return (
      <div
        style={{
          height,
          borderRadius: 14,
          background: "#e6f3ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#6b7268",
          margin: "0 16px 16px",
        }}
      >
        NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJsKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height, borderRadius: 14, margin: "0 16px 16px" }}
      />
    </>
  );
}
