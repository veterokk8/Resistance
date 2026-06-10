import type { EmergencyScenario } from '../../types';

interface Props {
  scenarios:     EmergencyScenario[];
  activeIndex:   number;
  onSwitch:      (i: number) => void;
}

export function ScenarioTabs({ scenarios, activeIndex, onSwitch }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {scenarios.map((sc, i) => (
        <button
          key={sc.id}
          onClick={() => onSwitch(i)}
          style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12,
            border:      `1px solid ${activeIndex === i ? '#3b82f6' : '#334155'}`,
            background:  activeIndex === i ? '#1d4ed8' : '#1e293b',
            color:       activeIndex === i ? '#fff'    : '#94a3b8',
            cursor:      'pointer',
            fontWeight:  activeIndex === i ? 600 : 400,
            transition:  'all 0.2s',
          }}
        >
          {i + 1}. {sc.title}
        </button>
      ))}
    </div>
  );
}