import React from 'react'

export default ({ fill = '#BFBFC0', width = 10, height = 2 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 2"
    className="minimize-icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      className="minimize-icon path"
      d="M0 0h10v2H0z"
    />
  </svg>
)
