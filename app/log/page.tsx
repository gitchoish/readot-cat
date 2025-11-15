"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/localStore";

type Book = {
  id: string;
  title: string;
};

export default function LogPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [pages, setPages] = useState("0");
  const [note, setNote] = useState("");

  const [todayLogs, setTodayLogs] = useState(
    store.logsOfDate(new Date().toISOString().slice(0, 10))
  );
  const [recent, setRecent] = useState(store.getLogs().slice(-10).reverse());

  // 공통으로 로그 다시 읽기
  const refreshLogs = () => {
    const todayISO = new Date().toISOString().slice(0, 10);
    setTodayLogs(store.logsOfDate(todayISO));
    setRecent(store.getLogs().slice(-10).reverse());
  };

  // 처음 들어왔을 때 한 번만
  useEffect(() => {
    const loadedBooks = store.getBooks();
    setBooks(loadedBooks);

    // 예전에 만든 로그들 중 bookId 없는 것들 첫 책으로 붙여서 정리
    if (loadedBooks.length > 0) {
      const allLogs = store.getLogs();
      const firstId = loadedBooks[0].id;
      let changed = false;
      const fixed = allLogs.map((l) => {
        if (!l.bookId) {
          changed = true;
          return { ...l, bookId: firstId };
        }
        return l;
      });
      if (changed) {
        store.saveLogs(fixed);
      }

      // 셀렉트 박스 기본값
      setSelectedBookId((prev) => (prev ? prev : firstId));
      refreshLogs();
    }
  }, []);

  // 새 로그 작성
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayISO = new Date().toISOString().slice(0, 10);
    const p = Number(pages) || 0;

    const bookIdToSave =
      selectedBookId && selectedBookId.length > 0
        ? selectedBookId
        : books.length > 0
        ? books[0].id
        : undefined;

    store.addLog({
      id: crypto.randomUUID(),
      date: todayISO,
      bookId: bookIdToSave,
      pages: p,
      note: note.trim() || undefined,
    });

    setPages("0");
    setNote("");
    refreshLogs();
  };

  // 로그 삭제
  const handleDeleteLog = (logId: string) => {
    const all = store.getLogs();
    const filtered = all.filter((l) => l.id !== logId);
    store.saveLogs(filtered);
    refreshLogs();
  };

  // 책 id → 제목
  const getBookTitle = (bookId?: string) => {
    if (!bookId) return "(no book)";
    const found = books.find((b) => b.id === bookId);
    return found ? found.title : "(no book)";
  };

  return (
    <div style={{ padding: 16, paddingBottom: 90, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          href="/"
          style={{
            border: "2px solid #000",
            borderRadius: 12,
            padding: "4px 10px",
            background: "#fff",
            textDecoration: "none",
            fontSize: 13,
          }}
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Log</h1>
      </div>

      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
          background: "#fff",
          border: "2px solid #000",
          borderRadius: 16,
          padding: 12,
        }}
      >
        <label style={{ fontSize: 12 }}>Book</label>
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          style={{
            border: "2px solid #000",
            padding: "4px 6px",
            borderRadius: 6,
          }}
        >
          {books.length === 0 && <option value="">(no books)</option>}
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <label style={{ fontSize: 12 }}>Pages</label>
        <input
          type="number"
          min={0}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          style={{
            border: "2px solid #000",
            padding: "4px 6px",
            borderRadius: 6,
          }}
        />

        <label style={{ fontSize: 12 }}>Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            border: "2px solid #000",
            padding: "4px 6px",
            borderRadius: 6,
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: 4,
            border: "2px solid #000",
            background: "#fff",
            borderRadius: 8,
            padding: "6px 12px",
            fontWeight: 600,
            cursor: "pointer",
            width: 90,
          }}
        >
          Add
        </button>
      </form>

      {/* 오늘 로그 */}
      <section>
        <h2 style={{ fontSize: 14, marginBottom: 8 }}>Today logs</h2>
        {todayLogs.length === 0 && <div style={{ fontSize: 12 }}>No log today.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {todayLogs.map((log) => (
            <div
              key={log.id}
              style={{
                border: "2px solid #000",
                borderRadius: 12,
                padding: "6px 10px",
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  {getBookTitle(log.bookId)} · {log.pages}p
                </div>
                {log.note && (
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{log.note}</div>
                )}
              </div>
              <button
                onClick={() => handleDeleteLog(log.id)}
                style={{
                  border: "1px solid #000",
                  background: "#fff",
                  borderRadius: 6,
                  width: 24,
                  height: 24,
                  lineHeight: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                aria-label="delete log"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 로그 */}
      <section style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 14, marginBottom: 8 }}>Recent logs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {recent.map((log) => (
            <div
              key={log.id}
              style={{
                border: "2px solid #000",
                borderRadius: 12,
                padding: "6px 10px",
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 12 }}>
                  {log.date} · {log.pages}p
                </div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>
                  {getBookTitle(log.bookId)}
                  {log.note ? ` · ${log.note}` : ""}
                </div>
              </div>
              <button
                onClick={() => handleDeleteLog(log.id)}
                style={{
                  border: "1px solid #000",
                  background: "#fff",
                  borderRadius: 6,
                  width: 24,
                  height: 24,
                  lineHeight: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                aria-label="delete log"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
