// app/books/[id]/page.tsx
"use client";

type Props = {
  params: {
    id: string;
  };
};

export default function BookDetailPage({ params }: Props) {
  return (
    <div style={{ padding: 16 }}>
      <h1>Book detail</h1>
      <p>id: {params.id}</p>
      {/* 여기서 store.getBookById(params.id) 이런거 하면 됨 */}
    </div>
  );
}
