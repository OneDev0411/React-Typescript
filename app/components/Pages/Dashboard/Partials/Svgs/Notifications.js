// Notifications.js
import React from 'react'
export default ({ color = '#4E5C6C', width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 23"
  >
    <g fill="none" fillRule="evenodd" stroke={color} strokeLinejoin="round">
      <path
        fill={color}
        d="M20.5 11c0-3.651-2.309-6.756-5.54-7.959C14.738 1.603 13.5.5 12 .5S9.258 1.603 9.037 3.041C5.805 4.244 3.5 7.349 3.5 11v5.5c0 1.657-1.344 3-3 3h23c-1.659 0-3-1.343-3-3V11z"
      />
      <path d="M15 19.5c0 1.657-1.344 3-3 3-1.659 0-3-1.343-3-3" />
    </g>
  </svg>
)
