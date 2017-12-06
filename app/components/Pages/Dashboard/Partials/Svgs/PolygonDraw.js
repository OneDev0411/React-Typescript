// Draw.js
import React from 'react'

export default ({ color = '#8DA2B5', width = 24, height = 24 }) => (
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g fill={color} fillRule="evenodd">
      <path d="M12.554 1L23.253 14.21l-1.555 1.259L11 2.258z" />
      <circle cx="12" cy="2" r="2" />
      <circle cx="22" cy="15" r="2" />
      <circle cx="2" cy="22" r="2" />
      <circle cx="2" cy="8" r="2" />
      <path d="M2 7l8.66-5 1 1.732-8.66 5zM1 9h2v12H1z" />
      <path d="M2 20.884L22.54 13l.716 1.867-20.539 7.885z" />
    </g>
  </svg>
)
