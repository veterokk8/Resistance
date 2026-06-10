import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SchemeElement, EmergencyAction,
  EmergencyLogEntry, EmergencyResult,
} from '../../types';
import { SCENARIOS } from '../../constants/scenarios';
import { calcResult } from '../../utils/calcResult';

export function useTrainer() {
  const [scenarioIndex,    setScenarioIndex]    = useState(0);
  const scenario = SCENARIOS[scenarioIndex];

  const [elements,         setElements]         = useState<SchemeElement[]>(scenario.initialElements);
  const [log,              setLog]              = useState<EmergencyLogEntry[]>([]);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [wrongCount,       setWrongCount]       = useState(0);
  const [timeElapsed,      setTimeElapsed]      = useState(0);
  const [isFinished,       setIsFinished]       = useState(false);
  const [result,           setResult]           = useState<EmergencyResult | null>(null);
  const [flashRed,         setFlashRed]         = useState<string | null>(null);

  const timerRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Refs для доступа к актуальным значениям внутри таймера ──
  const completedActionsRef = useRef(completedActions);
  const wrongCountRef       = useRef(wrongCount);
  const scenarioRef         = useRef(scenario);

  // Синхронизируем refs при каждом рендере
  useEffect(() => { completedActionsRef.current = completedActions; }, [completedActions]);
  useEffect(() => { wrongCountRef.current       = wrongCount;       }, [wrongCount]);
  useEffect(() => { scenarioRef.current         = scenario;         }, [scenario]);

  // ── Таймер ──
  function startTimer(limit: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= limit) {
          clearInterval(timerRef.current!);
          // ✅ Считаем результат здесь, через refs — без отдельного useEffect
          setIsFinished(true);
          setResult(
            calcResult(
              prev,
              completedActionsRef.current,
              wrongCountRef.current,
              scenarioRef.current,
            ),
          );
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startTimer(scenario.timeLimit);
    return () => clearInterval(timerRef.current!);
  }, [scenario.timeLimit]);

  // ── Переключение сценария ──
  function switchScenario(index: number) {
    clearInterval(timerRef.current!);
    const next = SCENARIOS[index];
    setScenarioIndex(index);
    setElements(next.initialElements);
    setLog([]);
    setCompletedActions([]);
    setWrongCount(0);
    setTimeElapsed(0);
    setIsFinished(false);
    setResult(null);
    setFlashRed(null);
    startTimer(next.timeLimit);
  }

  // ── Действие оператора ──
  const performAction = useCallback((action: EmergencyAction) => {
    if (isFinished) return;

    const nextCorrectId = scenario.correctSequence[completedActions.length];
    const isCorrect     = action.id === nextCorrectId;

    setElements(els => els.map(el =>
      el.id === action.targetElementId ? { ...el, ...action.effect } : el,
    ));

    setLog(l => [...l, {
      time:     timeElapsed,
      actionId: action.id,
      label:    action.label,
      isCorrect,
    }]);

    if (!isCorrect) {
      setWrongCount(w => w + 1);
      setFlashRed(action.id);
      setTimeout(() => setFlashRed(null), 800);
      return;
    }

    const newCompleted = [...completedActions, action.id];
    setCompletedActions(newCompleted);

    if (newCompleted.length === scenario.correctSequence.length) {
      clearInterval(timerRef.current!);
      setIsFinished(true);
      // ✅ Результат считается прямо здесь — никакого useEffect не нужно
      setResult(calcResult(timeElapsed, newCompleted, wrongCount, scenario));
    }
  }, [isFinished, completedActions, timeElapsed, wrongCount, scenario]);

  // ── Перезапуск ──
  function handleRestart() {
    clearInterval(timerRef.current!);
    setElements(scenario.initialElements);
    setLog([]);
    setCompletedActions([]);
    setWrongCount(0);
    setTimeElapsed(0);
    setIsFinished(false);
    setResult(null);
    setFlashRed(null);
    startTimer(scenario.timeLimit);
  }

  return {
    scenario, scenarioIndex,
    elements, log,
    completedActions, wrongCount,
    timeElapsed, isFinished, result, flashRed,
    switchScenario, performAction, handleRestart,
  };
}