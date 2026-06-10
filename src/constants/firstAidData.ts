// ===== ТИПЫ =====
export interface Step {
  id: string;
  label: string;
  correct: boolean;
  hint: string;
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface RecoveryStep {
  id: number;
  text: string;
}

// ===== ДАННЫЕ: Освобождение от тока =====
export const ELECTRIC_STEPS: Step[] = [
  {
    id: "power_off",
    label: "🔌 Отключить питание (рубильник/автомат)",
    correct: true,
    hint: "✅ Первое действие — обесточить установку!",
  },
  {
    id: "dry_stick",
    label: "🪵 Оттолкнуть пострадавшего сухой палкой/доской",
    correct: true,
    hint: "✅ Если нельзя отключить — используй диэлектрик",
  },
  {
    id: "touch_hands",
    label: "🤚 Взять пострадавшего голыми руками",
    correct: false,
    hint: "❌ НЕЛЬЗЯ! Ток пройдёт через тебя тоже!",
  },
  {
    id: "rubber_gloves",
    label: "🧤 Надеть резиновые перчатки или обмотать руки сухой тканью",
    correct: true,
    hint: "✅ Диэлектрические перчатки — защита спасателя",
  },
  {
    id: "wet_cloth",
    label: "💧 Использовать мокрую тряпку для изоляции",
    correct: false,
    hint: "❌ Вода проводит ток! Только СУХИЕ материалы!",
  },
  {
    id: "stand_on_board",
    label: "🪵 Встать на сухую доску/резиновый коврик",
    correct: true,
    hint: "✅ Изолируй себя от земли",
  },
];

// ===== ДАННЫЕ: Оценка пострадавшего =====
export const VICTIM_CHECKS: QuizQuestion[] = [
  {
    id: "shout",
    question: "Первое действие после освобождения от тока?",
    options: [
      { text: "🗣️ Окликнуть и потрясти за плечи", correct: true },
      { text: "💊 Дать лекарства", correct: false },
      { text: "🚿 Облить водой", correct: false },
      { text: "🏃 Поднять и посадить", correct: false },
    ],
    explanation:
      "Всегда сначала проверяем сознание — окликаем и осторожно трясём за плечи.",
  },
  {
    id: "pulse",
    question: "Где проверяют пульс у пострадавшего без сознания?",
    options: [
      { text: "🤚 На запястье", correct: false },
      { text: "🫀 На сонной артерии (шея)", correct: true },
      { text: "🦵 На бедренной артерии", correct: false },
      { text: "👂 Приложить ухо к груди", correct: false },
    ],
    explanation:
      "Пульс на сонной артерии — самый надёжный способ. Проверяем 10 секунд.",
  },
  {
    id: "no_breath",
    question: "Пульса НЕТ, дыхания НЕТ. Ваши действия?",
    options: [
      { text: "📞 Позвонить родственникам", correct: false },
      { text: "🫀 Начать СЛР и вызвать 112", correct: true },
      { text: "🔄 Перевернуть на бок", correct: false },
      { text: "⏳ Ждать скорую помощь", correct: false },
    ],
    explanation:
      "При клинической смерти — немедленно СЛР! Каждая секунда на счету.",
  },
  {
    id: "pulse_no_breath",
    question: "Пульс ЕСТЬ, сознания НЕТ, дыхание ЕСТЬ. Что делать?",
    options: [
      { text: "🫀 Начать СЛР", correct: false },
      { text: "🔄 Стабильное боковое положение", correct: true },
      { text: "🧍 Оставить лежать на спине", correct: false },
      { text: "💧 Дать воды", correct: false },
    ],
    explanation:
      "Стабильное боковое положение предотвращает аспирацию при рвоте.",
  },
];

// ===== ДАННЫЕ: Боковое положение =====
export const RECOVERY_STEPS: RecoveryStep[] = [
  { id: 1, text: "🦵 Согнуть ближнюю ногу в колене под прямым углом" },
  { id: 2, text: "🤚 Ближнюю руку вытянуть перпендикулярно телу ладонью вверх" },
  { id: 3, text: "🖐️ Дальнюю руку положить тыльной стороной под щёку" },
  { id: 4, text: "🔄 Повернуть на бок, потянув за согнутое колено" },
  { id: 5, text: "👄 Запрокинуть голову для открытия дыхательных путей" },
  { id: 6, text: "👁️ Контролировать дыхание каждые 2 минуты" },
];

// ===== КОНСТАНТЫ СЛР =====
export const CPR_CONFIG = {
  COMPRESSIONS_PER_CYCLE: 30,
  BREATHS_PER_CYCLE: 2,
  TOTAL_CYCLES: 3,
  MIN_INTERVAL_MS: 450,  // 100-120 уд/мин → 500-600 мс
  MAX_INTERVAL_MS: 650,
} as const;