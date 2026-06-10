import type { EmergencyScenario } from '../types';

export const SCENARIOS: EmergencyScenario[] = [
  {
    id:          'scenario-1',
    title:       'КЗ на линии Л-1 (110 кВ)',
    description: 'Сработала защита на линии Л-1. Линия отключилась. ' +
                 'Локализуйте повреждение и восстановите питание через резервную линию Л-2.',
    timeLimit:   120,
    initialElements: [
      { id: 'bus-1',  label: 'Шина 110 кВ',    type: 'bus',         status: 'normal',  x: 300, y: 60  },
      { id: 'line-1', label: 'Линия Л-1',       type: 'line',        status: 'fault',   x: 150, y: 160 },
      { id: 'line-2', label: 'Линия Л-2',       type: 'line',        status: 'normal',  x: 450, y: 160 },
      { id: 'brk-1',  label: 'Выкл. Q1 (Л-1)', type: 'breaker',     status: 'fault',   x: 150, y: 260 },
      { id: 'brk-2',  label: 'Выкл. Q2 (Л-2)', type: 'breaker',     status: 'normal',  x: 450, y: 260 },
      { id: 'tr-1',   label: 'Трансф. Т1',      type: 'transformer', status: 'warning', x: 300, y: 360 },
    ],
    availableActions: [
      { id: 'a5', label: '5. Убедиться в восстановлении напряжения', targetElementId: 'bus-1',  correctOrder: 5,  effect: { status: 'normal'   } },  
      { id: 'a2', label: '2. Проверить показания РЗА линии Л-1',     targetElementId: 'line-1', correctOrder: 2,  effect: {} },
      { id: 'a3', label: '3. Отключить разъединители Л-1',           targetElementId: 'brk-1', correctOrder: 3,  effect: { status: 'disabled' } },
      { id: 'a1', label: '1. Сообщить диспетчеру об аварии',        targetElementId: 'bus-1',  correctOrder: 1,  effect: {} },
      { id: 'a4', label: '4. Включить выключатель Л-2 (Q2)',         targetElementId: 'brk-2', correctOrder: 4,  effect: { status: 'normal'   } },
      { id: 'a6', label: '⚠️ Включить Л-1 без проверки (ОШИБКА)',    targetElementId: 'line-1', correctOrder: 99, effect: { status: 'fault'    } },
    ],
    correctSequence: ['a1', 'a2', 'a3', 'a4', 'a5'],
  },

  {
    id:          'scenario-2',
    title:       'Пожар в кабельном туннеле (10 кВ)',
    description: 'Зафиксировано задымление в кабельном туннеле секции 10 кВ. ' +
                 'Немедленно обесточьте кабели, вызовите пожарных и обеспечьте безопасность персонала.',
    timeLimit:   90,
    initialElements: [
      { id: 'bus-10', label: 'Шина 10 кВ',    type: 'bus',         status: 'fault',   x: 300, y: 60  },
      { id: 'cab-1',  label: 'Кабель К-1',    type: 'line',        status: 'fault',   x: 150, y: 160 },
      { id: 'cab-2',  label: 'Кабель К-2',    type: 'line',        status: 'warning', x: 450, y: 160 },
      { id: 'brk-a',  label: 'Выкл. QA (К-1)', type: 'breaker',   status: 'fault',   x: 150, y: 260 },
      { id: 'brk-b',  label: 'Выкл. QB (К-2)', type: 'breaker',   status: 'warning', x: 450, y: 260 },
      { id: 'tr-2',   label: 'Трансф. Т2',    type: 'transformer', status: 'warning', x: 300, y: 370 },
    ],
    availableActions: [
      { id: 'b1', label: '1. Сообщить диспетчеру о задымлении',        targetElementId: 'bus-10', correctOrder: 1,  effect: {} },
      { id: 'b5', label: '5. Вывести персонал из туннеля',              targetElementId: 'bus-10', correctOrder: 5,  effect: {} },
      { id: 'b4', label: '4. Отключить выключатель QB (К-2)',           targetElementId: 'brk-b',  correctOrder: 4,  effect: { status: 'disabled' } },
      { id: 'b3', label: '3. Отключить выключатель QA (К-1)',           targetElementId: 'brk-a',  correctOrder: 3,  effect: { status: 'disabled' } }, 
      { id: 'b6', label: '6. Подтвердить обесточивание диспетчеру',     targetElementId: 'bus-10', correctOrder: 6,  effect: { status: 'disabled' } },
      { id: 'b2', label: '2. Вызвать пожарную службу (101)',            targetElementId: 'bus-10', correctOrder: 2,  effect: {} },
      { id: 'b7', label: '⚠️ Войти в туннель без СИЗ (ОШИБКА)',         targetElementId: 'cab-1',  correctOrder: 99, effect: { status: 'fault'    } },
      { id: 'b8', label: '⚠️ Тушить кабели водой под напряжением (ОШИБКА)', targetElementId: 'cab-2', correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
  },

  {
    id:          'scenario-3',
    title:       'Перегрев трансформатора Т3 (35 кВ)',
    description: 'Температура масла трансформатора Т3 превысила 105°C. ' +
                 'Сработала сигнализация. Переведите нагрузку на резервный трансформатор Т4 и выведите Т3 в ремонт.',
    timeLimit:   100,
    initialElements: [
      { id: 'bus-35',  label: 'Шина 35 кВ',      type: 'bus',         status: 'normal',  x: 300, y: 50  },
      { id: 'tr-3',    label: 'Трансф. Т3',       type: 'transformer', status: 'fault',   x: 150, y: 170 },
      { id: 'tr-4',    label: 'Трансф. Т4 (рез)', type: 'transformer', status: 'normal',  x: 450, y: 170 },
      { id: 'brk-t3',  label: 'Выкл. QT3',        type: 'breaker',     status: 'fault',   x: 150, y: 280 },
      { id: 'brk-t4',  label: 'Выкл. QT4',        type: 'breaker',     status: 'normal',  x: 450, y: 280 },
      { id: 'bus-low', label: 'Шина 10 кВ (НН)',   type: 'bus',         status: 'warning', x: 300, y: 380 },
    ],
    availableActions: [
      { id: 'c7', label: '7. Оформить заявку на ремонт Т3',                targetElementId: 'bus-35',  correctOrder: 7,  effect: {} },
      { id: 'c6', label: '6. Отключить разъединители Т3 со стороны ВН',   targetElementId: 'tr-3',    correctOrder: 6,  effect: { status: 'disabled' } },
      { id: 'c5', label: '5. Отключить выключатель QT3',                   targetElementId: 'brk-t3', correctOrder: 5,  effect: { status: 'disabled' } },
      { id: 'c4', label: '4. Перевести нагрузку с Т3 на Т4',              targetElementId: 'bus-low', correctOrder: 4,  effect: { status: 'normal'   } },
      { id: 'c3', label: '3. Включить резервный трансформатор Т4 (QT4)',   targetElementId: 'brk-t4', correctOrder: 3,  effect: { status: 'normal'   } },
      { id: 'c1', label: '1. Зафиксировать показания термометра Т3',      targetElementId: 'tr-3',    correctOrder: 1,  effect: {} },
      { id: 'c2', label: '2. Сообщить диспетчеру о перегреве Т3',         targetElementId: 'bus-35',  correctOrder: 2,  effect: {} },
      { id: 'c8', label: '⚠️ Отключить Т3 без включения резерва (ОШИБКА)', targetElementId: 'tr-3',    correctOrder: 99, effect: { status: 'fault'    } },
      { id: 'c9', label: '⚠️ Игнорировать сигнализацию (ОШИБКА)',          targetElementId: 'bus-35',  correctOrder: 99, effect: { status: 'fault'    } },
    ],
    correctSequence: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
  },
    // СЦЕНАРИЙ 4: КЗ на шинах 220 кВ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id:          'scenario-4',
    title:       'КЗ на шинах 220 кВ',
    description: 'Сработала дифференциальная защита шин 220 кВ. ' +
                 'Все выключатели секции №1 шин 220 кВ отключились. ' +
                 'Напряжение на секции отсутствует. Локализуйте повреждение и восстановите нормальную схему.',
    timeLimit:   150,
    initialElements: [
      { id: 'bus-220-1', label: 'Шина 220 кВ С1',  type: 'bus',         status: 'fault',   x: 200, y: 55  },
      { id: 'bus-220-2', label: 'Шина 220 кВ С2',  type: 'bus',         status: 'normal',  x: 450, y: 55  },
      { id: 'sw-sb',     label: 'СВ 220 кВ',        type: 'breaker',     status: 'fault',   x: 325, y: 55  },
      { id: 'line-220-1',label: 'Линия ВЛ-220 №1', type: 'line',        status: 'fault',   x: 100, y: 170 },
      { id: 'line-220-2',label: 'Линия ВЛ-220 №2', type: 'line',        status: 'normal',  x: 550, y: 170 },
      { id: 'tr-aт1',    label: 'АТ-1 (220/110)',   type: 'transformer', status: 'fault',   x: 200, y: 310 },
      { id: 'tr-aт2',    label: 'АТ-2 (220/110)',   type: 'transformer', status: 'normal',  x: 450, y: 310 },
    ],
    availableActions: [
      { id: 'd3', label: '3. Проверить показания приборов — нет ли тока КЗ на шинах',    targetElementId: 'bus-220-1', correctOrder: 3,  effect: {} },
      { id: 'd7', label: '7. Восстановить нормальную схему, доложить диспетчеру РДУ',    targetElementId: 'bus-220-2', correctOrder: 7,  effect: {} },
      { id: 'd4', label: '4. Вывести С1 шин 220 кВ из работы (разъединители)',           targetElementId: 'bus-220-1', correctOrder: 4,  effect: { status: 'disabled' } },
      { id: 'd1', label: '1. Доложить диспетчеру РДУ о срабатывании ДЗШ 220 кВ С1',     targetElementId: 'bus-220-1', correctOrder: 1,  effect: {} },
      { id: 'd5', label: '5. Включить секционный выключатель СВ 220 кВ',                 targetElementId: 'sw-sb',     correctOrder: 5,  effect: { status: 'normal' } },
      { id: 'd2', label: '2. Проверить положение всех выключателей С1 шин 220 кВ',        targetElementId: 'bus-220-1', correctOrder: 2,  effect: {} },
      { id: 'd6', label: '6. Перевести ВЛ-220 №1 и АТ-1 на питание от С2',              targetElementId: 'line-220-1',correctOrder: 6,  effect: { status: 'normal' } },
      { id: 'd8', label: '⚠️ Включить С1 шин без осмотра и проверки (ОШИБКА)',           targetElementId: 'bus-220-1', correctOrder: 99, effect: { status: 'fault' } },
      { id: 'd9', label: '⚠️ Включить АТ-1 без перевода на резервную секцию (ОШИБКА)',   targetElementId: 'tr-aт1',    correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // СЦЕНАРИЙ 5: Отключение автотрансформатора АТ-1 220/110 кВ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id:          'scenario-5',
    title:       'Отключение АТ-1 (220/110 кВ)',
    description: 'Сработала дифференциальная защита автотрансформатора АТ-1 220/110 кВ. ' +
                 'АТ-1 отключился со всех сторон. Напряжение на шинах 110 кВ С1 упало. ' +
                 'Переведите нагрузку на АТ-2 и выведите АТ-1 в ремонт.',
    timeLimit:   120,
    initialElements: [
      { id: 'bus-220',  label: 'Шина 220 кВ',      type: 'bus',         status: 'normal',  x: 300, y: 50  },
      { id: 'at1',      label: 'АТ-1 (220/110)',    type: 'transformer', status: 'fault',   x: 150, y: 180 },
      { id: 'at2',      label: 'АТ-2 (220/110)',    type: 'transformer', status: 'normal',  x: 450, y: 180 },
      { id: 'brk-at1v', label: 'Выкл. АТ-1 ВН',    type: 'breaker',     status: 'fault',   x: 150, y: 290 },
      { id: 'brk-at2v', label: 'Выкл. АТ-2 ВН',    type: 'breaker',     status: 'normal',  x: 450, y: 290 },
      { id: 'bus-110-1',label: 'Шина 110 кВ С1',    type: 'bus',         status: 'fault',   x: 150, y: 390 },
      { id: 'bus-110-2',label: 'Шина 110 кВ С2',    type: 'bus',         status: 'normal',  x: 450, y: 390 },
    ],
    availableActions: [
      { id: 'e1', label: '1. Доложить диспетчеру РДУ об отключении АТ-1',              targetElementId: 'at1',       correctOrder: 1,  effect: {} },
      { id: 'e2', label: '2. Проверить показания ДЗТ и газовой защиты АТ-1',           targetElementId: 'at1',       correctOrder: 2,  effect: {} },
      { id: 'e3', label: '3. Убедиться в отключении всех выключателей АТ-1',           targetElementId: 'brk-at1v',  correctOrder: 3,  effect: {} },
      { id: 'e4', label: '4. Включить секционный выключатель шин 110 кВ (СВ-110)',     targetElementId: 'bus-110-1', correctOrder: 4,  effect: { status: 'normal' } },
      { id: 'e5', label: '5. Проверить нагрузку АТ-2 — не превышает ли допустимую',   targetElementId: 'at2',       correctOrder: 5,  effect: {} },
      { id: 'e6', label: '6. Отключить разъединители АТ-1 со стороны ВН и СН',        targetElementId: 'brk-at1v',  correctOrder: 6,  effect: { status: 'disabled' } },
      { id: 'e7', label: '7. Заземлить АТ-1, оформить допуск бригады',                targetElementId: 'at1',       correctOrder: 7,  effect: { status: 'disabled' } },
      { id: 'e8', label: '8. Доложить диспетчеру о выводе АТ-1 в ремонт',             targetElementId: 'bus-220',   correctOrder: 8,  effect: {} },
      { id: 'e9', label: '⚠️ Включить АТ-1 повторно без проверки защит (ОШИБКА)',      targetElementId: 'at1',       correctOrder: 99, effect: { status: 'fault' } },
      { id: 'e10',label: '⚠️ Не включать СВ-110, оставить С1 без напряжения (ОШИБКА)',targetElementId: 'bus-110-1', correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // СЦЕНАРИЙ 6: Однофазное замыкание на землю (ОЗЗ) в сети 10 кВ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id:          'scenario-6',
    title:       'ОЗЗ в сети 10 кВ',
    description: 'На секции 10 кВ №2 зафиксировано однофазное замыкание на землю (ОЗЗ). ' +
                 'Сработала сигнализация ОЗЗ, напряжение нулевой последовательности 3U₀ = 100%. ' +
                 'Поврежденное присоединение не отключилось. Найдите и отключите повреждённый фидер.',
    timeLimit:   110,
    initialElements: [
      { id: 'bus-10-2',  label: 'Шина 10 кВ С2',    type: 'bus',     status: 'warning', x: 300, y: 55  },
      { id: 'fdr-1',     label: 'Фидер Ф-201',       type: 'line',    status: 'normal',  x: 80,  y: 180 },
      { id: 'fdr-2',     label: 'Фидер Ф-202',       type: 'line',    status: 'warning', x: 200, y: 180 },
      { id: 'fdr-3',     label: 'Фидер Ф-203',       type: 'line',    status: 'normal',  x: 320, y: 180 },
      { id: 'fdr-4',     label: 'Фидер Ф-204',       type: 'line',    status: 'normal',  x: 440, y: 180 },
      { id: 'fdr-5',     label: 'Фидер Ф-205',       type: 'line',    status: 'normal',  x: 560, y: 180 },
      { id: 'tr-10',     label: 'Тр-р 110/10 кВ',    type: 'transformer', status: 'normal', x: 300, y: 360 },
    ],
    availableActions: [
      { id: 'f4', label: '4. Восстановить Ф-201 (3U₀ не исчезло) — не он',                targetElementId: 'fdr-1',    correctOrder: 4,  effect: {} },
      { id: 'f1', label: '1. Зафиксировать показания 3U₀ и сообщить диспетчеру',           targetElementId: 'bus-10-2', correctOrder: 1,  effect: {} },
      { id: 'f2', label: '2. Проверить показания ОЗЗ-реле по всем фидерам С2',             targetElementId: 'bus-10-2', correctOrder: 2,  effect: {} },
      { id: 'f6', label: '6. Оставить Ф-202 отключённым, доложить диспетчеру',             targetElementId: 'bus-10-2', correctOrder: 6,  effect: { status: 'normal' } },
      { id: 'f3', label: '3. Поочерёдно отключить Ф-201 — проверить исчезновение 3U₀',    targetElementId: 'fdr-1',    correctOrder: 3,  effect: {} },
      { id: 'f5', label: '5. Отключить Ф-202 — 3U₀ исчезло, повреждение на Ф-202',        targetElementId: 'fdr-2',    correctOrder: 5,  effect: { status: 'disabled' } },
      { id: 'f7', label: '7. Организовать выезд бригады на трассу Ф-202 для поиска места', targetElementId: 'fdr-2',    correctOrder: 7,  effect: {} },
      { id: 'f8', label: '⚠️ Отключить всю секцию 10 кВ С2 без поиска (ОШИБКА)',           targetElementId: 'bus-10-2', correctOrder: 99, effect: { status: 'fault' } },
      { id: 'f9', label: '⚠️ Игнорировать ОЗЗ — работать более 2 часов без действий (ОШИБКА)', targetElementId: 'bus-10-2', correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // СЦЕНАРИЙ 7: Потеря оперативного тока (DC) на подстанции
  // ─────────────────────────────────────────────────────────────────────────
  {
    id:          'scenario-7',
    title:       'Потеря оперативного тока (DC 220 В)',
    description: 'Сработала сигнализация «Неисправность ЩПТ». ' +
                 'Потеряно оперативное питание DC 220 В на секции №1. ' +
                 'Защиты и управление выключателями секции №1 не работают. ' +
                 'Переведите нагрузку на резервный щит постоянного тока и восстановите питание.',
    timeLimit:   100,
    initialElements: [
      { id: 'batt-1',  label: 'Аккум. батарея №1', type: 'transformer', status: 'fault',   x: 120, y: 80  },
      { id: 'batt-2',  label: 'Аккум. батарея №2', type: 'transformer', status: 'normal',  x: 480, y: 80  },
      { id: 'zpt-1',   label: 'ЩПТ-1 (DC 220 В)',  type: 'bus',         status: 'fault',   x: 120, y: 210 },
      { id: 'zpt-2',   label: 'ЩПТ-2 (DC 220 В)',  type: 'bus',         status: 'normal',  x: 480, y: 210 },
      { id: 'sw-dc',   label: 'СВ ЩПТ (DC)',        type: 'breaker',     status: 'fault',   x: 300, y: 210 },
      { id: 'bus-220', label: 'Шина 220 кВ',         type: 'bus',         status: 'warning', x: 300, y: 360 },
      { id: 'bus-110', label: 'Шина 110 кВ',         type: 'bus',         status: 'warning', x: 300, y: 430 },
    ],
    availableActions: [
      { id: 'g2', label: '2. Проверить автоматы и предохранители ЩПТ-1',                    targetElementId: 'zpt-1',  correctOrder: 2,  effect: {} },
      { id: 'g1', label: '1. Доложить диспетчеру о потере оперативного тока ЩПТ-1',         targetElementId: 'zpt-1',  correctOrder: 1,  effect: {} },
      { id: 'g4', label: '4. Включить секционный автомат СВ ЩПТ (перевести С1 на ЩПТ-2)',  targetElementId: 'sw-dc',  correctOrder: 4,  effect: { status: 'normal' } },
      { id: 'g5', label: '5. Убедиться в наличии оперативного тока на всех присоединениях', targetElementId: 'zpt-1',  correctOrder: 5,  effect: { status: 'normal' } },
      { id: 'g3', label: '3. Проверить напряжение аккумуляторной батареи №1',               targetElementId: 'batt-1', correctOrder: 3,  effect: {} },
      { id: 'g7', label: '7. Вызвать службу СДТУ для ремонта ЩПТ-1, оформить заявку',      targetElementId: 'batt-1', correctOrder: 7,  effect: {} },
      { id: 'g6', label: '6. Проверить исправность защит и сигнализации после восстановления',targetElementId: 'bus-220',correctOrder: 6,  effect: { status: 'normal' } },
      { id: 'g8', label: '⚠️ Продолжать работу без оперативного тока на С1 (ОШИБКА)',        targetElementId: 'zpt-1',  correctOrder: 99, effect: { status: 'fault' } },
      { id: 'g9', label: '⚠️ Включить СВ ЩПТ без проверки батареи №1 (ОШИБКА)',             targetElementId: 'sw-dc',  correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // СЦЕНАРИЙ 8: Перегрузка линии 110 кВ при отключении параллельной цепи
  // ─────────────────────────────────────────────────────────────────────────
  {
    id:          'scenario-8',
    title:       'Перегрузка ВЛ-110 кВ при отключении параллельной цепи',
    description: 'Аварийно отключилась ВЛ-110 кВ цепь №2. Вся нагрузка перешла на цепь №1. ' +
                 'Ток в цепи №1 достиг 112% от допустимого. ' +
                 'Сработала сигнализация перегрузки. Примите меры по разгрузке линии.',
    timeLimit:   90,
    initialElements: [
      { id: 'bus-110-a', label: 'Шина 110 кВ (ПС-А)',  type: 'bus',         status: 'normal',  x: 150, y: 55  },
      { id: 'bus-110-b', label: 'Шина 110 кВ (ПС-Б)',  type: 'bus',         status: 'warning', x: 450, y: 55  },
      { id: 'vl-110-1',  label: 'ВЛ-110 кВ цепь №1',  type: 'line',        status: 'warning', x: 200, y: 190 },
      { id: 'vl-110-2',  label: 'ВЛ-110 кВ цепь №2',  type: 'line',        status: 'fault',   x: 400, y: 190 },
      { id: 'brk-vl1',   label: 'Выкл. Q-ВЛ1',         type: 'breaker',     status: 'warning', x: 200, y: 310 },
      { id: 'brk-vl2',   label: 'Выкл. Q-ВЛ2',         type: 'breaker',     status: 'fault',   x: 400, y: 310 },
      { id: 'tr-b',      label: 'Тр-р ПС-Б (110/10)',  type: 'transformer', status: 'warning', x: 450, y: 390 },
    ],
    availableActions: [
      { id: 'h1', label: '1. Доложить диспетчеру о перегрузке ВЛ-110 №1 и отключении №2',   targetElementId: 'vl-110-1', correctOrder: 1,  effect: {} },
      { id: 'h2', label: '2. Зафиксировать ток нагрузки и время допустимой перегрузки',      targetElementId: 'vl-110-1', correctOrder: 2,  effect: {} },
      { id: 'h3', label: '3. Запросить диспетчера об отключении части нагрузки на ПС-Б',     targetElementId: 'bus-110-b',correctOrder: 3,  effect: {} },
      { id: 'h4', label: '4. Отключить наименее ответственные фидеры 10 кВ на ПС-Б',         targetElementId: 'tr-b',     correctOrder: 4,  effect: { status: 'normal' } },
      { id: 'h5', label: '5. Проверить снижение тока ВЛ-110 №1 до допустимого',              targetElementId: 'vl-110-1', correctOrder: 5,  effect: { status: 'normal' } },
      { id: 'h6', label: '6. Выяснить причину отключения ВЛ-110 №2, доложить диспетчеру',   targetElementId: 'vl-110-2', correctOrder: 6,  effect: {} },
      { id: 'h7', label: '7. После устранения — включить ВЛ-110 №2 по разрешению диспетчера',targetElementId: 'brk-vl2',  correctOrder: 7,  effect: { status: 'normal' } },
      { id: 'h8', label: '8. Восстановить отключённую нагрузку на ПС-Б',                     targetElementId: 'tr-b',     correctOrder: 8,  effect: { status: 'normal' } },
      { id: 'h9', label: '⚠️ Включить ВЛ-110 №2 без выяснения причины отключения (ОШИБКА)',  targetElementId: 'brk-vl2',  correctOrder: 99, effect: { status: 'fault' } },
      { id: 'h10',label: '⚠️ Игнорировать перегрузку, ждать срабатывания защиты (ОШИБКА)',   targetElementId: 'vl-110-1', correctOrder: 99, effect: { status: 'fault' } },
    ],
    correctSequence: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'],
  },
];