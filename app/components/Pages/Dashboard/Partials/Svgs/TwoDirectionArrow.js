import React from 'react'

export default ({ height = '16', width = '16', fill = '#ffffff' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M7 14H3.414L14 3.414V7h2V0H9v2h3.586L2 12.586V9H0v7h7z"
    />
  </svg>
)
