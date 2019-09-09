import React from 'react'

function Instagram(props) {
  const { width = 16, height = 16, color = '#333' } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="-3 -3 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.49341 15.5C3.28429 15.5 1.49341 13.7091 1.49341 11.5V4.5C1.49341 2.29088 3.28429 0.5 5.49341 0.5H12.4934C14.7025 0.5 16.4934 2.29088 16.4934 4.5V11.5C16.4934 13.7091 14.7025 15.5 12.4934 15.5H5.49341Z"
        clipRule="evenodd"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.3503 5.643C12.652 6.94474 12.652 9.0553 11.3503 10.357C10.0485 11.6588 7.93797 11.6588 6.63622 10.357C5.33448 9.0553 5.33448 6.94474 6.63622 5.643C7.93797 4.34125 10.0485 4.34125 11.3503 5.643"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.8932 3.43333V3.43333C13.8932 3.61742 13.744 3.76666 13.5599 3.76666C13.3758 3.76666 13.2266 3.61742 13.2266 3.43333"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.2266 3.43335L13.2266 3.43335C13.2266 3.24925 13.3758 3.10002 13.5599 3.10002C13.744 3.10002 13.8932 3.24925 13.8932 3.43335V3.43335"
      />
    </svg>
  )
}

export default Instagram
