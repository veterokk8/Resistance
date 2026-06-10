import { SAFETY_TOPICS } from "../constants/safetyData";

interface Props {
    onSelectTopic: (topicId: string) => void;
    onBack: () => void;
}

export function SafetyTopicScreen({ onSelectTopic, onBack }: Props) {
    return (
        <div className="topic-screen">

            {/* Шапка */}
            <div className="topic-header">
                <button className="back-btn" onClick={onBack}>← Назад</button>
                <h2>Охрана труда</h2>
                <p>Выбери тему для проверки знаний</p>
            </div>

            {/* Список тем */}
            <div className="topic-list">
                {SAFETY_TOPICS.map(topic => (
                    <button
                        key={topic.id}
                        className="topic-card"
                        onClick={() => onSelectTopic(topic.id)}
                    >
                        <span className="topic-icon">{topic.icon}</span>
                        <span className="topic-label">{topic.label}</span>
                        <span className="topic-arrow">→</span>
                    </button>
                ))}
            </div>

        </div>
    );
}