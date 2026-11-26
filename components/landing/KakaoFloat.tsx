"use client";

import { useEffect, useState } from "react";
import { kakaoChannelUrl } from "@/content/thanks";

// 화면 아래에 떠 있는 카카오톡 상담 버튼. 채널 주소가 있을 때만 나타나고,
// 가격 안내 카드(#offer)가 화면에 보이는 동안에는 카드 안 버튼과 겹치지 않게 숨깁니다.
export function KakaoFloat() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("offer");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.35 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!kakaoChannelUrl || hidden) return null;
  return (
    <a
      href={kakaoChannelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3.5 text-[15px] font-extrabold text-[#191919] shadow-lg"
    >
      <span aria-hidden="true">💬</span>
      카톡 상담
    </a>
  );
}
