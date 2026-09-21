import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("scroll reveal restores the original pace and keeps the revenue signal visible", async () => {
  const [css, component, flowCss] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../components/Reveal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/GrowthFlow.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(css, /transform:\s*translateY\(18px\)/);
  assert.match(css, /opacity 0\.7s/);
  assert.doesNotMatch(component, /const effectiveDelay/);
  assert.match(component, /threshold:\s*0\.15/);
  assert.match(component, /rootMargin:\s*"0px 0px -8% 0px"/);
  assert.match(flowCss, /\.signal \{ animation:flowSignal 2\.2s linear infinite/);
  assert.match(flowCss, /@keyframes flowSignal \{ to \{ stroke-dashoffset:-76; \} \}/);
});
