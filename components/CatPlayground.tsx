"use client";

import { useEffect, useRef, useState } from "react";
import CatTama from "./CatTama";
import {
  getCatGrowthState,
  type CatGrowthState,
} from "@/lib/catGrowth";

type CatMode = "idle" | "walkA" | "walkB" | "happy" | "sleepy";

type Firework = {
  id: number;
  x: number;
  y: number;
};

export default function CatPlayground() {
  const [mode, setMode] = useState<CatMode>("idle");
  const [x, setX] = useState(0);
  const dirRef = useRef(1);
  const [fires, setFires] = useState<Firework[]>([]);
  const fireId = useRef(0);

  // 성장 상태: 레벨/기분/오라 + 통계
  const [growth, setGrowth] = useState<CatGrowthState | null>(null);

  // 성장 상태를 localStore 기반으로 다시 계산
  const refreshGrowth = () => {
    try {
      const next = getCatGrowthState();
      setGrowth(next);
    } catch (e) {
      console.error("Failed to compute cat growth state", e);
    }
  };

  // 처음 진입 시 한 번 성장 상태 계산
  useEffect(() => {
    refreshGrowth();
  }, []);

  // 기본 idle ↔ walk
  useEffect(() => {
    const timer = setInterval(() => {
      setMode((prev) => {
        if (prev === "idle") return "walkA";
        if (prev === "walkA" || prev === "walkB") return "idle";
        return "idle";
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 걷을 때 다리 토글
  useEffect(() => {
    if (mode !== "walkA" && mode !== "walkB") return;
    const step = setInterval(() => {
      setMode((p) => (p === "walkA" ? "walkB" : "walkA"));
    }, 180);
    return () => clearInterval(step);
  }, [mode]);

  // 걷을 때 좌우 이동
  useEffect(() => {
    if (mode !== "walkA" && mode !== "walkB") return;
    const move = setInterval(() => {
      setX((prev) => {
        const next = prev + dirRef.current * 6;
        if (next > 90) {
          dirRef.current = -1;
          return 90;
        }
        if (next < -90) {
          dirRef.current = 1;
          return -90;
        }
        return next;
      });
    }, 90);
    return () => clearInterval(move);
  }, [mode]);

  // 공통으로 폭죽 뿌리는 함수
  const spawnFireworks = (currentX: number) => {
    const burst: Firework[] = Array.from({ length: 6 }).map((_, i) => ({
      id: fireId.current++,
      x: currentX + ((i % 3) * 16 - 16), // 좌우로 흩어지게
      y: -28 - Math.floor(i / 3) * 14, // 고양이 위
    }));
    setFires((prev) => [...prev, ...burst]);
    setTimeout(() => {
      setFires((prev) =>
        prev.filter((f) => !burst.some((b) => b.id === f.id))
      );
    }, 900);
  };

  // 로그 추가 이벤트 → happy + 성장 상태도 함께 갱신
  useEffect(() => {
    function onLogAdded() {
      // 1) 성장 상태 다시 계산
      refreshGrowth();

      // 2) 기쁨 모션 + 폭죽
      setMode("happy");
      spawnFireworks(x);
      setTimeout(() => setMode("idle"), 2500);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("readot-log-added", onLogAdded);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("readot-log-added", onLogAdded);
      }
    };
  }, [x]);

  // 가끔 졸게
  useEffect(() => {
    const sleepyTimer = setInterval(() => {
      setMode("sleepy");
      setTimeout(() => setMode("idle"), 1800);
    }, 23000);
    return () => clearInterval(sleepyTimer);
  }, []);

  // 클릭해도 happy (성장 상태는 그대로)
  const handleCatClick = () => {
    setMode("happy");
    spawnFireworks(x);
    setTimeout(() => setMode("idle"), 2000);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 260,
        position: "relative",
      }}
    >
      <div
        onClick={handleCatClick}
        style={{
          transform: `translateX(${x}px)`,
          transition:
            mode === "walkA" || mode === "walkB"
              ? "none"
              : "transform 0.25s ease-out",
          cursor: "pointer",
        }}
      >
        <CatTama
          size={210}
          mode={mode}
          // 성장 정보 전달: 없으면 안전하게 기본값으로
          levelStage={growth?.levelStage ?? 2}
          mood={growth?.mood}
          aura={growth?.aura}
        />
      </div>

      {/* 폭죽 레이어 */}
      {fires.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: `calc(50% + ${f.x}px)`,
            top: `calc(50% + ${f.y}px)`,
            width: 6,
            height: 6,
            background: "#000",
            border: "1px solid #000",
            transform: "translate(-50%, -50%)",
            animation: "popDot 0.9s ease-out forwards",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes popDot {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -90%) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
