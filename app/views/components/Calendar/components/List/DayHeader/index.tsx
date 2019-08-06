import React from 'react'
import fecha from 'fecha'

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
    props.activeDate.toDateString() === new Date(props.item.date).toDateString()

  return (
    <div style={{ ...props.style, ...FlexStyle }}>
      <div
        style={{
          ...ContainerStyle,
          backgroundColor: isActive ? '#e5ebfe' : '#f5f8fa',
          color: isActive ? '#3050f2' : '#000'
        }}
      >
        <div
          style={{
            ...FlexStyle,
            width: '9rem'
          }}
        >
          <strong
            style={{
              marginRight: '1rem'
            }}
          >
            {fecha.format(date, 'DD')}
          </strong>

          {date.getFullYear() !== new Date().getFullYear() && (
            <span>{date.getFullYear()}&nbsp;</span>
          )}

          <span
            style={{
              textTransform: 'uppercase'
            }}
          >
            {fecha.format(date, 'MMM, ddd')}
          </span>
        </div>

        <div style={FlexStyle}>
          {props.item.is_today && <strong>TODAY</strong>}
        </div>
      </div>
    </div>
  )
}
