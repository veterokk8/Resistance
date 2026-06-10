import type { EmergencyAction } from '../../types';

interface Props {
  action:     EmergencyAction;
  isDone:     boolean;
  isFlash:    boolean;
  isFinished: boolean;
  onClick:    (action: EmergencyAction) => void;
}

export function ActionButton({ action, isDone, isFlash, isFinished, onClick }: Props) {
  const isWrong = action.correctOrder === 99;

  const border = isFlash
    ? '2px solid #ef4444'
    : `1px solid ${isDone ? '#22c55e' : isWrong ? '#7f1d1d' : '#334155'}`;

  const background = isFlash
    ? '#3b0a0a'
    : isDone ? '#14532d' : isWrong ? '#1c0a0a' : '#1e293b';

  const color = isFlash
    ? '#ef4444'
    : isDone ? '#86efac' : isWrong ? '#fca5a5' : '#e2e8f0';

  return (
    <button
      onClick={() => onClick(action)}
      disabled={isDone || isFinished}
      style={{
        padding: '10px 14px', borderRadius: 8,
        border, background, color,
        cursor:     isDone || isFinished ? 'not-allowed' : 'pointer',
        textAlign:  'left', fontSize: 13,
        opacity:    isDone ? 0.6 : 1,
        boxShadow:  isFlash ? '0 0 16px #ef444488' : 'none',
        transform:  isFlash ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s ease',
      }}
    >
      {isDone ? '✅ ' : isFlash ? '❌ ' : ''}{action.label}
    </button>
  );
}