import { useState } from "react";
import { TASKS }       from "../constants/tasks";
import { formatTime }  from "../hooks/useTimer";
import type { LeaderboardEntry, User } from "../types";

interface Props {
    user:             User;
    totalTime:        number;
    resistorEntries:  LeaderboardEntry[];   // ← раздельные списки
    safetyEntries:    LeaderboardEntry[];
    onRestart:        () => void;
    onClear:          (mode: "resistor" | "safety") => void;
    mode:             "resistor" | "safety";
    onBack:    () => void;
}

const MEDALS   = ["🥇", "🥈", "🥉"];
const GAME_META = {
    resistor: { icon: "⚡", title: "Резисторы",    finish: "Все задания выполнены!" },
    safety:   { icon: "🦺", title: "Охрана труда", finish: "Тест завершён!"         },
};

export function LeaderboardScreen({
    user, totalTime, resistorEntries, safetyEntries, onRestart, onClear, mode,onBack
}: Props) {

    // Активная вкладка — по умолчанию та, в которой только что сыграли
    const [activeTab, setActiveTab] = useState<"resistor" | "safety">(mode);

    const entries  = activeTab === "resistor" ? resistorEntries : safetyEntries;

    // Ищем себя в активной вкладке
    const myIndex = entries.findIndex(e => {
        if (e.name !== user.name) return false;
        return activeTab === "safety"
            ? e.safetyTime === entries.find(x => x.name === user.name)?.safetyTime
            : e.totalTime  === totalTime;
    });

    const tabStyle = (tab: "resistor" | "safety") => ({
        flex:         1,
        padding:      "8px",
        border:       "none",
        borderBottom: activeTab === tab ? "3px solid #6366f1" : "3px solid transparent",
        background:   "transparent",
        color:        activeTab === tab ? "#4338ca" : "#9ca3af",
        fontWeight:   activeTab === tab ? "bold" : "normal" as const,
        cursor:       "pointer",
        fontSize:     "14px",
        transition:   "all 0.2s",
    });

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "sans-serif", padding: "20px",
        }}>
            <div style={{
                background: "white", borderRadius: "20px", padding: "32px",
                width: "460px", maxWidth: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
                   <button
        onClick={onBack}
        style={{
            background: "none",
            border: "1px solid #e5e7eb",
            color: "#6b7280",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            marginBottom: 16,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 4,
        }}
    >
          ← Назад в меню
        </button>

                {/* Шапка */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "56px" }}>🏆</div>
                    <h2 style={{ margin: "8px 0 4px", color: "#4338ca", fontSize: "22px" }}>
                        {GAME_META[mode].icon} {GAME_META[mode].finish}
                    </h2>
                    <p style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "13px" }}>
                        {user.avatar} {user.name}
                    </p>

                    {/* Итоговое время текущей игры */}
                    <div style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                        border: "2px solid #6366f1", borderRadius: "16px", padding: "16px 40px",
                    }}>
                        <div style={{ fontSize: "12px", color: "#6366f1", marginBottom: "4px" }}>
                            {mode === "safety" ? "Итоговое время (с штрафами)" : "Общее время"}
                        </div>
                        <div style={{
                            fontSize: "42px", fontWeight: "bold", color: "#4338ca",
                            fontVariantNumeric: "tabular-nums", lineHeight: 1,
                        }}>
                            {formatTime(totalTime)}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                            {mode === "safety"
                                ? `${safetyEntries.find(e => e.name === user.name)?.safetyScore ?? 0} / ${safetyEntries.find(e => e.name === user.name)?.tasksCount ?? 0} правильных`
                                : `${TASKS.length} заданий пройдено`
                            }
                        </div>
                    </div>
                </div>

                {/* ===== Вкладки ===== */}
                <div style={{
                    display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "16px",
                }}>
                    <button style={tabStyle("resistor")} onClick={() => setActiveTab("resistor")}>
                        ⚡ Резисторы
                    </button>
                    <button style={tabStyle("safety")} onClick={() => setActiveTab("safety")}>
                        🦺 Охрана труда
                    </button>
                </div>

                {/* Таблица лидеров активной вкладки */}
                <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "13px", color: "#4338ca" }}>
                        🏅 Топ — {GAME_META[activeTab].title}
                    </h4>

                    {entries.length === 0 ? (
                        <p style={{ color: "#9ca3af", fontSize: "13px", textAlign: "center" }}>
                            Пока нет записей
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {entries.map((entry, i) => {
                                const isMe = i === myIndex;
                                return (
                                    <div key={i} style={{
                                        display: "flex", alignItems: "center", gap: "10px",
                                        padding: "10px 14px", borderRadius: "10px",
                                        background: isMe
                                            ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
                                            : i === 0 ? "#fffbeb" : "#f9fafb",
                                        border: isMe ? "2px solid #6366f1" : "1px solid #e5e7eb",
                                    }}>
                                        <span style={{
                                            fontSize: i < 3 ? "20px" : "14px",
                                            minWidth: "28px", textAlign: "center",
                                            color: "#6b7280", fontWeight: "bold",
                                        }}>
                                            {i < 3 ? MEDALS[i] : `${i + 1}.`}
                                        </span>

                                        <span style={{ fontSize: "20px" }}>{entry.avatar}</span>

                                        <span style={{
                                            flex: 1, fontSize: "14px",
                                            fontWeight: isMe ? "bold" : "normal",
                                            color: isMe ? "#4338ca" : "#374151",
                                        }}>
                                            {entry.name}
                                            {isMe && (
                                                <span style={{
                                                    marginLeft: "6px", fontSize: "10px",
                                                    background: "#6366f1", color: "white",
                                                    padding: "1px 6px", borderRadius: "10px",
                                                }}>
                                                    ВЫ
                                                </span>
                                            )}
                                        </span>

                                        {/* Для safety — время + очки; для резисторов — время */}
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{
                                                fontSize: "15px", fontWeight: "bold",
                                                color: i === 0 ? "#d97706" : "#374151",
                                                fontVariantNumeric: "tabular-nums",
                                            }}>
                                                {activeTab === "safety"
                                                    ? formatTime(entry.safetyTime ?? entry.totalTime)
                                                    : formatTime(entry.totalTime)
                                                }
                                            </div>
                                            {activeTab === "safety" && (
                                                <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                                                    {entry.safetyScore ?? 0}/{entry.tasksCount ?? 0} ✓
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Кнопки */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={onRestart} style={{
                        flex: 1, padding: "12px",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "white", border: "none", borderRadius: "10px",
                        fontSize: "14px", fontWeight: "bold", cursor: "pointer",
                    }}>
                        🔄 Играть снова
                    </button>
                    <button
                        onClick={() => onClear(activeTab)}   // ← очищает активную вкладку
                        title={`Очистить таблицу ${GAME_META[activeTab].title}`}
                        style={{
                            padding: "12px 16px", background: "#fee2e2",
                            color: "#dc2626", border: "none", borderRadius: "10px",
                            fontSize: "14px", cursor: "pointer",
                        }}
                    >
                        🗑
                    </button>
                </div>

            </div>
        </div>
    );
}