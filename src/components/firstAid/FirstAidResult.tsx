import { type FC } from "react";

interface Props {
  score: number;
  errors: string[];
  onRetry: () => void;
  onMenu: () => void;
}

const FirstAidResult: FC<Props> = ({ score, errors, onRetry, onMenu }) => {
  const grade =
    score >= 90 ? { label: "Отлично! 🏆", color: "#2ed573" } :
    score >= 60 ? { label: "Хорошо! 👍",  color: "#f0c040" } :
                  { label: "Нужно повторить ⚠️", color: "#e74c3c" };

  return (
    <div className="fa-card">
      <h2>📊 Результат</h2>
      <div className="fa-result-score" style={{ color: grade.color }}>
        {score} очков
      </div>
      <p className="fa-result-grade" style={{ color: grade.color }}>
        {grade.label}
      </p>

      {errors.length > 0 && (
        <div className="fa-errors-box">
          <h4>❌ Ошибки ({errors.length}):</h4>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="fa-result-actions">
        <button className="fa-finish-btn" onClick={onRetry}>
          🔄 Ещё раз
        </button>
        <button className="fa-back-btn" onClick={onMenu}>
          🏠 В меню
        </button>
      </div>
    </div>
  );
};

export default FirstAidResult;