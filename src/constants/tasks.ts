import type { Task, Resistor, ConnectionType } from "../types.ts";

export const TASKS: Task[] = [
    {
        id: 1,
        description: "Собери цепь с сопротивлением 30 Ω",
        targetResistance: 30,
        hint: "Попробуй последовательно 15Ω + 15Ω",
    },
    {
        id: 2,
        description: "Собери цепь с сопротивлением 0.14 Ω",
        targetResistance: 0.14,
        hint: "Попробуй параллельно 0.2Ω и 0.5Ω",
    },
    {
        id: 3,
        description: "Собери цепь с сопротивлением 4.2 Ω",
        targetResistance: 4.2,
        hint: "Попробуй параллельно 0.5Ω и 5Ω, параллельно 15Ω и 5Ω и их последовательно",
    },
    {
        id: 4,
        description: "Собери цепь с сопротивлением 10.74 Ω",
        targetResistance: 10.74,
        hint: "Попробуй параллельно 10Ω и 0.8Ω и последовательно 10Ω",
    },
    {
        id: 5,
        description: "Собери цепь с сопротивлением 8.2 Ω",
        targetResistance: 8.2,
        hint: "Попробуй параллельно 15Ω + 15Ω и последовательно 0.5Ω + 0.2Ω",
    },
    ];

export const TOLERANCE = 0.1;

export const AVAILABLE_COMPONENTS: Resistor[] = [
    { id: "template-r1", value: 0.2,  position: { x: 0, y: 0 } },
    { id: "template-r2", value: 0.5, position: { x: 0, y: 0 } },
    { id: "template-r3", value: 0.8, position: { x: 0, y: 0 } },
    { id: "template-r4", value: 5, position: { x: 0, y: 0 } },
    { id: "template-r5", value: 10, position: { x: 0, y: 0 } },
    { id: "template-r6", value: 15,  position: { x: 0, y: 0 } },
];

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