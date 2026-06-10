import { useState, useRef, type JSX }          from "react";
import { DndContext, DragOverlay }    from "@dnd-kit/core";

import { TASKS, AVAILABLE_COMPONENTS } from "./constants/tasks";
import { analyzeCircuit }              from "./utils/circuitAnalysis";
import { useConnections }              from "./hooks/useConnections";
import { useDragHandlers }             from "./hooks/useDragHandlers";
import { useTimer }                    from "./hooks/useTimer";
import { useLeaderboard }              from "./hooks/useLeaderboard";

import { Board }               from "./components/Board";
import { DraggableResistor }   from "./components/DraggableResistor";
import { CircuitResults }      from "./components/CircuitResults";
import { TaskPanel }           from "./components/TaskPanel";
import { AuthScreen }          from "./components/AuthScreen";
import { LeaderboardScreen }   from "./components/LeaderboardScreen";
import { TimerDisplay }        from "./components/TimerDisplay";

import type { Resistor, User, SafetyResult } from "./types";
import { TOLERANCE }           from "./constants/tasks";
import { MenuScreen }         from "./components/MenuScreen";
import { SafetyTopicScreen }  from "./components/SafetyTopicScreen";
import { SafetyQuizScreen }   from "./components/SafetyQuizScreen";
import { useFirstAidGame, type ScenarioId } from "./hooks/useFirstAid";
import FirstAidMenu      from "./components/firstAid/FirstAidMenu";
import ElectricFreedom   from "./components/firstAid/ElectricFreedom";
import CheckVictim       from "./components/firstAid/CheckVictim";
import RecoveryPosition  from "./components/firstAid/RecoveryPosition";
import CPRGame           from "./components/firstAid/CPRGame";
import FirstAidResult    from "./components/firstAid/FirstAidResult";
import { EmergencyTrainer } from "./components/EmergencyTrainer/index"
import "./App.css"

type Screen = "auth" | "menu" | "game" | "safety" | "safetyQuiz" | "leaderboard";

