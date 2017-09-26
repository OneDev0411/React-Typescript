import React from 'react'

export default ({ fill = '#9B9B9B', width = 16, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={fill} fillRule="evenodd">
      <path d="M14 20H3c-1.103 0-2-.897-2-2v-3h2v3h11V2H3v3H1V2c0-1.102.897-2 2-2h11c1.103 0 2 .898 2 2v16c0 1.103-.897 2-2 2" />
      <path d="M7.707 5.292L6.293 6.708 8.59 9H0v2h8.582l-2.29 2.294 1.415 1.412 4.708-4.715z" />
    </g>
  </svg>
)
