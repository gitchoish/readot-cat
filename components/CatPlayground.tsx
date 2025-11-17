"use client";

import { useEffect, useRef, useState } from "react";
import CatTama from "./CatTama";
import { getCatGrowthState } from "@/lib/catGrowth";

type CatMode = "idle" | "walkA" | "walkB" | "happy" | "sleepy";

export default function CatPlayground() {
  const [mode, setMode] = useState<CatMode>("idle");

  // FSM용 기본 행동 상태 (happy 같은 오버라이드 제외)
  const [fsmMode, setFsmMode] = useState<CatMode>("idle");

  // happy 등 연출용 오버라이드 상태
  const [overrideMode, setOverrideMode] = useState<CatMode | null>(null);

  // 움직임 관련
  const [x, setX] = useState(0);
  const dirRef = useRef(1); // 1 = 오른쪽, -1 = 왼쪽

  // 이펙트 플래그
  const [showFireworks, setShowFireworks] = useState(false);     // 화면 전체 폭죽 (로그용)
  const [showPetSparkles, setShowPetSparkles] = useState(false); // 고양이 주변 반짝이 (클릭용)

  // FSM 타이머
  const fsmTimerRef = useRef<number | null>(null);

  // 성장 상태 (레벨 단계)
  const growth = getCatGrowthState();
  const levelStage = growth?.levelStage ?? 2;

  /* -----------------------------
   * 공통 happy 진입 함수
   * - fireworks: 전체 폭죽 (로그 축하)
   * - sparkles:  고양이 주변 반짝이 (클릭 쓰다듬기)
   * ----------------------------- */
  const enterHappy = (options?: {
    fireworks?: boolean;
    sparkles?: boolean;
    durationMs?: number;
  }) => {
    const fireworks = options?.fireworks ?? false;
    const sparkles = options?.sparkles ?? false;
    const durationMs = options?.durationMs ?? 2000;

    // FSM 타이머 정지
    if (fsmTimerRef.current !== null) {
      clearTimeout(fsmTimerRef.current);
      fsmTimerRef.current = null;
    }

    setOverrideMode("happy");
    setMode("happy");

    if (fireworks) setShowFireworks(true);
    if (sparkles) setShowPetSparkles(true);

    window.setTimeout(() => {
      if (fireworks) setShowFireworks(false);
      if (sparkles) setShowPetSparkles(false);

      setOverrideMode(null);
      setFsmMode("idle");
    }, durationMs);
  };

  // 로그 축하 전용 (전체 폭죽)
  const triggerLogCelebration = () => {
    enterHappy({ fireworks: true, durationMs: 2200 });
  };

  // 클릭 쓰다듬기 전용 (고양이 주변 반짝이)
  const triggerPetEffect = () => {
    enterHappy({ sparkles: true, durationMs: 1500 });
  };

  // -----------------------------
  // FSM: 다음 상태 선택
  // -----------------------------
  const chooseNextMode = (current: CatMode): CatMode => {
    if (current === "idle") {
      const r = Math.random();
      if (r < 0.45) return "walkA";   // 걷기
      if (r < 0.65) return "sleepy";  // 졸기
      return "idle";
    }

    if (current === "walkA" || current === "walkB") {
      return "idle";
    }

    if (current === "sleepy") {
      return "idle";
    }

    return "idle";
  };

  // -----------------------------
  // FSM: 상태별 유지 시간(ms)
  // -----------------------------
  const modeDuration = (m: CatMode): number => {
    if (m === "idle") {
      return 3000 + Math.floor(Math.random() * 4000); // 3~7초
    }
    if (m === "walkA" || m === "walkB") {
      return 3000 + Math.floor(Math.random() * 3000); // 3~6초
    }
    if (m === "sleepy") {
      return 2000;
    }
    return 3000;
  };

  // -----------------------------
  // FSM 루프
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    // happy 등 오버라이드 상태라면 FSM 잠시 정지
    if (overrideMode) {
      setMode(overrideMode);
      return;
    }

    // 걷기 상태면 walkA로 시작
    if (fsmMode === "walkA" || fsmMode === "walkB") {
      setMode("walkA");
    } else {
      setMode(fsmMode);
    }

    const duration = modeDuration(fsmMode);

    const timer = window.setTimeout(() => {
      setFsmMode((prev) => chooseNextMode(prev));
    }, duration);

    fsmTimerRef.current = timer;

    return () => {
      if (fsmTimerRef.current !== null) {
        clearTimeout(fsmTimerRef.current);
        fsmTimerRef.current = null;
      }
    };
  }, [fsmMode, overrideMode]);

  // -----------------------------
  // 걷기 모션: 다리 프레임 전환
  // -----------------------------
  useEffect(() => {
    if (mode !== "walkA" && mode !== "walkB") return;

    const step = window.setInterval(() => {
      setMode((p) => (p === "walkA" ? "walkB" : "walkA"));
    }, 180);

    return () => clearInterval(step);
  }, [mode]);

  // -----------------------------
  // 걷기 모션: 좌우 이동
  // -----------------------------
  useEffect(() => {
    if (mode !== "walkA" && mode !== "walkB") return;

    const move = window.setInterval(() => {
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

  // -----------------------------
  // 독서 로그 추가 이벤트 → 로그 축하 (전체 폭죽)
  // -----------------------------
  useEffect(() => {
    function onLogAdded() {
      triggerLogCelebration();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("readot-log-added", onLogAdded);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("readot-log-added", onLogAdded);
      }
    };
  }, []);

  // -----------------------------
  // 홈에 들어왔을 때 pending 플래그 있으면 한 번 로그 축하
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const flag = window.localStorage.getItem("readot-pending-happy");
    if (flag === "1") {
      window.localStorage.removeItem("readot-pending-happy");
      triggerLogCelebration();
    }
  }, []);

  // -----------------------------
  // 클릭 → 쓰다듬기 이펙트
  // -----------------------------
  const handleCatClick = () => {
    triggerPetEffect();
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
        <CatTama size={210} mode={mode} levelStage={levelStage} />
      </div>

      {/* 클릭용: 고양이 주변 반짝이 이펙트 */}
      {showPetSparkles && <PetSparkles />}

      {/* 로그용: 화면 전체 폭죽 오버레이 */}
      {showFireworks && <FireworksOverlay />}
    </div>
  );
}

