import React from 'react'
export default ({ color = '#4E5C6C', width = 19, height = 19 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 21"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={color} fillRule="evenodd">
      <path d="M12 15.93c.525-.203.9-.71.9-1.304 0-.595-.375-1.102-.9-1.304v2.61zm-1.9-5.105c0 .595.375 1.102.9 1.305V9.52c-.525.203-.9.71-.9 1.305" />
      <path d="M15 4H9V2.5c0-.827.673-1.5 1.5-1.5h3c.827 0 1.5.673 1.5 1.5V4zm-1.1 10.626c0 1.152-.816 2.115-1.9 2.346V18c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-1.028c-1.084-.23-1.9-1.194-1.9-2.346 0-.276.223-.5.5-.5.276 0 .5.224.5.5 0 .595.375 1.102.9 1.305v-2.76c-1.084-.23-1.9-1.19-1.9-2.343 0-1.152.816-2.115 1.9-2.346V7.5c0-.276.224-.5.5-.5s.5.224.5.5v.98c1.084.23 1.9 1.193 1.9 2.345 0 .277-.223.5-.5.5-.276 0-.5-.223-.5-.5 0-.595-.375-1.102-.9-1.304v2.76c1.084.23 1.9 1.196 1.9 2.348zM20.5 4H16V2.5C16 1.122 14.88 0 13.5 0h-3C9.12 0 8 1.122 8 2.5V4H3.5C1.57 4 0 5.57 0 7.5v10C0 19.43 1.57 21 3.5 21h17c1.93 0 3.5-1.57 3.5-3.5v-10C24 5.57 22.43 4 20.5 4z" />
    </g>
  </svg>
)
