import React from 'react'

export default ({ height = '14', width = '14', fill = '#ffffff' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M5 10A5 5 0 1 1 5 0a5 5 0 0 1 0 10zm0-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm3.54.61a.758.758 0 0 1-.004-1.074.763.763 0 0 1 1.074.003l3.467 3.467a.758.758 0 0 1 .004 1.075.763.763 0 0 1-1.075-.004L8.539 9.61z"
    />
  </svg>
)
