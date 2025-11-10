"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/localStore";

export default function TopHud() {
  const [total, setTotal] = useState(0);
  const [readDays, setReadDays] = useState(0);
  const [goal, setGoal] = useState(10);

  useEffect(() => {
    const all = store.totalPagesAll?.() ?? 0;
    setTotal(all);

    const now = new Date();
    const monthLogs = store.dailyTotalsForMonth?.(
      now.getFullYear(),
      now.getMonth() + 1
    ) ?? [];
    const daysRead = monthLogs.filter((d) => d.total && d.total > 0).length;
    setReadDays(daysRead);

    const s = store.getSettings?.();
    if (s?.monthlyGoal) setGoal(s.monthlyGoal);
  }, []);

  const progress = Math.min(readDays / goal, 1);
  const filled = Math.round(progress * 10);

  return (
    <div className="top-hud">
      {/* 첫 줄: 중앙 정렬된 레벨 + 오른쪽 끝의 설정 */}
      <div className="hud-row">
        <div className="hud-left">
          <span className="hud-level">Lv.1</span>
          <span className="hud-total">total {total}p</span>
        </div>
        <div className="hud-right">
          <button className="hud-settings">⚙</button>
        </div>
      </div>

      {/* 두 번째 줄: 목표 텍스트 */}
      <div className="hud-text">
        this month: {readDays} / {goal} days
      </div>

      {/* 세 번째 줄: 목표 바 */}
      <div className="hud-bar">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`bar-block ${i < filled ? "bar-filled" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
