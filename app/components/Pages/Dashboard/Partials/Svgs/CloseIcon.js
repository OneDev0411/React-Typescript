import React from 'react'

export default ({ fill = '#BFBFC0', width = 10, height = 10 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    className="close-icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      className="close-icon path"
      d="M9.677 8.104L6.573 5l3.104-3.104A1.111 1.111 0 0 0 8.104.325L5.001 3.428 1.898.325A1.112 1.112 0 0 0 .325 1.896L3.43 5 .325 8.103a1.11 1.11 0 0 0 1.572 1.572L5 6.572l3.103 3.102a1.111 1.111 0 0 0 1.573-1.57z"
    />
  </svg>
)
