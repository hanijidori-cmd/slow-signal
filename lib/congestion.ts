// 혼잡지수 산출 — 한국도로공사 실시간 grade 값 + 국도구간 시간대 보정 하이브리드 모델
// grade: 1=원활(80km/h+), 2=서행(40~80km/h), 3=정체(0~40km/h)

export type ExVdsRecord = {
  routeNo?: string;
  routeName?: string;
  grade?: string;
  speed?: string;
  conzoneName?: string;
};

export function congestionFromExData(records: ExVdsRecord[]): number {
  if (!records || records.length === 0) return 0;
  let weight = 0;
  for (const r of records) {
    const grade = Number(r.grade);
    if (grade === 3) weight = Math.max(weight, 50); // 정체 구간이 하나라도 있으면 +50
    else if (grade === 2) weight = Math.max(weight, 25); // 서행이면 +25
  }
  return weight;
}

export function timeOfDayBonus(date: Date = new Date()): number {
  const day = date.getDay(); // 0=일 6=토
  const hour = date.getHours();
  const isWeekend = day === 0 || day === 6;
  const isPeakHour = hour >= 10 && hour < 16;
  // 주말 또는 낮 시간대(10~16시)면 국도 구간 혼잡 가능성 보정치 부여
  return isWeekend || isPeakHour ? 30 : 0;
}

export function hotspotBonus(destinationName: string, hotspots: string[]): number {
  return hotspots.some((h) => destinationName.includes(h)) ? 20 : 0;
}

export function computeCongestionIndex(params: {
  exWeight: number;
  timeBonus: number;
  hotspot: number;
}): number {
  const total = params.exWeight + params.timeBonus + params.hotspot;
  return Math.min(100, total);
}
