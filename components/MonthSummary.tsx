"use client";
import { useMemo } from "react";
import { store } from "@/lib/localStore";

export default function MonthSummary() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const daily = useMemo(
    () => store.dailyTotalsForMonth(year, month),
    [year, month]
  );

  // 1) 이번 달 총 페이지
  const totalPages = daily.reduce((sum, d) => sum + (d.total || 0), 0);

  // 2) 독서한 날
  const activeDays = daily.filter((d) => (d.total || 0) > 0).length;

  // 3) 하루 최고
  const maxPages = daily.reduce((max, d) => {
    const v = d.total || 0;
    return v > max ? v : max;
  }, 0);

  // 4) 이번 달 내 최장 연속
  let bestStreak = 0;
  let cur = 0;
  daily.forEach((d) => {
    if ((d.total || 0) > 0) {
      cur += 1;
      if (cur > bestStreak) bestStreak = cur;
    } else {
      cur = 0;
    }
  });

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("ko-KR", {
    month: "long",
  });

  return (
    <div className="ui-card px-4 py-4 space-y-4">
      {/* 제목 영역 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {monthLabel} 독서 현황
        </h2>
        <span className="text-[10px] opacity-60">
          {year}.{String(month).padStart(2, "0")}
        </span>
      </div>

      <div className="border-t-2 border-black opacity-60" />

      {/* 내용 영역 */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryBox label="이번 달 총 페이지" value={`${totalPages} p`} />
        <SummaryBox label="독서한 날" value={`${activeDays} 일`} />
        <SummaryBox label="하루 최고" value={`${maxPages} p`} />
        <SummaryBox label="최장 연속" value={`${bestStreak} 일`} />
      </div>

      {/* 꼬리말 */}
      <p className="text-[11px] opacity-60">
        이번 달 {activeDays}일 읽었어요. 계속 키우면 고양이가 더 활발해집니다. (๑•̀ㅂ•́)و✧
      </p>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-black rounded-lg bg-white px-3 py-2 flex flex-col gap-1 shadow-[2px_2px_0px_0px_#000]">
      <span className="text-[10px] opacity-70">{label}</span>
      <span className="text-lg font-bold tracking-tight">{value}</span>
    </div>
  );
}
