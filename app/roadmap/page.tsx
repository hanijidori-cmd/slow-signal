export default function RoadmapPage() {
  const phases = [
    {
      title: "Phase 1 (현재, MVP)",
      items: [
        "KTO OpenAPI 3종(국문관광정보·연관관광지·Odii) 연동 완료",
        "한국도로공사 실시간 소통 데이터 기반 혼잡 판정",
        "카카오맵 표시, 카카오맵/티맵 딥링크, 카카오톡 공유하기",
      ],
    },
    {
      title: "Phase 2 (사업 제휴 이후)",
      items: [
        "카카오모빌리티 실시간 길찾기 API 연동 — 더 정밀한 혼잡 감지",
        "카카오내비 SDK viaPoints 연동 — 앱 내 자동 경유지 주입 및 오버레이",
        "카카오같이가치 공식 기부 캠페인 등록 — 지역화폐 연계 리워드",
      ],
    },
    {
      title: "Phase 3 (사업화·공공연계)",
      items: [
        "지자체 정책 의사결정용 '남도 트래픽 대시보드' B2G 제공",
        "렌터카·여행사 전용 SDK 배포 (B2B)",
        "카카오 ESG 공식 상생사례 등재 및 글로벌 소도시 확장",
      ],
    },
  ];

  return (
    <div>
      <div className="top-bar">
        <span className="brand">발전 방향</span>
      </div>
      {phases.map((phase) => (
        <div className="card" key={phase.title}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{phase.title}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--color-text-muted)" }}>
            {phase.items.map((item) => (
              <li key={item} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="api-label">
        Phase 2·3 항목은 현재 개인 개발자 권한으로는 사용할 수 없는 카카오 사업 제휴형 API입니다.
      </div>
    </div>
  );
}
