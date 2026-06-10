import type { User } from "../types";

interface MenuScreenProps {
    user: User;
    onGoGame:        () => void;
    onGoSafety:      () => void;
    onGoLeaderboard: () => void;
    onGoFirstAid:    () => void;
    onGoEmergency:   () => void;
}

export function MenuScreen({ user, onGoGame, onGoSafety, 
                onGoLeaderboard, onGoFirstAid, onGoEmergency, }: MenuScreenProps) {
    return (
        <div className="menu-screen">

            {/* Приветствие */}
            <div className="menu-header">
                <span className="menu-avatar">{user.avatar}</span>
                <h2 className="menu-name">Привет, {user.name}!</h2>
                <p className="menu-subtitle">Выбери режим</p>
            </div>

            {/* Кнопки */}
            <div className="menu-buttons">

                <button className="menu-btn" onClick={onGoGame}>
                    <span className="menu-btn-icon">⚙️</span>
                    <div className="menu-btn-text">
                        <strong>Игра с резисторами</strong>
                        <hr/>
                        <em>Собирай цепи и решай задачи</em>
                    </div>
                </button>

                <button className="menu-btn" onClick={onGoSafety}>
                    <span className="menu-btn-icon">🦺</span>
                    <div className="menu-btn-text">
                        <strong>Охрана труда</strong>
                        <hr/>
                        <em>Проверь знания по безопасности</em>
                    </div>
                </button>

                <button className="menu-btn" onClick={onGoFirstAid}>
                    <span className="menu-btn-icon">🚑</span>
                    <div className="menu-btn-text">
                        <strong>Первая помощь</strong>
                        <hr/>
                        <em>Отработай навыки спасения</em>
                    </div>
                </button>

                <button className="menu-btn" onClick={onGoEmergency}>
                    <span className="menu-btn-icon">⚡</span>
                    <div className="menu-btn-text">
                        <strong>Тренажёр аварий</strong>
                        <hr/>
                        <em>Ликвидируй аварии на подстанции</em>
                    </div>
                </button>

                <button className="menu-btn" onClick={onGoLeaderboard}>
                    <span className="menu-btn-icon">🏆</span>
                    <div className="menu-btn-text">
                        <strong>Таблица лидеров</strong>
                        <hr/>
                        <em>Посмотри лучшие результаты</em>
                    </div>
                </button>

            </div>
        </div>
    );
}