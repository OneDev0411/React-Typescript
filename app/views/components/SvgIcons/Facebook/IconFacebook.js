import React from 'react'

function Facebook(props) {
  const { width = 16, height = 16, color = '#333' } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="-6 -2 24 24"
      fill="none"
    >
      <path
        stroke={color}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.44075 6.16668H5.70218V4.89335V4.89335C5.66667 4.527 5.92426 4.20017 6.27752 4.16335C6.29996 4.16101 6.32249 4.1599 6.34504 4.16001H8.27361V1.49335H5.49004C2.96361 1.49335 2.4879 3.49335 2.4879 4.73335V6.16668H0.559326V8.83335H2.4879V16.5H5.70218V8.83335H8.17718L8.44075 6.16668Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default Facebook
