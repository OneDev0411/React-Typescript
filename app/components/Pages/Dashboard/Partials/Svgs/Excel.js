import React from 'react'

const Document = ({ height = '32', width = '40', fill = '#8da2b5' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
  >
    <g fill={fill} fillRule="evenodd">
      <path d="M81.102 30.602L61.399 11a3.997 3.997 0 0 0-3.398-2H31c-7.73 0-14 6.27-14 14v54c0 7.73 6.27 14 14 14h38c7.73 0 14-6.27 14-14V34.102a4.002 4.002 0 0 0-1.899-3.5zM62 22.802L69.2 30H62zM75 77c0 3.313-2.688 6-6 6H31c-3.313 0-6-2.687-6-6V23c0-3.312 2.688-6 6-6h23v14c0 3.867 3.133 7 7 7h14z" />
      <path d="M46 47.699h8v29.5h-8zM34 60.699h8v16.5h-8zM58 55.699h8v21.5h-8z" />
    </g>
  </svg>
)

export default Document