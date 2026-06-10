import type { EmergencyScenario, EmergencyAction } from '../../types';
import { ActionButton } from './ActionButton';

interface Props {
  scenario:         EmergencyScenario;
  completedActions: string[];
  flashRed:         string | null;
  isFinished:       boolean;
  wrongCount:       number;
  onAction:         (action: EmergencyAction) => void;
}

export function ActionPanel({
  scenario, completedActions, flashRed,
  isFinished, wrongCount, onAction,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
        🎮 Доступные действия
      </h3>

      {scenario.availableActions.map(action => (
        <ActionButton
          key={action.id}
          action={action}
          isDone={completedActions.includes(action.id)}
          isFlash={flashRed === action.id}
          isFinished={isFinished}
          onClick={onAction}
        />
      ))}

      <div style={{
        marginTop: 8, padding: 12, background: '#1e293b',
        borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 2,
      }}>
        <div>❌ Ошибок: <strong style={{ color: '#ef4444' }}>{wrongCount}</strong></div>
        <div>✅ Шагов: <strong style={{ color: '#22c55e' }}>
          {completedActions.length} / {scenario.correctSequence.length}
        </strong></div>
      </div>
    </div>
  );
}