// lib/localStore.ts

// ===== 타입 =====
export type Book = {
  id: string;          // uuid 같은 고유값
  title: string;
  author?: string;
  totalPages?: number; // 책 전체 페이지 (없어도 됨)
  memo?: string;
};

export type ReadLog = {
  id: string;          // 고유값
  date: string;        // "2025-11-03" 이런 ISO 날짜
  bookId?: string;     // 어떤 책을 읽었는지 (없어도 됨)
  pages: number;       // 오늘 읽은 페이지
  note?: string;       // 메모
};

export type Settings = {
  monthlyGoal: number; // 이번 달 목표 독서일수
};

// ===== 공통 유틸 =====
function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ===== books 관련 =====
function getBooks(): Book[] {
  return safeParse<Book[]>("readot-books", []);
}

function addBook(b: Book) {
  const list = getBooks();
  list.push(b);
  save("readot-books", list);
}

function updateBook(id: string, patch: Partial<Book>) {
  const list = getBooks().map((b) =>
    b.id === id ? { ...b, ...patch } : b
  );
  save("readot-books", list);
}

function removeBook(id: string) {
  const list = getBooks().filter((b) => b.id !== id);
  save("readot-books", list);
}

// ===== logs 관련 =====
function getLogs(): ReadLog[] {
  return safeParse<ReadLog[]>("readot-logs", []);
}

function addLog(log: ReadLog) {
  const list = getLogs();
  list.push(log);
  save("readot-logs", list);

  // 홈 화면이 실시간으로 다시 그릴 수 있도록 이벤트 쏴주기
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("readot-log-added"));
  }
}

function saveLogs(list: ReadLog[]) {
  save("readot-logs", list);
}

function logsOfDate(date: string): ReadLog[] {
  return getLogs().filter((l) => l.date === date);
}

// 오늘 읽은 페이지 합계
function pagesTodayAll(): number {
  const todayISO = new Date().toISOString().slice(0, 10);
  return logsOfDate(todayISO).reduce((sum, l) => sum + (l.pages || 0), 0);
}

// 전체 읽은 페이지 합계
function totalPagesAll(): number {
  return getLogs().reduce((sum, l) => sum + (l.pages || 0), 0);
}

// ===== 달력 / 통계 =====

// 해당 달의 마지막 날짜 구하기
function daysInMonth(year: number, month1to12: number): number {
  // month1to12가 10이면 new Date(year, 10, 0) -> 10월의 마지막 날
  return new Date(year, month1to12, 0).getDate();
}

// 해당 연/월에 대해 날짜별 읽은 페이지 합계를 배열로 돌려줌
// 예: [{day:1, total:0}, {day:2,total:5}, ...]
function dailyTotalsForMonth(year: number, month1to12: number) {
  const days = daysInMonth(year, month1to12);
  const allLogs = getLogs();
  const result: { day: number; total: number }[] = [];

  for (let d = 1; d <= days; d++) {
    const iso = new Date(year, month1to12 - 1, d)
      .toISOString()
      .slice(0, 10);
    const total = allLogs
      .filter((l) => l.date === iso)
      .reduce((sum, l) => sum + (l.pages || 0), 0);

    result.push({ day: d, total });
  }

  return result;
}

// 연속 독서일 계산 (오늘부터 거꾸로 내려가며)
function streak(): number {
  const logs = getLogs();
  if (logs.length === 0) return 0;

  // 날짜만 뽑아서 중복 제거 후 내림차순
  const dates = Array.from(new Set(logs.map((l) => l.date)))
    .sort()
    .reverse();

  let count = 0;
  const cursor = new Date();

  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (dates.includes(iso)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}

// 이번 달에 "읽은 날"이 며칠인지 (페이지 > 0인 날)
function readDaysThisMonth(year: number, month1to12: number): number {
  const daily = dailyTotalsForMonth(year, month1to12);
  return daily.filter((d) => d.total > 0).length;
}

// ===== settings (목표 설정) =====
function getSettings(): Settings {
  // 기본값: 월 10일 읽기
  return safeParse<Settings>("readot-settings", { monthlyGoal: 10 });
}

function storeSettings(s: Settings) {
  save("readot-settings", s);
}

// ===== 책별 읽은 페이지 합계 =====
// books/page.tsx 에서 사용하고 있는 함수
function totalReadForBook(bookId: string): number {
  const logs = getLogs();
  return logs
    .filter((l) => l.bookId === bookId)
    .reduce((sum, l) => sum + (l.pages || 0), 0);
}

// ===== export 묶음 =====
export const store = {
  // books
  getBooks,
  addBook,
  updateBook,
  removeBook,

  // logs
  getLogs,
  addLog,
  saveLogs,
  logsOfDate,
  pagesTodayAll,
  totalPagesAll,

  // calendar / stats
  daysInMonth,
  dailyTotalsForMonth,
  streak,
  readDaysThisMonth,

  // settings
  getSettings,
  storeSettings,

  // book helpers
  totalReadForBook,
};
