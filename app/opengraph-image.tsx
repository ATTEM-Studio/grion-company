import { ImageResponse } from "next/og";

export const alt = "그리온컴퍼니 — 매출이 멈춘 곳을 눈에 보이게 만듭니다";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: "#141a3d",
          color: "#f7f8fc",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            color: "#b6bffa",
            fontWeight: 700,
          }}
        >
          GRION / GROWTH OPERATING SYSTEM
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 62,
            fontWeight: 800,
            lineHeight: 1.26,
            color: "#ffffff",
          }}
        >
          <span>매출이 멈춘 곳을</span>
          <span style={{ color: "#b6bffa" }}>눈에 보이게 만듭니다.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 25,
            color: "rgba(247,248,252,0.7)",
          }}
        >
          광고를 더하기 전에, 사업의 흐름을 확인합니다.
        </div>
      </div>
    ),
    { ...size }
  );
}
