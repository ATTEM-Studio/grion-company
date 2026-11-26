"use client";

import Image from "next/image";
import { useRef } from "react";

const TAPS = 10; // 연속 10번
const GAP_MS = 1200; // 터치와 터치 사이가 이 시간을 넘으면 처음부터 다시 셉니다

// 보이는 모양과 동작은 그냥 로고입니다. 로고를 연속으로 10번 누르면 관리자 로그인 화면으로 이동합니다.
export function LogoDoor() {
  const count = useRef(0);
  const last = useRef(0);

  const onTap = () => {
    const now = Date.now();
    count.current = now - last.current > GAP_MS ? 1 : count.current + 1;
    last.current = now;
    if (count.current < TAPS) return;
    count.current = 0;
    void fetch("/api/ops-door", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { path?: string } | null) => {
        if (j?.path && j.path.startsWith("/")) window.location.assign(j.path);
      })
      .catch(() => {});
  };

  return (
    <span onClick={onTap} className="inline-block select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation]">
      <Image src="/grion-logo.png" alt="GRION" width={128} height={27} priority draggable={false} className="h-auto w-[104px] md:w-[120px]" />
    </span>
  );
}
