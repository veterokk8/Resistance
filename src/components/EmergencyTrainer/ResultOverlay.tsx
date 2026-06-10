import type { EmergencyResult } from '../../types';
import { fmt } from '../../utils/fmt';

interface Props {
  result:        EmergencyResult;
  onRestart:     () => void;
  onBack:        () => void;
}

export function ResultOverlay({ result, onRestart, onBack }: Props) {
  const color = result.passed ? '#22c55e' : '#ef4444';
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0f172acc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)', zIndex: 10, borderRadius: 12,
    }}>
      <div style={{
        background: '#1e293b', borderRadius: 16, padding: 40,
        textAlign: 'center', minWidth: 300,
        border:    `2px solid ${color}`,
        boxShadow: `0 0 40px ${color}44`,
      }}>
        <div style={{ fontSize: 64 }}>{result.passed ? '🏆' : '📚'}</div>
        <h2 style={{ color, margin: '12px 0 4px' }}>
          {result.passed ? 'Аттестация пройдена!' : 'Требуется повторение'}
        </h2>
        <div style={{ fontSize: 56, fontWeight: 800, color }}>
          {result.score}
          <span style={{ fontSize: 24, color: '#94a3b8' }}>/100</span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: 14, margin: '16px 0', lineHeight: 2 }}>
          <div>⏱ Время: {fmt(result.totalTime)}</div>
          <div>✅ Правильных: {result.correctActions}</div>
          <div>❌ Ошибок: {result.wrongActions}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onRestart} style={{
            padding: '10px 24px', borderRadius: 8,
            background: result.passed ? '#22c55e' : '#3b82f6',
            border: 'none', color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>
            🔄 Заново
          </button>
          <button onClick={onBack} style={{
            padding: '10px 24px', borderRadius: 8,
            background: '#334155', border: 'none',
            color: '#e2e8f0', fontSize: 14, cursor: 'pointer',
          }}>
            🏠 В меню
          </button>
        </div>
      </div>
    </div>
  );
}