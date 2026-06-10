import { useState } from "react";
import type { User } from "../types";

const AVATARS = ["🧑‍🔬", "👩‍🔬", "🧑‍💻", "👩‍💻", "🤖", "👾", "⚡", "🔬"];

interface Props {
    onLogin: (user: User) => void;
}

export function AuthScreen({ onLogin }: Props) {
    const [name,   setName]   = useState("");
    const [avatar, setAvatar] = useState(AVATARS[0]);
    const [error,  setError]  = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            setError("Имя должно содержать минимум 2 символа");
            return;
        }
        if (trimmed.length > 20) {
            setError("Имя не должно превышать 20 символов");
            return;
        }
        onLogin({ name: trimmed, avatar });
    }

    return (
        <div style={{
            minHeight:      "100vh",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontFamily:     "sans-serif",
        }}>
            <div style={{
                background:    "white",
                borderRadius:  "20px",
                padding:       "40px",
                width:         "360px",
                boxShadow:     "0 20px 60px rgba(0,0,0,0.3)",
            }}>
                {/* Заголовок */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>⚡</div>
                    <h1 style={{ margin: 0, fontSize: "22px", color: "#4338ca" }}>
                        Давай поиграем
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: "13px" }}>
                        Введи своё имя, чтобы начать
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Выбор аватара */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display:      "block",
                            fontSize:     "13px",
                            color:        "#374151",
                            fontWeight:   "600",
                            marginBottom: "8px",
                        }}>
                            Выбери аватар
                        </label>
                        <div style={{
                            display:       "flex",
                            gap:           "8px",
                            flexWrap:      "wrap",
                            justifyContent: "center",
                        }}>
                            {AVATARS.map(a => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAvatar(a)}
                                    style={{
                                        width:        "48px",
                                        height:       "48px",
                                        fontSize:     "24px",
                                        borderRadius: "12px",
                                        border:       avatar === a
                                            ? "3px solid #6366f1"
                                            : "2px solid #e5e7eb",
                                        background:   avatar === a ? "#eef2ff" : "white",
                                        cursor:       "pointer",
                                        transition:   "all 0.15s",
                                        transform:    avatar === a ? "scale(1.1)" : "scale(1)",
                                    }}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Поле имени */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display:      "block",
                            fontSize:     "13px",
                            color:        "#374151",
                            fontWeight:   "600",
                            marginBottom: "8px",
                        }}>
                            Твоё имя
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(""); }}
                            placeholder="Например: Иван"
                            style={{
                                width:        "100%",
                                padding:      "12px 16px",
                                fontSize:     "15px",
                                border:       `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
                                borderRadius: "10px",
                                outline:      "none",
                                boxSizing:    "border-box",
                                transition:   "border-color 0.2s",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6366f1")}
                            onBlur={e  => (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")}
                            autoFocus
                        />
                        {error && (
                            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#ef4444" }}>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Кнопка */}
                    <button
                        type="submit"
                        style={{
                            width:        "100%",
                            padding:      "14px",
                            background:   "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color:        "white",
                            border:       "none",
                            borderRadius: "10px",
                            fontSize:     "15px",
                            fontWeight:   "bold",
                            cursor:       "pointer",
                            transition:   "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                        🚀 Начать игру
                    </button>
                </form>
            </div>
        </div>
    );
}