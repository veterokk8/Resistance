import { type FC, useState } from "react";
import { VICTIM_CHECKS, type QuizOption } from "../../constants/firstAidData";
import { type ScenarioResult } from "../../hooks/useFirstAid";

interface Props {
  onFinish: (result: ScenarioResult) => void;
}

const CheckVictim: FC<Props> = ({ onFinish }) => {
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<QuizOption | null>(null);
  const [points,   setPoints]   = useState(100);
  const [errors,   setErrors]   = useState<string[]>([]);

  const question = VICTIM_CHECKS[current];

  const handleAnswer = (opt: QuizOption) => {
    if (selected) return;
    setSelected(opt);
    if (!opt.correct) {
      setPoints((p) => Math.max(0, p - 25));
      setErrors((e) => [...e, `Неверный ответ: "${opt.text}" (${question.question})`]);
    }
  };

  const handleNext = () => {
    if (current + 1 >= VICTIM_CHECKS.length) {
      onFinish({ points, errors });
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="fa-card">
      <h2>🔍 Оценка состояния пострадавшего</h2>
      <p className="fa-subtitle">
        Вопрос {current + 1} из {VICTIM_CHECKS.length}
      </p>

      {/* Прогресс вопросов */}
      <div className="fa-progress-wrap">
        <div
          className="fa-progress-fill"
          style={{
            width: `${((current + 1) / VICTIM_CHECKS.length) * 100}%`,
            background: "#f0c040",
          }}
        />
      </div>

      <div className="fa-question-box">
        <h3>{question.question}</h3>
        <div className="fa-options-grid">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`fa-option-btn ${
                selected
                  ? opt.correct
                    ? "fa-option-correct"
                    : selected === opt
                    ? "fa-option-wrong"
                    : "fa-option-disabled"
                  : "fa-option-default"
              }`}
              onClick={() => handleAnswer(opt)}
              disabled={!!selected}
              style={{ fontWeight: 700, color: "#1a1a1a" }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <div className={`fa-explanation ${selected.correct ? "fa-expl-good" : "fa-expl-bad"}`}>
            <strong>{selected.correct ? "✅ Верно!" : "❌ Неверно!"}</strong>
            <p>{question.explanation}</p>
          </div>
          <button className="fa-finish-btn" onClick={handleNext}>
            {current + 1 >= VICTIM_CHECKS.length ? "Завершить →" : "Следующий →"}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckVictim;