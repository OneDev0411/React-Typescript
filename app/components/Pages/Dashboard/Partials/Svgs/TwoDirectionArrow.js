import React from 'react'

export default ({
                  height = '16',
                  width = '16',
                  fill = '#B2B2B2'
                }) => (
                  <svg className="maximize-icon" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 11">
                    <path className="maximize-icon path" fill={fill} fillRule="evenodd" d="M7 9H3.414L10 3.414V7h2V0H5v2h3.586L2 7.586V4H0v7h7z" />
                  </svg>
)
