// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";



// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Readot Cat",
  description: "pixel reading pet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
