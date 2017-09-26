// Deals.js
import React from 'react'
export default ({ color = '#4E5C6C', width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 23 23"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={color}>
      <path d="M9.5 9c0 .93.64 1.705 1.5 1.93V7.07c-.86.225-1.5 1-1.5 1.93M12 15.93c.86-.225 1.5-1 1.5-1.93 0-.93-.64-1.705-1.5-1.928v3.857z" />
      <path d="M14.5 14c0 1.483-1.084 2.71-2.5 2.95V18c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-1.05c-1.416-.24-2.5-1.467-2.5-2.95 0-.276.224-.5.5-.5s.5.224.5.5c0 .93.64 1.705 1.5 1.93v-3.98C9.584 11.71 8.5 10.482 8.5 9S9.584 6.29 11 6.05V5c0-.276.224-.5.5-.5s.5.224.5.5v1.05c1.416.24 2.5 1.467 2.5 2.95 0 .276-.224.5-.5.5s-.5-.224-.5-.5c0-.93-.64-1.705-1.5-1.93v3.98c1.416.24 2.5 1.467 2.5 2.95m-3-14C5.16 0 0 5.16 0 11.5S5.16 23 11.5 23 23 17.84 23 11.5 17.84 0 11.5 0" />
    </g>
  </svg>
)
