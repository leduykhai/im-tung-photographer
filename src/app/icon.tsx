import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 19,
          background: "#252525",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF8F5",
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-0.05em",
        }}
      >
        T
      </div>
    ),
    {
      ...size,
    },
  );
}
