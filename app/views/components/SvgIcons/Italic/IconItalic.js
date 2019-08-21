import React from 'react'

function Italic(props) {
  const { width = 16, height = 16 } = props

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 .165H9.909a.833.833 0 0 0 0 1.667h.724a.167.167 0 0 1 .14.256L3.187 14.011a.333.333 0 0 1-.282.154H1a.833.833 0 0 0 0 1.667h5.091a.833.833 0 1 0 0-1.667h-.724a.167.167 0 0 1-.14-.256l7.586-11.922a.333.333 0 0 1 .282-.155H15a.833.833 0 1 0 0-1.667z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default Italic
