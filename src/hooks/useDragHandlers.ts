import { useState }                          from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { Resistor, DraggingConnection }                     from "../types.ts";
import { AVAILABLE_COMPONENTS }              from "../constants/tasks";


export function useDragHandlers(
    _placedComponents: Resistor[],
setPlacedComponents: React.Dispatch<React.SetStateAction<Resistor[]>>, boardRef: React.RefObject<HTMLDivElement | null>, draggingConnection: DraggingConnection) {
    const [activeId, setActiveId] = useState<string | null>(null);

    function handleDragStart(event: DragStartEvent) {
        if (draggingConnection) return;
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over, delta } = event;
        setActiveId(null);
        if (!over || !boardRef.current) return;

        const isOverBoard = over.id === "dropZone";
        const isFromPanel = (active.id as string).startsWith("template-");

        if (isFromPanel && isOverBoard) {
            const source = AVAILABLE_COMPONENTS.find((c) => c.id === active.id);
            if (!source) return;

            const boardRect = boardRef.current.getBoundingClientRect();
            const finalRect = active.rect.current.translated;
            if (!finalRect) return;

            setPlacedComponents((prev) => [
                ...prev,
                {
                    ...source,
                    id: "placed-" + Date.now() + "-" + Math.random(),
                    position: {
                        x: finalRect.left - boardRect.left - 2,
                        y: finalRect.top  - boardRect.top  - 2,
                    },
                },
            ]);
        } else if (!isFromPanel && isOverBoard) {
            setPlacedComponents((prev) =>
                prev.map((comp) =>
                    comp.id === active.id
                        ? {
                              ...comp,
                              position: {
                                  x: comp.position.x + delta.x,
                                  y: comp.position.y + delta.y,
                              },
                          }
                        : comp
                )
            );
        }
    }

    return { activeId, handleDragStart, handleDragEnd };
}