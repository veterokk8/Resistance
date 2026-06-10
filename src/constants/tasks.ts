import type { Task, Resistor, ConnectionType } from "../types.ts";

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
    {
        id: 7,
        description: "Собери цепь с сопротивлением 11 Ω",
        targetResistance: 11,
        hint: "Попробуй параллельно 5Ω + 20Ω и последовательно 2Ω + 5Ω",
    },
    ];

export const TOLERANCE = 0.1;

export const AVAILABLE_COMPONENTS: Resistor[] = [
    { id: "template-r1", value: 5,  position: { x: 0, y: 0 } },
    { id: "template-r6", value: 2,  position: { x: 0, y: 0 } },
    { id: "template-r2", value: 10, position: { x: 0, y: 0 } },
    { id: "template-r3", value: 15, position: { x: 0, y: 0 } },
    { id: "template-r4", value: 20, position: { x: 0, y: 0 } },
    { id: "template-r5", value: 30, position: { x: 0, y: 0 } },
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