import type { Task, ConnectionType } from "../types";

export const TASKS: Task[] = [
    {
        id: 1,
        description: "Собери цепь с сопротивлением 15 Ω",
        targetResistance: 15,
        hint: "Попробуй один резистор 15Ω или последовательно 5Ω + 10Ω",
    },
    {
        id: 2,
        description: "Собери цепь с сопротивлением 30 Ω",
        targetResistance: 30,
        hint: "Попробуй последовательно 10Ω + 20Ω или один резистор 30Ω",
    },
    {
        id: 3,
        description: "Собери цепь с сопротивлением 6 Ω",
        targetResistance: 6,
        hint: "Попробуй параллельно 10Ω и 15Ω",
    },
    {
        id: 4,
        description: "Собери цепь с сопротивлением 4 Ω",
        targetResistance: 4,
        hint: "Попробуй параллельно 20Ω и 5Ω",
    },
    {
        id: 5,
        description: "Собери цепь с сопротивлением 50 Ω",
        targetResistance: 50,
        hint: "Попробуй последовательно 5Ω + 15Ω + 30Ω",
    },
    {
        id: 6,
        description: "Собери цепь с сопротивлением 17 Ω",
        targetResistance: 17,
        hint: "Попробуй последовательно 5Ω + 10Ω + 2Ω",
    },
];

export const TOLERANCE = 0.1;

export const CONNECTION_LABELS: Record<ConnectionType, string> = {
    empty:        "Нет компонентов",
    single:       "Один компонент",
    series:       "⛓ Последовательное",
    parallel:     "⟺ Параллельное",
    mixed:        "⚡ Смешанное",
    disconnected: "⚠️ Есть несвязанные",
};

export const CONNECTION_COLORS: Record<ConnectionType, string> = {
    empty:        "#888",
    single:       "#555",
    series:       "#0a7",
    parallel:     "#07a",
    mixed:        "#a70",
    disconnected: "#e44",
};