import React from 'react'

function Underline(props) {
  const { width = 16, height = 16 } = props

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <g fillRule="evenodd">
        <path d="M15 14.165H1a.833.833 0 0 0 0 1.667h14a.833.833 0 1 0 0-1.667zM1.319 1.832h.908c.092 0 .167.075.167.167V7.68a5.606 5.606 0 1 0 11.212 0V2c0-.092.075-.167.167-.167h.908a.833.833 0 1 0 0-1.666h-3.814a.833.833 0 1 0 0 1.666h.908c.092 0 .167.075.167.167v5.682a3.94 3.94 0 0 1-7.879 0V2c0-.092.075-.167.167-.167h.903a.833.833 0 1 0 0-1.666H1.32a.833.833 0 1 0 0 1.666v-.001z" />
      </g>
    </svg>
  )
}

export default Underline
