import React from 'react'

export default ({ height = '20', width = '19', color = '#ffffff' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path d="M-2-2h24v24H-2z" />
      <g fill={color}>
        <path d="M16 20H2c-1.103 0-2-.897-2-2V4c0-1.102.897-2 2-2h7v2H2v14h14V9h2v9c0 1.103-.897 2-2 2z" />
        <path d="M7.808 8.365l2.828 2.827L7.1 11.9zm10.606-4.95a2 2 0 1 0-2.828-2.83L9.222 6.95l2.83 2.83 6.362-6.366z" />
      </g>
    </g>
  </svg>
)
