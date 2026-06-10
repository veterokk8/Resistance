import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer() {
    const [seconds, setSeconds]     = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setSeconds(0);
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(
                () => setSeconds(s => s + 1),
                1000
            );
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    return { seconds, isRunning, start, pause, reset };
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}