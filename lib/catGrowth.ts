// lib/catGrowth.ts
import { store, type ReadLog } from "./localStore";

// 성장 단계 타입
export type CatLevelStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// 기분 타입
export type CatMood = "superHappy" | "happy" | "calm" | "bored" | "sleepy";

// 오라 타입
export type CatAura = "none" | "spark" | "halo" | "flow" | "legend";

export type CatGrowthStats = {
  totalPages: number;
  pagesToday: number;
  streakDays: number;
  recentReadDays: number;
};

export type CatGrowthState = {
  levelStage: CatLevelStage;
  levelName: string;
  mood: CatMood;
  aura: CatAura;
  stats: CatGrowthStats;
};

// YYYY-MM-DD 문자열을 Date로 변환
function parseISODate(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map((v) => Number(v));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// logs에서 가장 최근 읽은 날짜(YYYY-MM-DD) 찾기
function getLastReadDateISO(logs: ReadLog[]): string | null {
  if (logs.length === 0) return null;
  const dates = Array.from(new Set(logs.map((l) => l.date))).sort(); // 오름차순
  return dates[dates.length - 1] ?? null;
}

// 오늘로부터 며칠 지났는지
function daysSince(dateISO: string | null): number | null {
  if (!dateISO) return null;
  const target = parseISODate(dateISO);
  if (!target) return null;

  const today = new Date();
  // 시/분/초 버리기
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - target.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// 최근 7일 동안 "읽은 날"이 며칠인지 계산
function computeRecentReadDays(logs: ReadLog[]): number {
  if (logs.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 최근 7일 날짜 문자열 준비 (오늘 포함)
  const days: string[] = [];
  const cursor = new Date(today);
  for (let i = 0; i < 7; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    days.push(iso);
    cursor.setDate(cursor.getDate() - 1);
  }

  const logsByDate = new Set(logs.map((l) => l.date));
  let count = 0;
  for (const day of days) {
    if (logsByDate.has(day)) count++;
  }
  return count;
}

// 누적 페이지 → 레벨 단계/이름 계산
function computeLevel(totalPages: number): {
  levelStage: CatLevelStage;
  levelName: string;
} {
  if (totalPages < 20) {
    return { levelStage: 0, levelName: "별씨앗 알" };
  }
  if (totalPages < 50) {
    return { levelStage: 1, levelName: "새싹냥" };
  }
  if (totalPages < 100) {
    return { levelStage: 2, levelName: "풋풋냥" };
  }
  if (totalPages < 200) {
    return { levelStage: 3, levelName: "독서초보냥" };
  }
  if (totalPages < 350) {
    return { levelStage: 4, levelName: "도서관 수습냥" };
  }
  if (totalPages < 500) {
    return { levelStage: 5, levelName: "서가 지킴이냥" };
  }
  if (totalPages < 800) {
    return { levelStage: 6, levelName: "책벌레 마스터냥" };
  }
  if (totalPages < 1200) {
    return { levelStage: 7, levelName: "별빛 사서냥" };
  }
  return { levelStage: 8, levelName: "우주 독서냥" };
}

// 최근 7일 패턴 + 마지막 읽은 날 기준으로 mood 계산
function computeMood(logs: ReadLog[]): CatMood {
  if (logs.length === 0) {
    // 한 번도 안 읽은 상태면 일단 잠자는 톤
    return "sleepy";
  }

  const recentReadDays = computeRecentReadDays(logs);
  const lastReadISO = getLastReadDateISO(logs);
  const daysGap = daysSince(lastReadISO); // 오늘 - 마지막 읽은 날

  // 충분히 자주 읽음
  if (recentReadDays >= 4) {
    return "superHappy";
  }

  if (recentReadDays === 2 || recentReadDays === 3) {
    return "happy";
  }

  if (recentReadDays === 1) {
    return "calm";
  }

  // recentReadDays === 0 인 경우들
  if (daysGap === null) {
    return "sleepy";
  }

  if (daysGap <= 3) {
    // 최근 3일 안에는 읽은 적 있지만, 이번 주는 좀 쉬는 중
    return "bored";
  }

  if (daysGap >= 5) {
    // 5일 이상 안 읽음 → 완전 잠든 느낌
    return "sleepy";
  }

  // 그 외 애매한 구간은 중간 톤으로
  return "calm";
}

// streak 기반 오라 계산
function computeAura(streakDays: number): CatAura {
  if (streakDays >= 30) {
    return "legend";
  }
  if (streakDays >= 14) {
    return "flow";
  }
  if (streakDays >= 7) {
    return "halo";
  }
  if (streakDays >= 3) {
    return "spark";
  }
  return "none";
}

/**
 * 고양이 성장 상태 계산 헬퍼
 * - localStore에 저장된 독서 로그/통계를 바탕으로
 *   level / mood / aura / stats 를 한 번에 계산해준다.
 */
export function getCatGrowthState(): CatGrowthState {
  const totalPages = store.totalPagesAll();
  const pagesToday = store.pagesTodayAll();
  const streakDays = store.streak();
  const logs = store.getLogs();

  const recentReadDays = computeRecentReadDays(logs);
  const { levelStage, levelName } = computeLevel(totalPages);
  const mood = computeMood(logs);
  const aura = computeAura(streakDays);

  return {
    levelStage,
    levelName,
    mood,
    aura,
    stats: {
      totalPages,
      pagesToday,
      streakDays,
      recentReadDays,
    },
  };
}
