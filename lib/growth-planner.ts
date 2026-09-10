/** Empty is not zero. Currency and count inputs use integer validation. */
export function parsePlannerValue(raw: string, integer = false): number | null {
  const text = raw.trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text)) return null;
  const value = Number(text.replaceAll(",", ""));
  if (!Number.isFinite(value) || value > 90_000_000_000 || (integer && !Number.isInteger(value))) return null;
  return value;
}

export const roundUpTarget = (value: number) =>
  Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 4);

export function paymentPlan(current: number, goal: number, average: number, days: number) {
  if (![current, goal, average, days].every(Number.isFinite) || current < 0 || goal <= 0 || average <= 0 || !Number.isInteger(days) || days < 1 || days > 31) return null;
  const gap = Math.max(0, goal - current);
  const requiredAverage = current > 0 ? roundUpTarget(goal / (current / average)) : null;
  return {
    extraMonthly: roundUpTarget(gap / average),
    extraDaily: roundUpTarget(gap / average / days),
    requiredAverage,
    extraAverage: requiredAverage === null ? null : Math.max(0, requiredAverage - average),
  };
}

export function combinedPlan(current: number, goal: number, average: number, days: number, extraDaily: number, nextAverage: number) {
  if (!paymentPlan(current, goal, average, days) || !Number.isSafeInteger(extraDaily) || extraDaily < 0 || !Number.isFinite(nextAverage) || nextAverage <= 0) return null;
  const revenue = Math.round((current / average + extraDaily * days) * nextAverage);
  if (!Number.isSafeInteger(revenue)) return null;
  return { revenue, remaining: goal - revenue };
}

/** Keep all entered won; never turn a small remaining gap into "0만원". */
export function formatPlanMoney(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  const absolute = Math.abs(rounded);
  const sign = rounded < 0 ? "−" : "";
  const eok = Math.floor(absolute / 100_000_000);
  const remainder = absolute % 100_000_000;
  const nf = (n: number) => n.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  if (eok && remainder % 100 === 0) {
    return sign + nf(eok) + "억" + (remainder ? " " + nf(remainder / 10000) + "만 원" : " 원");
  }
  if (!eok && absolute >= 10000 && absolute % 100 === 0) return sign + nf(absolute / 10000) + "만 원";
  return sign + absolute.toLocaleString("ko-KR") + "원";
}
