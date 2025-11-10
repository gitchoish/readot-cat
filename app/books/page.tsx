// app/books/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { store } from "@/lib/localStore";

type Book = {
  id: string;
  title: string;
  author?: string;
  totalPages?: number;
  memo?: string;
};

export default function BooksPage() {
  const [list, setList] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");

  // 상단에 보여줄 설정값
  const settings = store.getSettings();
  const now = new Date();
  const readDays = store.readDaysThisMonth(
    now.getFullYear(),
    now.getMonth() + 1
  );

  function refresh() {
    const books = store.getBooks();
    setList(books);
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    store.addBook({
      id,
      title: title.trim(),
      author: author.trim() || undefined,
      totalPages: totalPages ? Number(totalPages) : undefined,
    });

    setTitle("");
    setAuthor("");
    setTotalPages("");
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this book?")) return;
    store.removeBook(id);
    refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        paddingBottom: 80,
      }}
    >
      {/* 상단 HUD 비슷하게 */}
      <div
        style={{
          background: "#fff",
          borderBottom: "2px solid #000",
          padding: "14px 16px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>Books</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {list.length} saved
            </span>
          </div>
          {/* 오른쪽에 홈 설정처럼 버튼 하나 위치만 맞춰둠 */}
          <div style={{ position: "absolute", right: 0 }}>
            <a
              href="/"
              style={{
                border: "2px solid #000",
                borderRadius: 6,
                background: "#fff",
                width: 26,
                height: 26,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                textDecoration: "none",
                color: "#000",
              }}
              title="Back to home"
            >
              ←
            </a>
          </div>
        </div>
        <div style={{ marginTop: 4, fontSize: 12, textAlign: "center" }}>
          this month: {readDays} / {settings.monthlyGoal} days
        </div>
      </div>

      {/* 입력 카드 */}
      <div style={{ padding: "14px 16px 0" }}>
        <form
          onSubmit={handleAdd}
          style={{
            background: "#fff",
            border: "2px solid #000",
            borderRadius: 10,
            boxShadow: "2px 2px 0 #000",
            padding: 12,
            display: "grid",
            gap: 6,
          }}
        >
          <label style={{ fontSize: 12 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              border: "2px solid #000",
              borderRadius: 6,
              padding: "4px 6px",
              background: "#fff",
            }}
            placeholder="Book title"
          />

          <label style={{ fontSize: 12, marginTop: 2 }}>Author (optional)</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              border: "2px solid #000",
              borderRadius: 6,
              padding: "4px 6px",
              background: "#fff",
            }}
            placeholder="Author"
          />

          <label style={{ fontSize: 12, marginTop: 2 }}>
            Total pages (optional)
          </label>
          <input
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value)}
            type="number"
            min={0}
            style={{
              border: "2px solid #000",
              borderRadius: 6,
              padding: "4px 6px",
              background: "#fff",
            }}
            placeholder="e.g. 320"
          />

          <button
            type="submit"
            style={{
              marginTop: 4,
              border: "2px solid #000",
              background: "#fff",
              borderRadius: 8,
              padding: "6px 10px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "2px 2px 0 #000",
              width: "fit-content",
            }}
          >
            Add
          </button>
        </form>
      </div>

      {/* 목록 */}
      <div style={{ padding: "10px 16px 16px" }}>
        {list.length === 0 ? (
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            No books yet. Add one above 👆
          </div>
        ) : (
          <ul style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {list.map((b) => {
              const read = store.totalReadForBook(b.id);
              const total = b.totalPages || 0;
              const left = total ? Math.max(0, total - read) : null;
              const percent =
                total && total > 0 ? Math.min(100, (read / total) * 100) : 0;

              return (
                <li
                    key={b.id}
                    style={{
                      background: "#fff",
                      border: "2px solid #000",
                      borderRadius: 10,
                      boxShadow: "2px 2px 0 #000",
                      padding: "10px 10px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.title}</div>
                        {b.author && (
                          <div style={{ fontSize: 11, opacity: 0.6 }}>
                            {b.author}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(b.id)}
                        style={{
                          border: "2px solid #000",
                          background: "#fff",
                          borderRadius: 6,
                          width: 26,
                          height: 26,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        aria-label="delete"
                      >
                        ×
                      </button>
                    </div>

                    {/* progress */}
                    <div style={{ marginTop: 6, fontSize: 11 }}>
                      {total ? (
                        <>
                          read {read}p / {total}p · left {left}p
                        </>
                      ) : (
                        <>read {read}p · pages not set</>
                      )}
                    </div>

                    {total ? (
                      <div
                        style={{
                          marginTop: 4,
                          height: 8,
                          border: "2px solid #000",
                          borderRadius: 6,
                          background: "#fff",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percent}%`,
                            background: "#000",
                          }}
                        />
                      </div>
                    ) : null}
                  </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
