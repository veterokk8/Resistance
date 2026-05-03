import { useDroppable }  from "@dnd-kit/core";
import type { Connection, Resistor, DraggingConnection } from "../types";
import { getConnectionPointPosition } from "../utils/circuitAnalysis";


interface Props {
    children:            React.ReactNode;
    boardRef:            React.RefObject<HTMLDivElement | null>;
    connections:         Connection[];
    placedComponents:    Resistor[];
    draggingConnection:  DraggingConnection;
}

export function Board({
    children,
    boardRef,
    connections,
    placedComponents,
    draggingConnection,
}: Props) {
    const { setNodeRef } = useDroppable({ id: "dropZone" });

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                boardRef.current = node;
            }}
            style={{
                width:           "700px",
                height:          "500px",
                border:          "2px solid black",
                position:        "relative",
                backgroundColor: "#f0f0f0",
                overflow:        "visible",
                backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
                backgroundSize:  "20px 20px",
            }}
        >
            {/* Резисторы на поле */}
            {children}

            {/* SVG-слой проводов */}
            <svg
                style={{
                    position: "absolute",
                    left: 0, top: 0,
                    width: "100%", height: "100%",
                    pointerEvents: "none",
                    zIndex: 10,
                }}
            >
                {connections.map((conn) => {
                    const from = getConnectionPointPosition(
                        conn.from.componentId, conn.from.point, placedComponents
                    );
                    const to = getConnectionPointPosition(
                        conn.to.componentId, conn.to.point, placedComponents
                    );
                    if (!from || !to) return null;
                    return (
                        <line
                            key={conn.id}
                            x1={from.x} y1={from.y}
                            x2={to.x}   y2={to.y}
                            stroke="#6366f1" strokeWidth="2.5"
                        />
                    );
                })}

                {draggingConnection && (() => {
                    const from = getConnectionPointPosition(
                        draggingConnection.from.componentId,
                        draggingConnection.from.point,
                        placedComponents
                    );
                    if (!from) return null;
                    return (
                        <line
                            x1={from.x} y1={from.y}
                            x2={draggingConnection.currentPos.x}
                            y2={draggingConnection.currentPos.y}
                            stroke="#a5b4fc" strokeWidth="2"
                            strokeDasharray="6,4"
                        />
                    );
                })()}
            </svg>

            {/* Подсказка на пустом поле */}
            {placedComponents.length === 0 && (
                <div
                    style={{
                        position:      "absolute",
                        top: "50%", left: "50%",
                        transform:     "translate(-50%, -50%)",
                        color:         "#9ca3af",
                        fontSize:      "14px",
                        textAlign:     "center",
                        pointerEvents: "none",
                    }}
                >
                    <div style={{ fontSize: "40px" }}>⬅️</div>
                    <div>Перетащи резисторы сюда</div>
                </div>
            )}
        </div>
    );
}