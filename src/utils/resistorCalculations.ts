import type { Resistor } from "../types";

export function calculateSeriesResistance(resistors: Resistor[]): number {
    return resistors.reduce((sum, r) => sum + r.value, 0);
}

export function calculateParallelResistance(resistors: Resistor[]): number {
    if (resistors.length === 0) return 0;
    const inverseSum = resistors.reduce((sum, r) => sum + 1 / r.value, 0);
    return 1 / inverseSum;
}