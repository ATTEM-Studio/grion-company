/**
 * Growth math for the hero calculator.
 *
 * Two rules drive the design here.
 *
 * 1. Never invent data. No industry benchmarks, no "average conversion is
 *    X%", no scoring model. Every number returned is either typed by the
 *    visitor or exact arithmetic on what they typed.
 *
 * 2. Unknown is not zero. Most small-business owners know their monthly
 *    customer count and average ticket, but NOT their impression or
 *    click-through counts. If a missing 노출 were treated as 0, the panel
 *    would show "유입률 0%" — which reads as a damning diagnosis when it
 *    actually means "no data". So the funnel numbers are optional, and
 *    every rate derived from them is `null` (rendered as "—") until the
 *    visitor supplies them.
 *
 * The core identity always holds:
 *
 *   월매출 = 방문 × 객단가
 *
 * and when the funnel numbers ARE supplied it expands to:
 *
 *   월매출 = 노출 × 유입률 × 방문률 × 객단가
 *
 * Because revenue is a plain product either way, "what would this one
 * factor have to become to hit the goal on its own?" is just
 * `factor × (goal / current)`.
 */

export type GrowthInputs = {
  /** 월 노출 수 — 선택 입력 */
  impressions: number;
  /** 월 유입 수 — 선택 입력 */
  visits: number;
  /** 월 실제 방문·구매 건수 — 필수 */
  customers: number;
  /** 객단가 (원) — 필수 */
  aov: number;
  /** 재방문율 (0~100, %) — 선택 입력 */
  repeatRate: number;
  /** 목표 월매출 (원) — 필수 */
  goalRevenue: number;
  /** 월세 (원) — 선택. 예산 점검에만 사용 */
  rent: number;
};

/**
 * 그리온이 실제로 쓰는 운영 판단 기준입니다.
 *
 * 업계 평균이나 통계가 아니라 그리온의 기준이라는 점이 중요합니다.
 * 화면에서도 반드시 "그리온 기준"으로 표기해야 하며, 객관적 사실처럼
 * 제시해서는 안 됩니다. 기준이 바뀌면 이 상수만 고치면 됩니다.
 */
export const GRION_STANDARDS = {
  /** 월세 + 마케팅비가 목표 매출에서 차지해도 되는 상한 */
  fixedCostRatio: 0.1,
  /** 신규 고객 1명 획득에 쓸 수 있는 비용 = 객단가 × 이 값 */
  cacRatio: 0.25,
  /**
   * 객단가 구간별 재방문율 기준.
   * 객단가가 높을수록 구매 주기가 길어져 기준을 낮게 잡습니다.
   * `maxAov` 이하이면 해당 `rate`(%)를 적용합니다.
   */
  repeatRateBands: [
    { maxAov: 50_000, rate: 25 },
    { maxAov: 100_000, rate: 20 },
    { maxAov: 150_000, rate: 15 },
    { maxAov: 200_000, rate: 10 },
    { maxAov: Infinity, rate: 5 },
  ],
} as const;

export type Standards = {
  /** 목표 매출 × 10% — 월세와 마케팅비를 합쳐 넘지 않아야 하는 상한 */
  fixedCostCeiling: number;
  rent: number;
  /** 상한 − 월세. 0 이하이면 월세만으로 이미 기준을 넘긴 상태 */
  marketingBudget: number;
  /** 월세가 이미 상한을 넘어 마케팅에 쓸 여력이 없는 경우 */
  budgetOverrun: boolean;
  /** 객단가 × 25% */
  targetCac: number;
  /** 가용 예산으로 확보 가능한 신규 고객 수 */
  affordableNewCustomers: number;
  /** 목표까지 더 필요한 방문 수 */
  neededExtraCustomers: number;
  /** 신규 고객 확보만으로 목표에 닿을 수 있는가 */
  reachableByAcquisition: boolean;
  /** 객단가 구간에 따른 재방문율 기준 (%) */
  targetRepeatRate: number;
  /** 기준 − 입력값. 양수면 기준에 못 미침. 재방문율 미입력이면 null */
  repeatShortfall: number | null;
};

export type StageKey = "impressions" | "visits" | "customers" | "aov" | "repeat";

export type Stage = {
  key: StageKey;
  no: string;
  label: string;
  question: string;
  value: number;
  unit: "명" | "원" | "%";
  /** true면 비워둬도 나머지 계산이 정상 동작합니다. */
  optional: boolean;
  /**
   * 이 단계로 넘어온 전환율(0~1). 데이터가 없으면 null —
   * 절대 0으로 대체하지 않습니다. 0%는 "전환이 없다"는 진단이고,
   * null은 "아직 모른다"이기 때문입니다.
   */
  rate: number | null;
  rateLabel: string | null;
};

export type LeverKey = "impressions" | "clickRate" | "visitRate" | "customers" | "aov";

