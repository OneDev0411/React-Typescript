import React from 'react'

import { fade } from '@material-ui/core/styles'

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
  const isActive =
    props.activeDate &&
    props.activeDate.getTime() === new Date(props.item.date).getTime()

  return (
    <div style={{ ...props.style }}>
      <div
        style={{
          ...ContainerStyle,
          ...getStyles(props.item, isActive)
        }}
      >
        <div style={FlexStyle}>
          {props.item.isToday && 'Today '} {props.item.title}
        </div>
      </div>
    </div>
  )
}

/**
 *
 * @param isToday
 * @param isActiveDay
 */
function getStyles(
  item: ICalendarEventHeader,
  isActiveDay: boolean | null
): React.CSSProperties {
  if (item.isToday) {
    return {
      color: '#fff',
      backgroundColor: primary,
      fontWeight: 500
    }
  }

  if (isActiveDay) {
    return {
      color: primary,
      backgroundColor: fade(primary, 0.14),
      fontWeight: 500
    }
  }

  return {
    backgroundColor: '#f5f8fa',
    color: '#000'
  }
}
