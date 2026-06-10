import type { SchemeElement } from '../../types';
import { STATUS_COLOR, STATUS_LABEL, ELEMENT_ICON } from '../../constants/maps';

interface Props {
  elements: SchemeElement[];
}

export function SchemeCanvas({ elements }: Props) {
  return (
    <div style={{
      position: 'relative',
      height: 480,                  // ← чуть больше запас
      background: '#0f172a',
      borderRadius: 12,
      overflow: 'visible',          // ← было 'hidden', теперь не обрезаем
      border: '1px solid #1e293b',
    }}>
      <div style={{
        color: '#94a3b8', padding: '12px 16px', fontSize: 13,
        borderBottom: '1px solid #1e293b',
      }}>
        📐 Однолинейная схема подстанции
      </div>

      {elements.map(el => {
        const isBus = el.type === 'bus';

        return (
          <div key={el.id} style={{
            position:  'absolute',
            left:      el.x,
            top:       el.y + 40,
            transform: 'translate(-50%, -50%)',
            // ── ширина контейнера зависит от типа ──────────────────
            width:     isBus ? 180 : 90,   // ← шина получает свою ширину
            textAlign: 'center',
          }}>
            <div style={{
              width:          isBus ? '100%' : 56,
              height:         isBus ? 12     : 56,
              background:     STATUS_COLOR[el.status],
              borderRadius:   isBus ? 4 : el.type === 'transformer' ? 28 : 8,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              margin:         isBus ? '0' : '0 auto', // ← иконка по центру контейнера
              fontSize:       22,
              boxShadow:      `0 0 12px ${STATUS_COLOR[el.status]}88`,
              transition:     'all 0.4s ease',
            }}>
              {!isBus && ELEMENT_ICON[el.type]}
            </div>

            <div style={{
              color:     '#e2e8f0',
              fontSize:  11,
              marginTop: 4,
              lineHeight: 1.3,
              // whiteSpace убран — пусть переносится, иначе вылезает за экран
            }}>
              {el.label}
            </div>

            <div style={{
              color:      STATUS_COLOR[el.status],
              fontSize:   10,
              fontWeight: 600,
            }}>
              {STATUS_LABEL[el.status]}
            </div>
          </div>
        );
      })}
    </div>
  );
}