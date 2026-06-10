interface Props { progress: number }

export function ProgressBar({ progress }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: '#64748b', marginBottom: 4,
      }}>
        <span>Прогресс ликвидации</span>
        <span>{progress}%</span>
      </div>
      <div style={{ height: 6, background: '#1e293b', borderRadius: 3 }}>
        <div style={{
          height: '100%', borderRadius: 3, width: `${progress}%`,
          background:  'linear-gradient(90deg, #3b82f6, #22c55e)',
          transition:  'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}