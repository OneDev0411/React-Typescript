import React from 'react'

import { borderColor } from '../../../../../../../../views/utils/colors'

export function Divider() {
  return (
    <div
      style={{
        width: '1px',
        height: '24px',
        margin: '0 1em',
        backgroundColor: borderColor
      }}
    />
  )
}
