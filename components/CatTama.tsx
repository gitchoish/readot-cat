"use client";

import type { CatLevelStage, CatMood, CatAura } from "@/lib/catGrowth";

type CatMode = "idle" | "walkA" | "walkB" | "happy" | "sleepy";

type Props = {
  size?: number;
  mode?: CatMode;

  // 성장 관련 props
  levelStage?: CatLevelStage; // 0~3
  mood?: CatMood;             // 지금은 아직 사용 X
  aura?: CatAura;             // 지금은 아직 사용 X
};

export default function CatTama({
  size = 160,
  mode = "idle",
  levelStage = 2, // 기본: lv2 기본냥
}: Props) {
  const ink = "#000";

  /* ---------------------------------
   * 공통 얼굴: mode(표정)에 따라 출력
   * (나중에 mood까지 섞어서 확장 가능)
   * --------------------------------- */
  const renderFace = () => {
    switch (mode) {
      case "happy":
        return (
          <>
            {/* eyes */}
            <rect x={10} y={9} width={1} height={1} fill={ink} />
            <rect x={14} y={9} width={1} height={1} fill={ink} />
            {/* mouth */}
            <rect x={12} y={11} width={1} height={1} fill={ink} />
          </>
        );
      case "sleepy":
        return (
          <>
            {/* closed eyes */}
            <rect x={9.5} y={9} width={2} height={1} fill={ink} />
            <rect x={13.5} y={9} width={2} height={1} fill={ink} />
            {/* small mouth */}
            <rect x={12} y={12} width={1} height={1} fill={ink} />
          </>
        );
      default:
        return (
          <>
            <rect x={10} y={9} width={1} height={1} fill={ink} />
            <rect x={14} y={9} width={1} height={1} fill={ink} />
            <rect x={12} y={11} width={1} height={1} fill={ink} />
          </>
        );
    }
  };

  /* ---------------------------------
   * lv0 : 베이비냥 (얼굴만 톡)
   * --------------------------------- */
  const renderBaby = () => {
    const face = "#FDF3DC";
    const blush = "#F8D4C3";

    return (
      <>
        {/* small ears */}
        <rect x={9} y={6} width={2} height={2} fill={ink} />
        <rect x={13} y={6} width={2} height={2} fill={ink} />

        {/* face block */}
        <rect
          x={8}
          y={8}
          width={8}
          height={6}
          fill={face}
          stroke={ink}
          strokeWidth={1}
        />

        {/* eyes */}
        <rect x={10} y={9} width={1} height={1} fill={ink} />
        <rect x={13} y={9} width={1} height={1} fill={ink} />

        {/* mouth */}
        <rect x={11} y={11} width={1} height={1} fill={ink} />

        {/* blush */}
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />
      </>
    );
  };

  /* ---------------------------------
   * lv1 : 새싹냥
   * --------------------------------- */
  const renderSproutCat = () => {
    const face = "#FDF3DC";
    const blush = "#F8D4C3";
    const sprout = "#7CCF3A";

    return (
      <>
        {/* sprout on head */}
        <rect x={11} y={3} width={2} height={1} fill={sprout} />
        <rect x={10} y={4} width={1} height={1} fill={sprout} />
        <rect x={13} y={4} width={1} height={1} fill={sprout} />

        {/* ears */}
        <rect x={8} y={5} width={2} height={2} fill={ink} />
        <rect x={14} y={5} width={2} height={2} fill={ink} />

        {/* big head */}
        <rect
          x={7}
          y={7}
          width={10}
          height={7}
          fill={face}
          stroke={ink}
          strokeWidth={1}
        />

        {/* face details */}
        <rect x={10} y={9} width={1} height={1} fill={ink} />
        <rect x={13} y={9} width={1} height={1} fill={ink} />
        <rect x={11} y={11} width={1} height={1} fill={ink} />
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />

        {/* tiny body */}
        <rect
          x={8}
          y={14}
          width={8}
          height={3}
          fill={face}
          stroke={ink}
          strokeWidth={1}
        />

        {/* arms */}
        <rect x={7} y={15} width={1} height={2} fill={ink} />
        <rect x={16} y={15} width={1} height={2} fill={ink} />

        {/* legs */}
        {mode === "walkA" ? (
          <>
            <rect x={9} y={17} width={1} height={2} fill={ink} />
            <rect x={13} y={18} width={1} height={1} fill={ink} />
          </>
        ) : mode === "walkB" ? (
          <>
            <rect x={9} y={18} width={1} height={1} fill={ink} />
            <rect x={13} y={17} width={1} height={2} fill={ink} />
          </>
        ) : (
          <>
            <rect x={9} y={17} width={1} height={2} fill={ink} />
            <rect x={13} y={17} width={1} height={2} fill={ink} />
          </>
        )}

        {/* small shadow */}
        <rect x={9} y={19} width={5} height={1} fill="#d0c8b5" opacity={0.8} />
      </>
    );
  };

  /* ---------------------------------
   * 공통 다리 (lv2/lv3 기본)
   * --------------------------------- */
  const renderLegs = () => {
    if (mode === "walkA") {
      return (
        <>
          <rect x={10} y={16} width={1} height={3} fill={ink} />
          <rect x={14} y={17} width={1} height={2} fill={ink} />
        </>
      );
    }
    if (mode === "walkB") {
      return (
        <>
          <rect x={10} y={17} width={1} height={2} fill={ink} />
          <rect x={14} y={16} width={1} height={3} fill={ink} />
        </>
      );
    }
    return (
      <>
        <rect x={10} y={16} width={1} height={3} fill={ink} />
        <rect x={14} y={16} width={1} height={3} fill={ink} />
      </>
    );
  };

  /* ---------------------------------
   * lv2 : 기본냥 (초보냥)
   * --------------------------------- */
  const renderDefaultCat = () => {
    const body = "#FDF3DC";
    const belly = "#FFFFFF";
    const blush = "#F8D4C3";

    return (
      <>
        {/* ears */}
        <rect x={8} y={4} width={2} height={3} fill={ink} />
        <rect x={14} y={4} width={2} height={3} fill={ink} />

        {/* head + upper body */}
        <rect
          x={7}
          y={6}
          width={10}
          height={7}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />

        {/* lower body / belly */}
        <rect
          x={8}
          y={13}
          width={8}
          height={4}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />
        <rect x={9} y={14} width={6} height={2} fill={belly} />

        {/* arms */}
        <rect x={6} y={11} width={1} height={3} fill={ink} />
        <rect x={17} y={11} width={1} height={3} fill={ink} />

        {/* tail */}
        <rect x={17} y={13} width={1} height={4} fill={ink} />

        {/* face */}
        {renderFace()}

        {/* blush */}
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />

        {/* legs */}
        {renderLegs()}
      </>
    );
  };

  /* ---------------------------------
   * lv3 : 책냥 (책 껴안는 버전)
   * --------------------------------- */
  const renderBookCat = () => {
    const body = "#FDF3DC";
    const belly = "#FFFFFF";
    const blush = "#F8D4C3";
    const bookCover = "#7AA2FF";
    const bookLabel = "#FFFFFF";

    return (
      <>
        {/* ears */}
        <rect x={8} y={4} width={2} height={3} fill={ink} />
        <rect x={14} y={4} width={2} height={3} fill={ink} />

        {/* head + upper body */}
        <rect
          x={7}
          y={6}
          width={10}
          height={7}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />

        {/* lower body */}
        <rect
          x={8}
          y={13}
          width={8}
          height={4}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />
        <rect x={9} y={14} width={6} height={2} fill={belly} />

        {/* tail */}
        <rect x={17} y={13} width={1} height={4} fill={ink} />

        {/* face */}
        {renderFace()}

        {/* blush */}
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />

        {/* book in front of belly */}
        <rect
          x={8}
          y={12}
          width={6}
          height={5}
          fill={bookCover}
          stroke={ink}
          strokeWidth={1}
        />
        <rect x={9} y={13} width={4} height={1} fill={bookLabel} />

        {/* arms hugging book */}
        <rect x={7} y={12} width={1} height={4} fill={ink} />
        <rect x={14} y={12} width={1} height={4} fill={ink} />

        {/* legs */}
        {renderLegs()}
      </>
    );
  };

  /* ---------------------------------
   * 레벨별 분기
   * --------------------------------- */
  const renderByLevel = () => {
    if (levelStage === 0) return renderBaby();
    if (levelStage === 1) return renderSproutCat();
    if (levelStage === 3) return renderBookCat();
    return renderDefaultCat(); // lv2 및 그 외 기본
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        shapeRendering="crispEdges"
      >
        {/* 24x24 설계를 32x32 중앙으로 이동 */}
        <g transform="translate(4,4)">{renderByLevel()}</g>
      </svg>
    </div>
  );
}
