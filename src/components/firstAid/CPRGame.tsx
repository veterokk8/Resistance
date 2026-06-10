import { type FC } from "react";
import { useCPR } from "../../hooks/useFirstAid";
import { type ScenarioResult } from "../../hooks/useFirstAid";
import { CPR_CONFIG } from "../../constants/firstAidData";

interface Props {
  onFinish: (result: ScenarioResult) => void;
}

const feedbackColors: Record<string, string> = {
  success: "#2ed573",
  warning: "#ffa502",
  error:   "#e74c3c",
  info:    "#3498db",
  "":      "#aaa",
};

const CPRGame: FC<Props> = ({ onFinish }) => {
  const { cprState, handleCompression, handleBreath } = useCPR(onFinish);
  const { phase, compressions, breaths, cycle, feedback, feedbackType, points } = cprState;
  const { COMPRESSIONS_PER_CYCLE, BREATHS_PER_CYCLE, TOTAL_CYCLES } = CPR_CONFIG;

  const progressValue = phase === "compressions" ? compressions : breaths;
  const progressMax   = phase === "compressions" ? COMPRESSIONS_PER_CYCLE : BREATHS_PER_CYCLE;
  const progressColor = phase === "compressions" ? "#e74c3c" : "#3498db";

  return (
    <div className="fa-card">
      <h2>🫀 Сердечно-лёгочная реанимация</h2>
      <p className="fa-subtitle">
        Цикл {cycle}/{TOTAL_CYCLES} —{" "}
        {phase === "compressions"
          ? `Нажатия: ${compressions}/${COMPRESSIONS_PER_CYCLE}`
          : `Вдохи: ${breaths}/${BREATHS_PER_CYCLE}`}
      </p>

      {/* Прогресс-бар */}
      <div className="fa-progress-wrap">
        <div
          className="fa-progress-fill"
          style={{
            width: `${Math.round((progressValue / progressMax) * 100)}%`,
            background: progressColor,
          }}
        />
      </div>

      <div className="fa-rhythm-hint">
        🎵 Ритм: «Staying Alive» — 100–120 уд/мин
      </div>

      <p
        className="fa-feedback"
        style={{ color: feedbackColors[feedbackType] }}
      >
        {feedback || (phase === "compressions"
          ? "👇 Нажимайте на грудную клетку!"
          : "💨 Делайте вдохи!")}
      </p>

      <div className="fa-actions">
        {phase === "compressions" ? (
          <button className="fa-btn fa-btn-compression" onClick={handleCompression}>
            💪 НАЖАТЬ
            <span className="fa-btn-hint">глубина 5–6 см, руки прямые</span>
          </button>
        ) : (
          <button className="fa-btn fa-btn-breath" onClick={handleBreath}>
            💨 ВДОХ
            <span className="fa-btn-hint">запрокинуть голову, зажать нос</span>
          </button>
        )}
      </div>

      <div className="fa-info-box">
        <h4>📋 Правила СЛР</h4>
        <ul>
          <li>30 нажатий → 2 вдоха (1 цикл)</li>
          <li>Частота: 100–120 нажатий/мин</li>
          <li>Глубина: 5–6 см</li>
          <li>Основание ладони — центр грудины</li>
        </ul>
      </div>

      <div className="fa-score">Очки: {points}</div>
    </div>
  );
};

export default CPRGame;