"use client";

type CatMode = "idle" | "walkA" | "walkB" | "happy" | "sleepy";

type Props = {
  size?: number;
  mode?: CatMode;
};

export default function CatTama({ size = 160, mode = "idle" }: Props) {
  const ink = "#000";

  // 얼굴만 모드에 따라 바꾼다
  const renderFace = () => {
    // 몸통 기준: x=6~18, y=6~15  이 안쪽이 얼굴 영역이야
    // 가운데 x는 12 근처로 놓으면 이쁘다
    switch (mode) {
      case "happy":
        return (
          <>
            {/* 눈 */}
            <rect x={10} y={9} width={1} height={1} fill={ink} />
            <rect x={14} y={9} width={1} height={1} fill={ink} />
            {/* 입 살짝 위로 */}
            <rect x={12} y={11} width={1} height={1} fill={ink} />
          </>
        );
      case "sleepy":
        return (
          <>
            {/* 눈 감은 버전 */}
            <rect x={9.5} y={9} width={2} height={1} fill={ink} />
            <rect x={13.5} y={9} width={2} height={1} fill={ink} />
            <rect x={12} y={12} width={1} height={1} fill={ink} />
          </>
        );
      default: // idle, walkA, walkB
        return (
          <>
            <rect x={10} y={9} width={1} height={1} fill={ink} />
            <rect x={14} y={9} width={1} height={1} fill={ink} />
            <rect x={12} y={11} width={1} height={1} fill={ink} />
          </>
        );
    }
  };

  // 다리 프레임
  const renderLegs = () => {
    if (mode === "walkA") {
      return (
        <>
          {/* 왼다리 앞으로 */}
          <rect x={10} y={16} width={1} height={3} fill={ink} />
          {/* 오른다리 뒤로 */}
          <rect x={14} y={17} width={1} height={2} fill={ink} />
        </>
      );
    }
    if (mode === "walkB") {
      return (
        <>
          {/* 왼다리 뒤로 */}
          <rect x={10} y={17} width={1} height={2} fill={ink} />
          {/* 오른다리 앞으로 */}
          <rect x={14} y={16} width={1} height={3} fill={ink} />
        </>
      );
    }
    // 기본 서있는 다리
    return (
      <>
        <rect x={10} y={16} width={1} height={3} fill={ink} />
        <rect x={14} y={16} width={1} height={3} fill={ink} />
      </>
    );
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
        viewBox="0 0 24 24"
        width={size}
        height={size}
        shapeRendering="crispEdges"
      >
        {/* 귀 */}
        <rect x={8} y={4} width={2} height={3} fill={ink} />
        <rect x={14} y={4} width={2} height={3} fill={ink} />

        {/* 몸통(살짝 위로 올림) */}
        <rect
          x={6}
          y={6}
          width={12}
          height={9}
          fill="#fff"
          stroke={ink}
          strokeWidth={1}
        />

        {/* 팔 - 옆으로 삐죽 */}
        <rect x={5} y={8} width={1} height={3} fill={ink} />
        <rect x={18} y={8} width={1} height={3} fill={ink} />

        {/* 얼굴 */}
        {renderFace()}

        {/* 다리 */}
        {renderLegs()}

        {/* sleepy 표시 */}
        {mode === "sleepy" && (
          <>
            <rect x={4} y={3} width={1} height={1} fill={ink} />
            <rect x={5} y={2} width={1} height={1} fill={ink} />
            <rect x={6} y={1} width={1} height={1} fill={ink} />
          </>
        )}
      </svg>
    </div>
  );
}
