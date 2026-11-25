import { Fragment } from "react";

/**
 * 카피 안의 **강조** 부분을 형광펜 밑줄 + 굵은 글씨로 보여줍니다.
 * "\n" 은 휴대폰(640px 미만)에서만 줄을 바꿉니다. 넓은 화면에서는 띄어쓰기로 이어집니다.
 * tone="dark" 는 어두운 배경용입니다.
 */
export function Rich({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && (
            <>
              {" "}
              <br className="sm:hidden" />
            </>
          )}
          {line.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong
                key={i}
                className={
                  tone === "dark"
                    ? "box-decoration-clone font-extrabold text-white [background:linear-gradient(transparent_58%,rgba(182,191,250,0.45)_58%)]"
                    : "box-decoration-clone font-extrabold text-ink [background:linear-gradient(transparent_58%,var(--accent-line)_58%)]"
                }
              >
                {part}
              </strong>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            )
          )}
        </Fragment>
      ))}
    </>
  );
}
