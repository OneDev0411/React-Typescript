// Chat.js
import React from 'react'
export default ({ color = '#4E5C6C', width = 20, height = 19 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 19"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={color}
      d="M1.175 17.947c-.132 0-.262-.054-.36-.155-.147-.155-.183-.39-.088-.583l1.85-3.76C.91 11.964 0 10.034 0 7.975 0 3.57 4.262-.015 9.5-.015S19 3.568 19 7.974c0 4.407-4.262 7.992-9.5 7.992-1.065 0-2.11-.148-3.114-.44l-5 2.372c-.068.03-.14.047-.21.047z"
    />
  </svg>
)