export type Lever = {
  key: LeverKey;
  label: string;
  current: number;
  /** 이 지표 하나로 목표에 도달하려면 얼마가 되어야 하는가. 불가능하면 null. */
  required: number | null;
  unit: "명" | "원" | "%";
  /** 100%를 넘어야 해서 이 지표 단독으로는 목표 달성이 불가능한 경우. */
  impossible: boolean;
  /**
   * 가능은 하지만 매우 높은 비율(80% 초과)이 필요한 경우.
   * 벤치마크를 주장하는 대신, 그 숫자가 실제로 무슨 뜻인지
   * 평범한 말로 다시 설명해 과신을 막습니다.
   */
  strained: boolean;
  /** strained일 때 보여줄 평이한 재진술. 예: "10명 중 9명" */
  plainRestatement: string | null;
};

export type GrowthResult = {
  currentRevenue: number;
  goalRevenue: number;
  gap: number;
  multiplier: number;
  goalReached: boolean;
  stages: Stage[];
  levers: Lever[];
  weakestStage: Stage | null;
  repeatCustomers: number;
  /** 방문·객단가·목표가 모두 있어 매출 계산이 가능한 상태. */
  canCompute: boolean;
  /** 노출·유입이 모두 있어 퍼널 전환율을 볼 수 있는 상태. */
  hasFunnelData: boolean;
  /** 그리온 기준으로 본 예산·CAC·재방문 점검. 계산 불가면 null. */
  standards: Standards | null;
};

/** 객단가에 해당하는 그리온 재방문율 기준(%)을 찾습니다. */
export function targetRepeatRateFor(aov: number): number {
  const band = GRION_STANDARDS.repeatRateBands.find((b) => aov <= b.maxAov);
  return band ? band.rate : GRION_STANDARDS.repeatRateBands[GRION_STANDARDS.repeatRateBands.length - 1].rate;
}

const safeDiv = (a: number, b: number): number =>
  b > 0 && Number.isFinite(a) && Number.isFinite(b) ? a / b : 0;

const clean = (n: number): number => (Number.isFinite(n) && n > 0 ? n : 0);

/** 0.86 → "10명 중 약 9명" */
function restateRate(pct: number): string {
  const outOfTen = Math.round((pct / 100) * 10);
  return `10명 중 약 ${outOfTen}명`;
}

