import { formatTime } from "../hooks/useTimer";

interface Props {
    seconds:    number;
    isRunning:  boolean;
    taskIndex:  number;
    totalTasks: number;
}

export function TimerDisplay({ seconds, isRunning, taskIndex, totalTasks }: Props) {
    // Цвет меняется при долгом решении
    const color = seconds > 120 ? "#ef4444"
                : seconds > 60  ? "#f59e0b"
                : "#22c55e";

    return (
        <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
            background:    "white",
            border:        `2px solid ${color}`,
            borderRadius:  "10px",
            padding:       "8px 14px",
            transition:    "border-color 0.5s",
        }}>
            <span style={{ fontSize: "18px" }}>
                {isRunning ? "⏱" : "⏸"}
            </span>
            <div>
                <div style={{
                    fontSize:   "22px",
                    fontWeight: "bold",
                    color,
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                    transition: "color 0.5s",
                }}>
                    {formatTime(seconds)}
                </div>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>
                    Задание {taskIndex + 1} из {totalTasks}
                </div>
            </div>
        </div>
    );
}