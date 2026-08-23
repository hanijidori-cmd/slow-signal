import { haversineKm } from "./haversine";

export function simScore(destCategory: string | null, candidateCategory: string | null): number {
  if (!destCategory || !candidateCategory) return 0.5; // 카테고리 정보 없으면 중립값
  if (destCategory === candidateCategory) return 1.0;
  // 대분류(앞 2글자)만 같아도 유사로 판정
  if (destCategory.slice(0, 2) === candidateCategory.slice(0, 2)) return 0.5;
  return 0;
}

export function effScore(distanceKm: number, maxKm = 20): number {
  if (distanceKm > maxKm) return 0;
  return Math.max(0, 1 - distanceKm / maxKm);
}

export function totalScore(sim: number, eff: number, wSim = 0.5, wEff = 0.5): number {
  return wSim * sim + wEff * eff;
}

export function distanceTo(lat1: number, lng1: number, lat2: number, lng2: number) {
  return haversineKm(lat1, lng1, lat2, lng2);
}
