"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/localStore";

// 요일
const WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 독서량에 따른 톤
function toneFor(pages: number) {
  if (pages === 0) return "#fff";
  if (pages < 10) return "rgba(0,0,0,0.05)";
  if (pages < 30) return "rgba(0,0,0,0.15)";
  return "rgba(0,0,0,0.28)";
}

// 달력 7x6 셀 생성
function buildMatrix(year: number, month1to12: number) {
  const firstDay = new Date(year, month1to12 - 1, 1).getDay(); // 0~6
  const daysInMonth = store.daysInMonth(year, month1to12);
  const cells: Array<number | null> = [];

  // 앞 공백
  for (let i = 0; i < firstDay; i++) cells.push(null);
  // 날짜
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // 뒤 공백 42개까지
  while (cells.length < 42) cells.push(null);

  // 7씩 잘라서 6주
  const rows: Array<Array<number | null>> = [];
  for (let r = 0; r < 6; r++) {
    rows.push(cells.slice(r * 7, r * 7 + 7));
  }
  return rows;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1~12
  const [selectedISO, setSelectedISO] = useState(
    today.toISOString().slice(0, 10)
  );

  // 이번 달 데이터
  const monthData = useMemo(
    () => store.dailyTotalsForMonth(year, month),
    [year, month]
  );
  const monthSum = monthData.reduce((sum, d) => sum + d.total, 0);
  const readDays = monthData.filter((d) => d.total > 0).length;
  const settings = store.getSettings();
  const matrix = useMemo(() => buildMatrix(year, month), [year, month]);

  // 선택한 날짜 로그
  const selectedLogs = store.logsOfDate(selectedISO);

  const todayISO = today.toISOString().slice(0, 10);
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });

  // 월 이동
  const gotoPrev = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      // 날짜도 1일로
      setSelectedISO(new Date(year - 1, 11, 1).toISOString().slice(0, 10));
    } else {
      setMonth((m) => m - 1);
      setSelectedISO(new Date(year, month - 2, 1).toISOString().slice(0, 10));
    }
  };
  const gotoNext = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      setSelectedISO(new Date(year + 1, 0, 1).toISOString().slice(0, 10));
    } else {
      setMonth((m) => m + 1);
      setSelectedISO(new Date(year, month, 1).toISOString().slice(0, 10));
    }
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* 헤더 */}
      <div
        style={{
          padding: "12px 16px 10px",
          borderBottom: "2px solid #000",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href="/"
          style={{
            border: "2px solid #000",
            borderRadius: 10,
            background: "#fff",
            padding: "3px 10px",
            textDecoration: "none",
            fontSize: 12,
          }}
        >
          ← Home
        </Link>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Calendar</div>
      </div>

      {/* 상단 요약 */}
      <div
        style={{
          padding: "12px 16px 0",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "2px solid #000",
            borderRadius: 14,
            background: "#fff",
            padding: "6px 10px",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {year}.{String(month).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 12 }}>sum {monthSum}p</div>
          <div style={{ fontSize: 12 }}>
            days {readDays} / {settings.monthlyGoal} goal
          </div>
        </div>
      </div>

      {/* 월 이동 + 제목 */}
      <div
        style={{
          padding: "10px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          onClick={gotoPrev}
          style={{
            border: "2px solid #000",
            background: "#fff",
            borderRadius: 8,
            width: 30,
            height: 28,
            cursor: "pointer",
          }}
          aria-label="previous month"
        >
          ◀
        </button>
        <div style={{ fontWeight: 600, fontSize: 15 }}>
          {monthLabel} {year}
        </div>
        <button
          onClick={gotoNext}
          style={{
            border: "2px solid #000",
            background: "#fff",
            borderRadius: 8,
            width: 30,
            height: 28,
            cursor: "pointer",
          }}
          aria-label="next month"
        >
          ▶
        </button>
      </div>

      {/* 달력 */}
      <div style={{ padding: "10px 16px 0" }}>
        {/* 요일 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 0,
            border: "2px solid #000",
            borderBottom: "none",
          }}
        >
          {WEEKS.map((w) => (
            <div
              key={w}
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 0",
                borderRight: "2px solid #000",
              }}
            >
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            border: "2px solid #000",
            borderTop: "none",
          }}
        >
          {matrix.map((row, rIdx) =>
            row.map((d, cIdx) => {
              const isLastCol = cIdx === 6;
              const isLastRow = rIdx === 5;
              const baseStyle: React.CSSProperties = {
                minHeight: 62,
                borderRight: isLastCol ? "none" : "2px solid #000",
                borderBottom: isLastRow ? "none" : "2px solid #000",
                background: "#fff",
              };

              if (d === null) {
                return <div key={`${rIdx}-${cIdx}`} style={baseStyle} />;
              }

              const dateISO = new Date(year, month - 1, d)
                .toISOString()
                .slice(0, 10);
              const total = monthData[d - 1]?.total || 0;
              const isToday = dateISO === todayISO;
              const isSelected = dateISO === selectedISO;

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => setSelectedISO(dateISO)}
                  style={{
                    ...baseStyle,
                    background: toneFor(total),
                    position: "relative",
                    textAlign: "left",
                    padding: 6,
                    cursor: "pointer",
                    outline: "none",
                    border: isSelected
                      ? "3px solid #000"
                      : baseStyle.borderBottom,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{d}</div>
                  {total > 0 && (
                    <div
                      style={{
                        fontSize: 10,
                        position: "absolute",
                        right: 4,
                        bottom: 3,
                        background: "#fff",
                        border: "1px solid #000",
                        borderRadius: 4,
                        padding: "0 2px",
                      }}
                    >
                      {total}p
                    </div>
                  )}
                  {isToday && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 2,
                        border: "2px dashed #000",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 선택일 로그 */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          {selectedISO} logs
        </div>
        {selectedLogs.length === 0 ? (
          <div style={{ fontSize: 12, opacity: 0.6 }}>No logs on this day.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {selectedLogs.map((log) => {
              const books = store.getBooks();
              const title =
                books.find((b) => b.id === log.bookId)?.title || "(no book)";
              return (
                <div
                  key={log.id}
                  style={{
                    border: "2px solid #000",
                    borderRadius: 10,
                    background: "#fff",
                    padding: "5px 8px",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 500 }}>
                    {title} · {log.pages}p
                  </div>
                  {log.note && (
                    <div style={{ fontSize: 11, opacity: 0.6 }}>{log.note}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 범례 */}
      <div style={{ padding: "14px 16px 40px", fontSize: 11, opacity: 0.7 }}>
        Legend: light → dark = more pages
      </div>
    </div>
  );
}
