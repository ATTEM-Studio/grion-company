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

// Missing values stay unknown throughout the page, including budget inputs.
const EMPTY_INPUTS: GrowthInputs = {
  currentRevenue: NaN,
  operatingDays: NaN,
  impressions: NaN,
  visits: NaN,
  customers: NaN,
  aov: NaN,
  repeatRate: NaN,
  goalRevenue: NaN,
  rent: NaN,
};

type GrowthContextValue = {
  inputs: GrowthInputs;
  setInput: (key: keyof GrowthInputs, value: number) => void;
  updateInputs: (values: Partial<GrowthInputs>) => void;
  reset: () => void;
  result: GrowthResult;
  /** True only after the visitor enters their own values. */
  touched: boolean;
};

const GrowthContext = createContext<GrowthContextValue | null>(null);

export function GrowthProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<GrowthInputs>(EMPTY_INPUTS);
  const [touched, setTouched] = useState(false);

  const setInput = useCallback((key: keyof GrowthInputs, value: number) => {
    setTouched(true);
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs(EMPTY_INPUTS);
    setTouched(false);
  }, []);

  const updateInputs = useCallback((values: Partial<GrowthInputs>) => {
    setTouched(true);
    setInputs((prev) => ({ ...prev, ...values }));
  }, []);

  const result = useMemo(() => computeGrowth(inputs), [inputs]);

  const value = useMemo(
    () => ({ inputs, setInput, updateInputs, reset, result, touched }),
    [inputs, setInput, updateInputs, reset, result, touched]
  );

  return <GrowthContext.Provider value={value}>{children}</GrowthContext.Provider>;
}

export function useGrowth(): GrowthContextValue {
  const ctx = useContext(GrowthContext);
  if (!ctx) throw new Error("useGrowth must be used inside <GrowthProvider>");
  return ctx;
}
