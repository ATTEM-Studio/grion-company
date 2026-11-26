"use client";

import { useSyncExternalStore } from "react";
import { applicantKey, thanksHero } from "@/content/thanks";
import { Rich } from "./Rich";

const subscribe = () => () => {};
const readName = () => {
  try {
    return sessionStorage.getItem(applicantKey) ?? "";
  } catch {
    return "";
  }
};

// 신청 직후 같은 탭에 매장명이 남아 있으면 "○○ 사장님"으로 인사합니다. 없으면 기본 문구를 씁니다.
export function ThanksTitle() {
  const name = useSyncExternalStore(subscribe, readName, () => "");
  const text = name ? thanksHero.titleNamed.replace("{name}", name) : thanksHero.title;
  return <Rich text={text} tone="dark" />;
}
