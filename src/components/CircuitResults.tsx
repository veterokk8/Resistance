import type { Resistor, Connection }                        from "../types";
import { analyzeCircuit }                                   from "../utils/circuitAnalysis";
import { calculateSeriesResistance,
         calculateParallelResistance }                      from "../utils/resistorCalculations";
import { CONNECTION_LABELS, CONNECTION_COLORS }             from "../constants/tasks";

interface Props {
    components:  Resistor[];
    connections: Connection[];
}

export function CircuitResults({ components, connections }: Props) {
    const { totalResistance, connectionType } = analyzeCircuit(components, connections);

    return (
        <div
            style={{
                width:          "160px",
                border:         "2px solid #333",
                borderRadius:   "8px",
                padding:        "14px",
                background:     "#fafafa",
                display:        "flex",
                flexDirection:  "column",
                gap:            "10px",
            }}
        >
            <h3 style={{ margin: 0, fontSize: "14px" }}>📊 Анализ</h3>

            <div>
                <div style={{ fontSize: "11px", color: "#666" }}>Тип соединения</div>
                <div style={{ fontWeight: "bold", color: CONNECTION_COLORS[connectionType], fontSize: "12px" }}>
                    {CONNECTION_LABELS[connectionType]}
                </div>
            </div>

            <div>
                <div style={{ fontSize: "11px", color: "#666" }}>Итоговое R</div>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {totalResistance !== null ? `${totalResistance.toFixed(2)} Ω` : "—"}
                </div>
            </div>

            {components.length > 0 && (
                <div
                    style={{
                        fontSize:   "11px",
                        color:      "#999",
                        borderTop:  "1px solid #ddd",
                        paddingTop: "8px",
                    }}
                >
                    <div>Все последовательно:</div>
                    <div style={{ color: "#0a7" }}>
                        {calculateSeriesResistance(components).toFixed(2)} Ω
                    </div>
                    <div style={{ marginTop: "4px" }}>Все параллельно:</div>
                    <div style={{ color: "#07a" }}>
                        {calculateParallelResistance(components).toFixed(2)} Ω
                    </div>
                </div>
            )}
        </div>
    );
}