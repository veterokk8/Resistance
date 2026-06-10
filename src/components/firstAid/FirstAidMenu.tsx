import { type FC } from "react";
import { type ScenarioId } from "../../hooks/useFirstAid";

interface Scenario {
  id: ScenarioId;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "electric",
    icon: "⚡",
    title: "Освобождение от тока",
    description: "Выберите правильные способы освободить пострадавшего",
    color: "#f0c040",
  },
  {
    id: "check",
    icon: "🔍",
    title: "Оценка пострадавшего",
    description: "Определите состояние и правильные действия",
    color: "#3498db",
  },
  {
    id: "recovery",
    icon: "🔄",
    title: "Боковое положение",
    description: "Расставьте шаги в правильном порядке",
    color: "#2ed573",
  },
  {
    id: "cpr",
    icon: "🫀",
    title: "СЛР: 30 + 2",
    description: "Проведите сердечно-лёгочную реанимацию",
    color: "#e74c3c",
  },
];

interface Props {
  onSelect: (id: ScenarioId) => void;
  onBack: () => void;
}

const FirstAidMenu: FC<Props> = ({ onSelect, onBack }) => (
  <div className="fa-card">
    <button className="fa-back-btn" onClick={onBack}>← Назад</button>
    <h2>🚑 Первая помощь при электротравме</h2>
    <p className="fa-subtitle">Выберите сценарий для тренировки</p>

    <div className="fa-scenario-grid">
      {SCENARIOS.map((s) => (
        <button
          key={s.id}
          className="fa-scenario-card"
          style={{ borderColor: s.color }}
          onClick={() => onSelect(s.id)}
        >
          <span className="fa-scenario-icon">{s.icon}</span>
          <span className="fa-scenario-title" style={{ color: s.color }}>
            {s.title}
          </span>
          <span className="fa-scenario-desc">{s.description}</span>
        </button>
      ))}
    </div>
  </div>
);

export default FirstAidMenu;