export interface Resistor {
    id: string;
    value: number;
    position: { x: number; y: number };
}

export interface Connection {
    id: string;
    from: { componentId: string; point: "left" | "right" };
    to:   { componentId: string; point: "left" | "right" };
}

export interface Branch {
    resistance: number;
    nodeA: string;
    nodeB: string;
}

export type ConnectionType =
    | "single"
    | "series"
    | "parallel"
    | "mixed"
    | "disconnected"
    | "empty";

export interface CircuitAnalysis {
    totalResistance: number | null;
    connectionType: ConnectionType;
}

export interface Task {
    id: number;
    description: string;
    targetResistance: number;
    hint: string;
}

export type DraggingConnection = {
    from: { componentId: string; point: "left" | "right" };
    currentPos: { x: number; y: number };
} | null;