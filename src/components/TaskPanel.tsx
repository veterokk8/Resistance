import type { Task }          from "../types";
import { TOLERANCE }   from "../constants/tasks";

interface Props {
    task:              Task;
    currentResistance: number | null;
    taskIndex:         number;
    totalTasks:        number;
    showHint:          boolean;
    onNext:            () => void;
    onPrev:            () => void;
    onReset:           () => void;
    onToggleHint:      () => void;
     isLastTask: boolean;
    isSuccess:  boolean;
}

export function TaskPanel({
    task, currentResistance, taskIndex, totalTasks,
    showHint, onNext, onPrev, onReset, onToggleHint,
    isLastTask
}: Props) {
    const diff = currentResistance !== null
        ? Math.abs(currentResistance - task.targetResistance)
        : null;

    const isSuccess = diff !== null && diff <= TOLERANCE;
    const isClose   = diff !== null && !isSuccess && diff <= 5;

    const progressPercent = currentResistance !== null
        ? Math.max(0, Math.min(100,
            100 - (Math.abs(currentResistance - task.targetResistance) / task.targetResistance) * 100
          ))
        : 0;

    return (
        <div
            style={{
                width:         "220px",
                border:        `2px solid ${isSuccess ? "#22c55e" : "#6366f1"}`,
                borderRadius:  "12px",
                padding:       "16px",
                background:    isSuccess
                    ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                    : "linear-gradient(135deg, #f8f9ff, #eef2ff)",
                display:       "flex",
                flexDirection: "column",
                gap:           "12px",
                boxShadow:     isSuccess
                    ? "0 0 20px rgba(34,197,94,0.4)"
                    : "0 2px 8px rgba(99,102,241,0.15)",
                transition:    "all 0.3s ease",
            }}
        >
            {/* Заголовок + индикаторы */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "14px", color: "#4338ca" }}>
                    🎯 Задание {taskIndex + 1}/{totalTasks}
                </h3>
                <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: totalTasks }).map((_, i) => (
                        <div key={i} style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            background: i === taskIndex ? "#6366f1" : "#c7d2fe",
                        }} />
                    ))}
                </div>
            </div>

            {/* Описание */}
            <div style={{ background: "white", borderRadius: "8px", padding: "10px", border: "1px solid #e0e7ff" }}>
                <div style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                    {task.description}
                </div>
            </div>

            {/* Цель */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#eef2ff", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "12px", color: "#6366f1" }}>Цель:</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#4338ca" }}>
                    {task.targetResistance} Ω
                </span>
            </div>

            {/* Текущее значение */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                background: isSuccess ? "#dcfce7" : isClose ? "#fef9c3" : "#f3f4f6",
                borderRadius: "8px", padding: "8px 12px", transition: "background 0.3s" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Сейчас:</span>
                <span style={{ fontSize: "22px", fontWeight: "bold", transition: "color 0.3s",
                    color: isSuccess ? "#16a34a" : isClose ? "#ca8a04" : "#374151" }}>
                    {currentResistance !== null ? `${currentResistance.toFixed(2)} Ω` : "—"}
                </span>
            </div>

            {/* Прогресс-бар */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between",
                    fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                    <span>Точность</span>
                    <span>{diff !== null ? `Δ = ${diff.toFixed(2)} Ω` : ""}</span>
                </div>
                <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                        height:     "100%",
                        width:      `${progressPercent}%`,
                        background: isSuccess ? "#22c55e" : isClose ? "#eab308" : "#6366f1",
                        borderRadius: "4px",
                        transition: "width 0.4s ease, background 0.3s",
                    }} />
                </div>
            </div>

            {/* Успех */}
            {isSuccess && (
                <div style={{ background: "#22c55e", color: "white", borderRadius: "8px",
                    padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px" }}>🎉</div>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>Отлично! Задание выполнено!</div>
                    <div style={{ fontSize: "11px", opacity: 0.9, marginTop: "4px" }}>
                        Погрешность: ±{diff!.toFixed(3)} Ω
                    </div>
                </div>
            )}

            {/* Подсказка */}
            <div>
                <button onClick={onToggleHint} style={{
                    width: "100%", padding: "6px", background: "transparent",
                    border: "1px dashed #a5b4fc", borderRadius: "6px",
                    cursor: "pointer", fontSize: "12px", color: "#6366f1",
                }}>
                    {showHint ? "🙈 Скрыть подсказку" : "💡 Показать подсказку"}
                </button>
                {showHint && (
                    <div style={{ marginTop: "6px", padding: "8px", background: "#fefce8",
                        border: "1px solid #fde68a", borderRadius: "6px",
                        fontSize: "12px", color: "#92400e" }}>
                        {task.hint}
                    </div>
                )}
            </div>

            {/* Навигация */}
            <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={onPrev} disabled={taskIndex === 0} style={{
                    flex: 1, padding: "8px",
                    background: taskIndex === 0 ? "#e5e7eb" : "#e0e7ff",
                    border: "none", borderRadius: "6px",
                    cursor: taskIndex === 0 ? "not-allowed" : "pointer",
                    fontSize: "12px", fontWeight: "500",
                    color: taskIndex === 0 ? "#9ca3af" : "#4338ca",
                }}>← Назад</button>

                <button onClick={onReset} title="Очистить схему" style={{
                    padding: "8px 10px", background: "#fee2e2",
                    border: "none", borderRadius: "6px",
                    cursor: "pointer", fontSize: "12px", color: "#dc2626",
                }}>🗑</button>

                <button
    onClick={onNext}
    disabled={taskIndex === totalTasks - 1 && !isSuccess}
    style={{
        flex:         1,
        padding:      "8px",
        background:   isLastTask && isSuccess
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : taskIndex === totalTasks - 1
            ? "#e5e7eb"
            : "#e0e7ff",
        border:       "none",
        borderRadius: "6px",
        cursor:       (taskIndex === totalTasks - 1 && !isSuccess)
            ? "not-allowed"
            : "pointer",
        fontSize:     "12px",
        fontWeight:   "500",
        color:        isLastTask && isSuccess
            ? "white"
            : taskIndex === totalTasks - 1
            ? "#9ca3af"
            : "#4338ca",
    }}
>
    {isLastTask && isSuccess ? "🏆 Завершить" : "Вперёд →"}
</button>
            </div>
        </div>
    );
}
