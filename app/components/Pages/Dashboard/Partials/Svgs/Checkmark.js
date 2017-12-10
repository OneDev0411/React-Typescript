import React from 'react'
export default ({ color = '#4E5C6C', width = 11, height = 8 }) => (
  <svg className="svg-checkmark" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 11 8">
    <path
      fill="none"
      fillRule="evenodd"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.571 1L3.143 7 1 4.857"
    />
  </svg>

)
