import React from 'react'

export default ({
  color = '#8DA2B5',
}) => (
  <svg className="svg file-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20">
    <path fill={color} fillRule="evenodd" d="M14.001 18H2V2h8v4h4l.001 12zM11.414 0H2C.897 0 0 .898 0 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4.586L11.414 0z"/>
  </svg>
)
