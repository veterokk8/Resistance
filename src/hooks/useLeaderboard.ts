import { useState, useCallback } from "react";
import type { LeaderboardEntry } from "../types";

const STORAGE_KEY_RESISTOR = "circuit_leaderboard_resistor";
const STORAGE_KEY_SAFETY   = "circuit_leaderboard_safety";

function loadEntries(key: string): LeaderboardEntry[] {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveEntries(key: string, entries: LeaderboardEntry[]): void {
    localStorage.setItem(key, JSON.stringify(entries));
}

export function useLeaderboard() {
    const [resistorEntries, setResistorEntries] = useState<LeaderboardEntry[]>(
        () => loadEntries(STORAGE_KEY_RESISTOR)
    );
    const [safetyEntries, setSafetyEntries] = useState<LeaderboardEntry[]>(
        () => loadEntries(STORAGE_KEY_SAFETY)
    );

    const addEntry = useCallback((entry: LeaderboardEntry) => {
         const entryWithId: LeaderboardEntry = {
            ...entry,
            id: entry.id ?? crypto.randomUUID(),
        };
        if (entry.mode === "safety") {
            setSafetyEntries(prev => {
                const updated = [...prev.filter(e => e.name !== entryWithId.name), entryWithId]
                    .sort((a, b) => {
                        const timeDiff = (a.safetyTime ?? 0) - (b.safetyTime ?? 0);
                if (timeDiff !== 0) return timeDiff;
                return (b.safetyScore ?? 0) - (a.safetyScore ?? 0);
            })
                    .slice(0, 10);
                saveEntries(STORAGE_KEY_SAFETY, updated);
                return updated;
            });
        }else {
            setResistorEntries(prev => {
                const updated = [...prev.filter(e => e.name !== entry.name), entry]
                    .sort((a, b) => a.totalTime - b.totalTime)
                    .slice(0, 10);
                saveEntries(STORAGE_KEY_RESISTOR, updated);
                return updated;
            });
        }
        }, [])
    

    const clearEntries = useCallback((mode: "resistor" | "safety") => {
        if (mode === "safety") {
            saveEntries(STORAGE_KEY_SAFETY, []);
            setSafetyEntries([]);
        } else {
            saveEntries(STORAGE_KEY_RESISTOR, []);
            setResistorEntries([]);
        }
    }, []);

    return { resistorEntries, safetyEntries, addEntry, clearEntries };
}