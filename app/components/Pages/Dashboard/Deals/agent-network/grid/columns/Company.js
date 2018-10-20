import React from 'react'

export const Company = ({ name }) => (
  <div
    style={{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
  >
    {name}
  </div>
)
