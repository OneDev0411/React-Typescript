import React from 'react'
import fecha from 'fecha'

import { hexToRgb } from 'utils/hex-to-rgb'
import { primary } from 'views/utils/colors'

import { ContainerStyle, FlexStyle } from './styles'

interface IProps {
  activeDate: Date | null
  style: React.CSSProperties
  item: ICalendarDayRow
}

/**
 * renders the day header
 * @param props
 */
export function DayHeader(props: IProps) {
  const date = new Date(props.item.date)

  const isActive =
    props.activeDate &&
    props.activeDate.getTime() === new Date(props.item.date).getTime()

  return (
    <div style={{ ...props.style }}>
      <div
        style={{
          ...ContainerStyle,
          backgroundColor: isActive ? '#e5ebfe' : '#f5f8fa',
          color: isActive ? '#3050f2' : '#000'
        }}
      >
        <div style={FlexStyle}>
          <strong
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              width: '35px',
              height: '35px',
              zIndex: 1,
              borderRadius: '50%',
              ...getColors(props.item.is_today, isActive)
            }}
          >
            {fecha.format(date, 'DD')}
          </strong>

          <span
            style={{
              textTransform: 'uppercase'
            }}
          >
            {date.getFullYear() !== new Date().getFullYear()
              ? fecha.format(date, 'MMM YYYY, ddd')
              : fecha.format(date, 'MMM, ddd')}
          </span>
        </div>
      </div>
    </div>
  )
}

function getColors(
  isToday: boolean,
  isActiveDay: boolean | null
): React.CSSProperties {
  if (isToday) {
    return {
      color: '#fff',
      backgroundColor: primary
    }
  }

  if (isActiveDay) {
    return {
      color: primary,
      backgroundColor: `rgba(${hexToRgb(primary)}, 0.14)`
    }
  }

  return {
    color: '#000'
  }
}
