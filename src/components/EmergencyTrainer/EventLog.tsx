import type { EmergencyLogEntry } from '../../types';
import { fmt } from '../../utils/fmt';

interface Props { log: EmergencyLogEntry[] }

export function EventLog({ log }: Props) {
  return (
    <div style={{
      background: '#0f172a', borderRadius: 8, padding: 12,
      maxHeight: 200, overflowY: 'auto', border: '1px solid #1e293b',
    }}>
      <h3 style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: 13 }}>
        📋 Журнал действий
      </h3>
      {log.length === 0 && (
        <p style={{ color: '#475569', fontSize: 12 }}>Действий пока нет...</p>
      )}
      {[...log].reverse().map((entry, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, alignItems: 'flex-start',
          padding: '4px 0', borderBottom: '1px solid #1e293b', fontSize: 12,
        }}>
          <span style={{ color: '#475569', minWidth: 36 }}>{fmt(entry.time)}</span>
          <span>{entry.isCorrect ? '✅' : '❌'}</span>
          <span style={{ color: entry.isCorrect ? '#86efac' : '#fca5a5' }}>
            {entry.label}
          </span>
        </div>
      ))}
    </div>
  );
}