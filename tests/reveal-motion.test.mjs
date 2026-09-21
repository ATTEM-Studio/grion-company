import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("scroll reveal keeps motion brief and avoids long cascades", async () => {
  const [css, component] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../components/Reveal.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /transform:\s*translateY\(10px\)/);
  assert.match(css, /opacity 0\.42s/);
  assert.match(component, /const effectiveDelay = Math\.min\(delayMs, 120\)/);
  assert.match(component, /threshold:\s*0\.01/);
  assert.match(component, /rootMargin:\s*"0px 0px -2% 0px"/);
});
