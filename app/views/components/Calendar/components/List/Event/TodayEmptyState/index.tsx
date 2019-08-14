import React from 'react'

import styles from '../styles'

interface Props {
  style: React.CSSProperties
}

const emptyRowStyles = {
  alignItems: 'center',
  height: '100%',
  color: '#536280'
}

export function TodayEmptyState({ style }: Props) {
  return (
    <div style={style}>
      <div
        style={{
          ...styles.row,
          ...emptyRowStyles
        }}
      >
        <div style={styles.container}>No event set for today!</div>
      </div>
    </div>
  )
}
