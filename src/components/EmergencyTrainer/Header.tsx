import type { EmergencyScenario } from '../../types';
import { fmt } from '../../utils/fmt';

interface Props {
  scenario:  EmergencyScenario;
  timeLeft:  number;
  timeColor: string;
  onBack:    () => void;
}

export function Header({ scenario, timeLeft, timeColor, onBack }: Props) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 16,
    }}>
      <div>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid #334155',
          color: '#94a3b8', borderRadius: 6, padding: '4px 12px',
          cursor: 'pointer', marginBottom: 8, fontSize: 13,
        }}>
          ← Назад в меню
        </button>
        <h1 style={{ margin: 0, fontSize: 22, color: '#f1f5f9' }}>
          ⚡ Тренажёр ликвидации аварий
        </h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
          {scenario.title}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 40, fontWeight: 800, color: timeColor,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {fmt(timeLeft)}
        </div>
        <div style={{ fontSize: 11, color: '#475569' }}>осталось времени</div>
      </div>
    </div>
  );
}