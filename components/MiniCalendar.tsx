"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/localStore";

export default function MiniCalendar() {
  const [days, setDays] = useState<
    { date: string; day: number; total: number }[]
  >([]);

  const [monthInfo, setMonthInfo] = useState({
    year: 0,
    month: 0,
  });

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    setMonthInfo({ year: y, month: m });

    const monthLogs = store.dailyTotalsForMonth(y, m);
    const daysInMonth = new Date(y, m, 0).getDate();
    const list = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const found = monthLogs.find((d) => d.date === dateStr);
      return { date: dateStr, day: dayNum, total: found ? found.total : 0 };
    });

    setDays(list);
  }, []);

  return (
    <div
      className="w-full border-2 border-black rounded-xl mt-4 p-2 bg-white"
      style={{
        fontFamily: "monospace",
      }}
    >
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-2 text-xs">
        <span>
          {monthInfo.year}.{String(monthInfo.month).padStart(2, "0")}{" "}
          <span className="font-bold">({monthInfo.month}월)</span>
        </span>
        <button
          onClick={() => alert("전체 캘린더 보기 기능은 추후 추가됩니다.")}
          className="border-2 border-black rounded-full px-2 py-[2px] hover:bg-black hover:text-white transition-all"
        >
          전체 보기
        </button>
      </div>

      {/* 달력 */}
      <div
        className="grid grid-cols-7 gap-[2px]"
        style={{
          fontSize: "11px",
          textAlign: "center",
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="font-bold border-b border-black pb-[1px]">
            {d}
          </div>
        ))}

        {days.map((d) => (
          <div
            key={d.date}
            className="flex items-center justify-center border border-black aspect-square"
            style={{
              backgroundColor: d.total > 0 ? "#000" : "#fff",
              color: d.total > 0 ? "#fff" : "#000",
            }}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}
