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

  const renderDefaultCat = () => {
    const body = "#FDF3DC";   // 크림색 머리/몸통
    const belly = "#FFFFFF";  // 배 부분
    const blush = "#F8D4C3";  // 볼터치

    return (
      <>
        {/* 귀 - 살짝 넓게, 위로 */}
        <rect x={8} y={4} width={2} height={3} fill={ink} />
        <rect x={14} y={4} width={2} height={3} fill={ink} />

        {/* 머리(크게) */}
        <rect
          x={7}
          y={6}
          width={10}
          height={7}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />

        {/* 몸통 - 머리보다 한 칸 좁고, 짧게 */}
        <rect
          x={8}
          y={13}
          width={8}
          height={3}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />

        {/* 배 안쪽 하이라이트 */}
        <rect x={9} y={14} width={6} height={1} fill={belly} />

        {/* 팔 - 몸통 기준으로 완전 대칭 */}
        <rect x={7} y={13} width={1} height={2} fill={ink} />   {/* 왼팔 */}
        <rect x={16} y={13} width={1} height={2} fill={ink} />  {/* 오른팔 */}

        {/* 꼬리 - 위로 올라가는 대각선 버전 */}
        <rect x={16} y={14} width={1} height={1} fill={ink} />
        <rect x={17} y={13} width={1} height={1} fill={ink} />
        <rect x={18} y={12} width={1} height={1} fill={ink} />

        {/* 얼굴 (공통) */}
        {renderFace()}

        {/* 볼터치 - 눈 아래쪽 대칭 */}
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />

        {/* 다리 - 공통 다리 로직 사용 */}
        {renderLegs()}
      </>
    );
  };


  /* ---------------------------------
   * lv3 : 책냥 (책 껴안는 버전 – 기본냥과 같은 팔/꼬리 기준)
   * --------------------------------- */
  const renderBookCat = () => {
    const body = "#FDF3DC";
    const belly = "#FFFFFF";
    const blush = "#F8D4C3";
    const bookCover = "#7AA2FF";
    const bookLabel = "#FFFFFF";

    return (
      <>
        {/* 귀 */}
        <rect x={8} y={4} width={2} height={3} fill={ink} />
        <rect x={14} y={4} width={2} height={3} fill={ink} />

        {/* 머리 + 상체 */}
        <rect
          x={7}
          y={6}
          width={10}
          height={7}
          fill={body}
          stroke={ink}
          strokeWidth={1}
        />

        {/* 하체 */}
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

        {/* 꼬리 - 기본냥과 같은 대각선 꼬리 */}
        <rect x={16} y={14} width={1} height={1} fill={ink} />
        <rect x={17} y={13} width={1} height={1} fill={ink} />
        <rect x={18} y={12} width={1} height={1} fill={ink} />

        {/* 얼굴 */}
        {renderFace()}

        {/* 볼터치 */}
        <rect x={9} y={10} width={1} height={1} fill={blush} />
        <rect x={14} y={10} width={1} height={1} fill={blush} />

        {/* 책 - 배 앞쪽에 */}
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

        {/* 팔 - 기본냥과 같은 기준 위치(좌우 대칭) */}
        <rect x={7} y={13} width={1} height={2} fill={ink} />   {/* 왼팔 */}
        <rect x={16} y={13} width={1} height={2} fill={ink} />  {/* 오른팔 */}

        {/* 다리 - 공통 다리 */}
        {renderLegs()}
      </>
    );
  };

  
/* ---------------------------------
 * lv4 : 3D 책 더미 위에 서있는 수습냥 (발판 위치 수정 버전)
 * --------------------------------- */
const renderBookStackCat = () => {
  const body = "#FDF3DC";
  const belly = "#FFFFFF";
  const blush = "#F8D4C3";

  const bookBlue = "#7AA2FF";
  const bookYellow = "#F7D658";
  const bookRed = "#E36A6A";

  const frontShade = "#2b2b2b";
  const sideShade = "#101010";

  return (
    <>
      {/* 귀 */}
      <rect x={8} y={4} width={2} height={3} fill={ink} />
      <rect x={14} y={4} width={2} height={3} fill={ink} />

      {/* 머리 */}
      <rect
        x={7}
        y={6}
        width={10}
        height={7}
        fill={body}
        stroke={ink}
        strokeWidth={1}
      />

      {renderFace()}
      <rect x={9} y={10} width={1} height={1} fill={blush} />
      <rect x={14} y={10} width={1} height={1} fill={blush} />

      {/* 몸통 */}
      <rect
        x={8}
        y={13}
        width={8}
        height={3}
        fill={body}
        stroke={ink}
        strokeWidth={1}
      />
      <rect x={9} y={14} width={6} height={1} fill={belly} />

      {/* 팔 */}
      <rect x={7} y={13} width={1} height={2} fill={ink} />
      <rect x={15} y={13} width={1} height={2} fill={ink} />

      {/* 꼬리 (대각선) */}
      <rect x={16} y={13} width={1} height={2} fill={ink} />
      <rect x={17} y={12} width={1} height={1} fill={ink} />

      {/* ===== 다리 (책 위에 닿도록 Y 재조정) ===== */}
      {mode === "walkA" ? (
        <>
          <rect x={10} y={17} width={1} height={3} fill={ink} /> {/* 왼 */}
          <rect x={14} y={18} width={1} height={2} fill={ink} /> {/* 오른 */}
        </>
      ) : mode === "walkB" ? (
        <>
          <rect x={10} y={18} width={1} height={2} fill={ink} />
          <rect x={14} y={17} width={1} height={3} fill={ink} />
        </>
      ) : (
        <>
          <rect x={10} y={17} width={1} height={3} fill={ink} />
          <rect x={14} y={17} width={1} height={3} fill={ink} />
        </>
      )}

      {/* ===== 책 더미 전체를 위로 올리기 (기존보다 +2px 위로 배치) ===== */}

      {/* 파란 책 윗면 - 넓게 */}
      <rect x={8} y={20} width={8} height={1} fill={bookBlue} />

      {/* 앞면 */}
      <rect x={7} y={21} width={10} height={1} fill={bookBlue} />
      <rect x={7} y={22} width={10} height={1} fill={frontShade} />

      {/* 오른쪽 옆면 */}
      <rect x={16} y={21} width={1} height={2} fill={sideShade} />

      {/* 노란 책 */}
      <rect x={8} y={22} width={8} height={1} fill={bookYellow} />
      <rect x={7} y={23} width={10} height={1} fill={bookYellow} />
      <rect x={7} y={24} width={10} height={1} fill={frontShade} />
      <rect x={16} y={23} width={1} height={2} fill={sideShade} />

      {/* 빨간 책 */}
      <rect x={8} y={24} width={8} height={1} fill={bookRed} />
      <rect x={7} y={25} width={10} height={1} fill={bookRed} />
      <rect x={16} y={25} width={1} height={1} fill={sideShade} />
    </>
  );
};







  /* ---------------------------------
   * 레벨별 분기
   * --------------------------------- */
  const renderByLevel = () => {
    if (levelStage === 0) return renderBaby();        // 알
    if (levelStage === 1) return renderSproutCat();   // 새싹냥

    if (levelStage === 2) return renderDefaultCat();  // 풋풋냥(기본냥)
    if (levelStage === 3) return renderBookCat();     // 독서초보냥(책 한 권)

    // ✅ 4단계 이상은 일단 “수습냥” 스타일로 통일
    if (levelStage >= 4) return renderBookStackCat();

    // 혹시 잘못된 값이 들어오면 기본냥
    return renderDefaultCat();
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