export default function App() {
    const boardRef = useRef<HTMLDivElement | null>(null);

    // ── Экраны ────────────────────────────────────────────────────────
    const [screen, setScreen] = useState<Screen>("auth");
    const [user,   setUser]   = useState<User | null>(null);

    // ── Игровое состояние ─────────────────────────────────────────────
    const [placedComponents, setPlacedComponents] = useState<Resistor[]>([]);
    const [taskIndex,        setTaskIndex]        = useState(0);
    const [showHint,         setShowHint]         = useState(false);
    const [taskSolved,       setTaskSolved]       = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string>("");
    const [currentMode, setCurrentMode] = useState<"resistor" | "safety">("resistor");

    // ── Таймер (идёт непрерывно через все задания) ────────────────────
    const timer = useTimer();

    // ── Таблица лидеров ───────────────────────────────────────────────
    const { resistorEntries, safetyEntries, addEntry, clearEntries } = useLeaderboard();

    // ── Соединения и перетаскивание ───────────────────────────────────
    const {
        connections,
        draggingConnection,
        handleConnectionStart,
        handleConnectionEnd,
        handleMouseMove,
        handleMouseUp,
        resetConnections,
        removeConnection,
        removeConnectionsForComponent,
    } = useConnections(boardRef);

    const { activeId, handleDragStart, handleDragEnd } = useDragHandlers(
        placedComponents,
        setPlacedComponents,
        boardRef,
        draggingConnection
    );
    // ── Анализ цепи ───────────────────────────────────────────────────
    const { totalResistance } = analyzeCircuit(placedComponents, connections);

    const currentTask = TASKS[taskIndex];
    const isLastTask  = taskIndex === TASKS.length - 1;

    const diff = totalResistance !== null
        ? Math.abs(totalResistance - currentTask.targetResistance)
        : null;
    const isSuccess = diff !== null && diff <= TOLERANCE;

    const [appMode, setAppMode] = useState<"main" | "firstaid" | "emergency">("main");
const { state, startScenario, finishScenario, restart, goToMenu } = useFirstAidGame();

    // Фиксируем решение — останавливаем таймер только на последнем задании,
    // на промежуточных таймер продолжает идти
    if (isSuccess && !taskSolved && screen === "game") {
        setTaskSolved(true);
        if (isLastTask) timer.pause();
    }

    // ── Обработчики ───────────────────────────────────────────────────
    function handleLogin(u: User) {
        setUser(u);
        setScreen("menu");
    }

    function handleRemoveComponent(id: string) {
        setPlacedComponents(prev => prev.filter(c => c.id !== id));
        removeConnectionsForComponent(id);
    }

    function handleReset() {
        setPlacedComponents([]);
        resetConnections();
        setShowHint(false);
        // Если задание ещё не решено — таймер продолжает идти
        if (!taskSolved && !timer.isRunning) timer.start();
    }

    function handleNextTask() {
        if (taskIndex >= TASKS.length - 1) return;
        setTaskIndex(i => i + 1);
        setTaskSolved(false);
        setPlacedComponents([]);
        resetConnections();
        setShowHint(false);
        // Таймер НЕ сбрасывается — продолжает накапливать общее время
        if (!timer.isRunning) timer.start();
    }

    function handlePrevTask() {
        if (taskIndex <= 0) return;
        setTaskIndex(i => i - 1);
        setTaskSolved(false);
        setPlacedComponents([]);
        resetConnections();
        setShowHint(false);
        if (!timer.isRunning) timer.start();
    }

    function handleFinish() {
        // timer.seconds — это и есть общее время на все задания
        const totalTime = timer.seconds;

        if (user) {
            addEntry({
                name: user.name,
                avatar: user.avatar,
                totalTime,
                date: new Date().toISOString(),
                tasksCount: TASKS.length,
                mode: "resistor",
                id: ""
            });
        }

        timer.pause();
        setCurrentMode("resistor");
        setScreen("leaderboard");
    }

    function handleRestart() {
        setScreen("auth");
        setUser(null);
        setCurrentMode("resistor");
        setTaskIndex(0);
        setTaskSolved(false);
        setPlacedComponents([]);
        resetConnections();
        setShowHint(false);
        timer.reset();
    }

    function handleSafetyFinish(result: SafetyResult) {
    addEntry({
        name: result.name,
        avatar: result.avatar,
        totalTime: result.timeSpent,
        safetyTime: result.timeSpent,
        date: result.date,
        tasksCount: result.totalQuestions,
        mode: "safety",
        safetyScore: result.score,
        id: ""
    });
    setCurrentMode("safety");
    setScreen("leaderboard");
}

    if (appMode === "firstaid") {
  if (state.screen === "menu") {
    return <FirstAidMenu onSelect={startScenario} onBack={() => setAppMode("main")} />;
  }
  if (state.screen === "scenario") {
    const scenarioMap: Record<ScenarioId, JSX.Element> = {
      electric: <ElectricFreedom  onFinish={finishScenario} />,
      check:    <CheckVictim      onFinish={finishScenario} />,
      recovery: <RecoveryPosition onFinish={finishScenario} />,
      cpr:      <CPRGame          onFinish={finishScenario} />,
    };
    return scenarioMap[state.scenario!];
  }
  if (state.screen === "result") {
    return (
      <FirstAidResult
        score={state.totalScore}
        errors={state.allErrors}
        onRetry={restart}
        onMenu={goToMenu}
      />
    );
  }
}

if (appMode === "emergency") {
  return (
    <EmergencyTrainer
      onBack={() => setAppMode("main")}
    />
  );
}

    // ── Рендер ────────────────────────────────────────────────────────
    if (screen === "auth") {
        return <AuthScreen onLogin={handleLogin} />;
    }

    if (screen === "menu") {
    return (
        <MenuScreen
            user={user!}
            onGoGame={() => { timer.reset(); timer.start(); setScreen("game"); }}
            onGoSafety={() => setScreen("safety")}
            onGoLeaderboard={() => setScreen("leaderboard")}
            onGoFirstAid={() => setAppMode("firstaid")}
            onGoEmergency={() => setAppMode("emergency")}
        />
    );
}

if (screen === "safety") {
    return (
        <SafetyTopicScreen
            onSelectTopic={(id) => { setSelectedTopic(id); setScreen("safetyQuiz"); }}
            onBack={() => setScreen("menu")}
        />
    );
}

if (screen === "safetyQuiz") {
    return (
        <SafetyQuizScreen
            topicId={selectedTopic}
            user={user!}
            onFinish={handleSafetyFinish}
        />
    );
}

    if (screen === "leaderboard") {
        return (
            <LeaderboardScreen
                user={user!}
                totalTime={currentMode === "safety"
                    ? (safetyEntries.at(-1)?.safetyTime ?? 0)   // последняя запись safety
                    : timer.seconds}
                resistorEntries={resistorEntries}
                safetyEntries={safetyEntries}
                onClear={clearEntries}
                onRestart={handleRestart}
                //onClear={() => clearEntries(currentMode)}
                mode={currentMode}
                onBack={() => setScreen("menu")}
            />
        );
    }

    const activeComponent =
        activeId
            ? AVAILABLE_COMPONENTS.find(c => c.id === activeId) ??
              placedComponents.find(c => c.id === activeId)
            : null;


    return (
        <>
        <button
            onClick={() => setScreen("menu")}
            style={{
                background: 'none', border: '1px solid #334155',
                color: '#94a3b8', borderRadius: 6, padding: '4px 12px',
                cursor: 'pointer', marginBottom: 8, fontSize: 13,
            }}
        >
            ← Назад в меню
        </button>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{ fontFamily: "sans-serif", padding: "16px" }}>

                {/* Заголовок */}
                <div style={{
                    marginBottom:   "16px",
                    padding:        "12px 20px",
                    background:     "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius:   "10px",
                    color:          "white",
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "18px" }}>
                            ⚡ Конструктор электрических цепей
                        </h2>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.85 }}>
                            Перетаскивай резисторы на поле и соединяй их зелёными точками
                        </p>
                    </div>

                    {/* Имя пользователя */}
                    <div style={{
                        display:      "flex",
                        alignItems:   "center",
                        gap:          "8px",
                        background:   "rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        padding:      "6px 12px",
                    }}>
                        <span style={{ fontSize: "20px" }}>{user?.avatar}</span>
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                            {user?.name}
                        </span>
                    </div>
                </div>

                <div
                    style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {/* Панель компонентов */}
                    <div style={{
                        width:         "130px",
                        border:        "2px solid #6366f1",
                        borderRadius:  "10px",
                        padding:       "12px",
                        display:       "flex",
                        flexDirection: "column",
                        gap:           "12px",
                        alignItems:    "flex-start",
                        background:    "white",
                    }}>
                        <h3 style={{ margin: 0, fontSize: "13px", color: "#4338ca" }}>
                            🔧 Компоненты
                        </h3>
                        {AVAILABLE_COMPONENTS.map(comp => (
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

                    {/* Игровое поле */}
                    <Board
                        boardRef={boardRef}
                        connections={connections}
                        placedComponents={placedComponents}
                        draggingConnection={draggingConnection}
                        onRemoveConnection={removeConnection}
                    >
                        {placedComponents.map(comp => (
                            <DraggableResistor
                                key={comp.id}
                                {...comp}
                                isDraggingConnection={!!draggingConnection}
                                onConnectionStart={handleConnectionStart}
                                onConnectionEnd={handleConnectionEnd}
                                onRemove={handleRemoveComponent}
                            />
                        ))}
                    </Board>

                    {/* Правая панель */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                        {/* Таймер */}
                        <TimerDisplay
                            seconds={timer.seconds}
                            isRunning={timer.isRunning}
                            taskIndex={taskIndex}
                            totalTasks={TASKS.length}
                        />

                        <TaskPanel
                            task={currentTask}
                            currentResistance={totalResistance}
                            taskIndex={taskIndex}
                            totalTasks={TASKS.length}
                            showHint={showHint}
                            isLastTask={isLastTask}
                            isSuccess={isSuccess}
                            onNext={isLastTask && isSuccess ? handleFinish : handleNextTask}
                            onPrev={handlePrevTask}
                            onReset={handleReset}
                            onToggleHint={() => setShowHint(v => !v)}
                        />

                        <CircuitResults
                            components={placedComponents}
                            connections={connections}
                        />
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
                            <path
                                d="M 12 10 L 18 20 L 26 10 L 34 20 L 42 10 L 48 20"
                                stroke="black" strokeWidth="1.5" fill="none"
                            />
                            <line x1="50" y1="15" x2="60" y2="15" stroke="black" strokeWidth="2" />
                        </svg>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
        </>
    );
}