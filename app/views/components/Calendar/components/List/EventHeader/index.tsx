import React from 'react'
import fecha from 'fecha'

import { hexToRgb } from 'utils/hex-to-rgb'
import { primary } from 'views/utils/colors'

import { ContainerStyle, FlexStyle } from './styles'

interface IProps {
  activeDate: Date | null
  style: React.CSSProperties
  item: ICalendarEventHeader
}

/**
 * renders the day header
 * @param props
 */
export function EventHeader(props: IProps) {
  const date = new Date(props.item.date)

  const isActive =
    props.activeDate &&
    props.activeDate.getTime() === new Date(props.item.date).getTime()

  return (
    <div style={{ ...props.style }}>
      <div
        style={{
          ...ContainerStyle,
          backgroundColor: '#f5f8fa',
          color: '#000'
        }}
      >
        <div style={FlexStyle}>
          <strong
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              zIndex: 1,
              borderRadius: '50%',
              ...getBoxSize(props.item),
              ...getColors(props.item, isActive)
            }}
          >
            {props.item.title}
          </strong>

          <span
            style={{
              textTransform: 'uppercase'
            }}
          >
            {getSecondaryText(props.item, date)}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * returns secondary text of the header
 * @param item
 * @param date
 */
function getSecondaryText(item: ICalendarEventHeader, date: Date) {
  if (item.headerType === 'day-header') {
    return date.getFullYear() !== new Date().getFullYear()
      ? fecha.format(date, 'MMM YYYY, ddd')
      : fecha.format(date, 'MMM, ddd')
  }

  return date.getFullYear() !== new Date().getFullYear()
    ? fecha.format(date, 'MMMM YYYY')
    : fecha.format(date, 'MMMM')
}

/**
 *
 * @param isToday
 * @param isActiveDay
 */
function getColors(
  item: ICalendarEventHeader,
  isActiveDay: boolean | null
): React.CSSProperties {
  if (item.isToday) {
    return {
      color: '#fff',
      backgroundColor: primary
    }
  }

  if (isActiveDay) {
    return {
      color: primary,
      backgroundColor:
        item.headerType === 'day-header'
          ? `rgba(${hexToRgb(primary)}, 0.14)`
          : 'transparent'
    }
  }

  return {
    color: '#000'
  }
}

function getBoxSize(item: ICalendarEventHeader) {
  const size = item.headerType === 'day-header' ? '30px' : 'auto'

  return {
    width: size,
    height: size
  }
}
