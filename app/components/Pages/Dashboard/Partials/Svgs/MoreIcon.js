import React from 'react'

export default ({
  fill = "#B2B2B2",
  width = 4,
  height = 20
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 4 20">
    <g fill={fill} fillRule="evenodd">
      <circle cx="2" cy="2" r="2"/>
      <circle cx="2" cy="10" r="2"/>
      <circle cx="2" cy="18" r="2"/>
    </g>
  </svg>
)
