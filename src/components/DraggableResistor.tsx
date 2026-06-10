import { useDraggable } from "@dnd-kit/core";
import type { Resistor } from "../types.ts";

interface Props extends Resistor {
    isTemplate?:           boolean;
    isDraggingConnection?: boolean;
    onConnectionStart?: (
        componentId: string,
        point: "left" | "right",
        e: React.MouseEvent
    ) => void;
    onConnectionEnd?: (componentId: string, point: "left" | "right") => void;
    onRemove?:             (id: string) => void;
}

export function DraggableResistor({
    id,
    value,
    position,
    isTemplate = false,
    isDraggingConnection = false,
    onConnectionStart,
    onConnectionEnd,
    onRemove
}: Props) {
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({ id });

    const style: React.CSSProperties = {
        position:  isTemplate ? "relative" : "absolute",
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        left:      isTemplate ? undefined : position.x,
        top:       isTemplate ? undefined : position.y,
        cursor:    isDraggingConnection ? "crosshair" : "grab",
        zIndex:    isDragging ? 1000 : 1,
        opacity:   isDragging ? 0 : 1,
        userSelect: "none",
    };

    const handlePointMouseDown = (e: React.MouseEvent, point: "left" | "right") => {
        e.stopPropagation();
        e.preventDefault();
        onConnectionStart?.(id, point, e);
    };

    const handlePointMouseUp = (e: React.MouseEvent, point: "left" | "right") => {
        e.stopPropagation();
        e.preventDefault();
        onConnectionEnd?.(id, point);
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div
                {...(isTemplate ? { ...listeners, ...attributes } : {})}
                style={{
                    marginBottom: "2px",
                    cursor: "grab",
                    pointerEvents: !isTemplate && isDraggingConnection ? "none" : "auto",
                }}
            >
                R = {value}Ω
            </div>

            <div style={{ position: "relative" }}>
                {!isTemplate && onRemove && (
                    <button
                        onMouseDown={e => e.stopPropagation()} // не начинать drag
                        onClick={e => {
                            e.stopPropagation();
                            onRemove(id);
                        }}
                        style={{
                            position:   "absolute",
                            top:        -8,
                            right:      -8,
                            width:      "16px",
                            height:     "16px",
                            borderRadius: "50%",
                            background: "#ef4444",
                            color:      "white",
                            border:     "none",
                            cursor:     "pointer",
                            fontSize:   "12px",
                            lineHeight: "18px",
                            textAlign:  "center",
                            zIndex:     100,
                            padding:    0,
                        }}
                    >
                        ×
                    </button>
                )}
                <svg
                    width="60" height="30" viewBox="0 0 60 30"
                    style={{ display: "block" }}
                    {...(isTemplate ? { ...listeners, ...attributes } : {})}
                >
                    {!isTemplate && (
                        <circle
                            cx="3" cy="15" r="4" fill="green"
                            style={{ cursor: "crosshair", pointerEvents: "auto" }}
                            onMouseDown={(e) => handlePointMouseDown(e, "left")}
                            onMouseUp={(e)   => handlePointMouseUp(e,   "left")}
                        />
                    )}

                    <g
                        {...(!isTemplate && !isDraggingConnection
                            ? { ...listeners, ...attributes }
                            : {})}
                        style={{
                            cursor: !isTemplate && !isDraggingConnection ? "grab" : "default",
                        }}
                    >
                        <line x1="0"  y1="15" x2="10" y2="15" stroke="black" strokeWidth="2" />
                        <rect x="10" y="5" width="40" height="20" fill="none" stroke="black" strokeWidth="2" />
                        <path
                            d="M 12 10 L 18 20 L 26 10 L 34 20 L 42 10 L 48 20"
                            stroke="black" strokeWidth="1.5" fill="none"
                        />
                        <line x1="50" y1="15" x2="60" y2="15" stroke="black" strokeWidth="2" />
                    </g>

                    {!isTemplate && (
                        <circle
                            cx="57" cy="15" r="4" fill="green"
                            style={{ cursor: "crosshair", pointerEvents: "auto" }}
                            onMouseDown={(e) => handlePointMouseDown(e, "right")}
                            onMouseUp={(e)   => handlePointMouseUp(e,   "right")}
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}
