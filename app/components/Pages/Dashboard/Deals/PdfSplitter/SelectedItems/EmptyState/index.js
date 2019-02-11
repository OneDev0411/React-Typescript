import React from 'react'

import IconSplitterDnD from 'components/SvgIcons/SplitterDnD/IconSplitterDnD'

export function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '1rem',
        borderRadius: '3px',
        border: '1px dashed #ccc',
        width: '12rem'
      }}
    >
      <IconSplitterDnD />

      <div
        style={{ marginTop: '2rem', color: '#808080', fontSize: '0.875rem' }}
      >
        Drag and drop pages from left column
      </div>
    </div>
  )
}
