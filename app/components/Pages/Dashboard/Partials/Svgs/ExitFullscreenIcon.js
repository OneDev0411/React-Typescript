import React from 'react'

export default ({
  fill = "#B2B2B2",
  width = 20,
  height = 20
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" >
    <g fill={fill} fillRule="evenodd">
      <path d="M1.707 19.707L7 14.414V17h2v-6H3v2h2.586L.293 18.293zM17 7h-2.586l5.293-5.293L18.293.293 13 5.586V3h-2v6h6z"/>
    </g>
  </svg>
)
