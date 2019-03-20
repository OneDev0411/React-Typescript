import React from 'react'

function Quote(props) {
  const { width = 16, height = 16, color = '#333' } = props

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <g fill={color} fillRule="nonzero">
        <path d="M12.373 2.621a3.295 3.295 0 1 0 0 6.589c.25 0 .5-.032.743-.094a.167.167 0 0 1 .184.245 4.553 4.553 0 0 1-3.919 2.349.833.833 0 1 0 0 1.667 6.473 6.473 0 0 0 6.286-6.634v-.828a3.298 3.298 0 0 0-3.294-3.294zM4.157 2.621a3.295 3.295 0 0 0 0 6.589c.251 0 .5-.032.744-.094a.167.167 0 0 1 .184.245 4.553 4.553 0 0 1-3.918 2.349.833.833 0 1 0 0 1.667 6.474 6.474 0 0 0 6.285-6.634v-.828a3.298 3.298 0 0 0-3.295-3.294z" />
      </g>
    </svg>
  )
}

export default Quote
