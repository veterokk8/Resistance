import type { ElementStatus, SchemeElement } from '../types';

export const STATUS_COLOR: Record<ElementStatus, string> = {
  normal:   '#22c55e',
  fault:    '#ef4444',
  disabled: '#94a3b8',
  warning:  '#f59e0b',
};

export const STATUS_LABEL: Record<ElementStatus, string> = {
  normal:   'В работе',
  fault:    'АВАРИЯ',
  disabled: 'Отключён',
  warning:  'Предупреждение',
};

export const ELEMENT_ICON: Record<SchemeElement['type'], string> = {
  breaker:     '🔌',
  line:        '⚡',
  transformer: '🔄',
  bus:         '',
};