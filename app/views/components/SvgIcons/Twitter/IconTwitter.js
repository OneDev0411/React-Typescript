import React from 'react'

function Twitter(props) {
  const { width = 16, height = 16, color = '#333' } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
    >
      <path
        stroke={color}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.4532 3.47331L14.0532 2.87331L14.7866 1.27331L13.0799 1.83998V1.83998C12.5363 1.33326 11.823 1.04794 11.0799 1.03998V1.03998C9.42456 1.04364 8.08356 2.38464 8.07989 4.03998V4.70664C5.71989 5.19331 3.65989 3.90664 1.74656 1.70664C1.41322 3.48442 1.74656 4.81776 2.74656 5.70664L0.553223 5.37331H0.553223C0.728106 6.83062 1.92132 7.95366 3.38656 8.03998L1.55322 8.70665C2.21989 10.04 3.43322 10.2466 5.05322 10.3733H5.05322C3.7291 11.2764 2.1556 11.7427 0.553223 11.7066C9.05989 15.4866 14.0532 9.93331 14.0532 5.03998V4.48665L15.4532 3.47331Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default Twitter
