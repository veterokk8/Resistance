import { useState, useRef }          from "react";
import { DndContext, DragOverlay }    from "@dnd-kit/core";

import { TASKS, AVAILABLE_COMPONENTS } from "./constants/tasks";
import { analyzeCircuit }              from "./utils/circuitAnalysis";
import { useConnections }              from "./hooks/useConnections";
import { useDragHandlers }             from "./hooks/useDragHandlers";

import { Board }              from "./components/Board";
import { DraggableResistor }  from "./components/DraggableResistor";
import { CircuitResults }     from "./components/CircuitResults";
import { TaskPanel }          from "./components/TaskPanel";
import type { Resistor }      from "./types";

export default function App() {
    const boardRef = useRef<HTMLDivElement | null>(null);

    const [placedComponents, setPlacedComponents] = useState<Resistor[]>([]);
    const [taskIndex, setTaskIndex]               = useState(0);
    const [showHint, setShowHint]                 = useState(false);

    const {
        connections,
        draggingConnection,
        handleConnectionStart,
        handleConnectionEnd,
        handleMouseMove,
        handleMouseUp,
        resetConnections,
    } = useConnections(boardRef);

    const { activeId, handleDragStart, handleDragEnd } = useDragHandlers(
        placedComponents,
        setPlacedComponents,
        boardRef,
        draggingConnection
    );

    const { totalResistance } = analyzeCircuit(placedComponents, connections);

    function handleReset() {
        setPlacedComponents([]);
        resetConnections();
        setShowHint(false);
    }

    function handleNextTask() {
        if (taskIndex < TASKS.length - 1) { setTaskIndex((i) => i + 1); handleReset(); }
    }

    function handlePrevTask() {
        if (taskIndex > 0) { setTaskIndex((i) => i - 1); handleReset(); }
    }

    const activeComponent =
        activeId
            ? AVAILABLE_COMPONENTS.find((c) => c.id === activeId) ??
              placedComponents.find((c) => c.id === activeId)
            : null;

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{ fontFamily: "sans-serif", padding: "16px" }}>

                {/* Заголовок */}
                <div style={{ marginBottom: "16px", padding: "12px 20px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius: "10px", color: "white" }}>
                    <h2 style={{ margin: 0, fontSize: "18px" }}>⚡ Конструктор электрических цепей</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.85 }}>
                        Перетаскивай резисторы на поле и соединяй их зелёными точками
                    </p>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {/* Панель компонентов */}
                    <div style={{ width: "130px", border: "2px solid #6366f1", borderRadius: "10px",
                        padding: "12px", display: "flex", flexDirection: "column",
                        gap: "12px", alignItems: "flex-start", background: "white" }}>
                        <h3 style={{ margin: 0, fontSize: "13px", color: "#4338ca" }}>🔧 Компоненты</h3>
                        {AVAILABLE_COMPONENTS.map((comp) => (
                            <DraggableResistor
                                key={comp.id}
                                {...comp}
                                isTemplate={true}
                                isDraggingConnection={!!draggingConnection}
                                onConnectionStart={handleConnectionStart}
                                onConnectionEnd={handleConnectionEnd}
                            />
                        ))}
                    </div>

                    {/* Поле */}
                    <Board
                        boardRef={boardRef}
                        connections={connections}
                        placedComponents={placedComponents}
                        draggingConnection={draggingConnection}
                    >
                        {placedComponents.map((comp) => (
                            <DraggableResistor
                                key={comp.id}
                                {...comp}
                                isDraggingConnection={!!draggingConnection}
                                onConnectionStart={handleConnectionStart}
                                onConnectionEnd={handleConnectionEnd}
                            />
                        ))}
                    </Board>

                    {/* Правая панель */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <TaskPanel
                            task={TASKS[taskIndex]}
                            currentResistance={totalResistance}
                            taskIndex={taskIndex}
                            totalTasks={TASKS.length}
                            showHint={showHint}
                            onNext={handleNextTask}
                            onPrev={handlePrevTask}
                            onReset={handleReset}
                            onToggleHint={() => setShowHint((v) => !v)}
                        />
                        <CircuitResults components={placedComponents} connections={connections} />
                    </div>
                </div>
            </div>

            {/* Призрак при перетаскивании */}
            <DragOverlay>
                {activeComponent && (
                    <div style={{ cursor: "grabbing", opacity: 0.8 }}>
                        <div>R = {activeComponent.value}Ω</div>
                        <svg width="60" height="30" viewBox="0 0 60 30">
                            <line x1="0"  y1="15" x2="10" y2="15" stroke="black" strokeWidth="2" />
                            <rect x="10" y="5" width="40" height="20" fill="none" stroke="black" strokeWidth="2" />
                            <path d="M 12 10 L 18 20 L 26 10 L 34 20 L 42 10 L 48 20"
                                stroke="black" strokeWidth="1.5" fill="none" />
                            <line x1="50" y1="15" x2="60" y2="15" stroke="black" strokeWidth="2" />
                        </svg>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}


