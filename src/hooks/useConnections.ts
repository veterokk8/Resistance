import { useState }       from "react";
import type { Connection, DraggingConnection } from "../types.ts";


export function useConnections(boardRef: React.RefObject<HTMLDivElement | null>) {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [draggingConnection, setDraggingConnection] = useState<DraggingConnection>(null);

    function handleConnectionStart(
        componentId: string,
        point: "left" | "right",
        e: React.MouseEvent
    ) {
        if (componentId.startsWith("template-")) return;
        const boardRect = boardRef.current?.getBoundingClientRect();
        if (!boardRect) return;
        setDraggingConnection({
            from: { componentId, point },
            currentPos: {
                x: e.clientX - boardRect.left,
                y: e.clientY - boardRect.top,
            },
        });
    }

    function handleConnectionEnd(componentId: string, point: "left" | "right") {
        if (!draggingConnection) return;
        if (componentId.startsWith("template-")) return;
        if (
            draggingConnection.from.componentId === componentId &&
            draggingConnection.from.point === point
        ) {
            setDraggingConnection(null);
            return;
        }
        setConnections((prev) => [
            ...prev,
            {
                id: "conn-" + Date.now(),
                from: draggingConnection.from,
                to: { componentId, point },
            },
        ]);
        setDraggingConnection(null);
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!draggingConnection || !boardRef.current) return;
        const boardRect = boardRef.current.getBoundingClientRect();
        setDraggingConnection({
            ...draggingConnection,
            currentPos: {
                x: e.clientX - boardRect.left,
                y: e.clientY - boardRect.top,
            },
        });
    }

    function handleMouseUp(e: React.MouseEvent) {
        if (draggingConnection && (e.target as HTMLElement).tagName !== "circle") {
            setDraggingConnection(null);
        }
    }

    function resetConnections() {
        setConnections([]);
    }

    function removeConnection(id: string) {
        setConnections(prev => prev.filter(c => c.id !== id));
    }

    //  удаляем все соединения конкретного резистора
    function removeConnectionsForComponent(componentId: string) {
        setConnections(prev =>
            prev.filter(
                c => c.from.componentId !== componentId &&
                     c.to.componentId   !== componentId
            )
        );
    }


    return {
        connections,
        draggingConnection,
        handleConnectionStart,
        handleConnectionEnd,
        handleMouseMove,
        handleMouseUp,
        resetConnections,
        removeConnection,              
        removeConnectionsForComponent,
    };
}