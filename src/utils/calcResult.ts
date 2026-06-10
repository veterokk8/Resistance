import type { EmergencyScenario, EmergencyResult } from '../types';

export function calcResult(
  timeElapsed: number,
  completedActions: string[],
  wrongCount: number,
  scenario: EmergencyScenario,
): EmergencyResult {
  const total       = scenario.correctSequence.length;
  const timePenalty = Math.floor((timeElapsed / scenario.timeLimit) * 20);
  const wrongPenalty = wrongCount * 10;
  const score = Math.max(
    0,
    Math.round((completedActions.length / total) * 100 - wrongPenalty - timePenalty),
  );
  return {
    totalTime:      timeElapsed,
    correctActions: completedActions.length,
    wrongActions:   wrongCount,
    score,
    passed:         score >= 70,
  };
}