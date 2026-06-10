import { useSafetyQuiz } from "../hooks/useSafetyQuiz";
import { formatTime }    from "../hooks/useTimer";
import { SAFETY_QUESTIONS } from "../constants/safetyData";
import type { User, SafetyResult } from "../types";

interface Props {
    topicId:  string;
    user:     User;
    onFinish: (result: SafetyResult) => void;
}

export function SafetyQuizScreen({ topicId, user, onFinish }: Props) {
    const questions = SAFETY_QUESTIONS.filter(q => q.topic === topicId);

    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        score,
        elapsed,          // ← новое имя
        selectedOption,
        wrongFlash,
        handleAnswer,
    } = useSafetyQuiz({ questions, user, topicId, onFinish });

    if (questions.length === 0) {
        return <div>Вопросы не найдены для топика: {topicId}</div>;
    }

    return (
        <div className={`quiz-screen ${wrongFlash ? "quiz-screen--wrong" : ""}`}>

            {/* Шапка */}
            <div className="quiz-header">
                <span>Вопрос {currentIndex + 1} / {totalQuestions}</span>

                {/* Таймер вверх — красный если есть штраф (> чистого времени) */}
                <span className="quiz-timer">
                    ⏱ {formatTime(elapsed)}
                </span>

                <span>⭐ {score}</span>
            </div>

            {/* Прогресс-бар по вопросам */}
            <div className="quiz-progress-bar">
                <div
                    className="quiz-progress-fill"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            {/* Вопрос */}
            <p className="quiz-text">{currentQuestion.text}</p>

            {/* Варианты */}
            <div className="quiz-options">
                {currentQuestion.options.map((option, index) => {
                    let modifier = "";
                    if (selectedOption !== null) {
                        if (index === currentQuestion.correct) modifier = "quiz-option--correct";
                        else if (index === selectedOption)     modifier = "quiz-option--wrong";
                    }
                    return (
                        <button
                            key={index}
                            className={`quiz-option ${modifier}`}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedOption !== null}
                        >
                            <span>{["А", "Б", "В", "Г"][index]}</span>
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}