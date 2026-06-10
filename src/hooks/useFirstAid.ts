import { useState, useCallback, useRef } from "react";
import { CPR_CONFIG } from "../constants/firstAidData";

// ===== Типы результата =====
export interface ScenarioResult {
  points: number;
  errors: string[];
}

// ===== Хук для общего состояния игры =====
export type ScenarioId = "electric" | "check" | "recovery" | "cpr";

export interface FirstAidGameState {
  screen: "menu" | "scenario" | "result";
  scenario: ScenarioId | null;
  totalScore: number;
  allErrors: string[];
}

export function useFirstAidGame() {
  const [state, setState] = useState<FirstAidGameState>({
    screen: "menu",
    scenario: null,
    totalScore: 0,
    allErrors: [],
  });

  const startScenario = useCallback((id: ScenarioId) => {
    setState((s) => ({ ...s, screen: "scenario", scenario: id }));
  }, []);

  const finishScenario = useCallback((result: ScenarioResult) => {
    setState((s) => ({
      ...s,
      screen: "result",
      totalScore: s.totalScore + result.points,
      allErrors: [...s.allErrors, ...result.errors],
    }));
  }, []);

  const restart = useCallback(() => {
    setState({ screen: "menu", scenario: null, totalScore: 0, allErrors: [] });
  }, []);

  const goToMenu = useCallback(() => {
    setState((s) => ({ ...s, screen: "menu", scenario: null }));
  }, []);

  return { state, startScenario, finishScenario, restart, goToMenu };
}

// ===== Хук для СЛР =====
export interface CPRState {
  phase: "compressions" | "breaths";
  compressions: number;
  breaths: number;
  cycle: number;
  feedback: string;
  feedbackType: "success" | "warning" | "error" | "info" | "";
  points: number;
  errors: string[];
  finished: boolean;
}

export function useCPR(onFinish: (result: ScenarioResult) => void) {
  const [cprState, setCprState] = useState<CPRState>({
    phase: "compressions",
    compressions: 0,
    breaths: 0,
    cycle: 1,
    feedback: "",
    feedbackType: "",
    points: 100,
    errors: [],
    finished: false,
  });

  const lastPressTime = useRef<number | null>(null);
  const { MIN_INTERVAL_MS, MAX_INTERVAL_MS, COMPRESSIONS_PER_CYCLE, BREATHS_PER_CYCLE, TOTAL_CYCLES } = CPR_CONFIG;

const handleCompression = useCallback(() => {
    // ✅ Читаем и пишем ref СНАРУЖИ setCprState
    const now = Date.now();
    const interval = lastPressTime.current !== null ? now - lastPressTime.current : null;
    lastPressTime.current = now;

    setCprState((prev) => {
      if (prev.phase !== "compressions" || prev.finished) return prev;

      let newPoints = prev.points;
      const newErrors = [...prev.errors];
      let feedback = "✅ Отличный ритм!";
      let feedbackType: CPRState["feedbackType"] = "success";

      // ✅ Используем interval, вычисленный снаружи
      if (interval !== null) {
        if (interval < MIN_INTERVAL_MS) {
          feedback = "⚡ Слишком быстро! Замедлитесь.";
          feedbackType = "error";
          newPoints = Math.max(0, newPoints - 5);
          newErrors.push("Слишком быстрое нажатие в СЛР");
        } else if (interval > MAX_INTERVAL_MS) {
          feedback = "🐢 Слишком медленно! Ускорьтесь.";
          feedbackType = "warning";
          newPoints = Math.max(0, newPoints - 3);
          newErrors.push("Слишком медленное нажатие в СЛР");
        }
      }

      const newCompressions = prev.compressions + 1;
      if (newCompressions >= COMPRESSIONS_PER_CYCLE) {
        lastPressTime.current = null; // ✅ сброс при переходе к вдохам
        return {
          ...prev,
          compressions: newCompressions,
          phase: "breaths",
          feedback: "💨 Теперь сделайте 2 вдоха!",
          feedbackType: "info",
          points: newPoints,
          errors: newErrors,
        };
      }

      return {
        ...prev,
        compressions: newCompressions,
        feedback,
        feedbackType,
        points: newPoints,
        errors: newErrors,
      };
    });
  }, [MIN_INTERVAL_MS, MAX_INTERVAL_MS, COMPRESSIONS_PER_CYCLE]);

  const handleBreath = useCallback(() => {
    setCprState((prev) => {
      if (prev.phase !== "breaths" || prev.finished) return prev;

      const newBreaths = prev.breaths + 1;

      if (newBreaths >= BREATHS_PER_CYCLE) {
        if (prev.cycle >= TOTAL_CYCLES) {
          // Завершение игры
          setTimeout(() => onFinish({ points: prev.points, errors: prev.errors }), 400);
          return { ...prev, breaths: newBreaths, finished: true, feedback: "🎉 СЛР завершена!" };
        }
        return {
          ...prev,
          cycle: prev.cycle + 1,
          compressions: 0,
          breaths: 0,
          phase: "compressions",
          feedback: "💪 Продолжайте нажатия!",
          feedbackType: "success",
        };
      }

      return {
        ...prev,
        breaths: newBreaths,
        feedback: "💨 Ещё один вдох!",
        feedbackType: "info",
      };
    });
  }, [BREATHS_PER_CYCLE, TOTAL_CYCLES, onFinish]);

  return { cprState, handleCompression, handleBreath };
}