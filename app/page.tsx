"use client";

import TopHud from "@/components/TopHud";
import CatPlayground from "@/components/CatPlayground";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  return (
    <div className="app-shell">
      {/* 상단 HUD */}
      <TopHud />

      {/* 고양이 영역 */}
      <div className="cat-area">
        <CatPlayground />
      </div>

      {/* 하단 네비 */}
      <BottomNav active="home" />
    </div>
  );
}
