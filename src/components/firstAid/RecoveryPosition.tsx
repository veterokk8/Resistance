import { type FC, useState, useMemo } from "react";
import { RECOVERY_STEPS,type RecoveryStep } from "../../constants/firstAidData";
import { type ScenarioResult } from "../../hooks/useFirstAid";

interface Props {
  onFinish: (result: ScenarioResult) => void;
}

// Перемешать массив (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RecoveryPosition: FC<Props> = ({ onFinish }) => {
  const shuffled  = useMemo(() => shuffle(RECOVERY_STEPS), []);
  const [order,   setOrder]   = useState<RecoveryStep[]>([]);
  const [checked, setChecked] = useState(false);
  const [result,  setResult]  = useState<boolean[]>([]);
  const [points,  setPoints]  = useState(100);
  const [errors,  setErrors]  = useState<string[]>([]);

  const addStep = (step: RecoveryStep) => {
    if (order.find((s) => s.id === step.id)) return;
    setOrder((o) => [...o, step]);
  };

  const removeStep = (id: number) => {
    if (checked) return;
    setOrder((o) => o.filter((s) => s.id !== id));
  };

  const handleCheck = () => {
    let pts = points;
    const errs: string[] = [];
    const res = order.map((step, i) => {
      const correct = RECOVERY_STEPS[i]?.id === step.id;
      if (!correct) {
        pts = Math.max(0, pts - 15);
        errs.push(`Неверный порядок: шаг ${i + 1} — "${step.text}"`);
      }
      return correct;
    });
    setResult(res);
    setPoints(pts);
    setErrors(errs);
    setChecked(true);
  };

  return (
    <div className="fa-card">
      <h2>🔄 Стабильное боковое положение</h2>
      <p className="fa-subtitle">
        Пострадавший без сознания, пульс есть. Расставьте шаги по порядку.
      </p>

      <div className="fa-dnd-layout">
        {/* Источник */}
        <div className="fa-dnd-source">
          <h4>Доступные действия:</h4>
          {shuffled.map((step) => {
            const used = !!order.find((s) => s.id === step.id);
            return (
              <button
                key={step.id}
                className={`fa-dnd-item ${used ? "fa-dnd-used" : ""}`}
                onClick={() => addStep(step)}
                disabled={used}
                style={{ fontWeight: 700, color: "#1a1a1a" }}
              >
                {step.text}
              </button>
            );
          })}
        </div>

        {/* Целевая зона */}
        <div className="fa-dnd-target">
          <h4>Ваш порядок:</h4>
          {order.length === 0 && (
            <p className="fa-placeholder">← Нажимайте на действия</p>
          )}
          {order.map((step, i) => (
            <div
              key={step.id}
              className={`fa-dnd-item fa-dnd-placed ${
                checked
                  ? result[i] ? "fa-step-correct" : "fa-step-wrong"
                  : ""
              }`}
              style={{ fontWeight: 700, color: "#1a1a1a" }}
            >
              <span className="fa-step-num">{i + 1}.</span>
              <span>{step.text}</span>
              {!checked && (
                <button
                  className="fa-remove-btn"
                  onClick={() => removeStep(step.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {order.length === RECOVERY_STEPS.length && !checked && (
        <button className="fa-finish-btn" onClick={handleCheck}>
          ✅ Проверить порядок
        </button>
      )}

      {checked && (
        <>
          <p className="fa-feedback" style={{ color: points > 60 ? "#2ed573" : "#e74c3c" }}>
            {points > 60
              ? "✅ Отлично! Пострадавший в безопасности."
              : "⚠️ Есть ошибки. Запомните правильный порядок!"}
          </p>
          <button className="fa-finish-btn" onClick={() => onFinish({ points, errors })}>
            Продолжить →
          </button>
        </>
      )}
    </div>
  );
};

export default RecoveryPosition;