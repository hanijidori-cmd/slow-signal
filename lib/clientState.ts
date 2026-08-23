// 로그인 없이 localStorage로 여정 진행상태를 저장합니다.
const KEY = "slow-signal-trip";

export type TripState = {
  destinationId?: string;
  destinationName?: string;
  destLat?: number;
  destLng?: number;
  congestionIndex?: number;
  selectedCandidate?: {
    contentId: string;
    title: string;
    mapX: number;
    mapY: number;
    distanceKm: number;
    score: number;
    regionName: string;
  };
  badges?: string[];
  totalPoints?: number;
};

export function getTripState(): TripState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setTripState(patch: Partial<TripState>) {
  if (typeof window === "undefined") return;
  const current = getTripState();
  const next = { ...current, ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
