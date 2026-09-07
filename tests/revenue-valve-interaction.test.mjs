import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../components/GrowthFlow.tsx', import.meta.url), 'utf8');

test('객단가 모듈은 수압 상승 상태를 토글하고 흐름의 속도와 굵기를 강화한다', () => {
  assert.match(source, /useState/);
  assert.match(source, /aria-pressed=\{pressureBoosted\}/);
  assert.match(source, /setPressureBoosted/);
  assert.match(source, /rv-pressure-boosted/);
  assert.match(source, /\.rv-pressure-boosted \.rv-pipe-signal[\s\S]*animation-duration:\s*\.8s/);
  assert.match(source, /\.rv-pressure-boosted \.rv-pipe-signal[\s\S]*stroke-width:\s*7/);
  assert.match(source, /\.rv-pressure-boosted \.rv-pipe-core[\s\S]*stroke-width:\s*26/);
  assert.match(source, /수압 상승 중/);
});
