import React from 'react'

import styles from '../../styles'

interface Props {
  event: ICalendarEvent
  style: React.CSSProperties
}

const emptyRowStyles = {
  alignItems: 'center',
  height: '100%',
  color: '#536280'
}

export function EmptyState({ event, style }: Props) {
  return (
    <>
      <div style={style}>
        <div
          style={{
            ...styles.row,
            ...emptyRowStyles
          }}
        >
          <div style={styles.container}>
            No event set for this {event.type}!
          </div>
        </div>
      </div>
    </>
  )
}
