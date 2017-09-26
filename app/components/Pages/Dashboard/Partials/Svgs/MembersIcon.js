import React from 'react'

export default ({ fill = '#B2B2B2', width = 16, height = 16 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={fill} fillRule="evenodd">
      <path d="M8 8c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4M8 9c-4.71 0-8 2.467-8 6v1h16v-1c0-3.533-3.29-6-8-6" />
    </g>
  </svg>
)
