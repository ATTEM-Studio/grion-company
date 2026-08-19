"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { computeGrowth, type GrowthInputs, type GrowthResult } from "./growth";

/**
 * Holds the visitor's own numbers for the whole page.
 *
 * The hero calculator, the lever section, and the diagnosis form all read
 * from here, so a number typed once in the hero flows through every later
 * section and lands pre-filled in the contact form. That continuity is the
 * point: the visitor invests 30 seconds and gets it back, instead of being
 * asked for the same facts again at the bottom of the page.
 */

/**
 * Starting values are explicitly labelled as an example in the UI until
 * the visitor edits something (`touched`). They exist so the hero reads as
 * a working instrument on arrival rather than an empty form — never as a
 * claim about a real business.
 */
const EXAMPLE_INPUTS: GrowthInputs = {
  impressions: 30000,
  visits: 4500,
  customers: 1800,
  aov: 15000,
  repeatRate: 20,
  goalRevenue: 40000000,
  rent: 3000000,
};

type GrowthContextValue = {
  inputs: GrowthInputs;
  setInput: (key: keyof GrowthInputs, value: number) => void;
  reset: () => void;
  result: GrowthResult;
  /** False until the visitor changes any value — drives the "예시 값" badge. */
  touched: boolean;
};

const GrowthContext = createContext<GrowthContextValue | null>(null);

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<GrowthInputs>(EXAMPLE_INPUTS);
  const [touched, setTouched] = useState(false);

  const setInput = useCallback((key: keyof GrowthInputs, value: number) => {
    setTouched(true);
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs(EXAMPLE_INPUTS);
    setTouched(false);
  }, []);

  const result = useMemo(() => computeGrowth(inputs), [inputs]);

  const value = useMemo(
    () => ({ inputs, setInput, reset, result, touched }),
    [inputs, setInput, reset, result, touched]
  );

  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>;
}

export function useGrowth(): GrowthContextValue {
  const ctx = useContext(GrowthContext);
  if (!ctx) throw new Error("useGrowth must be used inside <GrowthProvider>");
  return ctx;
}
