import type { Branch, ConnectionType, Resistor, Connection, CircuitAnalysis } from "../types.ts";

export class UnionFind {
    private parent = new Map<string, string>();

    find(x: string): string {
        if (!this.parent.has(x)) this.parent.set(x, x);
        const p = this.parent.get(x)!;
        if (p !== x) {
            const root = this.find(p);
            this.parent.set(x, root);
            return root;
        }
        return x;
    }

    union(x: string, y: string): void {
        this.parent.set(this.find(x), this.find(y));
    }
}

export function termId(componentId: string, point: "left" | "right"): string {
    return `${componentId}::${point}`;
}

export function detectConnectionType(branches: Branch[]): ConnectionType {
    if (branches.length === 0) return "empty";
    if (branches.length === 1) return "single";

    const degree = new Map<string, number>();
    for (const b of branches) {
        degree.set(b.nodeA, (degree.get(b.nodeA) ?? 0) + 1);
        degree.set(b.nodeB, (degree.get(b.nodeB) ?? 0) + 1);
    }

    const ref = branches[0];
    const allParallel = branches.every(
        (b) =>
            (b.nodeA === ref.nodeA && b.nodeB === ref.nodeB) ||
            (b.nodeA === ref.nodeB && b.nodeB === ref.nodeA)
    );
    if (allParallel) return "parallel";

    let terminalCount = 0;
    let invalidDegree = false;

    for (const deg of degree.values()) {
        if (deg === 1) terminalCount++;
        else if (deg !== 2) { invalidDegree = true; break; }
    }

    if (!invalidDegree && terminalCount === 2) {
        const adj = new Map<string, string[]>();
        for (const b of branches) {
            adj.set(b.nodeA, [...(adj.get(b.nodeA) ?? []), b.nodeB]);
            adj.set(b.nodeB, [...(adj.get(b.nodeB) ?? []), b.nodeA]);
        }
        const startNode = branches[0].nodeA;
        const visited = new Set<string>();
        const queue = [startNode];
        while (queue.length) {
            const node = queue.shift()!;
            if (visited.has(node)) continue;
            visited.add(node);
            for (const nb of adj.get(node) ?? []) queue.push(nb);
        }
        if (visited.size === degree.size) return "series";
    }

    const hasIsolated = branches.some(
        (b) => (degree.get(b.nodeA) ?? 0) === 1 && (degree.get(b.nodeB) ?? 0) === 1
    );
    const uniqueNodePairs = new Set(
        branches.map((b) => [b.nodeA, b.nodeB].sort().join("|"))
    );
    if (uniqueNodePairs.size === branches.length && hasIsolated) return "disconnected";

    return "mixed";
}

export function simplifyBranches(branches: Branch[]): number | null {
    if (branches.length === 0) return null;
    if (branches.length === 1) return branches[0].resistance;

    let current = [...branches];
    let changed = true;

    while (changed && current.length > 1) {
        changed = false;

        outer_parallel:
        for (let i = 0; i < current.length; i++) {
            for (let j = i + 1; j < current.length; j++) {
                const a = current[i];
                const b = current[j];
                const isParallel =
                    (a.nodeA === b.nodeA && a.nodeB === b.nodeB) ||
                    (a.nodeA === b.nodeB && a.nodeB === b.nodeA);

                if (isParallel) {
                    const R = (a.resistance * b.resistance) / (a.resistance + b.resistance);
                    current = current.filter((_, k) => k !== i && k !== j);
                    current.push({ resistance: R, nodeA: a.nodeA, nodeB: a.nodeB });
                    changed = true;
                    break outer_parallel;
                }
            }
        }

        if (changed) continue;

        const degree = new Map<string, number>();
        for (const b of current) {
            degree.set(b.nodeA, (degree.get(b.nodeA) ?? 0) + 1);
            degree.set(b.nodeB, (degree.get(b.nodeB) ?? 0) + 1);
        }

        for (const [node, deg] of degree) {
            if (deg !== 2) continue;
            const connected = current.filter(
                (b) => b.nodeA === node || b.nodeB === node
            );
            if (connected.length !== 2) continue;
            const [a, b] = connected;
            const aOther = a.nodeA === node ? a.nodeB : a.nodeA;
            const bOther = b.nodeA === node ? b.nodeB : b.nodeA;
            const R = a.resistance + b.resistance;
            current = current.filter((br) => br !== a && br !== b);
            current.push({ resistance: R, nodeA: aOther, nodeB: bOther });
            changed = true;
            break;
        }
    }

    return current.length === 1 ? current[0].resistance : null;
}

export function analyzeCircuit(
    components: Resistor[],
    connections: Connection[]
): CircuitAnalysis {
    if (components.length === 0)
        return { totalResistance: null, connectionType: "empty" };
    if (components.length === 1)
        return { totalResistance: components[0].value, connectionType: "single" };

    const uf = new UnionFind();
    for (const comp of components) {
        uf.find(termId(comp.id, "left"));
        uf.find(termId(comp.id, "right"));
    }
    for (const conn of connections) {
        uf.union(
            termId(conn.from.componentId, conn.from.point),
            termId(conn.to.componentId, conn.to.point)
        );
    }

    const branches: Branch[] = components.map((comp) => ({
        resistance: comp.value,
        nodeA: uf.find(termId(comp.id, "left")),
        nodeB: uf.find(termId(comp.id, "right")),
    }));

    const connectionType = detectConnectionType(branches);
    const totalResistance = simplifyBranches([...branches]);

    return { totalResistance, connectionType };
}

export function getConnectionPointPosition(
    componentId: string,
    point: "left" | "right",
    placedComponents: Resistor[]
): { x: number; y: number } | null {
    const component = placedComponents.find((c) => c.id === componentId);
    if (!component) return null;
    const TEXT_HEIGHT = 20;
    const pointX = point === "left" ? 3 : 57;
    const pointY = 15 + TEXT_HEIGHT;
    return {
        x: component.position.x + pointX,
        y: component.position.y + pointY,
    };
}