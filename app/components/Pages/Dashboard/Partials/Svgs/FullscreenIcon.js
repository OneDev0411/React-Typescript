import React from 'react'

export default ({ fill = '#BFBFC0', width = '9', height = '9' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 9 9"
    className="minimize-icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill}
      fillRule="evenodd"
      className="minimize-icon path"
      d="M2.707 2h2.586L0 7.293l1.414 1.414 5.293-5.293V6h2V0h-6z"
    />
  </svg>
)
