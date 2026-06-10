import { SCENARIOS } from '../../constants/scenarios';
import { SchemeCanvas }  from './SchemeCanvas';
import { useTrainer }    from './useTrainer';
import { Header }        from './Header';
import { ScenarioTabs }  from './ScenarioTabs';
import { ProgressBar }   from './ProgressBar';
import { ActionPanel }   from './ActionPanel';
import { EventLog }      from './EventLog';
import { ResultOverlay } from './ResultOverlay';

interface Props { onBack: () => void }

export function EmergencyTrainer({ onBack }: Props) {
  const {
    scenario, scenarioIndex,
    elements, log,
    completedActions, wrongCount,
    timeElapsed, isFinished, result, flashRed,
    switchScenario, performAction, handleRestart,
  } = useTrainer();

  const progress  = Math.round((completedActions.length / scenario.correctSequence.length) * 100);
  const timeLeft  = scenario.timeLimit - timeElapsed;
  const timeColor = timeLeft < 30 ? '#ef4444' : timeLeft < 60 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      color: '#e2e8f0', fontFamily: 'Inter, sans-serif', padding: 24,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <Header
          scenario={scenario}
          timeLeft={timeLeft}
          timeColor={timeColor}
          onBack={onBack}
        />

        <ScenarioTabs
          scenarios={SCENARIOS}
          activeIndex={scenarioIndex}
          onSwitch={switchScenario}
        />

        {/* Описание аварии */}
        <div style={{
          background: '#1e293b', borderRadius: 10, padding: 14,
          borderLeft: '4px solid #ef4444', marginBottom: 20,
          fontSize: 14, color: '#fca5a5',
        }}>
          🚨 <strong>Аварийная ситуация:</strong> {scenario.description}
        </div>

        <ProgressBar progress={progress} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

          {/* Левая колонка */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            <SchemeCanvas elements={elements} />
            <EventLog log={log} />

            {isFinished && result && (
              <ResultOverlay
                result={result}
                onRestart={handleRestart}
                onBack={onBack}
              />
            )}
          </div>

          {/* Правая колонка */}
          <ActionPanel
            scenario={scenario}
            completedActions={completedActions}
            flashRed={flashRed}
            isFinished={isFinished}
            wrongCount={wrongCount}
            onAction={performAction}
          />
        </div>
      </div>
    </div>
  );
}