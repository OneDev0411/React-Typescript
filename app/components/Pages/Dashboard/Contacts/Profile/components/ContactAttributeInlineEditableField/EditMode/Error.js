import React from 'react'

export function Error(props) {
  return (
    <div style={{ marginTop: '0.5em', color: '#F43B38', fontSize: '0.875rem' }}>
      {props.children}
    </div>
  )
}