export function computeGrowth(raw: GrowthInputs): GrowthResult {
  const impressions = clean(raw.impressions);
  // 유입은 노출을, 방문은 유입을 넘을 수 없습니다. 다만 상위 값이
  // 비어 있으면(선택 입력) 클램프하지 않고 그대로 둡니다.
  const rawVisits = clean(raw.visits);
  const visits = impressions > 0 ? Math.min(rawVisits, impressions) : rawVisits;
  const rawCustomers = clean(raw.customers);
  const customers = visits > 0 ? Math.min(rawCustomers, visits) : rawCustomers;
  const aov = clean(raw.aov);
  const repeatRate = Math.min(Math.max(raw.repeatRate, 0), 100);
  const goalRevenue = clean(raw.goalRevenue);

  const currentRevenue = customers * aov;

  // 매출 계산에 꼭 필요한 것은 이 셋뿐입니다.
  const canCompute = customers > 0 && aov > 0 && goalRevenue > 0;
  const hasFunnelData = impressions > 0 && visits > 0;

  const clickRate = hasFunnelData ? safeDiv(visits, impressions) : null;
  const visitRate = visits > 0 && customers > 0 ? safeDiv(customers, visits) : null;
  const repeatFraction = repeatRate > 0 ? repeatRate / 100 : null;

  const gap = Math.max(0, goalRevenue - currentRevenue);
  const multiplier = currentRevenue > 0 && goalRevenue > 0 ? goalRevenue / currentRevenue : 0;
  const goalReached = canCompute && currentRevenue >= goalRevenue;

  const stages: Stage[] = [
    {
      key: "impressions",
      no: "01",
      label: "노출",
      question: "발견되고 있는가",
      value: impressions,
      unit: "명",
      optional: true,
      rate: null,
      rateLabel: null,
    },
    {
      key: "visits",
      no: "02",
      label: "유입",
      question: "관심이 생겼는가",
      value: visits,
      unit: "명",
      optional: true,
      rate: clickRate,
      rateLabel: "노출 → 유입",
    },
    {
      key: "customers",
      no: "03",
      label: "방문",
      question: "선택으로 이어졌는가",
      value: customers,
      unit: "명",
      optional: false,
      rate: visitRate,
      rateLabel: "유입 → 방문",
    },
    {
      key: "aov",
      no: "04",
      label: "객단가",
      question: "한 번의 가치가 충분한가",
      value: aov,
      unit: "원",
      optional: false,
      rate: null,
      rateLabel: null,
    },
    {
      key: "repeat",
      no: "05",
      label: "재방문",
      question: "다시 찾을 이유가 있는가",
      value: repeatRate,
      unit: "%",
      optional: true,
      rate: repeatFraction,
      rateLabel: "방문 → 재방문",
    },
  ];

  // 병목은 퍼널 데이터가 있을 때만 판단합니다. 재방문율 하나만 있는
  // 상태에서 "여기가 가장 많이 빠진다"고 말하면 비교 대상이 없어
  // 사실상 근거 없는 진단이 됩니다.
  const rated = hasFunnelData ? stages.filter((s) => s.rate !== null && s.rate > 0) : [];
  const weakestStage =
    rated.length >= 2
      ? rated.reduce((min, s) => ((s.rate as number) < (min.rate as number) ? s : min))
      : null;

  const buildLever = (
    key: LeverKey,
    label: string,
    current: number,
    unit: Lever["unit"],
    ceiling: number | null
  ): Lever => {
    if (goalReached || multiplier <= 0 || current <= 0) {
      return {
        key,
        label,
        current,
        required: null,
        unit,
        impossible: false,
        strained: false,
        plainRestatement: null,
      };
    }
    const required = current * multiplier;
    const impossible = ceiling !== null && required > ceiling;
    const strained = !impossible && unit === "%" && required > 80;
    return {
      key,
      label,
      current,
      required: impossible ? null : required,
      unit,
      impossible,
      strained,
      plainRestatement: strained ? restateRate(required) : null,
    };
  };

  // 데이터가 적으면 레버도 적게. 없는 숫자로 만든 레버는 보여주지 않습니다.
  const levers: Lever[] = hasFunnelData
    ? [
        buildLever("impressions", "노출 수", impressions, "명", null),
        buildLever("clickRate", "유입률", (clickRate ?? 0) * 100, "%", 100),
        buildLever("visitRate", "방문률", (visitRate ?? 0) * 100, "%", 100),
        buildLever("aov", "객단가", aov, "원", null),
      ]
    : [
        buildLever("customers", "월 방문 수", customers, "명", null),
        buildLever("aov", "객단가", aov, "원", null),
      ];

  const rent = clean(raw.rent);

  let standards: Standards | null = null;
  if (canCompute) {
    const fixedCostCeiling = goalRevenue * GRION_STANDARDS.fixedCostRatio;
    const marketingBudget = fixedCostCeiling - rent;
    const budgetOverrun = marketingBudget <= 0;
    const targetCac = aov * GRION_STANDARDS.cacRatio;
    const affordableNewCustomers =
      budgetOverrun || targetCac <= 0 ? 0 : Math.floor(marketingBudget / targetCac);
    const neededExtraCustomers = aov > 0 ? Math.ceil(gap / aov) : 0;
    const targetRepeatRate = targetRepeatRateFor(aov);

    standards = {
      fixedCostCeiling,
      rent,
      marketingBudget,
      budgetOverrun,
      targetCac,
      affordableNewCustomers,
      neededExtraCustomers,
      reachableByAcquisition:
        neededExtraCustomers === 0 || affordableNewCustomers >= neededExtraCustomers,
      targetRepeatRate,
      repeatShortfall: repeatRate > 0 ? targetRepeatRate - repeatRate : null,
    };
  }

  return {
    currentRevenue,
    goalRevenue,
    gap,
    multiplier,
    goalReached,
    stages,
    levers,
    weakestStage,
    repeatCustomers: repeatFraction ? Math.round(customers * repeatFraction) : 0,
    canCompute,
    hasFunnelData,
    standards,
  };
}

/* ----------------------------- formatting ----------------------------- */

const nf = new Intl.NumberFormat("ko-KR");

export const formatNumber = (n: number): string => nf.format(Math.round(n));

/** 30,000,000 → "3,000만원" · 1,250,000,000 → "12.5억원" */
export function formatWon(n: number): string {
  const v = Math.round(n);
  if (v === 0) return "0원";
  if (Math.abs(v) >= 100_000_000) {
    const eok = v / 100_000_000;
    return `${Number(eok.toFixed(eok >= 10 ? 0 : 1)).toLocaleString("ko-KR")}억원`;
  }
  if (Math.abs(v) >= 10_000) {
    const man = v / 10_000;
    return `${Number(man.toFixed(man >= 100 ? 0 : 1)).toLocaleString("ko-KR")}만원`;
  }
  return `${nf.format(v)}원`;
}

/** 0.0672 → "6.7%" */
export function formatRate(fraction: number): string {
  const pct = fraction * 100;
  return `${pct >= 10 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

export function formatPercentValue(pct: number): string {
  return `${pct >= 10 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

export function formatLeverValue(value: number, unit: Lever["unit"]): string {
  if (unit === "원") {
    // 객단가처럼 작은 금액은 "1.5만원"보다 "15,000원"이 읽기 쉽습니다.
    return value < 1_000_000 ? `${formatNumber(value)}원` : formatWon(value);
  }
  if (unit === "%") return formatPercentValue(value);
  return `${formatNumber(value)}명`;
}
