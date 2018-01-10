import React from 'react'

const Folder = ({ color = '#c9d7df', width = '1em', height = '1em' }) => (
  <svg width={width} height={height} viewBox="0 0 96 84" >
    <path
      d="M0 75c0 4.969 4.031 9 9 9h78c4.969 0 9-4.031 9-9V24c0-4.969-4.031-9-9-9H51L42 0H9C4.031 0 0 4.031 0 9v66zm84-3H12V12h23.211l5.5 9.172 3.5 5.828H84v45z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
)

export default Folder