/* -----------------------------
 * 고양이 주변 반짝이 이펙트 (클릭용)
 * ----------------------------- */
function PetSparkles() {
  const particles = Array.from({ length: 16 });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / particles.length;
        const dist = 40 + Math.random() * 12; // 고양이 주변 거리
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = 4 + Math.random() * 3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              background: "#ffe066",
              borderRadius: "50%",
              boxShadow: "0 0 6px rgba(255, 224, 102, 0.9)",
              transform: "translate(-50%, -50%)",
              animation: "pet-sparkle 0.9s ease-out forwards",
            }}
          />
        );
      })}

      <style>
        {`
          @keyframes pet-sparkle {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.6);
            }
            20% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.4);
            }
          }
        `}
      </style>
    </div>
  );
}

/* -----------------------------
 * 화면 전체 폭죽 오버레이 (로그용)
 * ----------------------------- */
function FireworksOverlay() {
  const particles = Array.from({ length: 60 });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {particles.map((_, i) => {
        const size = Math.random() * 6 + 4;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const colorList = ["#ff4d4d", "#ffcc00", "#66ddff", "#99ff66", "#ff99ff"];
        const color = colorList[Math.floor(Math.random() * colorList.length)];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}vw`,
              bottom: -10,
              width: size,
              height: size,
              background: color,
              borderRadius: "50%",
              boxShadow: `0 0 6px ${color}`,
              animation: `firework-up 1.4s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}

      <style>
        {`
          @keyframes firework-up {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            60% {
              transform: translateY(-60vh) scale(1.5);
              opacity: 0.95;
            }
            100% {
              transform: translateY(-110vh) scale(0.4);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
