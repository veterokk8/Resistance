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

export interface User {
    name: string;
    avatar: string; // эмодзи-аватар
}

export interface LeaderboardEntry {
    id:        string;
    name:      string;
    avatar:    string;
    totalTime: number;   // секунды
    date:      string;   // ISO-строка
    tasksCount: number;
    mode?: "resistor" | "safety" | "quiz";
    safetyScore?: number;
    safetyTime?:  number;
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

// Охрана труда


export interface SafetyTopic {
    id: string;
    label: string;
    icon: string;
}

export interface SafetyQuestion {
    id: number;
    topic: string;
    text: string;
    options: string[];
    correct: number;        // индекс правильного ответа
    // explanation: string;
    // points: number;
}

export interface SafetyResult {
    name: string;
    avatar: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    topic: string;
    date: string;
    timeSpent: number;
}

// ========== Emergency Trainer ==========
export type ElementStatus = 'normal' | 'fault' | 'disabled' | 'warning';

export interface SchemeElement {
  id: string;
  label: string;
  type: 'breaker' | 'line' | 'transformer' | 'bus';
  status: ElementStatus;
  x: number;
  y: number;
}

export interface EmergencyAction {
  id: string;
  label: string;
  targetElementId: string;
  correctOrder: number;
  effect: Partial<SchemeElement>;
}

export interface EmergencyScenario {
  id: string;
  title: string;
  description: string;
  initialElements: SchemeElement[];
  availableActions: EmergencyAction[];
  correctSequence: string[];
  timeLimit: number;
}

export interface EmergencyLogEntry {
  time: number;
  actionId: string;
  label: string;
  isCorrect: boolean;
}

export interface EmergencyResult {
  totalTime: number;
  correctActions: number;
  wrongActions: number;
  score: number;
  passed: boolean;
}