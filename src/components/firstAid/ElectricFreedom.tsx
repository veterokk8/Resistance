import { type FC, useState } from "react";
import { ELECTRIC_STEPS } from "../../constants/firstAidData";
import { type ScenarioResult } from "../../hooks/useFirstAid";

interface Props {
  onFinish: (result: ScenarioResult) => void;
}

const ElectricFreedom: FC<Props> = ({ onFinish }) => {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [points, setPoints]     = useState(100);
  const [errors, setErrors]     = useState<string[]>([]);

  const totalCorrect   = ELECTRIC_STEPS.filter((s) => s.correct).length;

  const correctClicked = revealed.filter(
    (id) => ELECTRIC_STEPS.find((s) => s.id === id)?.correct
  ).length;
  const allCorrectSelected = correctClicked === totalCorrect;

  const handleSelect = (id: string, correct: boolean, label: string) => {
    if (revealed.includes(id)) return;
    setRevealed((r) => [...r, id]);
    if (!correct) {
      setPoints((p) => Math.max(0, p - 20));
      setErrors((e) => [...e, `Неверное действие: "${label}"`]);
    }
  };

  return (
    <div className="fa-card">
      <h2>⚡ Освобождение от действия тока</h2>
      <p className="fa-subtitle">
        Выберите все ПРАВИЛЬНЫЕ действия. Нажмите на каждую карточку.
      </p>
      <p className="fa-score">
        Правильных: {correctClicked}/{totalCorrect} | Очки: {points}
      </p>

      <div className="fa-steps-grid">
        {ELECTRIC_STEPS.map((step) => {
          const isRevealed = revealed.includes(step.id);
          return (
            <button
              key={step.id}
              className={`fa-step-btn ${
                isRevealed
                  ? step.correct ? "fa-step-correct" : "fa-step-wrong"
                  : "fa-step-default"
              }`}
              onClick={() => handleSelect(step.id, step.correct, step.label)}
              disabled={isRevealed}
            >
              <span className="fa-step-label" style={{ fontWeight: 700, color: "#1a1a1a" }}>{step.label}</span>
              {isRevealed && (
                <span className="fa-step-hint"  style={{ fontWeight: 600, color: "#333" }}>{step.hint}</span>
              )}
            </button>
          );
        })}
      </div>

      {allCorrectSelected && (
        <button className="fa-finish-btn" onClick={() => onFinish({ points, errors })}>
          Продолжить →
        </button>
      )}
    </div>
  );
};

export default ElectricFreedom;