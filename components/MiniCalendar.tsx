"use client";

import Link from "next/link";
import { useMemo } from "react";
import { store } from "@/lib/localStore";

// 흑백 농도
function toneFor(pages: number) {
  if (pages === 0) return "rgba(15,15,15,0)";
  if (pages < 10) return "rgba(15,15,15,0.15)";
  if (pages < 30) return "rgba(15,15,15,0.35)";
  return "rgba(15,15,15,0.6)";
}

// 7x6 칸 채우기용
function buildCells(year: number, month1to12: number) {
  const firstDay = new Date(year, month1to12 - 1, 1).getDay(); // 0=일
  const days = store.daysInMonth(year, month1to12);
  const leading = firstDay;
  const trailing = (42 - (leading + days)) % 7;
  return {
    days,
    leading,
    trailing,
  };
}

export default function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const todayISO = today.toISOString().slice(0, 10);
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });

  // 여기서 dailyTotalsForMonth는 [{day:1,total:0}, ...] 이 모양임
  const monthData = useMemo(
    () => store.dailyTotalsForMonth(year, month),
    [year, month]
  );
  const { days, leading, trailing } = buildCells(year, month);

  return (
    <div className="ui-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold">
          {year}.{String(month).padStart(2, "0")}{" "}
          <span className="opacity-70">({monthLabel})</span>
        </div>
        <Link className="ui-btn" href="/calendar">
          Full
        </Link>
      </div>

      {/* 요일 헤더 */}
      <div
        className="grid text-center text-[10px] mb-1 opacity-80"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* 본 캘린더 */}
      <div
        className="grid gap-[2px]"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {/* 앞 공백 */}
        {Array.from({ length: leading }).map((_, i) => (
          <div
            key={`b-${i}`}
            className="border-2 border-black bg-white"
            style={{ aspectRatio: "1 / 1" }}
          />
        ))}

        {/* 날짜 */}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1;
          const iso = new Date(year, month - 1, d).toISOString().slice(0, 10);
          // ✅ 여기! day로 찾아서 total 가져오기
          const total =
            monthData.find((item) => item.day === d)?.total ?? 0;
          const isToday = iso === todayISO;

          return (
            <Link
              key={iso}
              href="/calendar"
              className="relative border-2 border-black"
              style={{
                aspectRatio: "1 / 1",
                background: toneFor(total),
              }}
              title={`${d} · ${total}p`}
            >
              {/* 오늘 표시용 프레임 */}
              {isToday && (
                <span className="pointer-events-none absolute inset-0 border-2 border-black" />
              )}
            </Link>
          );
        })}

        {/* 뒤 공백 */}
        {Array.from({ length: trailing }).map((_, i) => (
          <div
            key={`a-${i}`}
            className="border-2 border-black bg-white"
            style={{ aspectRatio: "1 / 1" }}
          />
        ))}
      </div>
    </div>
  );
}
