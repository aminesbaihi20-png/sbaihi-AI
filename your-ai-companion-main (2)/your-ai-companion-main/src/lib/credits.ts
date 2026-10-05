import { useCallback, useEffect, useState } from "react";

/**
 * Daily credits apply ONLY to advanced actions (PDF / document analysis).
 * Plain text chat is free and unlimited.
 */
const STORAGE_KEY = "sbaihi-pdf-credits";
const DAILY_LIMIT = 4;

interface CreditsState {
  used: number;
  date: string; // YYYY-MM-DD
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function readStoredCredits(): CreditsState {
  if (typeof window === "undefined") return { used: 0, date: getToday() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { used: 0, date: getToday() };
    const parsed = JSON.parse(raw) as CreditsState;
    if (parsed.date !== getToday()) return { used: 0, date: getToday() };
    return parsed;
  } catch {
    return { used: 0, date: getToday() };
  }
}

function writeStoredCredits(state: CreditsState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Credits for advanced/document features only. */
export function useCredits() {
  const [used, setUsed] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUsed(readStoredCredits().used);
    setReady(true);
  }, []);

  const remaining = Math.max(0, DAILY_LIMIT - used);
  const canSpend = remaining > 0;

  const spend = useCallback(() => {
    if (!canSpend) return false;
    const next = { used: used + 1, date: getToday() };
    writeStoredCredits(next);
    setUsed(next.used);
    return true;
  }, [canSpend, used]);

  return { used, remaining, limit: DAILY_LIMIT, canSpend, spend, ready };
}
