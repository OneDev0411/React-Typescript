import React from 'react'

export default function QuestionCircleIcon (props) {
  return (
    <svg width={16} height={16} {...props}>
      <g fill="none" fillRule="evenodd" stroke="#000">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6a2 2 0 1 1 2.667 1.886A1 1 0 0 0 8 8.829V9.5m0 2a.25.25 0 1 0 0 .5.25.25 0 0 0 0-.5"
        />
        <circle cx={8} cy={8} r={7.5} />
      </g>
    </svg>
  )
} 